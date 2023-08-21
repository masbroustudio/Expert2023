const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');

describe('ReplyRepository postgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-123', username: 'userreply' });
      await ThreadTableTestHelper.addThread({ id: 'thread-reply-123', title: 'thread title', owner: 'user-reply-123' });
      await CommentTableTestHelper.addComment({
        id: 'comment-reply-123', content: 'comment content', threadId: 'thread-reply-123', userId: 'user-reply-123',
      });
      const fakeIdGenerator = () => '123'; // stub
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const replyPayload = {
        content: 'reply content',
        commentId: 'comment-reply-123',
        owner: 'user-reply-123',
      };

      await replyRepository.addReply(replyPayload);

      const replies = await ReplyTableTestHelper.findReply('reply-123');
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toBe('reply-123');
    });

    it('should return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-23', username: 'userreplies' });
      await ThreadTableTestHelper.addThread({ id: 'thread-reply-23', title: 'thread title', owner: 'user-reply-23' });
      await CommentTableTestHelper.addComment({
        id: 'comment-reply-23', content: 'comment content', threadId: 'thread-reply-23', userId: 'user-reply-23',
      });
      const fakeIdGenerator = () => '1234'; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const replyPayload = {
        content: 'reply content',
        commentId: 'comment-reply-23',
        owner: 'user-reply-23',
      };

      const reply = await replyRepositoryPostgres.addReply(replyPayload);

      expect(reply).toStrictEqual(new AddedReply({
        id: 'reply-1234',
        content: 'reply content',
        owner: 'user-reply-23',
      }));
    });
  });

  describe('findReplyById function', () => {
    it('should return undefined if reply not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool);
      const reply = await replyRepository.findReplyById('reply-123');

      expect(reply).toBeUndefined();
    });

    it('should return reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-231', username: 'userreplies' });
      await ThreadTableTestHelper.addThread({ id: 'thread-reply-23', title: 'thread title', owner: 'user-reply-231' });
      await CommentTableTestHelper.addComment({
        id: 'comment-reply-23', content: 'comment content', threadId: 'thread-reply-23', userId: 'user-reply-231',
      });
      await ReplyTableTestHelper.addReply({
        id: 'reply-23', content: 'reply content', commentId: 'comment-reply-23', userId: 'user-reply-231',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const reply = await replyRepositoryPostgres.findReplyById('reply-23');

      expect(reply).toStrictEqual({
        id: 'reply-23',
        owner: 'user-reply-231',
      });
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-231', username: 'userreplies' });
      await ThreadTableTestHelper.addThread({ id: 'thread-reply-23', title: 'thread title', owner: 'user-reply-231' });
      await CommentTableTestHelper.addComment({
        id: 'comment-reply-23', content: 'comment content', threadId: 'thread-reply-23', userId: 'user-reply-231',
      });
      await ReplyTableTestHelper.addReply({
        id: 'reply-23', content: 'reply content', commentId: 'comment-reply-23', userId: 'user-reply-231',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply('reply-23');

      const replies = await ReplyTableTestHelper.findReply('reply-23');
      expect(replies).toStrictEqual([
        {
          id: 'reply-23',
          content: 'reply content',
          owner: 'user-reply-231',
          comment_id: 'comment-reply-23',
          date: expect.any(String),
          is_delete: true,
        },
      ]);
    });
  });

  describe('findRepliesByCommentId function', () => {
    it('should return empty array if no replies found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      const replies = await replyRepository.findReplyByCommentId(['comment-123']);

      expect(replies).toHaveLength(0);
    });

    it('should return replies correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-reply-231', username: 'userreplies' });
      await ThreadTableTestHelper.addThread({ id: 'thread-reply-23', title: 'thread title', owner: 'user-reply-231' });
      await CommentTableTestHelper.addComment({
        id: 'comment-reply-23', content: 'comment content', threadId: 'thread-reply-23', userId: 'user-reply-231',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-reply-24', content: 'comment content', threadId: 'thread-reply-23', userId: 'user-reply-231',
      });
      await ReplyTableTestHelper.addReply({
        id: 'reply-23', content: 'reply content', commentId: 'comment-reply-23', userId: 'user-reply-231',
      });
      await ReplyTableTestHelper.addReply({
        id: 'reply-24', content: 'reply content', commentId: 'comment-reply-24', userId: 'user-reply-231',
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.findReplyByCommentId(['comment-reply-23', 'comment-reply-24']);

      expect(replies).toStrictEqual([
        {
          id: 'reply-23',
          content: 'reply content',
          username: 'userreplies',
          date: expect.any(String),
          is_delete: false,
          comment_id: 'comment-reply-23',
          owner: 'user-reply-231',
        },
        {
          id: 'reply-24',
          content: 'reply content',
          username: 'userreplies',
          date: expect.any(String),
          is_delete: false,
          comment_id: 'comment-reply-24',
          owner: 'user-reply-231',
        },
      ]);
    });
  });
});
