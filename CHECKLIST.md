# SpeakEase - Setup Checklist

## Pre-Deployment Checklist

### ✅ Installation
- [ ] Node.js 18+ installed
- [ ] Run `npm install`
- [ ] All dependencies installed successfully

### ⚠️  CRITICAL: API Configuration
- [ ] OpenAI account created
- [ ] OpenAI API key obtained from https://platform.openai.com/api-keys
- [ ] API key added to `.env` file
- [ ] API key starts with `sk-`
- [ ] No spaces or quotes around API key in `.env`

### ✅ Local Testing
- [ ] Run `npm run dev`
- [ ] Application starts on http://localhost:3000
- [ ] No console errors in browser
- [ ] Google login works
- [ ] User profile created
- [ ] Dashboard displays correctly
- [ ] Lessons page loads all 50+ lessons
- [ ] Can select a lesson
- [ ] Microphone permission granted
- [ ] Can record audio
- [ ] Recording stops properly
- [ ] Transcription works (receives text from Whisper)
- [ ] Analysis completes (receives scores from GPT)
- [ ] Score display shows all 4 metrics
- [ ] Feedback text appears
- [ ] XP increases after lesson
- [ ] Daily challenge displays
- [ ] Can complete daily challenge
- [ ] Leaderboard shows rankings
- [ ] AI Tutor chat works
- [ ] Chat receives responses
- [ ] Analytics page displays
- [ ] Navigation works between all pages

### ✅ Build Verification
- [ ] Run `npm run build`
- [ ] Build completes without errors
- [ ] `dist/` folder created
- [ ] Static files present in `dist/assets/`

## Deployment Checklist

### For Vercel
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Environment variables added:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_OPENAI_API_KEY`
- [ ] Deployment started
- [ ] Deployment successful
- [ ] Production URL accessible
- [ ] Test all features on production

### For Netlify
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Netlify account created
- [ ] Repository connected
- [ ] Build settings configured:
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `dist`
- [ ] Environment variables added:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_OPENAI_API_KEY`
- [ ] Deployment started
- [ ] Deployment successful
- [ ] Production URL accessible
- [ ] Test all features on production

### Post-Deployment
- [ ] Supabase OAuth redirect URL updated
- [ ] Test Google login on production
- [ ] Test speech recording on production
- [ ] Monitor error logs
- [ ] Check OpenAI API usage
- [ ] Set up OpenAI spending limits
- [ ] Bookmark production URL

## Feature Testing Checklist

### Authentication
- [ ] Can click "Continue with Google"
- [ ] Google OAuth popup appears
- [ ] Can select Google account
- [ ] Redirected back to app
- [ ] User profile created
- [ ] Display name appears
- [ ] Avatar shows
- [ ] Can logout
- [ ] Can login again

### Dashboard
- [ ] XP displayed correctly
- [ ] Level shown
- [ ] Streak counter visible
- [ ] Daily challenge card appears
- [ ] Recent lessons shown
- [ ] Statistics accurate
- [ ] Progress bar works
- [ ] All navigation buttons functional

### Lessons
- [ ] All 50+ lessons load
- [ ] Categories display correctly
- [ ] Difficulty badges show
- [ ] XP rewards visible
- [ ] Completion status accurate
- [ ] Can click any lesson
- [ ] Reference text displays
- [ ] Description clear

### Speech Practice
- [ ] Lesson details show
- [ ] Reference text readable
- [ ] Microphone button clickable
- [ ] Browser asks for mic permission
- [ ] Recording starts
- [ ] Timer counts up
- [ ] Can stop manually
- [ ] Auto-stops at max duration
- [ ] "Analyzing..." message appears
- [ ] Transcription received
- [ ] All 4 scores display
- [ ] Overall score calculated
- [ ] Feedback text appears
- [ ] Strengths listed
- [ ] Improvements suggested
- [ ] Can practice again
- [ ] XP awarded

### Daily Challenge
- [ ] Challenge prompt displays
- [ ] Category and difficulty shown
- [ ] Max duration indicated
- [ ] XP reward visible
- [ ] Can record response
- [ ] Time limit enforced
- [ ] Feedback received
- [ ] Can retry
- [ ] Challenge history saved

### Leaderboard
- [ ] Top 20 users display
- [ ] Rankings correct
- [ ] XP amounts shown
- [ ] Current user highlighted
- [ ] Podium for top 3
- [ ] Avatars display
- [ ] Names visible
- [ ] Updates after earning XP

### AI Tutor
- [ ] Can start session
- [ ] Welcome message appears
- [ ] Can type message
- [ ] Can send message
- [ ] AI responds
- [ ] Response makes sense
- [ ] Chat history preserved
- [ ] Multiple exchanges work
- [ ] Can send multiple messages
- [ ] Session persists

### Analytics
- [ ] Total stats display
- [ ] Category progress shown
- [ ] Recent performance visible
- [ ] Charts render correctly
- [ ] Data accurate
- [ ] All sections load

## Troubleshooting Checklist

### If Login Fails
- [ ] Check internet connection
- [ ] Verify Supabase URL in `.env`
- [ ] Check Supabase anon key
- [ ] Clear browser cache
- [ ] Try incognito mode
- [ ] Check browser console for errors

### If Speech Recording Fails
- [ ] Check microphone connected
- [ ] Grant browser permissions
- [ ] Try different browser (Chrome recommended)
- [ ] Check system mic settings
- [ ] Verify no other app using mic

### If AI Feedback Fails
- [ ] Verify OpenAI API key in `.env`
- [ ] Check API key is valid (starts with sk-)
- [ ] Verify API credits in OpenAI account
- [ ] Check internet connection
- [ ] View browser console errors
- [ ] Check OpenAI API status page

### If Database Errors
- [ ] Verify Supabase URL correct
- [ ] Check Supabase anon key
- [ ] Verify migration applied
- [ ] Check Supabase dashboard
- [ ] View Supabase logs
- [ ] Check RLS policies

## Documentation Checklist

Read before asking for help:
- [ ] README.md
- [ ] QUICK_START.md
- [ ] SETUP_GUIDE.md
- [ ] FEATURES.md
- [ ] DEPLOYMENT.md
- [ ] PROJECT_SUMMARY.md
- [ ] IMPORTANT_SETUP.txt

## Success Criteria

Application is ready when:
- ✅ Builds without errors
- ✅ All features work locally
- ✅ Speech transcription works
- ✅ AI feedback generates
- ✅ Database operations succeed
- ✅ Authentication functional
- ✅ Production deployment successful
- ✅ All features work on production

---

**Total Checkpoints: 150+**

Once all critical items are checked, your SpeakEase app is ready for users!
