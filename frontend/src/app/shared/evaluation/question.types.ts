export interface QuestionOption {
    value: string;
    label: string;
}

export interface ImageOption {
    value: string;
    imageSrc: string;
    label?: string;
}

export interface AdaptiveAnswerHint {
    message: string;
    conceptId?: string;
    order?: number;
    independent?: boolean;
    /** Connected concepts sharing one paragraph, in explicit reasoning order. */
    paragraphId?: string;
    combinedFeedback?: Record<string, string>;
}

export type AnswerFeedback = Record<string, string | AdaptiveAnswerHint | AdaptiveAnswerHint[]>;

export interface SingleChoiceQuestion {
    questionId: string;
    question: string;
    options: QuestionOption[];
    correctAnswer: string;
    containerId: string;
    successMessage?: string;
    emptySelectionMessage?: string;
    incorrectMessage?: string;
    answerFeedback?: Record<string, string>;
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
    answerFeedback?: AnswerFeedback;
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
    answerFeedback?: AnswerFeedback;
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
    answerFeedback?: AnswerFeedback;
}

export type AnyQuestion =
    | SingleChoiceQuestion
    | MultipleChoiceQuestion
    | ImageChoiceQuestion
    | MultipleChoiceImageQuestion;
