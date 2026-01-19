// 

import React, { useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

// Social Identity Icon (Matching the SignIn page)
const PsyncLogo = () => (
    <div className="relative mb-4">
        <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 animate-pulse"></div>
        <svg className="w-12 h-12 relative z-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    </div>
)

function Signup() {
    const [name, setName] = useState('')
    const [userName, setuserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSignUp = async (e) => {
        if (e) e.preventDefault();
        setErr('')
        setLoading(true)
        try {
            const result = await axios.post(
                `${serverUrl}/api/auth/signup`,
                { name, userName, email, password },
                { withCredentials: true }
            )
            dispatch(setUserData({ ...result.data.user, streamToken: result.data.streamToken }));
            navigate('/');
        } catch (error) {
            setErr(error.response?.data?.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#050505] text-white selection:bg-purple-500 p-4 sm:p-6">
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                .social-input {
                    background: #121212;
                    border: 1px solid #222;
                    transition: all 0.2s ease;
                }
                .social-input:focus {
                    background: #1a1a1a;
                    border-color: #a855f7;
                    box-shadow: 0 0 0 1px #a855f7;
                }
            `}} />

            {/* Background Mesh (Same as SignIn for brand consistency) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-[480px] z-10 animate-slideUp">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-8">
                    <PsyncLogo />
                    <h1 className="text-3xl font-black tracking-tighter italic">JOIN PSYNC</h1>
                    <p className="text-gray-500 text-sm mt-2 text-center">Step into the new era of secure communication.</p>
                </div>

                {/* Signup Card */}
                <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-[2.5rem] p-8 shadow-2xl">
                    <form className="space-y-4" onSubmit={handleSignUp}>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 ml-1">Full Name</label>
                                <input
                                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    className="w-full social-input rounded-2xl px-5 py-3.5 outline-none placeholder:text-gray-700"
                                    placeholder="John Doe" required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 ml-1">Username</label>
                                <input
                                    type="text" value={userName} onChange={(e) => setuserName(e.target.value)}
                                    className="w-full social-input rounded-2xl px-5 py-3.5 outline-none placeholder:text-gray-700"
                                    placeholder="johndoe" required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 ml-1">Email Address</label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full social-input rounded-2xl px-5 py-3.5 outline-none placeholder:text-gray-700"
                                placeholder="name@example.com" required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] uppercase tracking-widest font-bold text-gray-500 ml-1">Secure Password</label>
                            <input
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full social-input rounded-2xl px-5 py-3.5 outline-none placeholder:text-gray-700"
                                placeholder="••••••••" required
                            />
                        </div>

                        {err && (
                            <p className="text-red-400 text-xs font-bold text-center bg-red-400/10 py-3 rounded-xl border border-red-400/20">
                                {err}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-black py-4 rounded-2xl transition-all active:scale-[0.98] hover:bg-gray-200 disabled:opacity-50 flex justify-center items-center gap-2 mt-4 shadow-lg shadow-white/5"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                            ) : "Create Account"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center pt-6 border-t border-[#1f1f1f]">
                        <p className="text-gray-500 text-sm font-medium">
                            Part of the network?{' '}
                            <span
                                onClick={() => navigate('/signin')}
                                className="text-white font-bold cursor-pointer hover:text-purple-400 transition underline underline-offset-4"
                            >
                                Sign In here
                            </span>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-gray-600 text-[10px] uppercase tracking-[0.2em]">
                    Psync Protocol © 2026
                </p>
            </div>
        </div>
    )
}

export default Signup