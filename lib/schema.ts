import { z } from 'zod';

export const refinementSchema = z.object({
  ClearRequirements: z.object({
    UserStory: z.string(),
    AcceptanceCriteria: z.array(z.string())
  }),
  Testability: z.object({
    TestingGuidelines: z.array(z.string())
  })
});

export type RefinementResponse = z.infer<typeof refinementSchema>;