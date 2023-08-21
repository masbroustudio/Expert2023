exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comment_threads(id)',
      onDelete: 'CASCADE',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    is_delete: {
      type: 'BOOLEAN',
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
