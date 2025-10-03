class CreateMessages < ActiveRecord::Migration[8.0]
  def change
    create_table :messages do |t|
      t.references :conversation, null: false, foreign_key: { to_table: :conversations }
      t.references :sender, null: false, foreign_key: { to_table: :users }
      t.text :content
      t.boolean :seen, default: false, null: false

      t.timestamps
    end

    add_index :messages, [ :conversation_id, :created_at ]
  end
end
