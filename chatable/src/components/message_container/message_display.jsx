import { useRef, useEffect, useContext } from 'react';
import './message_container.css';
import consumer from '../../cable';
import { targetUserMessageContext } from '../chats'

export default function MessageDisplay() {
	const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
	const messagesEndRef = useRef(null);
	const { messages, setMessages } = useContext(targetUserMessageContext);
	const hasMessages = messages.length > 0;

	useEffect(() => {
		autoScrolltoLastMessage(messagesEndRef)
	}, [messages]);

	useEffect(() => {
		userSubscription(currentUser, setMessages)
	}, []);

	return (
		<div className={`msg_display ${!hasMessages ? 'no-messages' : ''}`}>
			{hasMessages ? (
				<>
					{messages?.map((message) => (
						<div
							key={message.id}
							className={`message ${message.sender_id === parseInt(currentUser.id, 10) ? 'right' : 'left'}`}
						>
							{message.content}
						</div>
					))}
					<div ref={messagesEndRef} />
				</>
			) : (
				<div>No messages yet</div>
			)}
		</div>
	);
}

function userSubscription(currentUser, setMessages){
	if (!currentUser) return;
	const subscription = consumer.subscriptions.create(
		{ channel: 'ChatChannel', user_id: currentUser.id },
		{
			received(data){ setMessages(prev => [...prev, data.message]) },
			connected(){ console.log("Connection succesfully established") },
			disconnected(){ console.log("Disconnected") }
		}
	);
	return () => { subscription.unsubscribe() };
}

function autoScrolltoLastMessage(messagesEndRef){
	messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}