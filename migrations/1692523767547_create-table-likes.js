/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
  pgm.addConstraint("likes", "fk_likes.comment_id.id", {
    foreignKeys: {
      columns: "comment_id",
      references: "comments(id)",
      onDelete: "CASCADE",
    },
  });
  pgm.addConstraint("likes", "fk_likes.owner.id", {
    foreignKeys: {
      columns: "owner",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("likes", "fk_likes.comment_id.id");
  pgm.dropConstraint("likes", "fk_likes.owner.id");
  pgm.dropTable("likes");
};
