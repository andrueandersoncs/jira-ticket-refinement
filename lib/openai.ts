import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { systemPrompt } from '@/lib/system-prompt';
import { refinementSchema, type RefinementResponse } from '@/lib/schema';

export async function refineUserStory(apiKey: string, storyDescription: string): Promise<RefinementResponse> {
  const openai = createOpenAI({ apiKey });
  const { object } = await generateObject({
    model: openai.chat('o4-mini'),
    system: systemPrompt,
    schema: refinementSchema,
    prompt: `Refine the following ticket: ${storyDescription}`,
    temperature: 0.7,
    providerOptions: {
      openai: {
        reasoningEffort: 'medium',
      },
    }
  });

  return object;
}

export async function refineWithFeedback(
  apiKey: string, 
  currentRefinement: RefinementResponse, 
  feedbackType: 'user_story' | 'acceptance_criteria' | 'testing_guidelines',
  feedback: string
): Promise<RefinementResponse> {
  const openai = createOpenAI({ apiKey });
  
  const feedbackPrompt = `
Given the current refinement:

User Story:
${currentRefinement.ClearRequirements.UserStory}

Acceptance Criteria:
${currentRefinement.ClearRequirements.AcceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Testing Guidelines:
${currentRefinement.Testability.TestingGuidelines.map((g, i) => `${i + 1}. ${g}`).join('\n')}

The user provided feedback on the ${feedbackType.replace('_', ' ')}:
${feedback}

Please generate a new refinement incorporating this feedback.`;

  const { object } = await generateObject({
    model: openai.chat('o4-mini'),
    system: systemPrompt,
    schema: refinementSchema,
    prompt: feedbackPrompt,
    temperature: 0.7,
    providerOptions: {
      openai: {
        reasoningEffort: 'medium',
      },
    }
  });

  return object;
}