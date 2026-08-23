import { MultipleChoiceQuestion } from '../../../shared/evaluation/question.types';

export const question1: MultipleChoiceQuestion = {
    questionId: 'e2-damped-osc-1-schwungrad',
    question: 'Welche der folgenden Aussagen trifft auf das schwingfende Rad zu?',
    options: [
        { value: 'answer1', label: 'Die Resonanzfrequenz ist kleiner als $\\omega_1=200\\,\\mathrm{mHz}$.' },
        { value: 'answer2', label: 'Die Resonanzfrequenz liegt zwischen $\\omega_1$ und $\\omega_2$.' },
        { value: 'answer3', label: 'Die Resonanzfrequenz ist größer als $\\omega_2=400\\,\\mathrm{mHz}$.' },
        { value: 'answer4', label: ' Über die Größe der Resonanzfrequenz kann keine Aussage getroffen werden.' }
    ],
    correctAnswers: ['answer1'],
    containerId: 'question1-container',
    successMessage: `✓ Völlig richtig, die Dämpfung beeinflusst das System in doppelter Weise. Einerseits führt die Dämpfung dazu, dass die Amplitude mit der Zeit abnimmt. Andererseits führt die Dämpfung aber auch zu einer Veränderung der Schwingungsfrequenz.<br><br>`,
    incompleteMessage: `✗ Das ist noch nicht ganz richtig - einige Elemente fehlen noch.<br><br>`,
    incorrectMessage: `✗ Das ist noch nicht ganz richtig - einige Ihrer Antworten sind falsch.<br><br>`
};
