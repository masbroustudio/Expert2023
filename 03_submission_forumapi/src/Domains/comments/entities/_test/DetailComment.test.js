const DetailComment = require("../DetailComment");

describe("a DetailComment entities", () => {
  it("should throw error when payload did not contain needed property", async () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: "2021-08-08T07:19:09.775Z",
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type spesification", async () => {
    // Arrange
    const payload = {
      id: "comment-123",
      username: 123,
      date: "2021-08-08T07:19:09.775Z",
      content: "sebuah comment",
      is_delete: "0",
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION"
    );
  });

  it("should create detailComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "ini adalah comment-123 johndoe",
      username: "johndoe",
      date: "2021-08-08T07:22:33.555Z",
      is_delete: "0",
    };

    // Action
    const { id, username, date, content } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it("should create detailComment object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-234",
      content: "ini adalah comment-234 dicoding",
      username: "dicoding",
      date: "2021-08-08T07:26:21.338Z",
      is_delete: "1",
    };

    // Action
    const { id, username, date, content } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual("**komentar telah dihapus**");
  });
});
