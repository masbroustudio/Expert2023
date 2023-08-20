/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("comments", {
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
      notNull: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    is_delete: {
      type: "BOOLEAN",
      default: false,
    },
  });
  pgm.addConstraint("comments", "fk_comments.thread_id.id", {
    foreignKeys: {
      columns: "thread_id",
      references: "threads(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("comments", "fk_comments.thread_id.id");
  pgm.dropTable("comments");
};
