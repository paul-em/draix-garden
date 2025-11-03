import type { ChatMessage, Plant, Task } from '$lib/db/schema';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface OpenAIError {
  message: string;
  type?: string;
}

export async function callOpenAI(
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('OpenAI API key is required. Please add it in Settings.');
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to communicate with OpenAI API');
  }
}

export async function generateFollowUpQuestions(
  plantName: string,
  latinName: string,
  apiKey: string
): Promise<string[]> {
  const systemPrompt = `You are a helpful gardening assistant. Generate 3-5 relevant follow-up questions about a plant to gather important care information. Focus on: age, health status, growing conditions, goals (e.g., harvest, ornamental), soil type, sunlight exposure, watering needs, and any specific concerns. Keep questions concise and practical.`;

  const userPrompt = `Plant Name: ${plantName}\nLatin Name: ${latinName}\n\nGenerate 3-5 follow-up questions to understand this plant better. Return only the questions, one per line, numbered.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  const response = await callOpenAI(messages, apiKey);
  
  // Parse numbered questions
  const questions = response
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(q => q.length > 0);

  return questions;
}

export async function generateTasksFromPlantInfo(
  plant: Plant,
  conversationHistory: ChatMessage[],
  apiKey: string
): Promise<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]> {
  const systemPrompt = `You are an expert gardener. Based on the plant information and conversation, generate a comprehensive list of seasonal care tasks. Each task should include:
1. A clear description of what to do
2. A specific date range (format: DD.MM - DD.MM or just DD.MM for single date)

Consider: pruning, fertilizing, watering schedules, pest control, harvesting, winterization, etc. Be specific and practical. Provide 3-8 tasks depending on the plant's needs.

Return the tasks in JSON format as an array:
[
  {
    "description": "Task description",
    "dateRange": "DD.MM - DD.MM"
  }
]`;

  const userPrompt = `Plant: ${plant.name} (${plant.latinName})
${plant.age ? `Age: ${plant.age}` : ''}
${plant.goals ? `Goals: ${plant.goals}` : ''}
${plant.otherInfo ? `Additional Info: ${plant.otherInfo}` : ''}

Generate seasonal care tasks for this plant.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: userPrompt },
  ];

  const response = await callOpenAI(messages, apiKey);
  
  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = response.trim();
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
    }

    const tasksData = JSON.parse(jsonStr);
    
    return tasksData.map((task: { description: string; dateRange: string }) => ({
      plantId: plant.id,
      description: task.description,
      dateRange: task.dateRange,
      completed: false,
    }));
  } catch (error) {
    console.error('Failed to parse tasks from OpenAI response:', error);
    console.log('Response was:', response);
    throw new Error('Failed to parse task list from AI response');
  }
}

export async function chatWithAI(
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  return callOpenAI(messages, apiKey);
}

