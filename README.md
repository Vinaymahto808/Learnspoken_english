# SpeakEase - AI-Powered Spoken English Learning App

A comprehensive web application for Indian users to master conversational English through AI-powered practice, real-time feedback, and gamified learning.

## Features

### Core Features
- **50+ Interactive Lessons**: Categorized modules covering greetings, shopping, travel, job interviews, business, and more
- **Speech Practice**: Record your speech and get AI-powered analysis
- **Real-time Feedback**: Detailed scores for pronunciation, grammar, fluency, and vocabulary
- **Daily Challenges**: Randomized speaking prompts with time limits
- **Global Leaderboards**: Compete with learners worldwide
- **AI Tutor Chat**: Practice conversations with GPT-4o-mini powered chatbot
- **Progress Analytics**: Detailed tracking of your learning journey with visual insights

### Technical Features
- **Speech-to-Text**: OpenAI Whisper API integration for accurate transcription
- **AI Analysis**: GPT-4o-mini provides personalized feedback on your speech
- **Authentication**: Secure Google OAuth via Supabase
- **Database**: PostgreSQL with Row Level Security via Supabase
- **Real-time Updates**: Live leaderboards and progress tracking
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Motion
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **AI Services**:
  - OpenAI Whisper API (Speech-to-Text)
  - OpenAI GPT-4o-mini (Feedback & Chat)
- **Deployment Ready**: Vercel/Netlify compatible

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- OpenAI API Key
- Supabase Account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
VITE_SUPABASE_URL=https://epihcsxhtfzrvctqoknf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

3. Get your OpenAI API Key from https://platform.openai.com/api-keys

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000

## Database Schema

The app uses Supabase with these tables:
- `profiles` - User data and statistics
- `lessons` - Learning content
- `user_lesson_progress` - Individual lesson tracking
- `speech_submissions` - Recorded practice sessions
- `daily_challenges` - Daily speaking prompts
- `user_challenges` - Challenge completion records
- `chat_sessions` - AI tutor conversations
- `chat_messages` - Chat history

All tables have Row Level Security enabled.

## Deployment

### Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy

### Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

## Support

For issues, please check the OpenAI API status and ensure your API key is valid.
