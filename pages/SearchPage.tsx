
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Icon from '../components/common/Icon';

const SearchPage: React.FC = () => {
    const { state, dispatch } = useApp();
    const { users, videos, currentUser } = state;
    const [query, setQuery] = useState('');

    const filteredUsers = useMemo(() => {
        if (!query) return [];
        return users.filter(
            u => u.username.toLowerCase().includes(query.toLowerCase()) && u.id !== currentUser?.id
        );
    }, [query, users, currentUser]);
    
    const filteredVideos = useMemo(() => {
        if (!query) return [];
        const searchTag = query.startsWith('#') ? query.substring(1) : query;
        return videos.filter(v => v.tags.some(tag => tag.toLowerCase().includes(searchTag.toLowerCase())));
    }, [query, videos]);

    const viewProfile = (user: any) => {
        dispatch({ type: 'SET_VIEWED_USER', payload: user });
    };

    return (
        <div className="h-full w-full bg-black text-white flex flex-col p-4">
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search users or #tags"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full bg-gray-800 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-[#0ea5ff]"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon name="search" className="w-5 h-5 text-gray-400"/>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {query ? (
                    <>
                        {filteredUsers.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold mb-2">Users</h2>
                                <div className="space-y-3">
                                    {filteredUsers.map(user => (
                                        <div key={user.id} onClick={() => viewProfile(user)} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-900 rounded-lg">
                                            <img src={user.profilePicture} alt={user.displayName} className="w-12 h-12 rounded-full"/>
                                            <div>
                                                <p className="font-semibold">@{user.username}</p>
                                                <p className="text-sm text-gray-400">{user.displayName}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {filteredVideos.length > 0 && (
                             <div>
                                <h2 className="text-lg font-bold mb-2">Videos</h2>
                                <div className="grid grid-cols-3 gap-0.5">
                                    {filteredVideos.map(video => (
                                        <div key={video.id} className="relative aspect-square bg-gray-900">
                                             <img src={video.coverImage} alt="video cover" className="w-full h-full object-cover"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-500 pt-20">
                        <p>Find your favorite creators or content.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
