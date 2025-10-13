class Conversation < ApplicationRecord
  has_many :messages, dependent: :destroy

  validates :user1_id, presence: true
  validates :user2_id, presence: true
  validates :user1_id, uniqueness: { scope: :user2_id, message: "conversation already exists with this user" }
  validate :user1_id_less_than_user2_id

  private

  def user1_id_less_than_user2_id
    if user1_id.present? && user2_id.present? && user1_id >= user2_id
      errors.add(:user1_id, "must be less than user2_id")
    end
  end
end
