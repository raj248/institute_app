export type CourseType = 'CAInter' | 'CAFinal';

export interface Course {
  id: string;
  name: string;
  courseType: CourseType;
  createdAt: string; // Date.toISOString()
  updatedAt: string;
  deletedAt: string | null;
  topics?: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  description?: string | null;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  course?: Course;
  testPapers?: TestPaper[];
  mcqs?: MCQ[];
  courseType: CourseType;
  testPaperCount?: number;
  noteCount?: number;
  videoNoteCount?: number;

  // ✅ Newly added:
  noteCountByType?: Record<string, number>;
  videoNoteCountByType?: Record<string, number>;
}

export interface TestPaper {
  id: string;
  name: string;
  description?: string;
  timeLimitMinutes?: number;
  totalMarks?: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  topic?: Topic;
  mcqCount?: number;
  mcqs?: MCQ[];
  isCaseStudy?: boolean;
  caseText?: string;
  notePath?: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: Record<string, string>;
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  explanation: string;
}

export type MCQAnswerExplanation = {
  id: string;
  answer: 'a' | 'b' | 'c' | 'd';
  explanation: string;
};

export interface Note {
  id: string;
  name: string;
  description?: string;
  type: 'rtp' | 'mtp' | 'other'; // added as per schema
  courseType: 'CAInter' | 'CAFinal';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface VideoNote {
  id: string;
  url: string;
  name: string;
  description?: string;
  type: 'rtp' | 'mtp' | 'revision' | 'other'; // added as per schema
  courseType: 'CAInter' | 'CAFinal';
  title?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface NewlyAdded {
  id: string;
  tableName: 'MCQ' | 'TestPaper' | 'Note' | 'VideoNote';
  entityId: string;
  addedAt: string;
  expiresAt: string;
  displayName: string;
}

export interface SearchResult {
  topics: Topic[];
  testPapers: TestPaper[];
  notes: Note[];
  videoNotes: VideoNote[];
}
