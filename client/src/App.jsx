import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import RecordList from "./components/RecordList";
import Record from "./components/Record";
<<<<<<< HEAD
// import { AuthProvider } from '@/hooks/use-auth'
// import { ProtectedRoute } from '@/components/protected-route'
// import SignIn from '@/views/auth/sign-in'
// import SignUp from '@/views/auth/sign-up'
// import Home from '@/views/home'
// import AppView from '@/views/app'
=======
import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthProvider from "./AuthProvider.jsx";
import { useAuth } from "./AuthProvider";

>>>>>>> f301fda (Added the capability to run client and server in a single service)

const Nav = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      <Outlet />
    </div>
  );
};

<<<<<<< HEAD
function AppRoot() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Nav />} >
            <Route path ="/" element={<RecordList />} ></Route>
          </Route>
          <Route path="/" element={<Nav />} >
            <Route path ="/edit/:id" element={<Record />} ></Route>
          </Route>
          <Route path="/" element={<Nav />} >
            <Route path ="/create" element={<Record />} ></Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
=======
const ProtectedRoute = () => {
  //const auth = useAuth();
  let user = JSON.parse(localStorage.getItem('user'));
  console.log(" logged in user is " + user);
  if (user === undefined) return <Navigate to="/login" />;
  return <Outlet />;
};

// export default ProtectedRoute;


function AppRoot() {
  return (
      <Router>
         <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Nav />} >
                  <Route path ="/" element={<RecordList />} ></Route>
                </Route>
                <Route path="/" element={<Nav />} >
                  <Route path ="/edit/:id" element={<Record />} ></Route>
                </Route>
                <Route path="/" element={<Nav />} >
                  <Route path ="/create" element={<Record />} ></Route>
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
>>>>>>> f301fda (Added the capability to run client and server in a single service)
      </Router>
  )
}

export default AppRoot
