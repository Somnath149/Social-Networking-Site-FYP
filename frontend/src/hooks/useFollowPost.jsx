import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setFollowThreads } from "../redux/threadSlice";

function useFollowPost() {
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.user);

   useEffect(() => {
    if (!userData?._id) return;

    const fetchThreads = async () => {
        try {
            const res = await axios.get(
                `${serverUrl}/api/thread/getFollowingThreadsActivity`,
                { withCredentials: true }
            );
            
            dispatch(setFollowThreads(res.data));
        } catch (err) {
            console.log(err);
        }
    };

    fetchThreads(); // initial
    // // const interval = setInterval(fetchThreads, 10000); // every 10 sec

    // return () => clearInterval(interval);
}, [userData?._id, dispatch]);

}

export default useFollowPost;
