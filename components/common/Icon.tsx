import React from 'react';

type IconProps = {
  name: string;
  className?: string;
  solid?: boolean;
};

const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6', solid = false }) => {
  const commonProps = solid ? {
    xmlns: "http://www.w3.org/2000/svg",
    className,
    viewBox: "0 0 24 24",
    fill: "currentColor"
  } : {
    xmlns: "http://www.w3.org/2000/svg",
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.5
  };

  const icons: { [key: string]: React.ReactElement } = {
    home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    add: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
    inbox: <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    profile: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    heart: solid 
        ? <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        : <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.25l-7.682-7.682a4.5 4.5 0 010-6.364z" />,
    comment: <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.862 12.525 9 11.772 9 11c0-.772-.138-1.525-.316-2.342m0 4.684a3 3 0 100-4.684m0 4.684l6.032 3.318m-6.032-11.318l6.032-3.318m0 0a3 3 0 10-5.712-2.328m5.712 2.328a3 3 0 100 4.656m0-4.656l-6.032 3.318" />,
    play: <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />,
    pause: <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />,
    send: <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />,
    more: <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
    bookmark: solid 
        ? <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        : <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h-1a2 2 0 00-2 2v2a2 2 0 002 2h1a2 2 0 002-2v-2a2 2 0 00-2-2zM7 3h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />,
    report: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4.5A1.5 1.5 0 014.5 15h15a1.5 1.5 0 011.5 1.5V21m-4.5-6v-4.5A1.5 1.5 0 0015 9h-3.75a1.5 1.5 0 00-1.5 1.5V15m-4.5 0V3m0 0v3m0-3h3m-3 0h-3" />,
    grid: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  };
  
  return (
    // @ts-ignore
    <svg {...commonProps}>
      {icons[name]}
    </svg>
  );
};

export default Icon;