class Api::V1::AuthenticationController < ApplicationController
  skip_before_action :authenticate_user

  # POST /auth/login
  def login
    @user = User.find_by(email: params[:user][:email])
    if @user&.authenticate(params[:user][:password])
      token = jwt_encode(user_id: @user.id)
      time = Time.now + 24.hours.to_i
      render json: { token: token, exp: time.strftime("%m-%d-%Y %H:%M"),
                     user: @user.slice(:id, :username, :email) }, status: :ok
    else
      render json: { error: "Login failed. Please check your credentials." }, status: :unauthorized
    end
  end
end
