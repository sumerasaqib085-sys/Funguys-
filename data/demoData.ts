import { User, Video, Message } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'user1',
    username: 'creator_cat',
    email: 'cat@example.com',
    password: 'password123',
    displayName: 'Creative Cat',
    profilePicture: 'https://picsum.photos/id/1025/200/200',
    bio: 'Just a cat who loves to create cool videos! 🐾',
    following: ['user2'],
    followers: ['user2', 'user3'],
  },
  {
    id: 'user2',
    username: 'dance_doggo',
    email: 'dog@example.com',
    password: 'password123',
    displayName: 'Dancing Doggo',
    profilePicture: 'https://picsum.photos/id/237/200/200',
    bio: 'Following the rhythm of life. 🕺💃',
    following: ['user1', 'user3'],
    followers: ['user1'],
  },
  {
    id: 'user3',
    username: 'foodie_fox',
    email: 'fox@example.com',
    password: 'password123',
    displayName: 'Foodie Fox',
    profilePicture: 'https://picsum.photos/id/40/200/200',
    bio: 'Exploring the world one bite at a time. 🦊🍕',
    following: [],
    followers: ['user2'],
  },
  {
    id: 'gemini',
    username: 'gemini',
    displayName: 'Gemini AI',
    profilePicture: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d6ebb193414a69e9b3a3d142d7b57b10.gif',
    bio: 'Your creative AI partner. Ask me anything!',
    following: [],
    followers: [],
  }
];

export const DEMO_VIDEOS: Video[] = [
  {
    id: 'vid1',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    coverImage: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    caption: 'Having some BIG fun out here! This was an amazing day.',
    tags: ['fun', 'animation', 'outdoors'],
    userId: 'user1',
    likes: ['user2', 'user3'],
    saves: ['user2'],
    comments: [
      { id: 'c1', userId: 'user2', videoId: 'vid1', text: 'This looks so cool!', timestamp: Date.now() - 100000 },
      { id: 'c2', userId: 'user3', videoId: 'vid1', text: 'Wow, incredible!', timestamp: Date.now() - 50000 },
    ],
    shares: 120,
    views: 15234,
  },
  {
    id: 'vid2',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    coverImage: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    caption: 'Diving into a dream world. What do you think this means?',
    tags: ['dream', 'surreal', 'blender'],
    userId: 'user2',
    likes: ['user1'],
    saves: [],
    comments: [
       { id: 'c3', userId: 'user1', videoId: 'vid2', text: 'Mind-bending stuff!', timestamp: Date.now() - 80000 },
    ],
    shares: 256,
    views: 22890,
  },
   {
    id: 'vid3',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    coverImage: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    caption: 'Just a chill day in the forest with some friends.',
    tags: ['nature', 'bunny', 'animation'],
    userId: 'user1',
    likes: ['user2', 'user3'],
    saves: ['user3'],
    comments: [],
    shares: 50,
    views: 8000,
  },
];


export const DEMO_MESSAGES: Record<string, Message[]> = {
    'gemini': [
        { id: 'msg1', senderId: 'gemini', receiverId: '', text: 'Hello! I am Gemini, your AI assistant. How can I help you be creative today?', timestamp: Date.now() - 200000 }
    ],
    'user2': [
        { id: 'msg2', senderId: 'user2', receiverId: '', text: 'Hey! Loved your last video.', timestamp: Date.now() - 100000 }
    ]
}