export interface QuestionOption {
    value: string;
    label: string;
}

export interface ImageOption {
    value: string;
    imageSrc: string;
    label?: string;
}

export interface SingleChoiceQuestion {
    questionId: string;
    question: string;
    options: QuestionOption[];
    correctAnswer: string;
    containerId: string;
    successMessage?: string;
    emptySelectionMessage?: string;
    incorrectMessage?: string;
}

export interface MultipleChoiceQuestion {
    questionId: string;
    question: string;
    options: QuestionOption[];
    correctAnswers: string[];
    containerId: string;
    successMessage?: string;
    emptySelectionMessage?: string;
    incompleteMessage?: string;
    incorrectMessage?: string;
}

export interface ImageChoiceQuestion {
    questionId: string;
    question: string;
    options: ImageOption[];
    correctAnswers: string[];
    containerId: string;
    successMessage?: string;
    emptySelectionMessage?: string;
    incompleteMessage?: string;
    incorrectMessage?: string;
}

export interface MultipleChoiceImageQuestion {
    questionId: string;
    imageSrc: string;
    imageAlt: string;
    question: string;
    options: QuestionOption[];
    correctAnswers: string[];
    containerId: string;
    successMessage?: string;
    emptySelectionMessage?: string;
    incompleteMessage?: string;
    incorrectMessage?: string;
}

export type AnyQuestion =
    | SingleChoiceQuestion
    | MultipleChoiceQuestion
    | ImageChoiceQuestion
    | MultipleChoiceImageQuestion;
