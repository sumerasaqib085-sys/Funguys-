import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { User, Message } from '../types';
import Icon from '../components/common/Icon';
import Loader from '../components/common/Loader';
import { getChatResponse } from '../services/geminiService';

const InboxPage: React.FC = () => {
    const { state, dispatch } = useApp();
    const { users, conversations, currentUser, activeChatUserId } = state;
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        if (activeChatUserId) {
            const userToChat = users.find(u => u.id === activeChatUserId);
            if (userToChat) {
                setSelectedUser(userToChat);
                dispatch({ type: 'SET_ACTIVE_CHAT_USER', payload: null });
            }
        }
    }, [activeChatUserId, users, dispatch]);

    const otherUsers = users.filter(u => u.id !== currentUser?.id);
    const geminiUser = users.find(u => u.id === 'gemini');
    
    // Prioritize Gemini chat, then other conversations
    const sortedUsers = [
      geminiUser,
      ...otherUsers.filter(u => conversations[u.id] && u.id !== 'gemini')
    ].filter(Boolean) as User[];


    const ChatWindow: React.FC<{ user: User }> = ({ user }) => {
        const { state, dispatch } = useApp();
        const messages = state.conversations[user.id] || [];
        const [input, setInput] = useState('');
        const [isThinking, setIsThinking] = useState(false);
        const messagesEndRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, [messages]);
        
        const handleSend = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!input.trim() || !currentUser) return;

            const userMessage: Message = {
                id: `msg-${Date.now()}`,
                senderId: currentUser.id,
                receiverId: user.id,
                text: input,
                timestamp: Date.now()
            };
            dispatch({ type: 'SEND_MESSAGE', payload: userMessage });
            setInput('');

            if (user.id === 'gemini') {
                setIsThinking(true);
                try {
                    const history = messages
                        .map(msg => ({
                            role: msg.senderId === 'gemini' ? 'model' : 'user',
                            parts: [{ text: msg.text }]
                        }));

                    const responseText = await getChatResponse(input, history);
                    
                    const aiMessage: Message = {
                        id: `msg-${Date.now() + 1}`,
                        senderId: 'gemini',
                        receiverId: currentUser.id,
                        text: responseText,
                        timestamp: Date.now()
                    };
                    dispatch({ type: 'SEND_MESSAGE', payload: aiMessage });

                } catch (error) {
                    console.error("Gemini chat error:", error);
                     const errorMessage: Message = {
                        id: `msg-${Date.now() + 1}`,
                        senderId: 'gemini',
                        receiverId: currentUser.id,
                        text: "Sorry, I encountered an error. Please try again.",
                        timestamp: Date.now()
                    };
                    dispatch({ type: 'SEND_MESSAGE', payload: errorMessage });
                } finally {
                    setIsThinking(false);
                }
            }
        };

        return (
            <div className="h-full w-full bg-black flex flex-col absolute inset-0">
                <header className="p-4 flex items-center bg-gray-900 border-b border-gray-800">
                    <button onClick={() => setSelectedUser(null)}><Icon name="back" className="w-6 h-6"/></button>
                    <img src={user.profilePicture} alt={user.displayName} className="w-10 h-10 rounded-full mx-3"/>
                    <h2 className="font-bold">{user.displayName}</h2>
                </header>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {messages.map((msg) => {
                        const isSent = msg.senderId === currentUser?.id;
                        return (
                            <div key={msg.id} className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'}`}>
                                <div className="flex flex-col">
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isSent ? 'bg-[#0ea5ff] text-white' : 'bg-gray-800'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    {isSent && (
                                        <div className="flex items-center justify-end mt-1 mr-1" title="Read">
                                            <Icon name="check" className="w-4 h-4 text-blue-300" />
                                            <Icon name="check" className="w-4 h-4 text-blue-300 -ml-2.5" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {isThinking && 
                         <div className="flex justify-start">
                           <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-800">
                               <Loader text="Thinking..."/>
                           </div>
                        </div>
                    }
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSend} className="p-4 flex items-center border-t border-gray-800">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5ff]"
                    />
                    <button type="submit" className="ml-2 p-2 rounded-full bg-[#0ea5ff] disabled:bg-gray-600 transition-colors">
                        <Icon name="send" className="w-5 h-5"/>
                    </button>
                </form>
            </div>
        );
    };

    if (selectedUser) {
        return <ChatWindow user={selectedUser} />;
    }

    return (
        <div className="h-full w-full bg-black text-white flex flex-col">
            <header className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold">Inbox</h1>
            </header>
            <div className="flex-1 overflow-y-auto">
                {sortedUsers.map(user => {
                    const lastMessage = conversations[user.id]?.[conversations[user.id].length - 1];
                    return (
                        <div key={user.id} onClick={() => setSelectedUser(user)} className="flex items-center p-4 space-x-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900">
                            <img src={user.profilePicture} alt={user.displayName} className="w-14 h-14 rounded-full" />
                            <div className="flex-1 overflow-hidden">
                                <p className="font-bold">{user.displayName}</p>
                                <p className="text-sm text-gray-400 truncate">{lastMessage?.text || `Start a conversation with ${user.displayName}`}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InboxPage;