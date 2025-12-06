import axios from "axios";

export const logout = async () => {
  await axios.post("http://localhost:9090/api/auth/logout", {}, { withCredentials: true });
};
