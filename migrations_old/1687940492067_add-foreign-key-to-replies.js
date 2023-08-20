/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint("replies", "fk_replies.comment_id.id", {
    foreignKeys: {
      columns: "comment_id",
      references: "comments(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("replies", "fk_replies.comment_id.id");
};
