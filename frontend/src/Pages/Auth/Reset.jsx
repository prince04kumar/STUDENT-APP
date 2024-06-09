import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Images/logo.jpg';

export default function Reset() {
    const navigate = useNavigate();
    const [resetState, setResetState] = useState(false);
    const [resetMail, setResetMail] = useState('');
    const [formData, setFormData] = useState({
        token: '',
        password: ''
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newPassword: formData.password
            })
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/auth/reset-password/${formData.token}`, requestOptions);
            if (!response.ok) {
                throw new Error('Password reset failed');
            }
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/auth/login'); 
        } catch (error) {
            console.error('Password Reset Error', error);
            setError('Invalid token or password. Please try again.');
        }
    };

    const handleResetEmail = async (e) => {
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: resetMail
            })
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/auth/reset-password`, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to send reset email');
            }
            setResetState(true);
            setError(''); 
        } catch (error) {
            console.error('Reset Email Request Error', error);
            setError('User not found or error sending reset email.');
        }
    };

    if (resetState) {
        return (
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2 rounded-full" src={logo} alt="logo" />
                        Ayush
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Reset Your Password
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handlePasswordReset}>
                                <div>
                                    <label htmlFor="token" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Reset Token</label>
                                    <input
                                        type="text"
                                        id="token"
                                        value={formData.token}
                                        onChange={handleInputChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Enter reset token"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    Update Password
                                </button>
                                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    } else {
        return (
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2 rounded-full" src={logo} alt="logo" />
                        Reset Password
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Send Reset Code
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleResetEmail}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={resetMail}
                                        onChange={(e) => setResetMail(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="name@company.com"
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    Send Reset Code
                                </button>
                                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
