import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAllUsers } from "../redux/userSlice";
import { serverUrl } from "../App";


const useGetAllUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Aapka API endpoint: /api/admin/users
                const res = await axios.get(
                    `${serverUrl}/api/admin/users`, 
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setAllUsers(res.data.users));
                }
            } catch (error) {
                console.log("Error fetching admin users:", error);
            }
        };

        fetchUsers();
    }, [dispatch]);
};

export default useGetAllUsers;