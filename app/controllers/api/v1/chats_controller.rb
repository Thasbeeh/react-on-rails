class Api::V1::ChatsController < ApplicationController
  def index
    @chats = Chat.all
  end

  def create
  end
end
