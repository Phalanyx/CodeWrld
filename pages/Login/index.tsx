import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@/lib/AppVars';
import { toast } from 'react-toastify';

const LoginPage = () => {

    const context = useContext(AppContext);


    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {

        if (router.isReady && context?.userID) {
            router.push('/');
        }
    }, [router.isReady]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName, password })
            });

            if (!response.ok) {
                toast.error('Login failed');
                return;
            }

            const { accessToken, refreshToken, userID } = await response.json();

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            context?.setUserID(userID.toString());
            localStorage.setItem('userID', userID.toString());

            toast.success('Login successful');

            setTimeout(() => {
                router.push('/');
            }, 500);

        } 
        catch (error) {
            toast.error('Login failed');
            return;
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label htmlFor="userName" className="block text-sm font-medium">
                        Username
                    </label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm outline-none focus:ring focus:border sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 rounded-md shadow outline-none">
                    Log In
                </button>
            </form>
            <button 
            className="w-full py-2 px-4 rounded-md shadow outline-none mt-10"
            onClick={() => router.push('/Signup')}
            > Sign up</button>

        
        </div>
    );
};

export default LoginPage;