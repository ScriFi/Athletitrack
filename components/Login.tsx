import React from 'react';
import { User } from '../types';
import { Icon } from './Icon';

interface LoginProps {
    users: User[];
    onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-brand-light">
             <div className="flex items-center gap-4 mb-8">
                <Icon className="w-12 h-12 text-brand-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
                    </svg>
                </Icon>
                <h1 className="text-4xl font-bold text-brand-dark">AthleticaTrack</h1>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a Profile to Login</h2>
                <p className="text-gray-500 mb-6">Choose a user to experience their role-based view.</p>
                <div className="space-y-4">
                    {users.map(user => (
                        <button
                            key={user.id}
                            onClick={() => onLogin(user)}
                            className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-brand-primary transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                            <div>
                                <p className="font-bold text-lg text-brand-dark">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email} - <span className="font-semibold capitalize">{user.role}</span></p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
             <div className="p-4 mt-8 text-center text-xs text-gray-400">
                <p>&copy; {new Date().getFullYear()} AthleticaTrack</p>
                <p>A multi-tenant scheduling application.</p>
            </div>
        </div>
    );
};
