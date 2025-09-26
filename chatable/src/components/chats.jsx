import axios from 'axios'
import { useState, useEffect, createContext } from 'react'
import ListUsers from './left_pane/list_users'
import MessageContainer from './message_container/message_container'
import './chats.css'

function Chats() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState('');
  const token = sessionStorage.getItem('token');
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then((response) => setUsers(response.data));
  }, [token]);
  
  useEffect(() => {
    if (selectedUser) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/v1/messages?user_id=${selectedUser.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(response => setMessages(response.data.user_messages))
    }
  }, [selectedUser, token]);
  
  return (
    <div className="main_container">
      <ListUsers users={users} onUserClick={setSelectedUser}/>
      <targetUserMessageContext.Provider value={{ messages , setMessages, selectedUser }}>
        <MessageContainer />  
      </targetUserMessageContext.Provider>
    </div>
  )
}

export const targetUserMessageContext = createContext(null);
export default Chats;