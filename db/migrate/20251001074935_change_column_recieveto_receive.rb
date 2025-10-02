class ChangeColumnRecievetoReceive < ActiveRecord::Migration[8.0]
  def change
    rename_column :messages, :reciever_id, :receiver_id
  end
end
