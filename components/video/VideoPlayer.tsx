import React, { useRef, useEffect, useState } from 'react';
import { Video, User } from '../../types';
import { useApp } from '../../context/AppContext';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import Icon from '../common/Icon';
import VideoSidebar from './VideoSidebar';

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const { state, dispatch } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisible = useIntersectionObserver(videoRef, { threshold: 0.7 });
  const [isPlaying, setIsPlaying] = useState(false);
  const { currentUser } = state;
  
  const uploader = state.users.find(u => u.id === video.userId);
  const isFollowing = currentUser?.following.includes(uploader?.id || '') || false;
  const isSelf = currentUser?.id === uploader?.id;

  useEffect(() => {
    if (isVisible) {
      videoRef.current?.play().then(() => setIsPlaying(true)).catch(e => {
        if (e.name !== 'AbortError') {
          console.error("Autoplay failed", e);
        }
      });
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isVisible]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  const viewProfile = () => {
      if (uploader) {
        dispatch({ type: 'SET_VIEWED_USER', payload: uploader });
      }
  };
  
  const handleFollow = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent video from pausing/playing
      if (currentUser && uploader) {
          dispatch({ type: 'TOGGLE_FOLLOW', payload: { targetUserId: uploader.id, currentUserId: currentUser.id } });
      }
  }

  if (!uploader) return null;

  return (
    <div className="relative h-full w-full snap-start flex-shrink-0 bg-black">
      <video
        ref={videoRef}
        onClick={togglePlay}
        src={video.url}
        loop
        playsInline
        className="h-full w-full object-contain"
        poster={video.coverImage}
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
          <Icon name="play" className="w-20 h-20 text-white/50" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
        <div className="flex items-center space-x-2">
            <img src={uploader.profilePicture} alt={uploader.displayName} className="w-10 h-10 rounded-full border-2 border-white cursor-pointer" onClick={viewProfile}/>
            <p className="font-bold text-sm cursor-pointer" onClick={viewProfile}>@{uploader.username}</p>
            {!isSelf && !isFollowing && (
                 <button onClick={handleFollow} className="text-xs font-semibold border border-white rounded px-2 py-0.5 ml-2 transition-colors hover:bg-white/20">
                    Follow
                </button>
            )}
        </div>
        <p className="text-sm mt-2">{video.caption}</p>
        <div className="flex flex-wrap gap-2 mt-1">
            {video.tags.map(tag => (
                <span key={tag} className="text-xs font-semibold">#{tag}</span>
            ))}
        </div>
      </div>

      <VideoSidebar video={video} uploader={uploader} />
    </div>
  );
};

export default VideoPlayer;