'use server';

import { fetchBacklogItems as jiraFetchBacklogItems, updateJiraTicket, searchIssue } from '@/lib/jira';
import { refineUserStory, refineWithFeedback } from '@/lib/openai';

export interface JiraConfig {
  url: string;
  username: string;
  project: string;
  token: string;
  searchQuery?: string;
}

export async function fetchBacklogItems(config: JiraConfig) {
  return jiraFetchBacklogItems(config);
}

export async function searchJiraIssue(config: JiraConfig, issueKey: string) {
  return searchIssue(config, issueKey);
}

export async function getRefinementSuggestions(description: string, openaiKey: string) {
  try {
    return await refineUserStory(openaiKey, description);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get refinement suggestions');
  }
}

export async function applyRefinementToJira(config: JiraConfig, issueKey: string, refinedDescription: string) {
  try {
    return await updateJiraTicket(config, issueKey, refinedDescription);
  } catch (error) {
    console.error('Jira API Error:', error);
    throw new Error('Failed to update Jira ticket');
  }
}

export async function getUpdatedRefinement(
  currentRefinement: any,
  feedbackType: 'user_story' | 'acceptance_criteria' | 'testing_guidelines',
  feedback: string,
  openaiKey: string
) {
  try {
    return await refineWithFeedback(openaiKey, currentRefinement, feedbackType, feedback);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to update refinement with feedback');
  }
}