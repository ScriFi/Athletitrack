import React, { useState } from 'react';
import { Icon } from './Icon';

interface LoginViewProps {
    onLogin: (username: string, password: string) => boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = onLogin(username, password);
        if (!success) {
            setError('Invalid username or password.');
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-brand-light">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
                    <div className="flex flex-col items-center mb-6">
                        <Icon className="w-12 h-12 text-brand-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
                            </svg>
                        </Icon>
                        <h1 className="text-2xl font-bold text-brand-dark mt-2">AthleticaTrack</h1>
                        <p className="text-gray-500">Facility Scheduler Login</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors" type="submit">
                            Sign In
                        </button>
                    </div>
                     <div className="text-center mt-6 text-sm text-gray-500">
                        <p className="font-bold">Demo Logins:</p>
                        <p>Admin: <code className="bg-gray-200 px-1 rounded">admin</code> / <code className="bg-gray-200 px-1 rounded">password</code></p>
                        <p>Baseball Coach: <code className="bg-gray-200 px-1 rounded">coachj</code> / <code className="bg-gray-200 px-1 rounded">baseball</code></p>
                    </div>
                </form>
            </div>
        </div>
    );
};
