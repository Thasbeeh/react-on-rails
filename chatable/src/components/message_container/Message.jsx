import { useEffect } from "react";
import './message_container.css';
import { useInView } from "react-intersection-observer";

export default function Message({ message, currentUser, onSeen }) {
  const currentUserId = parseInt(currentUser.id, 10);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  console.log(message.sender_id);


  useEffect(() => {
    if (inView && !message.seen && message.sender_id !== currentUserId) {
      onSeen(message.id);
    }
  }, [inView, message.seen, message.id, onSeen, message.sender_id, currentUserId]);

  return (
    <div
      ref={ref}
      className={`message ${message.sender_id === currentUserId ? "right" : "left"}`}
    >
      {message.content}
      {message.seen && message.sender_id === currentUserId && (
        <span className="read-receipt-tick">✓</span>
      )}
    </div>
  );
}
