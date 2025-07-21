import type { Topic, TestPaper, MCQ } from "~/types/entities";
import type { APIResponse } from "~/types/api"

const BASE_URL = process.env.EXPO_PUBLIC_API_SERVER_URL;

async function safeFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ success: boolean; error?: string; data?: T }> {
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

// ------------------- MCQs --------------------

export async function getMCQById(id: string): Promise<APIResponse<MCQ>> {
  return safeFetch(`${BASE_URL}/api/mcqs/${id}`);
}

export async function getMCQForTest(testPaperId: string): Promise<APIResponse<{
  id: string;
  question: string;
  options: Record<string, string>;
}>> {
  return safeFetch(`${BASE_URL}/api/mcqs/test/${testPaperId}`);
}