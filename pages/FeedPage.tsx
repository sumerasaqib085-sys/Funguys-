
import React from 'react';
import { useApp } from '../context/AppContext';
import VideoPlayer from '../components/video/VideoPlayer';

const FeedPage: React.FC = () => {
    const { state } = useApp();
    const { videos } = state;

    return (
        <div className="relative h-full w-full bg-black snap-y snap-mandatory overflow-y-scroll">
            {videos.length > 0 ? (
                videos.map(video => <VideoPlayer key={video.id} video={video} />)
            ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <p>No videos to show. Follow some creators!</p>
                </div>
            )}
        </div>
    );
};

export default FeedPage;
