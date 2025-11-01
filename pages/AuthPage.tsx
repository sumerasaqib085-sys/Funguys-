import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User } from '../types';

const AuthPage: React.FC = () => {
    const { state, dispatch } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');

    const validateUsername = (uname: string) => /^[a-zA-Z0-9_]{3,20}$/.test(uname);
    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const loginIdentifier = username; // User can enter username or email here
            const user = state.users.find(u => (u.username === loginIdentifier || u.email === loginIdentifier) && u.password === password);
            if (user) {
                dispatch({ type: 'LOGIN', payload: user });
            } else {
                setError('Invalid credentials.');
            }
        } else {
            if (!validateUsername(username)) {
                setError('Username must be 3-20 characters (letters, numbers, underscores).');
                return;
            }
             if (!validateEmail(email)) {
                setError('Please enter a valid email address.');
                return;
            }
            if (state.users.some(u => u.username === username)) {
                setError('Username is already taken.');
                return;
            }
             if (state.users.some(u => u.email === email)) {
                setError('An account with this email already exists.');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters long.');
                return;
            }
            if (displayName.trim().length < 2) {
                setError('Display name must be at least 2 characters long.');
                return;
            }
            if (!agreedToTerms) {
                setError('You must agree to the Terms of Service.');
                return;
            }

            const newUser: User = {
                id: `user${Date.now()}`,
                username,
                email,
                password,
                displayName,
                bio: 'Welcome to Funguys!',
                profilePicture: `https://picsum.photos/seed/${username}/200/200`,
                followers: [],
                following: [],
            };
            dispatch({ type: 'REGISTER', payload: newUser });
            dispatch({ type: 'LOGIN', payload: newUser });
        }
    };


    return (
        <div className="h-screen w-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#121212] rounded-lg p-8 shadow-lg">
                <h1 className="text-3xl font-bold text-center text-white mb-2">Funguys</h1>
                 <p className="text-center text-gray-400 mb-6">{isLogin ? 'Welcome back!' : 'Join the Fun'}</p>

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Display Name"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5ff]"
                        />
                    )}
                     <input
                        type="text"
                        placeholder={isLogin ? "Username or Email" : "Username"}
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5ff]"
                    />
                    {!isLogin && (
                         <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5ff]"
                        />
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full bg-gray-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0ea5ff]"
                    />
                    
                    {!isLogin && (
                        <div className="flex items-center space-x-2">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={agreedToTerms} 
                                onChange={e => setAgreedToTerms(e.target.checked)}
                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[#0ea5ff] focus:ring-[#0ea5ff]"
                             />
                            <label htmlFor="terms" className="text-xs text-gray-400">
                                I agree to the Terms of Service and Community Guidelines, which prohibit copyrighted, abusive, and 18+ content.
                            </label>
                        </div>
                    )}
                    
                    {error && <p className="text-red-500 text-xs text-center pt-1">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-[#0ea5ff] text-white font-bold py-3 rounded-md hover:bg-blue-600 transition-colors duration-300 transform active:scale-95"
                    >
                        {isLogin ? 'Log In' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button onClick={() => {setIsLogin(!isLogin); setError('');}} className="font-semibold text-[#0ea5ff] hover:underline ml-1">
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;