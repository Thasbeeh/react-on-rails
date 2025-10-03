class ChatChannel < ApplicationCable::Channel
  def subscribed
    conversation = Conversation.find(params[:conversation_id])
    stream_from "chat:conversation_#{conversation.id}"
  end

  def receive(data)
  end

  def message_seen(data)
    message = Message.find(data["messageId"])
    return unless message

    message.update(seen: true)
    broadcast_to("conversation_#{message.conversation_id}", message: { id: message.id, seen: message.seen })
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
