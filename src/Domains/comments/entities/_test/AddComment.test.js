const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload))
        .toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });


  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'hello mars',
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddComment(payload))
        .toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain owner property', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'hello mars',
      owner: undefined,
    };

    // Action and Assert
    expect(() => new AddComment(payload))
        .toThrowError('ADD_COMMENT.NOT_MEET_AUTHENTICATION_DATA');
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'hello from mars',
      owner: 'user-mars123',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment).toBeInstanceOf(AddComment);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.owner).toEqual(payload.owner);
  });
});
