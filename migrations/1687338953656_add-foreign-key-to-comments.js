/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint('comments', 'fk_comments.thread_id.id', {
    foreignKeys: {
      columns: 'thread_id',
      references: 'threads(id)',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.thread_id.id');
};
