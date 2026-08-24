import { MultipleChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    questionId: 't1-intro-theory-1-dgl-solutions',
    question: 'Welche der folgenden Gleichungen sind allgemeine Lösungen der Differentialgleichung des harmonischen Oszillators? Beachten Sie, dass alle Variablen als konstant angenommen werden sollen.',
    options: [
        { value: 'answer1', label: '\\( x(t) = A\\cos(\\omega_0t) + \\sin(\\phi) \\)' },
        { value: 'answer2', label: '\\( x(t) = c_1\\left(e^{i\\omega_0t} + e^{-i\\omega_0t}\\right) \\)' },
        { value: 'answer3', label: '\\( x(t) = c_1e^{i\\omega_0t} + c_2e^{-i\\omega_0t} \\)' },
        { value: 'answer4', label: '\\( x(t) = A\\cos(\\omega_0t + \\phi) \\)' }
    ],
    correctAnswers: ['answer3', 'answer4'],
    containerId: 't1-intro-theory-1-container',
    successMessage: `✓ Völlig richtig.<br><br>
		Wenn Sie mögen, können Sie die nächsten Seiten überspringen, um direkt zum Test zu gedämpften Schwingungen zu gelangen.`,
    incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Lösungen fehlen. Prüfen Sie, ob die Gleichung genügend freie Konstanten enthält.`,
    incorrectMessage: `✗ Das ist noch nicht ganz richtig. Prüfen Sie, ob die Gleichung genügend freie Konstanten enthält.`
};
