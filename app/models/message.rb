class Message < ApplicationRecord
  scope :between_users, ->(user1_id, user2_id) {
    where("(sender_id = :u1 AND receiver_id = :u2) OR (sender_id = :u2 AND receiver_id = :u1)",
          u1: user1_id, u2: user2_id)
    .order(:send_at)
  }
end
