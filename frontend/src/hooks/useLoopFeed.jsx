import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
    setFeedInitial,
    addFeedData
} from "../redux/loopSlice";
import { serverUrl } from "../App";

export default function useLoopFeed() {
    const dispatch = useDispatch();
    const { feedPage, feedSeed, hasMore } = useSelector(state => state.loop);

    const loadInitialFeed = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/loop/feed?page=1`, {
                withCredentials: true,
            });

            dispatch(setFeedInitial({
                loops: res.data.loops,
                seed: res.data.seed
            }));
        } catch (e) {
            console.log(e);
        }
    };

    const loadMoreFeed = async () => {
        if (!hasMore) return;

        try {
            const res = await axios.get(
                `${serverUrl}/api/loop/feed?page=${feedPage + 1}&seed=${feedSeed}`,
                { withCredentials: true }
            );

            dispatch(addFeedData({ loops: res.data.loops }));
        } catch (e) {
            console.log(e);
        }
    };

    return { loadInitialFeed, loadMoreFeed };
}
