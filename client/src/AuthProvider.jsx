import { useContext, createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("auth");
<<<<<<< HEAD
=======
  const [user, setUser] = useState();
>>>>>>> f301fda (Added the capability to run client and server in a single service)

  const loginAuth = async (data) => {
    try {
      console.log("calling authentication api");
<<<<<<< HEAD
      const res = await axios.get("/api/authenticate", {
        auth: data,
      });
      if (res.data.screen !== undefined) {
        readCookie();
        return;
=======
      const res = await axios.post("/api/auth/signin", {
        auth: data,
      });
      if (res.data.username !== undefined) {
        const loggedInUser = await getUser();
        if (loggedInUser !== undefined)
            return navigate("/");
>>>>>>> f301fda (Added the capability to run client and server in a single service)
      }
    } catch (e) {
      console.log(e);
    }
  };

<<<<<<< HEAD
  const readCookie = async () => {
    try {
      console.log("calling read cookie api")
      const res = await axios.get("/api/read-cookie");
      if (res.data.screen !== undefined) {
        setScreen(res.data.screen);
        navigate("/view");
        return;
=======
  const getUser = async () => {
    try {
      console.log("calling read cookie api")
      const res = await axios.get("/api/auth/me");
      if (res.data.username !== undefined) {
        setScreen(res.data.role);
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
>>>>>>> f301fda (Added the capability to run client and server in a single service)
      }
    } catch (e) {
      setScreen("auth");
      console.log(e);
    }
  };

  const logoutAuth = async () => {
    try {
      console.log("calling clear cookie api")
<<<<<<< HEAD
      await axios.get("/api/clear-cookie");
      setScreen("auth");
      navigate("/login");
      return;
    } catch (e) {
=======
      await axios.post("/api/auth/signout");
      localStorage.removeItem('user');
      setScreen("auth");
      setUser(null);
      navigate("/login");
      return;
    } catch (e) {
      localStorage.removeItem('user');
>>>>>>> f301fda (Added the capability to run client and server in a single service)
      console.log(e);
    }
  };

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{ screen, loginAuth, logoutAuth }}>
=======
    <AuthContext.Provider value={{ screen, user, loginAuth, logoutAuth, getUser }}>
>>>>>>> f301fda (Added the capability to run client and server in a single service)
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
export const useAuth = () => {
  return useContext(AuthContext);
};