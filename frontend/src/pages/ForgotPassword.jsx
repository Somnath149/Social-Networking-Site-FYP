// import React, { useState } from 'react'
// import { serverUrl } from '../App'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom';

// const ForgotPassword = () => {
//   const [step, setStep] = useState(1)
//   const [email, setEmail] = useState("")
//   const [otp, setOtp] = useState("")
//   const [newPassword, setnewPassword] = useState("")
//   const [confirmPassword, setconfirmPassword] = useState("")
//   const [inputClicked, setinputClicked] = useState({
//     email: false,
//     otp: false,
//     newPassword: false,
//     confirmPassword: false
//   })
//   const navigate = useNavigate();
//   const handleStep1=async () => {
//     try {
//       const result= await axios.post(`${serverUrl}/api/auth/sendOtp`,{email},{ withCredentials: true })
//       console.log(result.data)
//       setStep(2)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//     const handleStep2=async () => {
//     try {
//       const result= await axios.post(`${serverUrl}/api/auth/verifyOtp`,{email,otp},{ withCredentials: true })
//       console.log(result.data)
//       setStep(3)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//     const handleStep3=async () => {
//     try {
//       if(newPassword !== confirmPassword){
//         return console.log("password does not match")
//       }
//       const result= await axios.post(`${serverUrl}/api/auth/resetPassword`,{email,password:newPassword},{withCredentials:true})
//       console.log(result.data)
//       navigate('/signin');
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   return (
//     <div className='w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center'>
//       {step == 1 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center
//        items-center flex-col border-[#1a1f23]'>
//         <h2>Reset Password</h2>
//         <div>
//           <label htmlFor="email">Enter your email:</label>
//           <input type="email" id='email' onChange={(e) => setEmail(e.target.value)} value={email} className='border-2 border-black' />
//         </div>
//         <button type="button" className='text-white bg-black p-[7px] w-[70%] rounded-2xl' onClick={handleStep1}>Send OTP</button>
//       </div>}


//       {step == 2 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center
//        items-center flex-col border-[#1a1f23]'>
//         <div onClick={() => setinputClicked({ ...inputClicked, otp: true })}>
//           <label htmlFor="otp">Enter OTP:</label>
//           <input type="text" id='otp' onChange={(e) => setOtp(e.target.value)} value={otp} className='border-2 border-black' />
//         </div>
//         <button type="button" className='text-white bg-black p-[7px] w-[70%] rounded-2xl' onClick={handleStep2}>Submit</button>
//       </div>}

//       {step == 3 && <div className='w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center
//        items-center flex-col border-[#1a1f23]'>
//         <div onClick={() => setinputClicked({ ...inputClicked, newPassword: true })}>
//           <label htmlFor="password">Enter Password:</label>
//           <input type="password" id='newPassword' onChange={(e) => setnewPassword(e.target.value)} value={newPassword} className='border-2 border-black' />
//         </div>

//         <div onClick={() => setinputClicked({ ...inputClicked, confirmPassword: true })}>
//           <label htmlFor="confirm-password">Enter Confirm Password:</label>
//           <input type="password" id='confirmPassword' onChange={(e) => setconfirmPassword(e.target.value)} value={confirmPassword} className='border-2 border-black' />
//         </div>
//         <button type="button" className='text-white bg-black p-[7px] w-[70%] rounded-2xl' onClick={handleStep3}>Submit</button>
//       </div>}

//     </div>
//   )
// }

// export default ForgotPassword


import React, { useState } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const EmailIcon = () => (
    <svg className="w-10 h-10 text-indigo-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-1 13H4a2 2 0 01-2-2V7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2z"></path></svg>
);

const LockOpenIcon = () => (
    <svg className="w-10 h-10 text-indigo-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0v4m-1.5 8.5v-4a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2zM4 14h6"></path></svg>
);

const CheckIcon = () => (
    <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);


const ForgotPassword = () => {
   
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setnewPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const [err, setErr] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const handleStep1 = async () => {
        setErr('');
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/sendOtp`, { email }, { withCredentials: true })
            console.log(result.data)
            setStep(2)
        } catch (error) {
            console.error(error)
            setErr(error.response?.data?.message || "Failed to send OTP. Please check the email.")
        } finally {
            setLoading(false);
        }
    }

    const handleStep2 = async () => {
        setErr('');
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/verifyOtp`, { email, otp }, { withCredentials: true })
            console.log(result.data)
            setStep(3)
        } catch (error) {
            console.error(error)
            setErr(error.response?.data?.message || "OTP verification failed. Please try again.")
        } finally {
            setLoading(false);
        }
    }

    const handleStep3 = async () => {
        setErr('');
        setLoading(true);
        try {
            if (newPassword !== confirmPassword) {
                setLoading(false);
                return setErr("Passwords do not match.")
            }
            if (newPassword.length < 6) {
                setLoading(false);
                return setErr("Password must be at least 6 characters long.")
            }
            
            const result = await axios.post(`${serverUrl}/api/auth/resetPassword`, { email, password: newPassword }, { withCredentials: true })
            console.log(result.data)
            
            navigate('/signin'); 
        } catch (error) {
            console.error(error)
            setErr(error.response?.data?.message || "Failed to reset password.")
        } finally {
            setLoading(false);
        }
    }

    let title, component, action;

    if (step === 1) {
        title = "Reset Your Password";
        action = "Send OTP";
        component = (
            <div className='w-full'>
                <EmailIcon />
                <p className="text-gray-600 mb-6">Enter the email associated with your account. We will send an OTP to verify.</p>
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700 text-left">Email Address</label>
                <input 
                    type="email" 
                    id='email' 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email} 
                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300' 
                    placeholder="you@example.com"
                />
            </div>
        );
    } else if (step === 2) {
        title = "Verify OTP";
        action = "Verify Code";
        component = (
            <div className='w-full'>
                <LockOpenIcon />
                <p className="text-gray-600 mb-6">A 6-digit code has been sent to **{email}**. Please check your inbox (and spam folder).</p>
                <label htmlFor="otp" className="block mb-2 font-medium text-gray-700 text-left">OTP Code</label>
                <input 
                    type="text" 
                    id='otp' 
                    onChange={(e) => setOtp(e.target.value)} 
                    value={otp} 
                    className='w-full p-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300' 
                    placeholder="______"
                    maxLength={6}
                />
            </div>
        );
    } else if (step === 3) {
        title = "Set New Password";
        action = "Reset Password";
        component = (
            <div className='w-full'>
                <CheckIcon />
                <p className="text-gray-600 mb-6">Your identity is verified. Enter your new secure password below.</p>
                
                <div className='mb-4'>
                    <label htmlFor="newPassword" className="block mb-2 font-medium text-gray-700 text-left">New Password</label>
                    <input 
                        type="password" 
                        id='newPassword' 
                        onChange={(e) => setnewPassword(e.target.value)} 
                        value={newPassword} 
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300' 
                        placeholder="Min 6 characters"
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700 text-left">Confirm Password</label>
                    <input 
                        type="password" 
                        id='confirmPassword' 
                        onChange={(e) => setconfirmPassword(e.target.value)} 
                        value={confirmPassword} 
                        className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300' 
                        placeholder="Confirm your new password"
                    />
                </div>
            </div>
        );
    }

    const handleAction = () => {
        if (step === 1) return handleStep1();
        if (step === 2) return handleStep2();
        if (step === 3) return handleStep3();
    }

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center items-center p-6'>
            <style jsx global>{`
                @keyframes scaleIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
            `}</style>
            
            <div className='w-[90%] max-w-[500px] h-auto p-8 sm:p-10 bg-white rounded-2xl flex flex-col items-center shadow-2xl border border-gray-200 transform scale-95 opacity-0 animate-scaleIn'>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                <div className='h-0.5 w-12 bg-indigo-500 mb-8 rounded-full'></div>
                
                <div key={step} className='w-full text-center animate-fadeIn'>
                    {component}
                </div>

                {err && <p className="text-red-600 text-sm font-semibold mt-4 mb-2">{err}</p>}

                <button 
                    type="button" 
                    disabled={loading}
                    className={`mt-6 w-full bg-indigo-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition duration-300 shadow-md ${
                        loading 
                            ? 'opacity-70 cursor-not-allowed' 
                            : 'hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                    }`}
                    onClick={handleAction}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        action
                    )}
                </button>

                <p className="text-center text-gray-500 text-sm mt-6">
                    {step === 2 && (
                        <span onClick={handleStep1} className="text-indigo-600 font-medium cursor-pointer hover:underline transition duration-200">
                            Resend OTP
                        </span>
                    )}
                    {(step === 1 || step === 3) && (
                        <>
                            Remember your password?{' '}
                            <span 
                                onClick={() => navigate('/signin')} 
                                className="text-indigo-600 font-bold cursor-pointer hover:underline transition duration-200"
                            >
                                Sign In
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}

export default ForgotPassword