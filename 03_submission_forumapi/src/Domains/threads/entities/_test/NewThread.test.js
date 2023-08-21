const NewThread = require("../NewThread");

describe("a NewThread entities", () => {
  it("should create newThread object correctly", () => {
    // Arrange
    const payload = {
      title: "Title New Thread",
      body: "Thread Content Here",
    };

    // Action
    const { title, body } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });

  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "Title New Thread",
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });
});
