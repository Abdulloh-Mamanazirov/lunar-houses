import { Route, Routes } from "react-router-dom"
import Company from "./Pages/Company"
import Complex from "./Pages/Complex"
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Room from "./Pages/Room"
import UserLogin from "./Pages/UserLogin"
import Users from "./Pages/Users"

function App() {
  return (
    <div className="bg-gradient-to-br from-gray-400 to-white min-h-screen">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/log-in-user" element={<UserLogin/>}/>
        <Route path="/log-in-admin" element={<Login/>}/>
        <Route path="/company" element={<Company/>}/>
        <Route path="/complex" element={<Complex/>}/>
        <Route path="/room" element={<Room/>}/>
        <Route path="/users" element={<Users/>}/>
      </Routes>
    </div>
  )
}

export default App
