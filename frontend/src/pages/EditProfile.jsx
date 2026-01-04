import React, { useRef, useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dp1 from "../assets/dp1.jpeg"
import { serverUrl } from '../App'
import { setProfileData, setUserData } from '../redux/userSlice'
import axios from 'axios'
import Cropper from "react-easy-crop";
import { getCroppedImg } from '../../public/getCroppedImg'

function EditProfile() {
    const [loading, setLoading] = useState(false)
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const imageInput = useRef()
    const [frontendImage, setfrontendImage] = useState(userData.profileImage || dp1)
    const [backendImage, setbackendImage] = useState(null)
    const [name, setName] = useState(userData.name || "")
    const [userName, setuserName] = useState(userData.userName || "")
    const [bio, setBio] = useState(userData.bio || "")
    const [profession, setProfession] = useState(userData.profession || "")
    const [showCropper, setShowCropper] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedPixels, setCroppedPixels] = useState(null);
    const [tempImage, setTempImage] = useState(null);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageURL = URL.createObjectURL(file);
        setTempImage(imageURL);
        setShowCropper(true); // 🔥 open cropper
    };

    const onCropComplete = (_, croppedAreaPixels) => {
        setCroppedPixels(croppedAreaPixels);
    };

    const saveCroppedImage = async () => {
        const croppedBlob = await getCroppedImg(tempImage, croppedPixels);

        setbackendImage(croppedBlob); // 🔥 server
        setfrontendImage(URL.createObjectURL(croppedBlob)); // 🔥 preview
        setShowCropper(false);
    };


    const handleEditProfile = async () => {
        setLoading(true)
        try {
            const formdata = new FormData()
            formdata.append("name", name)
            formdata.append("userName", userName)
            formdata.append("bio", bio)
            formdata.append("profession", profession)
            if (backendImage) {
                formdata.append("profileImage", backendImage)
            }
            const result = await axios.post(`${serverUrl}/api/user/editProfile`, formdata, {
                withCredentials: true, headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            dispatch(setProfileData(result.data))
            dispatch(setUserData(result.data))
            navigate(`/profile/${userData.userName}`)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full min-h-[100vh]  bg-[var(--bg)] flex items-center flex-col gap-[20px]'>
            <div className='w-full h-[80px] flex fixed left-[20px] items-center gap-[20px] px-[20px]'>
                <MdOutlineKeyboardBackspace onClick={() => navigate(`/profile/${userData.userName}`)}
                    className='text-[var(--text)] cursor-pointer w-[25px] h-[25px]' />
                <h1 className='text-[var(--text)] text-[20px] font-semibold'>Edit Profile</h1>
            </div>

            <div onClick={() => imageInput.current.click()} className='w-[80px] h-[80px] mt-20 md:w-[140px] md:h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImage} />
                <img src={frontendImage} alt="" className='w-full object-cover' />
            </div>

            <div onClick={() => imageInput.current.click()} className='text-blue-500 text-center text-[18px] font-semibold'>Change your profile picture</div>
            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2
             border-gray-700 rounded-2xl text-white font-semibold px-[20px] outline-none' onChange={(e) => setName(e.target.value)}
                value={name} placeholder='Enter Your Name' />

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2
             border-gray-700 rounded-2xl text-white font-semibold px-[20px] outline-none' onChange={(e) => setuserName(e.target.value)}
                value={userName} placeholder='Enter Your userName' />

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2
             border-gray-700 rounded-2xl text-white font-semibold px-[20px] outline-none' onChange={(e) => setBio(e.target.value)}
                value={bio} placeholder='Enter Your Bio' />

            <input type="text" className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2
             border-gray-700 rounded-2xl text-white font-semibold px-[20px] outline-none' onChange={(e) => setProfession(e.target.value)}
                value={profession} placeholder='Enter Your Profession' />


            <div className="px-[10px]  min-w-[150px] py-[5px] h-940px] bg-[white]  cursor-pointer rounded-2xl">
                <button
                    type="button"
                    disabled={loading}
                    className={`w-full font-semibold py-3 rounded-md flex justify-center items-center gap-2 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                    onClick={handleEditProfile}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving Changes...</span>
                        </div>
                    ) : (
                        'Save Profile'
                    )}
                </button>

            </div>
            {showCropper && (
                <div className="fixed inset-0 bg-black z-50 flex flex-col">
                    <div className="flex-1 relative">
                        <Cropper
                            image={tempImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"     // 🔥 CIRCULAR
                            showGrid={false}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(e.target.value)}
                        className="mx-5 my-3"
                    />

                    <button
                        onClick={saveCroppedImage}
                        className="m-4 py-3 rounded-xl bg-white font-semibold"
                    >
                        Done
                    </button>
                </div>
            )}

        </div>
    )
}

export default EditProfile
