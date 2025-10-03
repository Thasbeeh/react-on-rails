class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user, only: :create

  def index
    @users = User.where.not(id: @current_user)
    render json: @users, status: :ok
  end

  def create
    user = User.new(user_params)
    if user.save
      render json: { message: "User created successfully", user: user }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
end
