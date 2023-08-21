exports.up = (pgm) => {
  pgm.addColumns('comment_threads', {
    is_delete: {
      type: 'boolean',
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('comment_threads', 'is_delete');
};
