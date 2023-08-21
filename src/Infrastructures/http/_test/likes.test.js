const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

let accessToken;
let anotherAccessToken;
let threadId;
let commentId;
let anotherCommentId;

describe("/threads/{threadId}/comments/{commentId}/likes endpoint", () => {
  beforeEach(async () => {
    const server = await createServer(container);

    // ..Post New User
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      },
    });

    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "yudhae",
        password: "secret",
        fullname: "Yudha E",
      },
    });

    // ..Post Login
    const loginResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: "dicoding",
        password: "secret",
      },
    });

    const setNewLoginResponse = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: "yudhae",
        password: "secret",
      },
    });

    const loginResponseJson = JSON.parse(loginResponse.payload);
    accessToken = loginResponseJson.data.accessToken;

    const setNewLoginResponseJson = JSON.parse(setNewLoginResponse.payload);
    anotherAccessToken = setNewLoginResponseJson.data.accessToken;

    // ..Post New thread
    const createThreadResponse = await server.inject({
      method: "POST",
      url: "/threads",
      payload: {
        title: "sebuah thread",
        body: "sebuah body thread",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const createThreadResponseJson = JSON.parse(createThreadResponse.payload);
    threadId = createThreadResponseJson.data.addedThread.id;

    // ..Post New Comment
    const createCommentResponse = await server.inject({
      method: "POST",
      url: `/threads/${threadId}/comments`,
      payload: {
        content: "sebuah comment",
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const anotherCreateCommentResponse = await server.inject({
      method: "POST",
      url: `/threads/${threadId}/comments`,
      payload: {
        content: "sebuah comment",
      },
      headers: {
        Authorization: `Bearer ${anotherAccessToken}`,
      },
    });

    const createCommentResponseJson = JSON.parse(createCommentResponse.payload);
    commentId = createCommentResponseJson.data.addedComment.id;

    const anotherCreateCommentResponseJson = JSON.parse(
      anotherCreateCommentResponse.payload
    );
    anotherCommentId = anotherCreateCommentResponseJson.data.addedComment.id;
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should respone 200 when another user like comment", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${anotherAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should respone 200 when user like his own comment", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${anotherCommentId}/likes`,
        headers: {
          Authorization: `Bearer ${anotherAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should respone 200 when user like comment", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should respone 200 when user like his own comment", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("get thread should response 200 when user like comment", async () => {
      // Arrange
      const server = await createServer(container);

      // Add like
      await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread.comments[0].likeCount).toEqual(1);
    });

    it("get thread should response 200 after user unlike comment", async () => {
      // Arrange
      const server = await createServer(container);

      // ..Put Likes
      await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // ..Put Unlike
      await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread.comments[0].likeCount).toEqual(0);
    });

    it("should response 401 when no credentials were included within headers", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 404 when threadId not valid", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/invalid-thread/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });

    it("should response 404 when commentId not valid", async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/invalid-comment/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "comment tidak valid atau tidak ditemukan"
      );
    });
  });
});
