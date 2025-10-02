class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_for User.find(params[:user_id])
  end

  def receive(data)
    binding.pry
  end

  def message_seen(data)
    message = Message.find(data["messageId"])
    return unless message

    message.update(seen: true)
    sender = User.find(message.sender_id)
    broadcast_to(sender, message: { id: message.id, seen: message.seen })
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
