
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('LikeRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding'});
    await UsersTableTestHelper.addUser({id: 'user-456', username: 'dicoding2'});
    await ThreadsTableTestHelper.addThread({id: 'thread-123', owner: 'user-123'});
    await CommentsTableTestHelper.addComment({id: 'comment-123', threadId: 'thread-123', owner: 'user-123'});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('checkLike function', () => {
    it('should return false if like not exist', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const like = await likeRepositoryPostgres.checkLike('comment-123', 'user-456');
      expect(like).toStrictEqual(false);
    });

    it('should return true if like exist', async () => {
      // Arrange
      const addLike = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(addLike);

      // Assert
      const like = await likeRepositoryPostgres.checkLike({commentId: 'comment-123', owner: 'user-123'});
      expect(like).toStrictEqual(true);
    });
  });

  describe('addLike function', () => {
    it('should persist added like', async () => {
      // Arrange
      const addLike = {
        owner: 'user-123',
        commentId: 'comment-123',
      };

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(addLike);

      // Assert
      const like = await LikesTableTestHelper.getLikeCount('comment-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should persist deleted like', async () => {
      // Arrange
      const addLike = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(addLike);
      await likeRepositoryPostgres.deleteLike(addLike);

      // Assert
      const like = await LikesTableTestHelper.getLikeCount('comment-123');
      expect(like).toHaveLength(0);
    });
  });

  describe('getLikeCount function', () => {
    it('should return like count', async () => {
    // Arrange
      const addLike = {
        commentId: 'comment-123',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike(addLike);

      // Assert
      const like = await likeRepositoryPostgres.getLikeCount('comment-123');
      expect(like).toStrictEqual(1);
    });
  });
});
