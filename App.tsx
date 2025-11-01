
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import FeedPage from './pages/FeedPage';
import AuthPage from './pages/AuthPage';
import BottomNav from './components/layout/BottomNav';
import SearchPage from './pages/SearchPage';
import CreatePage from './pages/CreatePage';
import InboxPage from './pages/InboxPage';
import ProfilePage from './pages/ProfilePage';

const AppContent: React.FC = () => {
    const { state } = useApp();
    const { currentUser, currentPage, viewedUser } = state;

    if (!currentUser) {
        return <AuthPage />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <FeedPage />;
            case 'search':
                return <SearchPage />;
            case 'create':
                return <CreatePage />;
            case 'inbox':
                return <InboxPage />;
            case 'profile':
                return <ProfilePage user={viewedUser || currentUser} />;
            default:
                return <FeedPage />;
        }
    };

    return (
        <div className="h-screen w-screen bg-black flex flex-col font-sans overflow-hidden">
            <main className="flex-1 h-full w-full overflow-hidden">
                {renderPage()}
            </main>
            <BottomNav />
        </div>
    );
};


const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
