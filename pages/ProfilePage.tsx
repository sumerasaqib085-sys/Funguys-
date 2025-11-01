import React, { useState } from 'react';
import { User } from '../types';
import { useApp } from '../context/AppContext';
import Icon from '../components/common/Icon';

interface ProfilePageProps {
  user: User;
}

const EditProfile: React.FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => {
    const { state, dispatch } = useApp();
    const [displayName, setDisplayName] = useState(user.displayName);
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const [profilePicture, setProfilePicture] = useState(user.profilePicture);
    const [error, setError] = useState('');
    
    const handleSave = () => {
        setError('');
        
        // Validate username
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            setError('Username must be 3-20 characters (letters, numbers, underscores).');
            return;
        }
        
        // Check if username is taken by another user
        if (state.users.some(u => u.username === username && u.id !== user.id)) {
            setError('This username is already taken.');
            return;
        }

        const updatedUser: User = {
            ...user,
            displayName,
            username,
            bio,
            profilePicture,
        };
        
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        onClose();
    };

    const handleChangePhoto = () => {
        // Simple way to get a new random photo for the demo
        const newSeed = `${username}${Date.now()}`;
        setProfilePicture(`https://picsum.photos/seed/${newSeed}/200/200`);
    }

    return (
        <div className="h-full w-full bg-black text-white flex flex-col absolute inset-0 z-20">
             <header className="p-4 flex justify-between items-center border-b border-gray-800">
                <button onClick={onClose} className="text-sm">Cancel</button>
                <h1 className="text-lg font-bold">Edit Profile</h1>
                <button onClick={handleSave} className="text-sm font-bold text-[#0ea5ff]">Save</button>
            </header>
            <div className="p-4 flex flex-col items-center overflow-y-auto">
                <div className="relative">
                    <img src={profilePicture} alt={displayName} className="w-24 h-24 rounded-full border-2 border-[#0ea5ff]" />
                </div>
                <button onClick={handleChangePhoto} className="text-sm font-semibold text-[#0ea5ff] mt-2">Change Photo</button>
                
                <div className="w-full mt-6 space-y-4">
                     <div>
                        <label className="text-xs text-gray-400">Display Name</label>
                        <input 
                            type="text" 
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            className="w-full bg-gray-900 border-b border-gray-700 p-2 focus:outline-none focus:border-[#0ea5ff]"
                        />
                    </div>
                     <div>
                        <label className="text-xs text-gray-400">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-gray-900 border-b border-gray-700 p-2 focus:outline-none focus:border-[#0ea5ff]"
                        />
                    </div>
                     <div>
                        <label className="text-xs text-gray-400">Bio</label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            className="w-full bg-gray-900 border-b border-gray-700 p-2 h-24 resize-none focus:outline-none focus:border-[#0ea5ff]"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                </div>
            </div>
        </div>
    );
};


const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
    const { state, dispatch } = useApp();
    const { currentUser } = state;
    const isCurrentUser = currentUser?.id === user.id;
    const isFollowing = currentUser?.following.includes(user.id) ?? false;
    
    const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
    const [isEditing, setIsEditing] = useState(false);

    const userVideos = state.videos.filter(v => v.userId === user.id);
    const savedVideos = state.videos.filter(v => user.id === currentUser?.id && v.saves.includes(user.id));

    const handleFollowToggle = () => {
        if (currentUser) {
            dispatch({ type: 'TOGGLE_FOLLOW', payload: { targetUserId: user.id, currentUserId: currentUser.id } });
        }
    };
    
    const handleMessage = () => {
        dispatch({ type: 'SET_ACTIVE_CHAT_USER', payload: user.id });
        dispatch({ type: 'SET_PAGE', payload: 'inbox' });
    }

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };
    
    const videosToShow = activeTab === 'posts' ? userVideos : savedVideos;

    if (isEditing) {
        return <EditProfile user={user} onClose={() => setIsEditing(false)} />;
    }

    return (
        <div className="h-full w-full bg-black text-white flex flex-col">
            <header className="p-4 flex justify-between items-center">
                <h1 className="text-lg font-bold">@{user.username}</h1>
                {isCurrentUser && <button onClick={handleLogout} className="text-sm text-gray-400">Logout</button>}
            </header>
            
            <div className="p-4 flex flex-col items-center">
                <img src={user.profilePicture} alt={user.displayName} className="w-24 h-24 rounded-full border-2 border-[#0ea5ff]" />
                <h2 className="text-xl font-bold mt-2">{user.displayName}</h2>
                <div className="flex space-x-6 my-4 text-center">
                    <div>
                        <p className="font-bold">{user.following.length}</p>
                        <p className="text-sm text-gray-400">Following</p>
                    </div>
                    <div>
                        <p className="font-bold">{user.followers.length}</p>
                        <p className="text-sm text-gray-400">Followers</p>
                    </div>
                    <div>
                        <p className="font-bold">{userVideos.reduce((acc, v) => acc + v.likes.length, 0)}</p>
                        <p className="text-sm text-gray-400">Likes</p>
                    </div>
                </div>
                <p className="text-sm text-center max-w-md">{user.bio}</p>

                <div className="mt-4 w-full max-w-sm flex space-x-2">
                    {isCurrentUser ? (
                        <button onClick={() => setIsEditing(true)} className="flex-1 border border-gray-600 rounded-md py-2 text-sm font-semibold transition-colors hover:bg-gray-800">Edit Profile</button>
                    ) : (
                        <>
                         <button 
                            onClick={handleFollowToggle}
                            className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                                isFollowing ? 'bg-gray-800 border border-gray-700' : 'bg-[#0ea5ff]'
                            }`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                        <button onClick={handleMessage} className="flex-1 border border-gray-600 rounded-md py-2 text-sm font-semibold transition-colors hover:bg-gray-800">Message</button>
                        </>
                    )}
                </div>
            </div>

            <div className="border-t border-b border-gray-800 grid grid-cols-2">
                 <button onClick={() => setActiveTab('posts')} className={`py-3 flex justify-center items-center ${activeTab === 'posts' ? 'border-b-2 border-white' : 'text-gray-500'}`}>
                    <Icon name="grid" className="w-6 h-6"/>
                 </button>
                  <button onClick={() => setActiveTab('saved')} className={`py-3 flex justify-center items-center ${activeTab === 'saved' ? 'border-b-2 border-white' : 'text-gray-500'}`}>
                    <Icon name="bookmark" className="w-6 h-6"/>
                 </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-3 gap-0.5">
                    {videosToShow.map(video => (
                        <div key={video.id} className="relative aspect-square bg-gray-900">
                             <img src={video.coverImage} alt="video cover" className="w-full h-full object-cover"/>
                        </div>
                    ))}
                </div>
                 {videosToShow.length === 0 && (
                    <div className="text-center text-gray-500 pt-20">
                        <p className="font-semibold">{activeTab === 'posts' ? 'No Posts Yet' : 'No Saved Videos'}</p>
                        <p className="text-sm">{activeTab === 'posts' ? 'Videos you upload will appear here.' : 'Videos you save will appear here.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;