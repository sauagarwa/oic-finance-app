import { useContext, createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("auth");

  const loginAuth = async (data) => {
    try {
      console.log("calling authentication api");
      const res = await axios.get("/api/authenticate", {
        auth: data,
      });
      if (res.data.screen !== undefined) {
        readCookie();
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const readCookie = async () => {
    try {
      console.log("calling read cookie api")
      const res = await axios.get("/api/read-cookie");
      if (res.data.screen !== undefined) {
        setScreen(res.data.screen);
        navigate("/view");
        return;
      }
    } catch (e) {
      setScreen("auth");
      console.log(e);
    }
  };

  const logoutAuth = async () => {
    try {
      console.log("calling clear cookie api")
      await axios.get("/api/clear-cookie");
      setScreen("auth");
      navigate("/login");
      return;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ screen, loginAuth, logoutAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
export const useAuth = () => {
  return useContext(AuthContext);
};