const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('ThreadRepository postgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-thread-123', username: 'userthread' });
      const fakeIdGenerator = () => 'xx1233'; // stub
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
        owner: 'user-thread-123',
      };

      await threadRepository.addThread(threadPayload);

      const threads = await ThreadTableTestHelper.findThread('thread-xx1233');
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toBe('thread-xx1233');
    });

    it('should return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-thread-23', username: 'userthreadss' });
      const fakeIdGenerator = () => '1234'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const threadPayload = {
        title: 'thread title',
        body: 'thread body',
        owner: 'user-thread-23',
      };

      const thread = await threadRepositoryPostgres.addThread(threadPayload);

      expect(thread).toStrictEqual(new AddedThread({
        id: 'thread-1234',
        title: 'thread title',
        owner: 'user-thread-23',
      }));
    });
  });

  describe('checkThreadById function', () => {
    it('should return null if thread not found', async () => {
      const fakeIdGenerator = () => '1234'; // stub
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const thread = await threadRepositoryPostgres.checkThreadById('thread-1234');

      expect(thread).toBeUndefined();
    });

    it('should return thread by id', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-thread-233', username: 'userthreads2' });
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-thread-233',
      });
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepository.checkThreadById('thread-123');

      expect(thread).not.toBeNull();
    });
  });

  describe('getDetailThreadById function', () => {
    it('should return null if thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getDetailThreadById('thread-123');

      expect(thread).toBeUndefined();
    });

    it('should return detail thread by id', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-thread-240', username: 'userthrea2' });
      await ThreadTableTestHelper.addThread({
        id: 'thread-290',
        title: 'thread title',
        body: 'thread body',
        owner: 'user-thread-240',
      });
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepository.getDetailThreadById('thread-290');

      expect(thread).not.toBeUndefined();
      expect(thread).toStrictEqual({
        id: 'thread-290',
        title: 'thread title',
        body: 'thread body',
        username: 'userthrea2',
        date: expect.any(String),
      });
    });
  });
});
