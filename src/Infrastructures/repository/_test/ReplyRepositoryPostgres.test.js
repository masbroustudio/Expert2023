const AddReply = require("../../../Domains/replies/entities/AddReply");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe("ReplyRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
    });

    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      owner: "user-123",
    });

    await CommentsTableTestHelper.addComment({
      id: "comment-123",
      threadId: "thread-123",
      owner: "user-123",
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist added reply", async () => {
      // Arrange
      const addReply = new AddReply({
        commentId: "comment-123",
        owner: "user-123",
        content: "sebuah content",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const reply =
        await RepliesTableTestHelper.getReplyByCommentId("comment-123");

      expect(reply).toHaveLength(1);

      expect(reply[0]).toStrictEqual({
        id: "reply-123",
        username: "dicoding",
        content: "sebuah content",
        date: reply[0].date,
      });
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw NotFoundError when reply not found", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action & Assert
      expect(
        replyRepositoryPostgres.verifyReplyOwner({
          replyId: "reply-123",
          owner: "user-123",
        })
      ).rejects.toThrowError("reply tidak ditemukan");
    });

    it("should throw AuthorizationError when reply owner not match", async () => {
      // Arrange
      const addReply = new AddReply({
        commentId: "comment-123",
        owner: "user-123",
        content: "sebuah content",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action
      const result = await replyRepositoryPostgres.addReply(addReply);

      result.replyId = result.id;
      result.owner = "user-1234";

      // Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(result)
      ).rejects.toThrowError("Tidak dapat akses, anda bukan pemilik reply");
    });

    it("should not throw AuthorizationError when reply owner match", async () => {
      // Arrange
      const addReply = new AddReply({
        commentId: "comment-123",
        owner: "user-123",
        content: "sebuah content",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action
      const result = await replyRepositoryPostgres.addReply(addReply);

      // Override result
      result.replyId = result.id;

      // Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner(result)
      ).resolves.not.toThrowError("Tidak dapat akses, anda bukan pemilik reply");
    });
  });

  describe("getReplyByCommentId function", () => {
    it("should return replies", async () => {
      // Arrange
      const addReply = new AddReply({
        commentId: "comment-123",
        owner: "user-123",
        content: "sebuah content",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const replies =
        await replyRepositoryPostgres.getReplyByCommentId("comment-123");

      expect(replies).toHaveLength(1);
      expect(replies[0]).toStrictEqual({
        comment_id: "comment-123",
        content: "sebuah content",
        date: replies[0].date,
        id: "reply-123",
        is_delete: false,
        owner: "user-123",
        username: "dicoding",
      });
    });
  });

  describe("deleteReply function", () => {
    it("should delete reply", async () => {
      // Arrange
      const addReply = new AddReply({
        commentId: "comment-123",
        owner: "user-123",
        content: "sebuah content",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action
      const replyRepository = await replyRepositoryPostgres.addReply(addReply);
      await replyRepositoryPostgres.deleteReply({
        replyId: replyRepository.id,
        owner: replyRepository.owner,
      });

      // Assert
      const replies =
        await replyRepositoryPostgres.getReplyByCommentId("comment-123");
      expect(replies[0]).toStrictEqual({
        comment_id: "comment-123",
        content: "sebuah content",
        date: replies[0].date,
        id: "reply-123",
        is_delete: true,
        owner: "user-123",
        username: "dicoding",
      });
    });
  });
});
