const AddedReply = require('../AddedReply');

describe('a AddedReply', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      body: 'test reply',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 12333,
      content: 'test reply',
      owner: 'user-123',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply entities correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'test reply',
      owner: 'user-123',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply).toBeInstanceOf(AddedReply);
    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });
});
