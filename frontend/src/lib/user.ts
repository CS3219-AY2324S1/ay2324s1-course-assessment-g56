import axios from "axios";

const apiUrl = `${process.env.USER_PATH}/user`;
export const getUsername = async (username: string) => {
    try {
        const response = await axios.get(`${apiUrl}/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}