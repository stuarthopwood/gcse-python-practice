export interface Question {
  code: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Answer {
  input: string;
  processing: string;
  output: string;
}

export interface GradeResponse {
  marks: number;
  maxMarks: number;
  feedback: string;
  strengths: string;
  improvements: string;
  modelAnswer: {
    input: string;
    processing: string;
    output: string;
  };
}

export interface GenerateRequest {
  difficulty?: "easy" | "medium" | "hard";
  recentTopics?: string[];
}

export interface GradeRequest {
  code: string;
  input: string;
  processing: string;
  output: string;
}
