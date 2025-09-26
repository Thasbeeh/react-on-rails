class Api::V1::MessagesController < ApplicationController
  def index
    user_messages = Message.between_users(@current_user, params[:user_id])
    render json: { user_messages: user_messages.as_json }
  end

  def create
    message = Message.new(
      sender_id: @current_user.id,
      reciever_id: params[:reciever_id],
      content: params[:content],
      send_at: Time.current,
      status: false
    )
    if message.save
      reciever = User.find(message.reciever_id)
      ChatChannel.broadcast_to(@current_user, message: message.as_json)
      ChatChannel.broadcast_to(reciever, message: message.as_json)
      render json: { status: "Message sent successfully" }, status: :ok
    else
      render json: { error: "Failed to send message" }, status: :unprocessable_entity
    end
  end
end
