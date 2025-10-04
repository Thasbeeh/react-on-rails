import { useRef, useEffect, useContext, useCallback } from 'react';
import './message_container.css';
import consumer from '../../cable';
import { targetUserMessageContext } from '../chats';
import Message from './Message';

function useMessageSubscription(setMessages, subscriptionRef, conversationIdRef) {
  useEffect(() => {
    const conversationId = conversationIdRef?.current || conversationIdRef;
    if (!conversationId) return;

    const subscription = consumer.subscriptions.create(
      { channel: 'ChatChannel', conversation_id: conversationId },
      { received(data) {
          if (!data?.message) return;
          setMessages(prevMessages => {
            const messageExists = prevMessages.some(msg => msg.id === data.message.id);
            if (messageExists) {
              return prevMessages.map(msg => msg.id === data.message.id ? { ...msg, ...data.message } : msg);
            }
            return [...prevMessages, data.message];
          });
        },
        connected() { console.log('[ChatChannel] Connected successfully'); },
        disconnected() { console.log('[ChatChannel] Disconnected'); }
      }
    );
    subscriptionRef.current = subscription;
    return () => { subscription?.unsubscribe(); };
  }, [setMessages, subscriptionRef, conversationIdRef?.current]);
}

function useAutoScroll(messages, messagesEndRef) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, messagesEndRef]);
}

export default function MessageDisplay() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);
  const { messages, setMessages, selectedUser, conversationIdRef } = useContext(targetUserMessageContext);
  const hasMessages = messages?.length > 0;

  const handleSeen = useCallback((messageId) => {
    if (!messageId || !subscriptionRef.current) return;
    subscriptionRef.current.perform('message_seen', { messageId });
  }, []);

  useMessageSubscription(setMessages, subscriptionRef, conversationIdRef);
  useAutoScroll(messages, messagesEndRef);

  return (
		<div className={`msg_display ${!hasMessages ? 'no-messages' : ''}`}>
			{!selectedUser ? (
				<div className="empty-state" role="status">
					No user selected 👈
				</div>
			) : hasMessages ? (
				<>
					{messages.map((message) => (
						<Message
							key={message.id}
							message={message}
							currentUser={currentUser}
							onSeen={handleSeen}
						/>
					))}
					<div ref={messagesEndRef} aria-hidden="true" />
				</>
			) : (
				<div className="empty-state" role="status">
					No messages yet. Say Hi 👋...
				</div>
			)}
		</div>
	);
}
