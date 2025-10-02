class Api::V1::MessagesController < ApplicationController
  def index
    user_messages = Message.between_users(@current_user, params[:user_id])
    render json: { user_messages: user_messages }
  end

  def create
    message = Message.new(
      sender_id: @current_user.id,
      receiver_id: params[:receiver_id],
      content: params[:content],
      send_at: Time.current
    )
    if message.save
      receiver = User.find(message.receiver_id)
      ChatChannel.broadcast_to(@current_user, message: message.as_json)
      ChatChannel.broadcast_to(receiver, message: message.as_json)
      render json: { status: "Message sent successfully" }, status: :ok
    else
      render json: { error: "Failed to send message" }, status: :unprocessable_entity
    end
  end
end
