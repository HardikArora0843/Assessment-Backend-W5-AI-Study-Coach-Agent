/**
 * Ask Endpoint
 * Handles AI question answering using an OpenAI-compatible client
 * configured to use OpenRouter with MongoDB study-material storage.
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
    // Validate OpenRouter configuration
    if (!process.env.OPENROUTER_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'OpenRouter API key is not configured',
        }),
      };
    }

    if (!process.env.OPENROUTER_BASE_URL) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'OpenRouter base URL is not configured',
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
          error:
            'MongoDB URI is not configured. Please set MONGODB_URI environment variable.',
        }),
      };
    }

    let body;

    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Invalid JSON request body',
        }),
      };
    }

    const { question } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Question is required',
        }),
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
          error:
            'No study material uploaded. Please upload documents first.',
        }),
      };
    }

    // Prepare context from all uploaded documents
    const maxContextChars =
      parseInt(process.env.MAX_CONTEXT_CHARS, 10) || 12000;

    let context = '';
    const sources = [];

    // Combine text from all documents while respecting the character limit
    for (const knowledge of knowledgeData) {
      const availableChars = maxContextChars - context.length;

      if (availableChars <= 0) {
        break;
      }

      const extractedText = knowledge.extractedText || '';
      const textToAdd = extractedText.substring(0, availableChars);

      context += `\n\n--- From ${knowledge.filename} ---\n${textToAdd}`;

      sources.push({
        filename: knowledge.filename,
        type: knowledge.type,
        uploadDate: knowledge.createdAt.toISOString(),
      });
    }

    // If context is still empty, return an error
    if (context.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'No readable content found in uploaded documents.',
        }),
      };
    }

    // Prepare the system prompt
    const systemPrompt = `You are an AI Study Coach. Your role is to help students learn from their uploaded study material.

IMPORTANT RULES:
1. Answer ONLY using the supplied study material in the context below.
2. If the answer cannot be found in the provided material, respond exactly: "I couldn't find this information in your uploaded study material."
3. Never hallucinate or invent information.
4. If the information is partially available, state what is available and what is not.
5. Be clear, concise, and educational in your responses.
6. When relevant, include page numbers or source references if available.
7. Format your responses with proper markdown for readability.`;

    const userPrompt = `Question: ${question.trim()}

Study Material Context:
${context}

Please answer the question based on the study material above.`;

    // Create an OpenAI-compatible client configured for OpenRouter.
    // The "openai" npm package is used as the client library;
    // OpenRouter is the actual model provider.
    const model = process.env.MODEL || 'openrouter/free';

    const openai = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: process.env.OPENROUTER_BASE_URL,
    });

    const completion = await createChatCompletionWithRetry(openai, {
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 1200,
    });

    const answer =
      completion.choices[0]?.message?.content ||
      'No response generated.';

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer,
        sources,
        model,
        tokensUsed: completion.usage?.total_tokens || 0,
      }),
    };
  } catch (error) {
    console.error('Ask error:', error);

    // Handle authentication errors
    if (error.status === 401) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error:
            'Invalid OpenRouter API key. Please check your configuration.',
        }),
      };
    }

    // Handle payment/quota/provider access errors
    if (error.status === 402) {
      return {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error:
            'The OpenRouter provider rejected the request because the selected model or account requires payment or has insufficient access.',
        }),
      };
    }

    // Handle rate limiting
    if (error.status === 429) {
      const retryAfter = getRetryAfterSeconds(error);

      return {
        statusCode: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          ...(retryAfter
            ? { 'Retry-After': retryAfter.toString() }
            : {}),
        },
        body: JSON.stringify({
          error:
            'The AI provider is rate-limiting this project or the free-model quota is exhausted. Please wait and try again.',
        }),
      };
    }

    // Handle unavailable model/provider
    if (error.status === 404) {
      return {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error:
            'The selected OpenRouter model or provider endpoint is unavailable.',
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
        error: 'Failed to generate answer: ' + error.message,
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

      const shouldRetry =
        error.status === 429 &&
        attempt < maxAttempts &&
        retryAfter !== null;

      if (!shouldRetry) {
        throw error;
      }

      await delay(Math.min(retryAfter, 5) * 1000);
    }
  }

  throw new Error('AI request failed after all retry attempts.');
}

function getRetryAfterSeconds(error) {
  const retryAfter =
    error.headers?.['retry-after'] ||
    error.headers?.get?.('retry-after');

  const seconds = Number.parseInt(retryAfter, 10);

  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}