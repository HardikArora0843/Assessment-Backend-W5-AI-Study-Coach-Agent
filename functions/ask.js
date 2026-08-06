/**
 * Ask Endpoint
 * Handles AI question answering using OpenAI API
 */

import fs from 'fs-extra';
import path from 'path';
import OpenAI from 'openai';

const KNOWLEDGE_DIR = path.join(process.cwd(), 'knowledge');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Load all knowledge files
    const knowledgeFiles = await fs.readdir(KNOWLEDGE_DIR);
    const knowledgeData = [];

    for (const file of knowledgeFiles) {
      if (file.endsWith('.json')) {
        const filePath = path.join(KNOWLEDGE_DIR, file);
        const data = await fs.readJson(filePath);
        knowledgeData.push(data);
      }
    }

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
        uploadDate: knowledge.uploadDate,
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
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
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
      return {
        statusCode: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.' 
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
  }
};
