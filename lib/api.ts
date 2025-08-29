import type {
  Topic,
  TestPaper,
  MCQAnswerExplanation,
  Note,
  VideoNote,
  NewlyAdded,
  SearchResult,
} from '~/types/entities';
import type { APIResponse } from '~/types/api';
import { getStoredUserId } from '~/utils/device-info';

const BASE_URL = process.env.EXPO_PUBLIC_API_SERVER_URL;

async function safeFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ success: boolean; error?: string; data?: T }> {
  console.log(`Fetching ${url}`);
  try {
    const userId = await getStoredUserId();

    // Append userId as query param if it's a GET request
    if (options.method === undefined || options.method.toUpperCase() === 'GET') {
      const urlObj = new URL(url, BASE_URL);
      if (userId) urlObj.searchParams.set('userId', userId);
      url = urlObj.toString();
    } else {
      // For POST/PUT/etc, ensure body has userId
      if (options.body) {
        const body = JSON.parse(options.body as string);
        options.body = JSON.stringify({ ...body, userId });
      } else {
        options.body = JSON.stringify({ userId });
        options.headers = {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        };
      }
    }

    const res = await fetch(url, options);
    const result = await res.json();

    if (!res.ok || !result.success) {
      console.error(`API error (${url}):`, result.error ?? res.statusText);
      return { success: false, error: result.error ?? res.statusText };
    }

    return result;
  } catch (error) {
    console.error(`Fetch error (${url}):`, error);
    return { success: false, error: (error as Error).message ?? 'Unknown error' };
  }
}

// ------------------- User --------------------

export async function registerUser(
  userId: string,
  phoneNumber: string
): Promise<APIResponse<{ id: string; userId: string; phoneNumber: number }>> {
  return safeFetch(`${BASE_URL}/api/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, phoneNumber }),
  });
}

// ------------------- Courses & Topics --------------------

export async function getTopicsByCourseType(courseType: string): Promise<APIResponse<Topic[]>> {
  return safeFetch(`${BASE_URL}/api/courses/${courseType}/topics`);
}

export async function getTopicById(topicId: string): Promise<APIResponse<Topic>> {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}`);
}

// ------------------- Test Papers --------------------

export async function getAllTestPapersByTopicId(
  topicId: string
): Promise<APIResponse<TestPaper[]>> {
  return safeFetch(`${BASE_URL}/api/topics/${topicId}/testpapers`);
}

export async function getTestPaperById(testPaperId: string): Promise<APIResponse<TestPaper>> {
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

export async function getNotesByTopic(
  topicId: string,
  type: string = 'all'
): Promise<APIResponse<Note[]>> {
  return safeFetch(`${BASE_URL}/api/notes/topic/${topicId}?type=${encodeURIComponent(type)}`);
}

/**
 * Get a note by its ID
 */
export async function getNoteById(noteId: string): Promise<APIResponse<Note>> {
  return safeFetch(`${BASE_URL}/api/notes/${noteId}`);
}

// ------------------ Video ---------------------

export async function getVideoNotesByTopicId(
  topicId: string,
  type: string = 'all'
): Promise<APIResponse<VideoNote[]>> {
  const url = `${BASE_URL}/api/videonotes/topic/${topicId}?type=${encodeURIComponent(type)}`;
  return safeFetch(url);
}

export async function getVideoByCourse(
  courseType: 'CAInter' | 'CAFinal',
  type: 'all' | 'rtp' | 'mtp' | 'revision' | 'other'
): Promise<APIResponse<VideoNote[]>> {
  return safeFetch(`${BASE_URL}/api/videonotes/course/${courseType}?type=${type}`);
}

/**
 * Get a video by its ID
 */
export async function getVideoNoteById(videoNoteId: string): Promise<APIResponse<Note>> {
  return safeFetch(`${BASE_URL}/api/videonotes/${videoNoteId}`);
}

// ------------------- Newly Added --------------------

/**
 * Get all newly added items
 */
export async function getNewlyAddedItems(): Promise<APIResponse<NewlyAdded[]>> {
  return safeFetch(`${BASE_URL}/api/newlyadded`);
}

export async function searchAll(query: string): Promise<APIResponse<SearchResult>> {
  const url = `${BASE_URL}/api/search?query=${encodeURIComponent(query)}`;
  return safeFetch<SearchResult>(url);
}
