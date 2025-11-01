export interface User {
  id: string;
  username: string;
  email?: string;
  password?: string; // Should not be stored long term
  displayName: string;
  profilePicture: string;
  bio: string;
  following: string[]; // array of user ids
  followers: string[]; // array of user ids
}

export interface Comment {
  id: string;
  userId: string;
  videoId: string;
  text: string;
  timestamp: number;
  replies?: Comment[];
}

export interface Video {
  id: string;
  url: string;
  coverImage: string;
  caption: string;
  tags: string[];
  userId: string;
  likes: string[]; // array of user ids
  saves: string[]; // array of user ids
  comments: Comment[];
  shares: number;
  views: number;
}

export interface Message {
  id: string;
  senderId: string; // 'gemini' for AI
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface Conversation {
    userId: string; // The other user in the conversation
    messages: Message[];
    unreadCount: number;
}

export type Page = 'home' | 'search' | 'create' | 'inbox' | 'profile';