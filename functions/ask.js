/**
 * Ask Endpoint
 * Handles AI question answering using OpenAI API with MongoDB storage
 */

import OpenAI from 'openai';
import { getAllDocumentsWithContent } from './models/Document.js';
import { closeMongoDB } from './utils/mongodb.js';

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'OpenAI API key is not configured' 
        }),
      };
    }

    // Validate MongoDB connection
    if (!process.env.MONGODB_URI) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'MongoDB URI is not configured. Please set MONGODB_URI environment variable.' 
        }),
      };
    }

    const { question } = JSON.parse(event.body);

    if (!question || question.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Question is required' }),
      };
    }

    // Load all knowledge documents from MongoDB
    const knowledgeData = await getAllDocumentsWithContent();

    if (knowledgeData.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'No study material uploaded. Please upload documents first.' 
        }),
      };
    }

    // Prepare context from all uploaded documents
    const maxContextChars = parseInt(process.env.MAX_CONTEXT_CHARS) || 12000;
    let context = '';
    const sources = [];

    // Combine text from all documents, respecting character limit
    for (const knowledge of knowledgeData) {
      const availableChars = maxContextChars - context.length;
      if (availableChars <= 0) break;

      const textToAdd = knowledge.extractedText.substring(0, availableChars);
      context += `\n\n--- From ${knowledge.filename} ---\n${textToAdd}`;
      sources.push({
        filename: knowledge.filename,
        type: knowledge.type,
        uploadDate: knowledge.createdAt.toISOString(),
      });
    }

    // If context is still empty, return error
    if (context.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'No readable content found in uploaded documents.' 
        }),
      };
    }

    // Prepare the prompt
    const systemPrompt = `You are an AI Study Coach. Your role is to help students learn from their uploaded study material.

IMPORTANT RULES:
1. Answer ONLY using the supplied study material in the context below.
2. If the answer cannot be found in the provided material, respond exactly: "I couldn't find this information in your uploaded study material."
3. Never hallucinate or invent information.
4. If the information is partially available, state what is available and what is not.
5. Be clear, concise, and educational in your responses.
6. When relevant, include page numbers or source references if available.
7. Format your responses with proper markdown for readability.`;

    const userPrompt = `Question: ${question}

Study Material Context:
${context}

Please answer the question based on the study material above.`;

    // Call OpenAI API
    const model = process.env.MODEL || 'gpt-4.1-mini';
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const completion = await createChatCompletionWithRetry(openai, {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 1200,
    });

    const answer = completion.choices[0]?.message?.content || 'No response generated.';

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: answer,
        sources: sources,
        model: model,
        tokensUsed: completion.usage?.total_tokens || 0,
      }),
    };

  } catch (error) {
    console.error('Ask error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Invalid OpenAI API key. Please check your configuration.' 
        }),
      };
    }

    if (error.status === 429) {
      const retryAfter = getRetryAfterSeconds(error);

      return {
        statusCode: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          ...(retryAfter ? { 'Retry-After': retryAfter.toString() } : {}),
        },
        body: JSON.stringify({ 
          error: 'The AI provider is rate-limiting this project or the API quota is exhausted. Please wait a minute and try again, or check your OpenAI billing and rate limits.' 
        }),
      };
    }

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to generate answer: ' + error.message 
      }),
    };
  } finally {
    // Close MongoDB connection
    await closeMongoDB();
  }
};

async function createChatCompletionWithRetry(openai, payload) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await openai.chat.completions.create(payload);
    } catch (error) {
      const retryAfter = getRetryAfterSeconds(error);
      const shouldRetry = error.status === 429 && attempt < maxAttempts && retryAfter !== null;

      if (!shouldRetry) {
        throw error;
      }

      await delay(Math.min(retryAfter, 5) * 1000);
    }
  }
}

function getRetryAfterSeconds(error) {
  const retryAfter = error.headers?.['retry-after'] || error.headers?.get?.('retry-after');
  const seconds = Number.parseInt(retryAfter, 10);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}
