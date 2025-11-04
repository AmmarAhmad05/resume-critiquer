import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function analyzeResume(resumeText) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume reviewer and career coach. Analyze the resume and return a JSON object with this structure:
{
  "overallScore": number (1-10),
  "strengths": [array of 3-5 strings],
  "weaknesses": [array of 3-5 strings],
  "suggestions": [array of 5-7 actionable strings],
  "atsScore": number (1-10),
  "formatting": {
    "score": number (1-10),
    "feedback": string
  },
  "content": {
    "score": number (1-10),
    "feedback": string
  },
  "summary": string (2-3 sentences)
}`
          },
          {
            role: 'user',
            content: `Please analyze this resume:\n\n${resumeText}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      analysis: JSON.parse(response.data.choices[0].message.content)
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}