import { generateContent } from '../config/gemini.config.js';

export const askGemini = async (prompt) => {
    try {
        const response = await generateContent(prompt);

        if (!response) {
            throw new Error('Gemini returned an empty response');
        }

        return response;
    } catch (error) {
        console.error('Gemini Service Error:', error.message);
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
            throw new Error('The AI service is currently unavailable due to an invalid API key. Please check your GEMINI_API_KEY in the .env file.');
        }
        throw new Error('The AI service is currently unavailable. Please try again later.');
    }
};