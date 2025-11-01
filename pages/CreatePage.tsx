
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Video } from '../types';
import Icon from '../components/common/Icon';
import Loader from '../components/common/Loader';

// Helper function to generate a cover image from a video file
const generateCoverImage = (videoFile: File, seekTo = 0.5): Promise<string> => {
  return new Promise((resolve, reject) => {
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('src', URL.createObjectURL(videoFile));
    videoPlayer.load();

    videoPlayer.addEventListener('error', (ex) => {
      reject(`Error loading video file.`);
    });

    videoPlayer.addEventListener('loadedmetadata', () => {
      if (videoPlayer.duration < seekTo) {
         videoPlayer.currentTime = 0;
      } else {
         videoPlayer.currentTime = videoPlayer.duration * seekTo;
      }

      videoPlayer.addEventListener('seeked', () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject('Could not get canvas context');
        }
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        
        URL.revokeObjectURL(videoPlayer.src); // Clean up object URL

        resolve(ctx.canvas.toDataURL("image/jpeg", 0.75));
      });
    });
  });
};


const CreatePage: React.FC = () => {
    const { state, dispatch } = useApp();
    const { currentUser } = state;

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [tags, setTags] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setError('');
        } else {
            setVideoFile(null);
            setPreviewUrl(null);
            setError('Please select a valid video file.');
        }
    };

    const handlePost = async () => {
        if (!videoFile || !currentUser) {
            setError('Please select a video to upload.');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            // Simulate upload delay for better UX
            await new Promise(res => setTimeout(res, 1500));

            const coverImage = await generateCoverImage(videoFile);
            
            const newVideo: Video = {
                id: `vid${Date.now()}`,
                url: URL.createObjectURL(videoFile),
                coverImage,
                caption,
                tags: tags.split(/[, ]+/).filter(Boolean), // Split by comma or space and remove empty strings
                userId: currentUser.id,
                likes: [],
                // FIX: Added missing 'saves' property to conform to the Video type.
                saves: [],
                comments: [],
                shares: 0,
                views: 0,
            };

            dispatch({ type: 'ADD_VIDEO', payload: newVideo });
            dispatch({ type: 'SET_PAGE', payload: 'home' });

        } catch (err) {
            console.error("Failed to post video:", err);
            setError('Could not process video. Please try another file.');
            setIsUploading(false);
        }
    };

    return (
        <div className="h-full w-full bg-black text-white flex flex-col p-4 overflow-y-auto">
            <h1 className="text-xl font-bold mb-4">Upload Video</h1>
            {isUploading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader text="Posting your video..." />
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    {!previewUrl ? (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                            <Icon name="upload" className="w-16 h-16 text-gray-500 mb-4" />
                            <p className="text-gray-400 mb-4">Select a video file to upload</p>
                            <label htmlFor="video-upload" className="bg-[#0ea5ff] text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
                                Choose File
                            </label>
                            <input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                        </div>
                    ) : (
                         <div className="w-full mb-4 flex justify-center">
                            <video src={previewUrl} controls className="max-h-64 rounded-lg bg-gray-900" />
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm text-center my-2">{error}</p>}
                    
                    {videoFile && (
                        <div className="space-y-4 mt-4">
                             <textarea
                                value={caption}
                                onChange={e => setCaption(e.target.value)}
                                placeholder="Write a caption..."
                                className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5ff] h-24"
                            />
                            <input
                                type="text"
                                value={tags}
                                onChange={e => setTags(e.target.value)}
                                placeholder="Add tags, separated by space or comma"
                                className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5ff]"
                            />
                             <button
                                onClick={handlePost}
                                className="w-full bg-[#0ea5ff] text-white font-bold py-3 rounded-md hover:bg-blue-600 transition-colors duration-300"
                            >
                                Post
                            </button>
                            <button
                                onClick={() => { 
                                    if(previewUrl) URL.revokeObjectURL(previewUrl);
                                    setVideoFile(null); 
                                    setPreviewUrl(null); 
                                }}
                                className="w-full border border-gray-600 rounded-md py-2 text-sm font-semibold transition-colors hover:bg-gray-800 mt-2"
                            >
                                Choose a different video
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CreatePage;