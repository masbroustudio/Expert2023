const DetailThread = require("../DetailThread");

describe("a DetailThread entities", () => {
  it("should create detailThread object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Title Thread",
      body: "Body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        {
          id: "comment-detail-123",
          content: "sebuah comment comment-detail-123 johndoe",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
        },
      ],
    };

    // Action
    const { id, title, body, date, username, comments } = new DetailThread(
      payload,
    );

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
    expect(Array.isArray(comments)).toEqual(true);
  });

  it("should throw error when payload did not contain needed property", async () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Title Thread",
      body: "Body thread",
      date: "2021-08-08T07:19:09.775Z",
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type spesification", async () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "Title Thread",
      body: "Body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: {},
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPESIFICATION",
    );
  });

  
});
