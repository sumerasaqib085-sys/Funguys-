
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Page } from '../../types';
import Icon from '../common/Icon';

const BottomNav: React.FC = () => {
    const { state, dispatch } = useApp();
    const { currentPage } = state;

    const navItems: { page: Page; label: string; icon: string }[] = [
        { page: 'home', label: 'Home', icon: 'home' },
        { page: 'search', label: 'Discover', icon: 'search' },
        { page: 'create', label: 'Create', icon: 'add' },
        { page: 'inbox', label: 'Inbox', icon: 'inbox' },
        { page: 'profile', label: 'Me', icon: 'profile' },
    ];

    return (
        <nav className="w-full bg-black border-t border-gray-800 flex justify-around items-center h-16 sm:h-20 z-10">
            {navItems.map(item => (
                <button
                    key={item.page}
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: item.page })}
                    className={`flex flex-col items-center justify-center h-full w-full transition-colors duration-200 ${
                        currentPage === item.page ? 'text-[#0ea5ff]' : 'text-gray-400'
                    }`}
                >
                    {item.page === 'create' ? (
                         <div className="w-12 h-8 bg-white rounded-lg flex items-center justify-center">
                            <Icon name={item.icon} className="w-6 h-6 text-black" />
                         </div>
                    ) : (
                         <Icon name={item.icon} className="w-7 h-7" />
                    )}
                   
                    <span className={`text-xs mt-1 ${item.page === 'create' ? 'hidden' : ''}`}>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
