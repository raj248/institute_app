import type { Topic, TestPaper, MCQAnswerExplanation, Note, VideoNote, NewlyAdded } from "~/types/entities";
import type { APIResponse } from "~/types/api"

const BASE_URL = process.env.EXPO_PUBLIC_API_SERVER_URL;

async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ success: boolean; error?: string; data?: T }> {
  console.log(`Fetching ${url}`);
  try {
    const res = await fetch(url, options);
    const result = await res.json();

    if (!res.ok || !result.success) {
      console.error(`API error (${url}):`, result.error ?? res.statusText);
      return { success: false, error: result.error ?? res.statusText };
    }

    return result;
  } catch (error) {
    console.error(`Fetch error (${url}):`, error);
    return { success: false, error: (error as Error).message ?? "Unknown error" };
  }
}

// ------------------- Courses & Topics --------------------

export async function getTopicsByCourseType(courseType: string): Promise<APIResponse<Topic[]>> {
  return safeFetch(`${BASE_URL}/api/courses/${courseType}/topics`, { cache: "no-store" });
}

export async function getTopicById(topicId: string): Promise<APIResponse<Topic>> {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}`);
}

// ------------------- Test Papers --------------------

export async function getAllTestPapersByTopicId(topicId: string): Promise<APIResponse<TestPaper[]>> {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}/testpapers`);
}

export async function getTestPaper(testPaperId: string): Promise<APIResponse<TestPaper>> {
  return safeFetch(`${BASE_URL}/api/testpapers/${testPaperId}`);
}

// ------------------- MCQs --------------------

export async function getMCQForTest(testPaperId: string): Promise<APIResponse<TestPaper>> {
  return safeFetch(`${BASE_URL}/api/testpapers/test/${testPaperId}`);
}

export async function getAnswersForTestPaper(
  testPaperId: string
): Promise<APIResponse<MCQAnswerExplanation[]>> {
  return safeFetch(`${BASE_URL}/api/testpapers/test/${testPaperId}/answers`);
}

// -------------------- Notes --------------------

export async function getNotesByTopic(topicId: string, type: string = "all"): Promise<APIResponse<Note[]>> {
  return safeFetch(`${BASE_URL}/api/notes/topic/${topicId}?type=${encodeURIComponent(type)}`);
}

// ------------------ Video ---------------------

export async function getVideoNotesByTopicId(
  topicId: string,
  type: string = "all"
): Promise<APIResponse<VideoNote[]>> {
  const url = `${BASE_URL}/api/videonotes/topic/${topicId}?type=${encodeURIComponent(type)}`;
  return safeFetch(url);
}

// ------------------- Newly Added --------------------

/**
 * Get all newly added items
 */
export async function getNewlyAddedItems(): Promise<APIResponse<NewlyAdded[]>> {
  return safeFetch(`${BASE_URL}/api/newlyadded`);
}