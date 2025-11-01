import React, { useState } from 'react';
import { Video, User } from '../../types';
import { useApp } from '../../context/AppContext';
import Icon from '../common/Icon';
import CommentSheet from './CommentSheet';

interface VideoSidebarProps {
  video: Video;
  uploader: User;
}

const VideoSidebar: React.FC<VideoSidebarProps> = ({ video, uploader }) => {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [showComments, setShowComments] = useState(false);
  
  const isLiked = currentUser ? video.likes.includes(currentUser.id) : false;
  const isSaved = currentUser ? video.saves.includes(currentUser.id) : false;

  const handleLike = () => {
    if (currentUser) {
      dispatch({ type: 'TOGGLE_LIKE', payload: { videoId: video.id, userId: currentUser.id } });
    }
  };
  
  const handleSave = () => {
    if (currentUser) {
      dispatch({ type: 'TOGGLE_SAVE', payload: { videoId: video.id, userId: currentUser.id } });
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this video from ${uploader.displayName} on Funguys!`,
          text: video.caption,
          url: video.url,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
        }
      }
    } else {
      navigator.clipboard.writeText(video.url);
      alert('Link copied to clipboard!');
    }
  };

  const handleReport = () => {
      alert("Thank you for your report. We will review this content to ensure it meets our community guidelines.");
  }

  return (
    <>
      <div className="absolute bottom-24 right-2 flex flex-col items-center space-y-5 text-white">
        <button onClick={handleLike} className="flex flex-col items-center transform transition-transform duration-200 active:scale-125">
          <div className="p-3 rounded-full bg-black/40">
            <Icon name="heart" solid={isLiked} className={`w-8 h-8 ${isLiked ? 'text-red-500' : 'text-white'}`} />
          </div>
          <span className="text-xs font-semibold">{video.likes.length}</span>
        </button>

        <button onClick={() => setShowComments(true)} className="flex flex-col items-center transform transition-transform duration-200 active:scale-125">
           <div className="p-3 rounded-full bg-black/40">
                <Icon name="comment" className="w-8 h-8" />
            </div>
          <span className="text-xs font-semibold">{video.comments.length}</span>
        </button>

        <button onClick={handleSave} className="flex flex-col items-center transform transition-transform duration-200 active:scale-125">
          <div className="p-3 rounded-full bg-black/40">
            <Icon name="bookmark" solid={isSaved} className={`w-8 h-8 ${isSaved ? 'text-yellow-400' : 'text-white'}`} />
          </div>
          <span className="text-xs font-semibold">{video.saves.length}</span>
        </button>
        
        <button onClick={handleShare} className="flex flex-col items-center transform transition-transform duration-200 active:scale-125">
          <div className="p-3 rounded-full bg-black/40">
            <Icon name="share" className="w-8 h-8" />
          </div>
          <span className="text-xs font-semibold">{video.shares}</span>
        </button>

        <button onClick={handleReport} className="flex flex-col items-center transform transition-transform duration-200 active:scale-125">
          <div className="p-3 rounded-full bg-black/40">
            <Icon name="report" className="w-8 h-8" />
          </div>
        </button>
      </div>
      {showComments && <CommentSheet videoId={video.id} onClose={() => setShowComments(false)} />}
    </>
  );
};

export default VideoSidebar;