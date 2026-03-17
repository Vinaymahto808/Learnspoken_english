import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface SpeechAnalysis {
  transcription: string;
  overallScore: number;
  pronunciationScore: number;
  grammarScore: number;
  fluencyScore: number;
  vocabularyScore: number;
  feedback: string;
  detailedFeedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const file = new File([audioBlob], 'audio.webm', { type: audioBlob.type });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en'
    });

    return transcription.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio. Please check your OpenAI API key.');
  }
}

export async function analyzeSpeech(
  transcription: string,
  expectedText: string,
  context: 'lesson' | 'challenge' | 'practice' = 'practice'
): Promise<SpeechAnalysis> {
  try {
    const prompt = `You are an expert English language tutor specializing in helping Indian learners improve their spoken English.

Analyze this spoken English response:
Transcription: "${transcription}"
${expectedText ? `Expected/Reference: "${expectedText}"` : ''}

Context: ${context}

Provide a comprehensive analysis with scores (1-100) for:
1. Pronunciation (clarity, accent neutrality, word stress)
2. Grammar (sentence structure, tenses, subject-verb agreement)
3. Fluency (pace, natural flow, hesitation)
4. Vocabulary (word choice, appropriateness, variety)

Also provide:
- Overall score (average of above)
- Specific strengths (2-3 points)
- Areas for improvement (2-3 points)
- Actionable suggestions (2-3 tips)
- Encouraging feedback paragraph

Be encouraging and culturally sensitive. Focus on progress, not perfection.

Respond in JSON format:
{
  "pronunciationScore": number,
  "grammarScore": number,
  "fluencyScore": number,
  "vocabularyScore": number,
  "overallScore": number,
  "strengths": string[],
  "improvements": string[],
  "suggestions": string[],
  "feedback": string
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive English language tutor. Respond only with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return {
      transcription,
      overallScore: analysis.overallScore || 0,
      pronunciationScore: analysis.pronunciationScore || 0,
      grammarScore: analysis.grammarScore || 0,
      fluencyScore: analysis.fluencyScore || 0,
      vocabularyScore: analysis.vocabularyScore || 0,
      feedback: analysis.feedback || 'Great effort! Keep practicing.',
      detailedFeedback: {
        strengths: analysis.strengths || [],
        improvements: analysis.improvements || [],
        suggestions: analysis.suggestions || []
      }
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze speech. Please try again.');
  }
}

export async function getChatResponse(messages: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are Alex, a friendly and encouraging English tutor helping Indian learners improve their conversational English.

Your goals:
- Have natural, engaging conversations
- Gently correct mistakes without being discouraging
- Use simple language for beginners, more complex for advanced
- Ask follow-up questions to encourage speaking
- Provide cultural context when useful
- Be patient and supportive
- Keep responses concise (2-3 sentences max)

Maintain a warm, encouraging tone. Celebrate progress!`
        },
        ...messages
      ],
      temperature: 0.8,
      max_tokens: 150
    });

    return completion.choices[0].message.content || 'I appreciate your effort. Keep practicing!';
  } catch (error) {
    console.error('Chat error:', error);
    throw new Error('Failed to get response. Please check your connection.');
  }
}
