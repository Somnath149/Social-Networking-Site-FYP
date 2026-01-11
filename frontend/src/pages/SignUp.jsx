import React, { useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const ChatIcon = () => (
    <svg className="w-16 h-16 mb-4 text-purple-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.03C4.342 16.568 5 15.7 5 14a7 7 0 0114 0c0 1.5-1 2-1 2.5V14a5 5 0 00-5-5h-4a5 5 0 00-5 5v2.5M12 21a9 9 0 100-18 9 9 0 000 18z"></path>
    </svg>
)

function Signup() {

    const [name, setName] = useState('')
    const [userName, setuserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleSignUp = async () => {
        setErr('')
        setLoading(true)
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/signup`,
                { name, userName, email, password },
                { withCredentials: true }
            )
            dispatch(setUserData({ ...result.data.user, streamToken: result.data.streamToken }));
        } catch (error) {
            if (error.response) {
                setErr(error.response?.data?.message || 'Something went wrong.')
            } else {
                console.error(error)
                setErr('Network error, please try again.')
            }
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center items-center p-4 sm:p-6">
             <style jsx global>{`
                /* Keyframes for the card scale-in */
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
            `}</style>
            <div className="w-full max-w-5xl h-auto lg:h-[650px] bg-white flex rounded-2xl overflow-hidden shadow-2xl border border-gray-700 transform scale-95 opacity-0 animate-scaleIn">

                <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 md:p-16 gap-6">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Join Psync Today</h2>
                    <p className="text-gray-500 mb-4 text-sm">Create your new account in a few simple steps.</p>

                    <div className="flex flex-col gap-5">
             
                        <div>
                            <label htmlFor="name" className="block mb-1 text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-gray-400"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="userName" className="block mb-1 text-sm font-semibold text-gray-700">Username</label>
                            <input
                                id="userName"
                                type="text"
                                value={userName}
                                onChange={(e) => setuserName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-gray-400"
                                placeholder="Choose a username"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-gray-400"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 hover:border-gray-400"
                                placeholder="Create a password"
                            />
                        </div>
                    {err && <p className="text-red-600  text-sm font-semibold mt-2">{err}</p>}
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        className={`w-full bg-gray-900 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition duration-300 shadow-md mt-4 ${
                            loading 
                                ? 'opacity-70 cursor-not-allowed' 
                                : 'hover:bg-gray-800 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-700 focus:ring-opacity-50'
                        }`}
                        onClick={handleSignUp}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'Sign Up'
                        )}
                    </button>

                    <p className="text-center text-gray-600 text-sm mt-2">
                        Already have an account?{' '}
                        <span
                            onClick={() => navigate('/signin')}
                            className="text-gray-900 font-bold cursor-pointer hover:underline transition duration-200"
                        >
                            Sign In
                        </span>
                    </p>
                </div>

                <div className="hidden lg:flex w-1/2 bg-gray-900 text-white flex-col justify-center items-center p-10 rounded-tr-2xl rounded-br-2xl relative overflow-hidden">
                    
                    <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://source.unsplash.com/random/800x600?abstract,grid')"}}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-80 z-0"></div>

                    <div className="z-10 flex flex-col items-center text-center">
                        <ChatIcon />
                        <h3 className="text-3xl font-bold mb-4">The Psync Experience</h3>
                        <p className="text-xl font-light max-w-sm text-center italic opacity-90">
                            “Connect, Share, and Stay Informed Safely”
                        </p>
                        <p className="mt-4 text-sm max-w-xs text-gray-300">
                             A new era of secure and reliable communication starts here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup