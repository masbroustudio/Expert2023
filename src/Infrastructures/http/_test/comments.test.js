const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

let accessToken;
let anotherAccessToken;
let threadId;
let commentId;

describe("/threads/{threadId}/comments endpoint", () => {
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

    // ..Post New Thread
    const threadResponse = await server.inject({
      method: "POST",
      url: "/threads",
      payload: {
        title: "sebuah thread",
        body: "sebuah thread body",
      },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const threadResponseJson = JSON.parse(threadResponse.payload);
    threadId = threadResponseJson.data.addedThread.id;

    // ..Post New Comment
    const commentResponse = await server.inject({
      method: "POST",
      url: `/threads/${threadId}/comments`,
      payload: { content: "sebuah comment" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const commentResponseJson = JSON.parse(commentResponse.payload);
    commentId = commentResponseJson.data.addedComment.id;
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and persisted comment", async () => {
      // Arrange
      const requestPayload = {
        content: "sebuah comment",
      };

      // Action
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it("should response 401 when access token not exist", async () => {
      // Arrange
      const requestPayload = {
        content: "sebuah comment",
      };

      // Action
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Action
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 404 when thread not found", async () => {
      // Arrange
      const requestPayload = {
        content: "sebuah comment",
      };

      // Action
      const server = await createServer(container);

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: requestPayload,
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
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 200 and delete comment", async () => {
      // Action
      const server = await createServer(container);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 401 when access token not found", async () => {
      // Action
      const server = await createServer(container);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 403 when user not the owner of comment", async () => {
      // Action
      const server = await createServer(container);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${anotherAccessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "Tidak dapat akses, anda bukan pemilik comment"
      );
    });

    it("should response 404 when comment not found", async () => {
      // Action
      const server = await createServer(container);

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/comment-123456`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "comment tidak valid atau tidak ditemukan"
      );
    });
  });
});
