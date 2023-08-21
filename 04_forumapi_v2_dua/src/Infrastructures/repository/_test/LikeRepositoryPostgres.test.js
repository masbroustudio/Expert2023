const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const LikeTableTestHelper = require('../../../../tests/LikeTableTestHelper');

describe('LikeRepository postgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await LikeTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add like', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-like-123', username: 'userlike' });
      await ThreadTableTestHelper.addThread({ id: 'thread-like-123', title: 'thread title', owner: 'user-like-123' });
      await CommentTableTestHelper.addComment({
        id: 'comment-like-123', content: 'comment content', threadId: 'thread-like-123', userId: 'user-like-123',
      });

      const fakeIdGenerator = () => 123; // stub
      const likeRepository = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      const likePayload = {
        commentId: 'comment-like-123',
        userId: 'user-like-123',
      };

      await likeRepository.addLike(likePayload);

      const likes = await LikeTableTestHelper.countLikes('comment-like-123');
      expect(likes).toStrictEqual(1);
    });
  });

  describe('removeLike function', () => {
    it('should remove like', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-like-1234', username: 'userlike' });
      await ThreadTableTestHelper.addThread({ id: 'thread-like-123', title: 'thread title', owner: 'user-like-1234' });
      await CommentTableTestHelper.addComment({
        id: 'comment-like-1234', content: 'comment content', threadId: 'thread-like-123', userId: 'user-like-1234',
      });
      const payload = {
        commentId: 'comment-like-1234',
        userId: 'user-like-1234',
      };
      await LikeTableTestHelper.addLike(payload);

      const fakeIdGenerator = () => 123; // stub
      const likeRepository = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      await likeRepository.removeLike(payload);

      const likes = await LikeTableTestHelper.countLikes('comment-like-1234');
      expect(likes).toStrictEqual(0);
    });
  });

  describe('verifyLiked function', () => {
    it('should return like', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-like-1235', username: 'userlike' });
      await ThreadTableTestHelper.addThread({ id: 'thread-like-123', title: 'thread title', owner: 'user-like-1235' });
      await CommentTableTestHelper.addComment({
        id: 'comment-like-1235', content: 'comment content', threadId: 'thread-like-123', userId: 'user-like-1235',
      });
      const payload = {
        commentId: 'comment-like-1235',
        userId: 'user-like-1235',
      };
      await LikeTableTestHelper.addLike(payload);

      const fakeIdGenerator = () => 123; // stub
      const likeRepository = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const like = await likeRepository.verifyLiked(payload);

      expect(like).toStrictEqual({ id: 'like-123' });
    });
  });

  describe('countLikes function', () => {
    it('should return count of likes', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-like-1236', username: 'userlike' });
      await ThreadTableTestHelper.addThread({ id: 'thread-like-123', title: 'thread title', owner: 'user-like-1236' });
      await CommentTableTestHelper.addComment({
        id: 'comment-like-1236', content: 'comment content', threadId: 'thread-like-123', userId: 'user-like-1236',
      });
      await LikeTableTestHelper.addLike({
        commentId: 'comment-like-1236',
        userId: 'user-like-1236',
      });

      const fakeIdGenerator = () => 123; // stub
      const likeRepository = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      const likes = await likeRepository.countLikes('comment-like-1236');

      expect(likes).toStrictEqual(1);
    });
  });
});
