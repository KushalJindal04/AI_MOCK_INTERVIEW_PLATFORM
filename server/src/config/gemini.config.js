import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-3.5-flash-lite";

const generateContent = async (prompt, retries = 5) => {
    let delay = 4000; // Start with a 4-second delay

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: prompt,
            });

            return response.text;
        } catch (error) {
            console.error(`Gemini API Error (Attempt ${attempt}):`, error.message);

            // If it's a 503 (Unavailable) or 429 (Too Many Requests), we retry.
            if ((error.message.includes("503") || error.message.includes("429") || error.message.includes("UNAVAILABLE")) && attempt < retries) {
                let waitTime = delay;
                
                // Parse the exact time Google wants us to wait
                const match = error.message.match(/retry in ([\d\.]+)s/i);
                if (match && match[1]) {
                    waitTime = Math.ceil(parseFloat(match[1]) * 1000) + 1000; // Exact time + 1s buffer
                }
                
                console.log(`Retrying in ${waitTime}ms...`);
                await new Promise((res) => setTimeout(res, waitTime));
                delay *= 1.5; // Exponential backoff for fallback
                continue;
            }

            // If we're out of retries or it's a different error, throw.
            throw new Error(`Gemini API failed: ${error.message}`);
        }
    }
};

export { generateContent };