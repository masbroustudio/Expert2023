/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint("threads", "fk_threads.owner.id", {
    foreignKeys: {
      columns: "owner",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("threads", "fk_threads.owner.id");
};
