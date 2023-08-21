const AddedComment = require('../AddedComment');

describe('a AddedComment', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'test comment',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'test comment',
      owner: 'test user',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment entities correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'test comment',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
