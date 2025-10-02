import { useState, useContext } from 'react'
import axios from 'axios'
import './message_container.css';
import { targetUserMessageContext } from '../chats'

export default function MessageInput() {
  const [message, setMessage] = useState('');
  const token = sessionStorage.getItem('token');
	const { selectedUser } = useContext(targetUserMessageContext);
	
  const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			axios.post(`${import.meta.env.VITE_API_URL}/api/v1/messages`,
				{ receiver_id: selectedUser.id, content: message },
				{ headers: { Authorization: `Bearer ${token}` } }
			).then((response) => { console.log('Message sent', response.data) }
			).catch((error) => { console.error('Error sending message', error) });
			setMessage('');
		}
	}

  return (
    <div className="message_input_pane">
			<div>
				<input
					type="text"
					className="message_input_field"
					value={message}
					placeholder="Type a message"
					onInput={e => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
			</div>
    </div>
  );
}
