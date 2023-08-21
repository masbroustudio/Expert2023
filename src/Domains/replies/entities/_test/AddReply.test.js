const AddReply = require("../AddReply");

describe("a AddReply entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      commentId: "thread-123",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      commentId: "thread-123",
      content: "sebuah content",
      owner: 123,
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when payload did not contain owner property", () => {
    // Arrange
    const payload = {
      commentId: "thread-123",
      content: "sebuah content",
      owner: undefined,
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError(
      "ADD_REPLY.NOT_MEET_AUTHENTICATION_DATA"
    );
  });

  it("should create AddReply object correctly", () => {
    // Arrange
    const payload = {
      commentId: "thread-123",
      content: "sebuah content",
      owner: "yudhae",
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply).toBeInstanceOf(AddReply);

    expect(addReply.commentId).toEqual(payload.commentId);

    expect(addReply.content).toEqual(payload.content);

    expect(addReply.owner).toEqual(payload.owner);
  });
});
