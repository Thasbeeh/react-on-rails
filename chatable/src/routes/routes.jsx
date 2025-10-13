import { Routes, Route } from 'react-router-dom'
import Login from '../components/login'
import Chats from '../components/chats'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chats" element={<Chats />} />
    </Routes>
  );
}

export default AppRoutes;