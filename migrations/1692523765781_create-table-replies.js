/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("replies", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP WITH TIME ZONE",
      default: pgm.func("current_timestamp"),
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    comment_id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    is_delete: {
      type: "BOOLEAN",
      default: false,
    },
  });
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
  pgm.dropTable("replies");
};
