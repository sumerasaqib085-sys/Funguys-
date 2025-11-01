
import React from 'react';

interface LoaderProps {
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      {text && <p className="text-white text-sm">{text}</p>}
    </div>
  );
};

export default Loader;
