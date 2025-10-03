class Api::V1::MessagesController < ApplicationController
  def index
    conversation = Conversation.between_users(@current_user.id, params[:user_id].to_i).first
    render json: {
      conversation_id: conversation&.id,
      conversation_messages: conversation&.messages&.order(:created_at) || []
    }
  end

  def create
    user1_id, user2_id = [ @current_user.id, params[:receiver_id].to_i ].sort
    conversation = Conversation.find_or_create_by!(user1_id: user1_id, user2_id: user2_id)

    message = conversation.messages.new(
      sender_id: @current_user.id,
      content: params[:content],
    )
    if message.save
      ChatChannel.broadcast_to("conversation_#{conversation.id}", message: message.as_json)
      render json: { status: "Message sent successfully" }, status: :ok
    else
      render json: { error: "Failed to send message" }, status: :unprocessable_entity
    end
  end
end
