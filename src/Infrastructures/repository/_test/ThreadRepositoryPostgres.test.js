const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ForumsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe("ThreadRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
    });
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ForumsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist added thread", async () => {
      // Arrange
      const addThread = new AddThread({
        owner: "user-123",
        title: "Title New Thread",
        body: "Thread Content Here",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);
      const thread = await ForumsTableTestHelper.getThread("thread-123");

      // Assert
      expect(thread).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      // Arrange
      const addThread = new AddThread({
        owner: "user-123",
        title: "Title New Thread",
        body: "Thread Content Here",
      });
      const fakeIdGenerator = () => "1234";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-1234",
          owner: "user-123",
          title: "Title New Thread",
        })
      );
    });
  });

  describe("verifyAvailableThread function", () => {
    it("should not throw NotFoundError when thread available", async () => {
      // Arrange
      const addThread = new AddThread({
        owner: "user-123",
        title: "Title New Thread",
        body: "Thread Content Here",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-123")
      ).resolves.not.toThrowError("thread tidak ditemukan");
    });

    it("should throw NotFoundError when thread not available", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-123")
      ).rejects.toThrowError("thread tidak ditemukan");
    });
  });

  describe("getThreadById function", () => {
    it("should return thread correctly", async () => {
      // Arrange
      const addThread = new AddThread({
        owner: "user-123",
        title: "Title New Thread",
        body: "Thread Content Here",
      });

      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);
      const thread = await threadRepositoryPostgres.getThreadById("thread-123");

      // Assert
      expect(thread).toEqual({
        id: "thread-123",
        title: "Title New Thread",
        body: "Thread Content Here",
        username: "dicoding",
        date: thread.date,
      });
    });

    it("should throw NotFoundError when thread not available", async () => {
      // Arrange
      const fakeIdGenerator = () => "123";
      const fakeTimestampGenerator = () => new Date().toISOString();
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeTimestampGenerator
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById("thread-123")
      ).rejects.toThrowError("thread tidak ditemukan");
    });
  });
});
