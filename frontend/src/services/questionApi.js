import { api } from './api';

const questionApi = {
    // Get all questions for instructor's courses
    getInstructorQuestions: async () => {
        const response = await api.get('/questions/instructor/all');
        return response;
    },

    // Get unanswered questions for instructor
    getInstructorUnansweredQuestions: async () => {
        const response = await api.get('/questions/instructor/unanswered');
        return response;
    },

    // Create an answer for a question
    createAnswer: async (questionId, content) => {
        const response = await api.post('/questions/answers', {
            questionId,
            content
        });
        return response;
    },
};

export default questionApi;
