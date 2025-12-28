export type AnswerType = "multiple-choices" | "true-false" | "open-ended";
export type Flashcard = {
  id: number;
  question: string;
  answerType: AnswerType;
  answer: string;
  stage: string | null;
  due: Date;
  hint: string | null;
  learn_id: number;
  options: string[] | null;
};
