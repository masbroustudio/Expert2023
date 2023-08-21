const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/thread/{id}/comments/{id}/likes endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
  });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      username: 'userlikesendpoint',
      id: 'user-likes-endpoint',
    });
    await ThreadTableTestHelper.addThread({
      id: 'thread-replies-endpoint',
      title: 'thread title',
      body: 'thread body',
      owner: 'user-likes-endpoint',
    });
    await CommentTableTestHelper.addComment({
      id: 'comment-replies-endpoint',
      content: 'comment content',
      userId: 'user-likes-endpoint',
      threadId: 'thread-replies-endpoint',
    });
  });

  describe('when PUT /thread/{id}/comments/{id}/likes', () => {
    it('should return 200 and add a like to a comment without authenticate', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/likes',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should return 404 thread not found', async () => {
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
        method: 'PUT',
        url: '/threads/thread-not-found/comments/comment-replies-endpoint/likes',
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should return 404 comment not found', async () => {
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
        method: 'PUT',
        url: '/threads/thread-replies-endpoint/comments/comment-not-found/likes',
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should return 200 and add or remove a like to a comment', async () => {
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
        method: 'PUT',
        url: '/threads/thread-replies-endpoint/comments/comment-replies-endpoint/likes',
        headers: {
          Authorization: `Bearer ${user.result.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
