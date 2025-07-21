export type CourseType = "CAInter" | "CAFinal";

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
  description: string;
  courseId: string;
  courseType: CourseType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  testPaperCount: number;
  // testPapers?: TestPaper[];
  // mcqs?: MCQ[];

}

export interface TestPaper {
  id: string;
  name: string;
  description?: string;
  timeLimitMinutes?: number;
  totalMarks?: string
  topicId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  topic?: Topic;
  mcqCount?: number;
  mcqs?: MCQ[];
}

export interface MCQ {
  id: string;
  question: string;
  options: Record<string, string>;
  marks: number;
}
