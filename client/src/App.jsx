import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import RecordList from "./components/RecordList";
import Record from "./components/Record";
// import { AuthProvider } from '@/hooks/use-auth'
// import { ProtectedRoute } from '@/components/protected-route'
// import SignIn from '@/views/auth/sign-in'
// import SignUp from '@/views/auth/sign-up'
// import Home from '@/views/home'
// import AppView from '@/views/app'

const Nav = () => {
  return (
    <div className="w-full p-6">
      <Navbar />
      <Outlet />
    </div>
  );
};

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
      </Router>
  )
}

export default AppRoot
