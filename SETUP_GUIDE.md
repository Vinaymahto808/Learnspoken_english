# SpeakEase - Complete Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key

You MUST add your OpenAI API key to use the app's core features.

1. Get your API key from: https://platform.openai.com/api-keys
2. Open the `.env` file in the root directory
3. Replace `your-openai-api-key-here` with your actual API key:

```env
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Run the App
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Features Overview

### 1. Dashboard
- View your progress statistics
- See completed lessons count
- Track your XP and level
- Access today's daily challenge
- Quick access to recent lessons

### 2. Speech Practice
**How to use:**
1. Select any lesson from the Lessons page
2. Read the reference text shown
3. Click the microphone button
4. Speak clearly for up to 90 seconds
5. Click stop when finished
6. Receive detailed AI feedback:
   - Pronunciation score (1-100)
   - Grammar score (1-100)
   - Fluency score (1-100)
   - Vocabulary score (1-100)
   - Overall score
   - Personalized feedback
   - Strengths and areas to improve

### 3. Daily Challenges
- New challenge every day
- Random speaking prompts
- Time-limited (90 seconds)
- Earn bonus XP
- Track your challenge history

### 4. Leaderboards
- View top 20 performers globally
- See your current rank
- Compare XP with other learners
- Track your progress over time

### 5. AI Tutor Chat
**How to use:**
1. Go to AI Tutor tab
2. Start a new chat session
3. Type your messages in English
4. Get instant responses from AI tutor
5. Practice natural conversations
6. Receive gentle corrections and encouragement

### 6. Progress Analytics
- View completed lessons by category
- Track your recent performance
- See average scores
- Monitor learning streaks
- Identify weak areas

## Lesson Categories

### Beginner (19 lessons)
- Basic Greetings
- Self Introduction
- Asking for Directions
- At the Grocery Store
- Ordering Food at Restaurant
- Weather Conversations
- Hobbies and Interests
- Family Introductions
- Shopping for Clothes
- Using Public Transport
- Internet and WiFi
- Asking for Help
- Apologizing
- Making Suggestions
- Birthday Wishes
- Inviting Someone
- Library Conversations
- Congratulating Someone

### Intermediate (22 lessons)
- Making Phone Calls
- Booking Tickets
- At the Doctor
- Bank Transactions
- Small Talk with Colleagues
- Email Writing Basics
- Complaint and Feedback
- Making Appointments
- Planning a Trip
- Hotel Check-in
- Returning Products
- Social Media Discussions
- Expressing Opinions
- Agreeing and Disagreeing
- Party Conversations
- Gym and Fitness
- Bargaining at Markets
- Asking for Leave
- Customer Service Call
- Talking About Movies
- Sports Conversations
- Classroom Discussions
- Group Projects
- Exam Preparation Tips

### Advanced (9 lessons)
- Job Interview Introduction
- Describing Your Experience
- Handling Difficult Questions
- Salary Negotiation
- Giving Presentations
- Discussing News
- Office Meetings
- Performance Review
- Discussing Salary

## XP and Leveling System

- **Beginner Lessons**: 50-60 XP each
- **Intermediate Lessons**: 70-80 XP each
- **Advanced Lessons**: 100-120 XP each
- **Daily Challenges**: 50 XP each
- **Level Up**: Every 500 XP

## Scoring System

Your speech is analyzed on 4 key metrics:

### Pronunciation (1-100)
- Clarity of speech
- Accent neutrality
- Word stress and intonation
- Individual sound accuracy

### Grammar (1-100)
- Sentence structure
- Tense usage
- Subject-verb agreement
- Proper word forms

### Fluency (1-100)
- Natural speech flow
- Speaking pace
- Hesitation patterns
- Filler word usage

### Vocabulary (1-100)
- Word choice appropriateness
- Vocabulary variety
- Contextual usage
- Advanced word usage

### Overall Score
Average of all 4 metrics

**Score Interpretation:**
- 80-100: Excellent
- 60-79: Good
- 40-59: Fair
- 0-39: Needs Practice

## Tips for Best Results

### Recording Quality
- Use a good microphone
- Record in a quiet environment
- Speak clearly and at normal pace
- Avoid background noise
- Position mic 6-12 inches away

### Practice Strategy
1. Start with Beginner lessons
2. Practice each lesson multiple times
3. Focus on areas where you score low
4. Complete daily challenges consistently
5. Use AI Tutor for conversation practice
6. Review feedback carefully
7. Re-attempt lessons to improve scores

### Common Mistakes to Avoid
- Speaking too fast
- Speaking too softly
- Not completing thoughts
- Using too many filler words (um, uh, like)
- Ignoring feedback suggestions

## Troubleshooting

### OpenAI API Errors
If you see "Failed to transcribe audio":
1. Check your API key is correct in `.env`
2. Verify you have credits in your OpenAI account
3. Check your internet connection
4. Ensure your API key has Whisper access

### Microphone Issues
If recording doesn't work:
1. Grant microphone permissions in browser
2. Check browser settings (Privacy & Security)
3. Try a different browser (Chrome recommended)
4. Check system microphone settings

### Authentication Issues
If Google login fails:
1. Check Supabase configuration
2. Verify internet connection
3. Clear browser cache and cookies
4. Try incognito/private mode

### Database Issues
If lessons don't load:
1. Check Supabase connection
2. Verify environment variables
3. Check browser console for errors
4. Try refreshing the page

## API Usage & Costs

### OpenAI API Pricing (as of 2024)
- **Whisper**: $0.006 per minute of audio
- **GPT-4o-mini**: ~$0.00015 per 1K tokens

### Estimated Costs
- 1 speech submission (60s): ~$0.006 (Whisper) + ~$0.0003 (GPT) = **~$0.0063**
- 100 submissions: **~$0.63**
- 1000 submissions: **~$6.30**

### Tips to Reduce Costs
- Keep recordings under 60 seconds
- Practice pronunciation before recording
- Review feedback carefully to avoid retakes
- Use chat feature sparingly

## Database Structure

The app automatically creates these tables in Supabase:

### profiles
Stores user information and statistics

### lessons
Contains all 50+ lesson modules

### user_lesson_progress
Tracks which lessons you've completed and your scores

### speech_submissions
Saves all your practice recordings and feedback

### daily_challenges
Stores daily challenge prompts

### user_challenges
Tracks your challenge attempts

### chat_sessions
Records AI tutor conversation sessions

### chat_messages
Stores chat history

## Privacy & Security

- All data is stored securely in Supabase
- Row Level Security (RLS) enabled on all tables
- You can only see your own data
- Google OAuth for secure authentication
- No data is shared with third parties
- Audio recordings are not permanently stored

## Support

If you encounter issues:

1. Check this guide first
2. Review the README.md
3. Check OpenAI API status: https://status.openai.com
4. Verify Supabase status: https://status.supabase.com
5. Check browser console for error messages

## Future Enhancements

Potential features for future versions:
- Friend system and friend leaderboards
- Achievement badges
- Speaking challenges with time pressure
- Pronunciation comparison with native speakers
- Voice modulation analysis
- Custom lesson creation
- Offline mode
- Mobile app version
- Group speaking sessions
- Live tutor sessions

---

Enjoy learning English with SpeakEase!
