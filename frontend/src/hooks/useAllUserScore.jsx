// hooks/useAllUserScore.js
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setAllUsers } from "../redux/userSlice";

const useAllUserScore = () => {
 const {userData}= useSelector(state=>state.user)
  const dispatch = useDispatch();
  const users = useSelector(state => state.user.allUsers); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeeklyUsers = async () => {
    
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${serverUrl}/api/user/weekly-active-users`,
        { withCredentials: true }
      );
      dispatch(setAllUsers(data)); 
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     if (!userData) return;

    fetchWeeklyUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchWeeklyUsers
  };
};

export default useAllUserScore;
