import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const RocketIcon = () => (
    <svg className="w-16 h-16 mb-4 text-purple-400 animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h1v1h-1V7zm0 3h1v1h-1v-1zm4-3h1v1h-1V7zm0 3h1v1h-1v-1zM6 16.5V18a2 2 0 002 2h8a2 2 0 002-2v-1.5M6 16.5L3 12m18 4.5l-3-4.5M6 16.5l-3 3m18-3l-3 3M12 4.5v15m0-15l6 6M12 4.5L6 10.5M15 15.5L9 15.5"></path>
    </svg>
)

function SignIn() {

    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSignIn = async () => {
        setErr('')
        setLoading(true)
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/signin`,
                { userName, password },
                { withCredentials: true }
            )
            dispatch(setUserData({ ...result.data, streamToken: result.data.streamToken }));

            navigate('/');
        } catch (error) {
            if (error.response) {
                setErr(error.response?.data?.message || 'Invalid credentials. Please check your username and password.')
            } else {
                console.error(error)
                setErr('Network error, please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <style jsx global>{`

                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
 
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounceSlow 3s infinite ease-in-out;
                }
            `}</style>
            
            <div
                className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6"
            >

                <div className="w-full max-w-5xl h-auto lg:h-[650px] bg-white rounded-3xl flex overflow-hidden shadow-2xl border border-gray-700 transform scale-95 opacity-0 animate-scaleIn">
                    
                    <div className="w-full lg:w-1/2 h-full bg-white flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 gap-6">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back 👋</h2>
                        <p className="text-gray-500 mb-4 text-sm">Please sign in to access your secure profile.</p>

                        <div className="w-full">
                            <label htmlFor="userName" className="block mb-1 text-sm font-semibold text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="userName"
                                onChange={(e) => setUserName(e.target.value)}
                                value={userName}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-gray-400"
                                placeholder="Your username"
                            />
                        </div>

                        <div className="w-full">
                            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-gray-400"
                                placeholder="Your password"
                            />
                        </div>

                        <p
                            onClick={() => navigate('/forgot-password')}
                            className="text-xs text-purple-600 hover:underline cursor-pointer self-end font-medium transition duration-200"
                        >
                            Forgot Password?
                        </p>

                        {err && <p className="text-red-600 text-sm font-semibold mt-2">{err}</p>}

                        <button
                            type="button"
                            disabled={loading}
                            className={`w-full bg-purple-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition duration-300 shadow-md mt-4 ${
                                loading 
                                    ? 'opacity-70 cursor-not-allowed' 
                                    : 'hover:bg-purple-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50'
                            }`}
                            onClick={handleSignIn}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <p className="text-sm text-gray-600 text-center mt-2">
                            Don't have an account?{' '}
                            <span
                                onClick={() => navigate('/signup')}
                                className="text-purple-600 font-bold hover:underline cursor-pointer transition duration-200"
                            >
                                Sign Up
                            </span>
                        </p>
                    </div>

                    <div className="hidden lg:flex w-1/2 h-full justify-center items-center bg-purple-700 flex-col gap-3 text-white p-10 relative overflow-hidden rounded-tr-3xl rounded-br-3xl">
                        
                        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://source.unsplash.com/random/800x600?abstract,geometric')"}}></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-900 opacity-80 z-0"></div>

                        <div className="z-10 flex flex-col items-center text-center">
                            <RocketIcon />
                            <h3 className="text-3xl font-bold mb-4">Launch Your Experience</h3>
                            <p className="text-xl font-light max-w-sm italic opacity-90">
                                “Your connection to the world is secure and seamless.”
                            </p>
                            <p className="mt-4 text-sm max-w-xs text-gray-300">
                                Ready to continue connecting, sharing, and staying informed?
                            </p>
                         
                            <button
                                onClick={() => navigate('/signup')}
                                className="mt-8 px-8 py-3 bg-white text-purple-700 font-bold rounded-full shadow-lg transition duration-300 hover:bg-gray-100 transform hover:scale-105"
                            >
                                Create New Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn