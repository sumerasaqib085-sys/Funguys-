import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { User, Video, Comment, Message, Page } from '../types';
import { DEMO_USERS, DEMO_VIDEOS, DEMO_MESSAGES } from '../data/demoData';

interface AppState {
    users: User[];
    videos: Video[];
    conversations: Record<string, Message[]>; // Keyed by other user's ID
    currentUser: User | null;
    currentPage: Page;
    viewedUser: User | null;
    activeChatUserId: string | null; // To open a specific chat window
}

type Action =
    | { type: 'LOGIN'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'REGISTER'; payload: User }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'ADD_VIDEO'; payload: Video }
    | { type: 'TOGGLE_LIKE'; payload: { videoId: string; userId: string } }
    | { type: 'TOGGLE_SAVE'; payload: { videoId: string; userId: string } }
    | { type: 'ADD_COMMENT'; payload: { videoId: string; comment: Comment } }
    | { type: 'TOGGLE_FOLLOW'; payload: { targetUserId: string; currentUserId: string } }
    | { type: 'SEND_MESSAGE'; payload: Message }
    | { type: 'SET_PAGE'; payload: Page }
    | { type: 'SET_VIEWED_USER'; payload: User | null }
    | { type: 'SET_ACTIVE_CHAT_USER'; payload: string | null };

const initialState: AppState = {
    users: [],
    videos: [],
    conversations: {},
    currentUser: null,
    currentPage: 'home',
    viewedUser: null,
    activeChatUserId: null,
};

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> }>({
    state: initialState,
    dispatch: () => null,
});

const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, currentUser: action.payload };
        case 'LOGOUT':
            return { ...state, currentUser: null, currentPage: 'home' };
        case 'REGISTER':
            return { ...state, users: [...state.users, action.payload] };
        case 'UPDATE_USER':
            return {
                ...state,
                currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
                users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
            };
        case 'ADD_VIDEO':
            return { ...state, videos: [action.payload, ...state.videos] };
        case 'TOGGLE_LIKE': {
            const { videoId, userId } = action.payload;
            return {
                ...state,
                videos: state.videos.map(v => {
                    if (v.id === videoId) {
                        const newLikes = v.likes.includes(userId) ? v.likes.filter(id => id !== userId) : [...v.likes, userId];
                        return { ...v, likes: newLikes };
                    }
                    return v;
                }),
            };
        }
        case 'TOGGLE_SAVE': {
            const { videoId, userId } = action.payload;
            return {
                ...state,
                videos: state.videos.map(v => {
                    if (v.id === videoId) {
                        const newSaves = v.saves.includes(userId) ? v.saves.filter(id => id !== userId) : [...v.saves, userId];
                        return { ...v, saves: newSaves };
                    }
                    return v;
                }),
            };
        }
        case 'ADD_COMMENT': {
            const { videoId, comment } = action.payload;
            return {
                ...state,
                videos: state.videos.map(v =>
                    v.id === videoId ? { ...v, comments: [comment, ...v.comments] } : v
                ),
            };
        }
        case 'TOGGLE_FOLLOW': {
            const { targetUserId, currentUserId } = action.payload;
            return {
                ...state,
                users: state.users.map(user => {
                    if (user.id === currentUserId) {
                        const newFollowing = user.following.includes(targetUserId)
                            ? user.following.filter(id => id !== targetUserId)
                            : [...user.following, targetUserId];
                        return { ...user, following: newFollowing };
                    }
                    if (user.id === targetUserId) {
                        const newFollowers = user.followers.includes(currentUserId)
                            ? user.followers.filter(id => id !== currentUserId)
                            : [...user.followers, currentUserId];
                        return { ...user, followers: newFollowers };
                    }
                    return user;
                }),
                currentUser: state.currentUser && state.currentUser.id === currentUserId
                    ? {
                        ...state.currentUser,
                        following: state.currentUser.following.includes(targetUserId)
                            ? state.currentUser.following.filter(id => id !== targetUserId)
                            : [...state.currentUser.following, targetUserId]
                    }
                    : state.currentUser,
            };
        }
        case 'SEND_MESSAGE': {
             const message = action.payload;
             const conversationKey = message.senderId === state.currentUser?.id ? message.receiverId : message.senderId;
             const newConversations = { ...state.conversations };
             newConversations[conversationKey] = [...(newConversations[conversationKey] || []), message];
             return { ...state, conversations: newConversations };
        }
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload, viewedUser: action.payload === 'profile' ? state.viewedUser : null };
        case 'SET_VIEWED_USER':
            return { ...state, viewedUser: action.payload, currentPage: 'profile' };
        case 'SET_ACTIVE_CHAT_USER':
            return { ...state, activeChatUserId: action.payload };
        default:
            return state;
    }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
        try {
            const storedState = localStorage.getItem('funguys_app_state');
            if (storedState) {
                return JSON.parse(storedState);
            }
            // First time load with demo data
            const firstLoadState = {
                ...init,
                users: DEMO_USERS,
                videos: DEMO_VIDEOS,
                conversations: DEMO_MESSAGES,
            };
            localStorage.setItem('funguys_app_state', JSON.stringify(firstLoadState));
            return firstLoadState;
        } catch (error) {
            console.error("Could not read from localStorage", error);
            return init;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('funguys_app_state', JSON.stringify(state));
        } catch (error) {
            console.error("Could not write to localStorage", error);
        }
    }, [state]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);