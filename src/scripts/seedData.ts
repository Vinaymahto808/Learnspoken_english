import { supabase } from '../lib/supabase';
import { LESSONS_DATA } from '../data/lessons';

export async function seedLessons() {
  console.log('Seeding lessons...');

  const lessonsToInsert = LESSONS_DATA.map((lesson, index) => ({
    title: lesson.title,
    description: lesson.description,
    category: lesson.category,
    difficulty: lesson.difficulty,
    xp_reward: lesson.xp_reward,
    transcript: lesson.transcript,
    order_index: index,
    is_active: true
  }));

  const { data, error } = await supabase
    .from('lessons')
    .upsert(lessonsToInsert, { onConflict: 'title' })
    .select();

  if (error) {
    console.error('Error seeding lessons:', error);
    return;
  }

  console.log(`Successfully seeded ${data?.length || 0} lessons`);
}

export async function seedDailyChallenges() {
  console.log('Seeding daily challenges...');

  const challenges = [
    { prompt: 'Describe your morning routine in detail', category: 'Daily Life', difficulty: 'Beginner' as const },
    { prompt: 'Explain why learning English is important for your career', category: 'Career', difficulty: 'Intermediate' as const },
    { prompt: 'Discuss the impact of technology on modern communication', category: 'Technology', difficulty: 'Advanced' as const },
    { prompt: 'Tell a story about a memorable trip you took', category: 'Travel', difficulty: 'Intermediate' as const },
    { prompt: 'Describe your dream job and why it appeals to you', category: 'Career', difficulty: 'Intermediate' as const },
    { prompt: 'Explain a traditional festival celebrated in your region', category: 'Culture', difficulty: 'Intermediate' as const },
    { prompt: 'Talk about a book or movie that influenced you', category: 'Entertainment', difficulty: 'Intermediate' as const },
    { prompt: 'Describe how you handle stress and pressure', category: 'Personal Development', difficulty: 'Advanced' as const },
    { prompt: 'Share your opinion on remote work vs office work', category: 'Work', difficulty: 'Advanced' as const },
    { prompt: 'Explain how you stay motivated to learn new skills', category: 'Personal Development', difficulty: 'Intermediate' as const }
  ];

  const today = new Date();
  const challengesToInsert = challenges.map((challenge, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() + index);
    return {
      ...challenge,
      active_date: date.toISOString().split('T')[0],
      max_duration: 90,
      xp_reward: 50
    };
  });

  const { data, error } = await supabase
    .from('daily_challenges')
    .upsert(challengesToInsert, { onConflict: 'active_date' })
    .select();

  if (error) {
    console.error('Error seeding challenges:', error);
    return;
  }

  console.log(`Successfully seeded ${data?.length || 0} daily challenges`);
}

if (typeof window === 'undefined') {
  seedLessons().then(() => seedDailyChallenges()).then(() => {
    console.log('Database seeding complete!');
  });
}
