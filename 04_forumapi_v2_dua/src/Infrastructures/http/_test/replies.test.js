const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/thread/{id}/comments/{id}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{id}/comments/{id}/replies', () => {
    it('should response 401 and persisted comment without authentication', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-replies-endpoint',
        id: 'user-replies-endpoint',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-replies-endpoint',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-replies-endpoint',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-replies-endpoint',
        content: 'comment content',
        userId: 'user-replies-endpoint',
        threadId: 'thread-replies-endpoint',
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/replies',
        payload: {
          content: 'reply content',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const user = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/replies',
        payload: {
          content: 'reply content',
        },
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(404);
      await expect(responseJson.status).toEqual('fail');
      await expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 if comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-replies-endpoint',
        id: 'user-replies-endpoint',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-replies-endpoint',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-replies-endpoint',
      });
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const user = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/replies',
        payload: {
          content: 'reply content',
        },
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(404);
      await expect(responseJson.status).toEqual('fail');
      await expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 201 and persisted comment with authentication', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-replies-endpoint',
        id: 'user-replies-endpoint',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-replies-endpoint',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-replies-endpoint',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-replies-endpoint',
        content: 'comment content',
        userId: 'user-replies-endpoint',
        threadId: 'thread-replies-endpoint',
      });
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const user = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/replies',
        payload: {
          content: 'reply content',
        },
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(201);
      await expect(responseJson.status).toEqual('success');
      await expect(responseJson.data).toHaveProperty('addedReply');
      await expect(responseJson.data.addedReply).toHaveProperty('id');
      await expect(responseJson.data.addedReply).toHaveProperty('content');
      await expect(responseJson.data.addedReply).toHaveProperty('owner');
    });
  });

  describe('when DELETE /threads/:threadId/comments/:commentId/replies/:replyId', () => {
    it('should response 401 if not authenticated', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-replies-endpoint',
        id: 'user-replies-endpoint',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-replies-endpoint',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-replies-endpoint',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-replies-endpoint',
        content: 'comment content',
        userId: 'user-replies-endpoint',
        threadId: 'thread-replies-endpoint',
      });
      await ReplyTableTestHelper.addReply({
        id: 'reply-replies-endpoint',
        content: 'reply content',
        userId: 'user-replies-endpoint',
        commentId: 'comment-replies-endpoint',
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/replies/reply-replies-endpoint',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const user = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
        },
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/xxx/comments/comment-replies-endpoint/replies/reply-replies-endpoint',
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(404);
      await expect(responseJson.status).toEqual('fail');
      await expect(responseJson.message).toEqual('reply tidak ditemukan');
    });

    it('should response 404 if comment not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-replies-endpoint',
        id: 'user-replies-endpoint',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-replies-endpoint',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-replies-endpoint',
      });
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const user = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
        },
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-replies-endpoint/comments/xxx/replies/reply-replies-endpoint',
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(404);
      await expect(responseJson.status).toEqual('fail');
      await expect(responseJson.message).toEqual('reply tidak ditemukan');
    });

    it('should response 404 if reply not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-replies-endpoint',
        id: 'user-replies-endpoint',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-replies-endpoint',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-replies-endpoint',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-replies-endpoint',
        content: 'comment content',
        userId: 'user-replies-endpoint',
        threadId: 'thread-replies-endpoint',
      });
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const user = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
        },
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/replies/xxx',
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(404);
      await expect(responseJson.status).toEqual('fail');
      await expect(responseJson.message).toEqual('reply tidak ditemukan');
    });

    it('should response 403 if reply found but not owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-replies-endpoint',
        id: 'user-replies-endpoint',
      });
      await ThreadTableTestHelper.addThread({
        id: 'thread-replies-endpoint',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-replies-endpoint',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-replies-endpoint',
        content: 'comment content',
        userId: 'user-replies-endpoint',
        threadId: 'thread-replies-endpoint',
      });
      await ReplyTableTestHelper.addReply({
        id: 'reply-replies-endpoint',
        content: 'reply content',
        userId: 'user-replies-endpoint',
        commentId: 'comment-replies-endpoint',
      });
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login user
      const user = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicodingxyuda',
          password: 'secret',
        },
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/replies/reply-replies-endpoint',
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(403);
      await expect(responseJson.status).toEqual('fail');
      await expect(responseJson.message).toEqual('anda tidak memiliki akses untuk menghapus reply ini');
    });

    it('should response 200 if reply found and owner', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      const users = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'userforrepliesexample',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const userId = await users.result.data.addedUser.id;
      await ThreadTableTestHelper.addThread({
        id: 'thread-replies-endpoint',
        title: 'thread title',
        body: 'thread body',
        owner: userId,
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-replies-endpoint',
        content: 'comment content',
        userId,
        threadId: 'thread-replies-endpoint',
      });
      await ReplyTableTestHelper.addReply({
        id: 'reply-replies-endpoint',
        content: 'reply content',
        userId,
        commentId: 'comment-replies-endpoint',
      });
      // login user
      const user = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'userforrepliesexample',
          password: 'secret',
        },
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/replies/reply-replies-endpoint',
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      await expect(response.statusCode).toEqual(200);
      await expect(responseJson.status).toEqual('success');
    });
  });
});
