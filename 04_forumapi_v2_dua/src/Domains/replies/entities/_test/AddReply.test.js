const AddReply = require('../AddReply');

describe('AddReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      body: 'test reply',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      content: 12333,
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddReply entities correctly', () => {
    const payload = {
      content: 'test reply',
    };

    const addReply = new AddReply(payload);

    expect(addReply).toBeInstanceOf(AddReply);
    expect(addReply.content).toEqual(payload.content);
  });
});
