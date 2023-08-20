/* instanbul ignore else */

const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const pool = require("../../database/postgres/pool");

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
    });
    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      owner: "user-123",
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist added comment", async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: "thread-123",
        content: "sebuah comment",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment =
        await CommentsTableTestHelper.getCommentByThreadId("thread-123");
      expect(comment).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: "thread-123",
        content: "sebuah comment",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator,
      );

      // Action
      const addedComment =
        await commentRepositoryPostgres.addComment(addComment);
      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "sebuah comment",
          owner: "user-123",
        }),
      );
    });
  });

  describe("verifyAvailableComment function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-123"),
      ).rejects.toThrowError("comment tidak valid atau tidak ditemukan");
    });

    it("should not throw NotFoundError when comment available", async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: "thread-123",
        content: "sebuah comment",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);
      const comment =
        await commentRepositoryPostgres.verifyAvailableComment("comment-123");

      // Assert
      expect(comment).toStrictEqual({ id: "comment-123" });
    });
  });

  describe("getCommentByThreadId function", () => {
    it("should return comments correctly", async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: "thread-123",
        content: "sebuah comment",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments =
        await commentRepositoryPostgres.getCommentByThreadId("thread-123");
      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual({
        id: "comment-123",
        content: "sebuah comment",
        date: comments[0].date,
        owner: "user-123",
        thread_id: "thread-123",
        is_delete: false,
        username: "dicoding",
      });
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw not found error when comment not available", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner({
          commentId: "comment-123",
          owner: "user-123",
        }),
      ).rejects.toThrowError("comment tidak valid atau tidak ditemukan");
    });

    it("should throw when comment owner not match", async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: "thread-123",
        content: "sebuah comment",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator,
      );

      // Action
      const result = await commentRepositoryPostgres.addComment(addComment);

      // Override result
      result.commentId = "comment-123";
      result.owner = "user-1234";

      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(result),
      ).rejects.toThrowError("Tidak dapat akses, anda bukan pemilik comment");
    });

    it("should not throw AuthorizationError when comment owner match", async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: "thread-123",
        content: "sebuah comment",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator,
      );

      // Action
      const result = await commentRepositoryPostgres.addComment(addComment);

      // Override result
      result.commentId = "comment-123";

      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(result),
      ).resolves.not.toThrowError("Missing authentication");
    });
  });

  describe("deleteComment function", () => {
    it("should delete comment correctly", async () => {
      // Arrange
      const addComment = new AddComment({
        threadId: "thread-123",
        content: "sebuah comment",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);
      await commentRepositoryPostgres.deleteComment({
        commentId: "comment-123",
        owner: "user-123",
      });

      // Assert
      const comments =
        await commentRepositoryPostgres.getCommentByThreadId("thread-123");
      expect(comments[0]).toStrictEqual({
        content: "sebuah comment",
        date: comments[0].date,
        id: "comment-123",
        is_delete: true,
        owner: "user-123",
        thread_id: "thread-123",
        username: "dicoding",
      });
    });
  });
});
