import { useRef, useEffect, useContext, useCallback } from 'react';
import './message_container.css';
import consumer from '../../cable';
import { targetUserMessageContext } from '../chats';
import Message from './Message';

// Creates and manages ActionCable subscription for real-time chat messages
function useMessageSubscription(currentUser, setMessages, subscriptionRef) {
  useEffect(() => {
    if (!currentUser?.id) return;

    const subscription = consumer.subscriptions.create(
      { channel: 'ChatChannel', user_id: currentUser.id },
      {
        received(data) {
          if (!data?.message) return;

          setMessages(prevMessages => {
            const messageExists = prevMessages.some(msg => msg.id === data.message.id);
            
            if (messageExists) {
              // Update existing message (e.g., seen status)
              return prevMessages.map(msg =>
                msg.id === data.message.id 
                  ? { ...msg, ...data.message }
                  : msg
              );
            }
            
            // Add new message
            return [...prevMessages, data.message];
          });
        },
        
        connected() {
          console.log('[ChatChannel] Connected successfully');
        },
        
        disconnected() {
          console.log('[ChatChannel] Disconnected');
        }
      }
    );

    subscriptionRef.current = subscription;

    // Cleanup function
    return () => {
      subscription?.unsubscribe();
      console.log('[ChatChannel] Unsubscribed');
    };
  }, [currentUser?.id, setMessages, subscriptionRef]);
}

// Auto-scrolls to the bottom of messages when new messages arrive
function useAutoScroll(messages, messagesEndRef) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }, [messages, messagesEndRef]);
}

export default function MessageDisplay() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  const { messages, setMessages } = useContext(targetUserMessageContext);

  const hasMessages = messages?.length > 0;

  // Memoized handler to prevent unnecessary re-renders
  const handleSeen = useCallback((messageId) => {
    if (!messageId || !subscriptionRef.current) return;

    subscriptionRef.current.perform('message_seen', { messageId });
  }, []);

  // Custom hooks for cleaner component logic
  useMessageSubscription(currentUser, setMessages, subscriptionRef);
  useAutoScroll(messages, messagesEndRef);

  return (
    <div className={`msg_display ${!hasMessages ? 'no-messages' : ''}`}>
      {hasMessages ? (
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
          No messages yet
        </div>
      )}
    </div>
  );
}
