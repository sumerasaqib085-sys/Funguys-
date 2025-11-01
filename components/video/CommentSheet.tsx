
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Icon from '../common/Icon';

interface CommentSheetProps {
  videoId: string;
  onClose: () => void;
}

const CommentSheet: React.FC<CommentSheetProps> = ({ videoId, onClose }) => {
  const { state, dispatch } = useApp();
  const { currentUser, users } = state;
  const video = state.videos.find(v => v.id === videoId);
  const [newComment, setNewComment] = useState('');

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && currentUser && video) {
      const comment = {
        id: `c${Date.now()}`,
        userId: currentUser.id,
        videoId: video.id,
        text: newComment,
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_COMMENT', payload: { videoId: video.id, comment } });
      setNewComment('');
    }
  };

  if (!video) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
      <div 
        className="absolute bottom-0 left-0 right-0 h-3/4 bg-[#181818] rounded-t-2xl flex flex-col p-4 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Comments ({video.comments.length})</h3>
          <button onClick={onClose} className="p-1">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {video.comments.map(comment => {
            const user = users.find(u => u.id === comment.userId);
            if (!user) return null;
            return (
              <div key={comment.id} className="flex items-start space-x-3">
                <img src={user.profilePicture} alt={user.displayName} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <p className="text-xs text-gray-400">@{user.username}</p>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        <form onSubmit={handlePostComment} className="mt-4 flex items-center border-t border-gray-700 pt-4">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5ff]"
          />
          <button type="submit" disabled={!newComment.trim()} className="ml-2 p-2 rounded-full bg-[#0ea5ff] disabled:bg-gray-600 transition-colors">
            <Icon name="send" className="w-5 h-5" />
          </button>
        </form>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default CommentSheet;
