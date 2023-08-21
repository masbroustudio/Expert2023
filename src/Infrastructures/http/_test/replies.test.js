const createServer = require("../createServer");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");

let accessToken;
let anotherAccessToken;
let threadId;
let commentId;

describe("/threads/{threadId}/comments/{commentId}/replies endpoint", () => {
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

    //  ..Post Login Auth
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

    // ..Post New Reply
    const replyResponse = await server.inject({
      method: "POST",
      url: `/threads/${threadId}/comments/${commentId}/replies`,
      payload: { content: "sebuah reply" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const replyResponseJson = JSON.parse(replyResponse.payload);
    replyId = replyResponseJson.data.addedReply.id;
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 201 and persisted reply", async () => {
      // Arrange
      const requestPayload = {
        content: "sebuah Reply",
      };

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 401 when access token not provide", async () => {
      // Arrange
      const requestPayload = {
        content: "sebuah Reply",
      };

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 404 when thread not found", async () => {
      // Arrange
      const requestPayload = {
        content: "sebuah Reply",
      };

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/thread-123456/comments/${commentId}/replies`,
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

    it("should response 404 when comment not found", async () => {
      // Arrange
      const requestPayload = {
        content: "sebuah Reply",
      };

      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/comment-123456/replies`,
        payload: requestPayload,
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

  describe("when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    it("should response 200 when reply owned by credential owner", async () => {
      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
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
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("Missing authentication");
    });

    it("should response 403 when reply not owned by credential owner", async () => {
      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${anotherAccessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "Tidak dapat akses, anda bukan pemilik reply"
      );
    });

    it("should response 404 when reply not found", async () => {
      // Action
      const server = await createServer(container);
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-123456`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("reply tidak ditemukan");
    });
  });
});
