import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MCQ, TestPaper } from '~/types/entities';

interface TestState {
  testData: TestPaper | null;
  answers: Record<string, string>;
  currentIndex: number;
  currentQuestion: MCQ | null;
  visited: string[];
  selectedOption: string;

  remainingTime: number;
  timerInterval: ReturnType<typeof setInterval> | null,

  setRemainingTime: (time: number) => void;
  decrementTime: () => void;
  startTimer: () => void;
  stopTimer: () => void;

  // Actions
  setTestData: (data: TestPaper) => void;
  setAnswer: (questionId: string, option: string) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentQuestion: (question: MCQ | null) => void;
  addVisited: (questionId: string) => void;
  setSelectedOption: (option: string) => void;
  clearAnswers: () => void;
  resetTest: () => void;
}

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      testData: null,
      answers: {},
      currentIndex: 0,
      currentQuestion: null,
      visited: [],
      selectedOption: '',

      remainingTime: -1,
      timerInterval: null,

      setRemainingTime: (time) => set({ remainingTime: time }),
      decrementTime: () => {
        const current = get().remainingTime;
        if (current > 0) set({ remainingTime: current - 1 });
        else get().stopTimer(); // auto-stop at 0
      },

      startTimer: () => {
        if (get().timerInterval) return; // prevent multiple timers
        const interval = setInterval(() => {
          get().decrementTime();
        }, 1000);
        set({ timerInterval: interval });
      },

      stopTimer: () => {
        const interval = get().timerInterval;
        if (interval) clearInterval(interval);
        set({ timerInterval: null });
      },

      setTestData: (data) =>
        set({
          testData: data,
          currentQuestion: data.mcqs ? data.mcqs[0] : null,
          currentIndex: 0,
          visited: [],
          selectedOption: '',
          answers: {},
        }),

      setAnswer: (questionId, option) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: option },
        })),

      setCurrentIndex: (index) =>
        set((state) => {
          const maxIndex = state.testData ? state.testData.mcqs ? state.testData.mcqs.length - 1 : 0 : 0;
          const clampedIndex = Math.max(0, Math.min(index, maxIndex));
          return { currentIndex: clampedIndex };
        }),
      setCurrentQuestion: (question) => set({ currentQuestion: question }),
      addVisited: (questionId) =>
        set((state) => ({
          visited: state.visited.includes(questionId)
            ? state.visited
            : [...state.visited, questionId],
        })),
      setSelectedOption: (option) => set({ selectedOption: option }),
      clearAnswers: () => set({ answers: {} }),
      resetTest: () =>
        set({
          testData: null,
          answers: {},
          currentIndex: 0,
          currentQuestion: null,
          visited: [],
          selectedOption: '',
        }),
    }),
    {
      name: 'test-store',
    }
  )
);
