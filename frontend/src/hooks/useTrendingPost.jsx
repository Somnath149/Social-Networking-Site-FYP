import { useDispatch, useSelector } from "react-redux";
import { setAllTrending, setTagPosts, setTodayTrending } from "../redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";

export const useTrendingPost = (selectedTag) => {
    const dispatch = useDispatch();
    const { postData } = useSelector(state => state.post);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const today = await axios.get(
                    `${serverUrl}/api/post/trending/today`,
                    { withCredentials: true }
                );

                const all = await axios.get(
                    `${serverUrl}/api/post/trending/all`,
                    { withCredentials: true }
                );

                dispatch(setTodayTrending(today.data));
                dispatch(setAllTrending(all.data));
            } catch (error) {
                console.log("TRENDING ERROR:", error);
            }
        };

        fetchTrending();
    }, [postData]);


    useEffect(() => {
        if (!selectedTag) return;

        const fetchTagPosts = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/post/tag/${selectedTag}`,
                    { withCredentials: true }
                );

                dispatch(setTagPosts(result.data));
            } catch (err) {
                console.log("TAG POSTS ERROR:", err);
            }
        };

        fetchTagPosts();
    }, [selectedTag]);
};
