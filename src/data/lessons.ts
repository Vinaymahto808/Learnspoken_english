export const LESSON_CATEGORIES = {
  GREETINGS: 'Greetings & Introductions',
  SHOPPING: 'Shopping & Markets',
  TRAVEL: 'Travel & Tourism',
  FOOD: 'Food & Dining',
  WORK: 'Work & Business',
  INTERVIEWS: 'Job Interviews',
  DAILY: 'Daily Conversations',
  SOCIAL: 'Social Situations',
  EMERGENCY: 'Emergency & Health',
  TECHNOLOGY: 'Technology & Internet',
  BANKING: 'Banking & Finance',
  EDUCATION: 'Education & Learning'
};

export interface LessonContent {
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xp_reward: number;
  transcript: string;
  practicePrompts: string[];
}

export const LESSONS_DATA: LessonContent[] = [
  {
    title: 'Basic Greetings',
    description: 'Learn how to greet people in different situations',
    category: LESSON_CATEGORIES.GREETINGS,
    difficulty: 'Beginner',
    xp_reward: 50,
    transcript: 'Hello! How are you? I am fine, thank you. Nice to meet you.',
    practicePrompts: ['Greet someone you meet for the first time', 'Ask how someone is doing']
  },
  {
    title: 'Self Introduction',
    description: 'Introduce yourself confidently in English',
    category: LESSON_CATEGORIES.GREETINGS,
    difficulty: 'Beginner',
    xp_reward: 50,
    transcript: 'My name is Raj. I am from Mumbai. I work as a software developer.',
    practicePrompts: ['Introduce yourself with your name and profession', 'Tell where you are from']
  },
  {
    title: 'Asking for Directions',
    description: 'Learn to ask and understand directions',
    category: LESSON_CATEGORIES.TRAVEL,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'Excuse me, how do I get to the railway station? Go straight and turn left at the signal.',
    practicePrompts: ['Ask for directions to a nearby landmark', 'Give directions to someone']
  },
  {
    title: 'At the Grocery Store',
    description: 'Common phrases for shopping groceries',
    category: LESSON_CATEGORIES.SHOPPING,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'How much does this cost? Do you have fresh vegetables? I would like to buy two kilos of rice.',
    practicePrompts: ['Ask for the price of an item', 'Request a specific quantity']
  },
  {
    title: 'Ordering Food at Restaurant',
    description: 'Order food confidently at restaurants',
    category: LESSON_CATEGORIES.FOOD,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'Can I see the menu please? I would like to order chicken biryani. Could I get some water?',
    practicePrompts: ['Order your favorite dish', 'Ask for the bill']
  },
  {
    title: 'Making Phone Calls',
    description: 'Professional phone conversation skills',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'Hello, this is Priya calling from Tech Solutions. May I speak with Mr. Kumar? Could you please hold for a moment?',
    practicePrompts: ['Introduce yourself on a phone call', 'Ask to speak with someone']
  },
  {
    title: 'Booking Tickets',
    description: 'Book train, bus, or flight tickets',
    category: LESSON_CATEGORIES.TRAVEL,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'I would like to book a ticket to Delhi for tomorrow. What time does the train depart? Is window seat available?',
    practicePrompts: ['Book a ticket for travel', 'Ask about timings']
  },
  {
    title: 'At the Doctor',
    description: 'Describe symptoms and understand medical advice',
    category: LESSON_CATEGORIES.EMERGENCY,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'Doctor, I have been having a headache for two days. I also feel feverish. Should I take any medicine?',
    practicePrompts: ['Describe your symptoms', 'Ask about medication']
  },
  {
    title: 'Bank Transactions',
    description: 'Common banking conversations',
    category: LESSON_CATEGORIES.BANKING,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'I would like to open a savings account. What documents do I need? Can I get an ATM card immediately?',
    practicePrompts: ['Inquire about bank services', 'Request account information']
  },
  {
    title: 'Job Interview Introduction',
    description: 'Introduce yourself in a job interview',
    category: LESSON_CATEGORIES.INTERVIEWS,
    difficulty: 'Advanced',
    xp_reward: 100,
    transcript: 'Good morning. Thank you for this opportunity. I am Amit Sharma, a software engineer with five years of experience in web development. I have worked on multiple projects using React and Node.js.',
    practicePrompts: ['Introduce yourself professionally', 'Highlight your key skills']
  },
  {
    title: 'Describing Your Experience',
    description: 'Talk about your work experience',
    category: LESSON_CATEGORIES.INTERVIEWS,
    difficulty: 'Advanced',
    xp_reward: 100,
    transcript: 'In my previous role at TCS, I led a team of five developers. We successfully delivered a customer portal that increased user engagement by thirty percent.',
    practicePrompts: ['Describe your previous job', 'Explain your achievements']
  },
  {
    title: 'Handling Difficult Questions',
    description: 'Answer challenging interview questions',
    category: LESSON_CATEGORIES.INTERVIEWS,
    difficulty: 'Advanced',
    xp_reward: 120,
    transcript: 'My biggest weakness is that I sometimes focus too much on details. However, I have learned to prioritize tasks and manage time better.',
    practicePrompts: ['Explain your weakness positively', 'Describe a challenge you faced']
  },
  {
    title: 'Salary Negotiation',
    description: 'Negotiate salary and benefits',
    category: LESSON_CATEGORIES.INTERVIEWS,
    difficulty: 'Advanced',
    xp_reward: 120,
    transcript: 'Based on my experience and the market standards, I believe a salary of twelve lakhs per annum would be appropriate. I am also looking for health insurance and work from home flexibility.',
    practicePrompts: ['State your salary expectation', 'Discuss benefits']
  },
  {
    title: 'Small Talk with Colleagues',
    description: 'Casual conversations at workplace',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'How was your weekend? Did you watch the cricket match yesterday? The weather is quite pleasant today.',
    practicePrompts: ['Start a casual conversation', 'Talk about weekend plans']
  },
  {
    title: 'Giving Presentations',
    description: 'Present ideas clearly and confidently',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Advanced',
    xp_reward: 100,
    transcript: 'Good afternoon everyone. Today I will present our quarterly results. As you can see in this chart, our sales have increased by twenty percent. Let me explain the key factors.',
    practicePrompts: ['Start a presentation', 'Explain data from a chart']
  },
  {
    title: 'Email Writing Basics',
    description: 'Write professional emails',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'Dear Sir, I am writing to inquire about the status of my application. I submitted it last week. I look forward to your response. Best regards.',
    practicePrompts: ['Write a formal email opening', 'Request information politely']
  },
  {
    title: 'Complaint and Feedback',
    description: 'Express complaints professionally',
    category: LESSON_CATEGORIES.DAILY,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'I ordered a product online but received a damaged item. I would like a replacement or refund. Could you please help me with this?',
    practicePrompts: ['Complain about a service', 'Request a solution']
  },
  {
    title: 'Making Appointments',
    description: 'Schedule meetings and appointments',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'I would like to schedule a meeting with you. Are you available on Thursday at 3 PM? If not, please suggest an alternative time.',
    practicePrompts: ['Request a meeting', 'Suggest a time']
  },
  {
    title: 'Weather Conversations',
    description: 'Talk about weather conditions',
    category: LESSON_CATEGORIES.DAILY,
    difficulty: 'Beginner',
    xp_reward: 50,
    transcript: 'It is quite hot today. I think it might rain in the evening. Did you check the weather forecast?',
    practicePrompts: ['Describe today\'s weather', 'Make a prediction about weather']
  },
  {
    title: 'Hobbies and Interests',
    description: 'Discuss your hobbies',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'I enjoy reading books in my free time. I also like playing cricket on weekends. What are your hobbies?',
    practicePrompts: ['Talk about your favorite hobby', 'Ask about someone\'s interests']
  },
  {
    title: 'Family Introductions',
    description: 'Talk about your family',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'I have a small family. My parents, one brother, and me. My father is a teacher and my mother is a homemaker.',
    practicePrompts: ['Describe your family', 'Talk about family members\' professions']
  },
  {
    title: 'Planning a Trip',
    description: 'Discuss travel plans',
    category: LESSON_CATEGORIES.TRAVEL,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'We are planning to visit Goa next month. We will stay there for five days. We want to visit beaches and try local cuisine.',
    practicePrompts: ['Describe your travel plan', 'Talk about places you want to visit']
  },
  {
    title: 'Hotel Check-in',
    description: 'Check into a hotel smoothly',
    category: LESSON_CATEGORIES.TRAVEL,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'Hello, I have a reservation under the name Sharma. Could I have a room with a view? What time is breakfast served?',
    practicePrompts: ['Provide reservation details', 'Ask about hotel facilities']
  },
  {
    title: 'Shopping for Clothes',
    description: 'Buy clothes with confidence',
    category: LESSON_CATEGORIES.SHOPPING,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'Do you have this shirt in medium size? Can I try this on? Do you accept credit cards?',
    practicePrompts: ['Ask for a different size', 'Inquire about payment methods']
  },
  {
    title: 'Returning Products',
    description: 'Return or exchange purchased items',
    category: LESSON_CATEGORIES.SHOPPING,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'I bought this jacket yesterday but it does not fit well. Can I exchange it for a larger size? Here is my receipt.',
    practicePrompts: ['Explain why you want to return', 'Provide proof of purchase']
  },
  {
    title: 'Using Public Transport',
    description: 'Navigate buses and metros',
    category: LESSON_CATEGORIES.TRAVEL,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'Which bus goes to Connaught Place? How much is the fare? Where should I get off?',
    practicePrompts: ['Ask for route information', 'Inquire about fare']
  },
  {
    title: 'Internet and WiFi',
    description: 'Tech-related conversations',
    category: LESSON_CATEGORIES.TECHNOLOGY,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'Is there WiFi available here? What is the password? My internet is not working properly.',
    practicePrompts: ['Request WiFi access', 'Report a technical issue']
  },
  {
    title: 'Social Media Discussions',
    description: 'Talk about social media',
    category: LESSON_CATEGORIES.TECHNOLOGY,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'I saw your post on Instagram. It was amazing! Do you use LinkedIn for professional networking?',
    practicePrompts: ['Comment on social media content', 'Discuss platform preferences']
  },
  {
    title: 'Asking for Help',
    description: 'Request assistance politely',
    category: LESSON_CATEGORIES.DAILY,
    difficulty: 'Beginner',
    xp_reward: 50,
    transcript: 'Excuse me, could you please help me? I am looking for the restroom. Thank you so much!',
    practicePrompts: ['Ask for help politely', 'Express gratitude']
  },
  {
    title: 'Apologizing',
    description: 'Apologize sincerely',
    category: LESSON_CATEGORIES.DAILY,
    difficulty: 'Beginner',
    xp_reward: 50,
    transcript: 'I am really sorry for being late. It will not happen again. Please accept my apology.',
    practicePrompts: ['Apologize for a mistake', 'Promise improvement']
  },
  {
    title: 'Expressing Opinions',
    description: 'Share your views clearly',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'In my opinion, education is the key to success. I believe everyone should have access to quality education. What do you think?',
    practicePrompts: ['Express your opinion', 'Ask for others\' views']
  },
  {
    title: 'Agreeing and Disagreeing',
    description: 'Show agreement or disagreement politely',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'I completely agree with you. However, I think there is another perspective. We should consider both sides.',
    practicePrompts: ['Agree with someone', 'Disagree politely']
  },
  {
    title: 'Making Suggestions',
    description: 'Suggest ideas and plans',
    category: LESSON_CATEGORIES.DAILY,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'Why don\'t we go to a movie tonight? How about trying that new restaurant? I suggest we leave early to avoid traffic.',
    practicePrompts: ['Suggest an activity', 'Propose a solution']
  },
  {
    title: 'Party Conversations',
    description: 'Socialize at parties',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'This party is wonderful! How do you know the host? Would you like some snacks?',
    practicePrompts: ['Start a conversation at a party', 'Offer something']
  },
  {
    title: 'Gym and Fitness',
    description: 'Talk about fitness routines',
    category: LESSON_CATEGORIES.DAILY,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'I go to the gym every morning. I focus on cardio and strength training. Do you work out regularly?',
    practicePrompts: ['Describe your fitness routine', 'Ask about exercise habits']
  },
  {
    title: 'Discussing News',
    description: 'Talk about current events',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Advanced',
    xp_reward: 90,
    transcript: 'Did you read about the new policy? It will impact many businesses. I think this change is necessary for growth.',
    practicePrompts: ['Discuss a news topic', 'Share your analysis']
  },
  {
    title: 'Bargaining at Markets',
    description: 'Negotiate prices at local markets',
    category: LESSON_CATEGORIES.SHOPPING,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'This seems expensive. Can you reduce the price? I will buy two if you give me a discount.',
    practicePrompts: ['Ask for a discount', 'Make a bulk purchase offer']
  },
  {
    title: 'Office Meetings',
    description: 'Participate in work meetings',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Advanced',
    xp_reward: 100,
    transcript: 'Let me share my thoughts on this project. I believe we should focus on customer feedback. We need to allocate more resources to marketing.',
    practicePrompts: ['Share ideas in a meeting', 'Make recommendations']
  },
  {
    title: 'Performance Review',
    description: 'Discuss your performance at work',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Advanced',
    xp_reward: 100,
    transcript: 'This year, I achieved all my targets and led two successful projects. I would like to take on more leadership responsibilities.',
    practicePrompts: ['Highlight your achievements', 'Express career goals']
  },
  {
    title: 'Asking for Leave',
    description: 'Request time off from work',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'I would like to request leave from Monday to Wednesday next week. I have a family function. I will complete my pending work before leaving.',
    practicePrompts: ['Request leave', 'Provide reason']
  },
  {
    title: 'Discussing Salary',
    description: 'Talk about compensation',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Advanced',
    xp_reward: 110,
    transcript: 'I have been with the company for two years and have consistently exceeded my targets. I would like to discuss a salary revision.',
    practicePrompts: ['Request salary increase', 'Justify with achievements']
  },
  {
    title: 'Customer Service Call',
    description: 'Handle customer service situations',
    category: LESSON_CATEGORIES.WORK,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'Thank you for calling. How may I help you today? I understand your concern. Let me check and get back to you.',
    practicePrompts: ['Greet a customer', 'Provide assistance']
  },
  {
    title: 'Birthday Wishes',
    description: 'Wish someone on special occasions',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Beginner',
    xp_reward: 50,
    transcript: 'Happy birthday! I wish you all the happiness and success. May all your dreams come true!',
    practicePrompts: ['Wish someone', 'Express good wishes']
  },
  {
    title: 'Inviting Someone',
    description: 'Invite people to events',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'I am hosting a dinner party this Saturday. Would you like to join us? Please bring your family along!',
    practicePrompts: ['Invite someone to an event', 'Specify details']
  },
  {
    title: 'Describing Places',
    description: 'Describe locations and landmarks',
    category: LESSON_CATEGORIES.TRAVEL,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'The Taj Mahal is a beautiful monument. It is located in Agra. The architecture is magnificent and the gardens are well-maintained.',
    practicePrompts: ['Describe a famous place', 'Talk about features']
  },
  {
    title: 'Classroom Discussions',
    description: 'Participate in academic discussions',
    category: LESSON_CATEGORIES.EDUCATION,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'May I ask a question? I did not understand this concept. Could you please explain it again?',
    practicePrompts: ['Ask questions in class', 'Seek clarification']
  },
  {
    title: 'Group Projects',
    description: 'Collaborate on team assignments',
    category: LESSON_CATEGORIES.EDUCATION,
    difficulty: 'Intermediate',
    xp_reward: 80,
    transcript: 'Let us divide the work. I can handle the research part. Who will work on the presentation? We should meet again on Friday.',
    practicePrompts: ['Assign tasks', 'Plan collaboration']
  },
  {
    title: 'Library Conversations',
    description: 'Use library services',
    category: LESSON_CATEGORIES.EDUCATION,
    difficulty: 'Beginner',
    xp_reward: 60,
    transcript: 'I would like to issue this book. How long can I keep it? Do you have books on Indian history?',
    practicePrompts: ['Request to borrow a book', 'Inquire about subjects']
  },
  {
    title: 'Exam Preparation Tips',
    description: 'Discuss study strategies',
    category: LESSON_CATEGORIES.EDUCATION,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'I prepare a study schedule before exams. I focus on important topics first. I also take regular breaks to stay fresh.',
    practicePrompts: ['Share study tips', 'Describe preparation method']
  },
  {
    title: 'Congratulating Someone',
    description: 'Congratulate on achievements',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Beginner',
    xp_reward: 50,
    transcript: 'Congratulations on your promotion! You deserved it. I am very happy for you!',
    practicePrompts: ['Congratulate someone', 'Express happiness']
  },
  {
    title: 'Talking About Movies',
    description: 'Discuss films and entertainment',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'I watched a great movie last weekend. The story was engaging and the acting was superb. Have you seen it?',
    practicePrompts: ['Recommend a movie', 'Describe the plot']
  },
  {
    title: 'Sports Conversations',
    description: 'Talk about sports and games',
    category: LESSON_CATEGORIES.SOCIAL,
    difficulty: 'Intermediate',
    xp_reward: 70,
    transcript: 'Did you watch the cricket match yesterday? India played brilliantly. Who is your favorite player?',
    practicePrompts: ['Discuss a sports event', 'Share your opinion']
  }
];
