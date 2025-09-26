import './message_container.css';
import MessageDisplay from './message_display'
import MessageInput from './message_input'

function MessageContainer() {
	return (
		<div className="message_container">
			<MessageDisplay />	
			<MessageInput /> 
		</div>
	)
}

export default MessageContainer;