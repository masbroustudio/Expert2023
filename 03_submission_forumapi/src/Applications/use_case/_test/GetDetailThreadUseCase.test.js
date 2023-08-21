const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetDetailThreadUseCase = require("../GetDetailThreadUseCase");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("GetDetailThreadUseCase", () => {
  it("should orchestrating the get detail thread action correctly", async () => {
    // Arrange
    const useCasePayload = { 
      threadId: "thread-123" 
    };


    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    const mockedThread = new DetailThread({
      id: "thread-123",
      title: "sebuah thread",
      body: "sebuah body thread",
      date: "2021-08-08T07:19:09.775Z",
      username: "dicoding",
      comments: [
        {
          id: "comment-123",
          content: "ini adalah comment-123 johndoe",
          username: "johndoe",
          date: "2021-08-08T07:22:33.555Z",
          replies: [
            {
              id: "reply-234",
              content: "ini adalah reply-234 dicoding",
              username: "dicoding",
              date: "2021-08-08T08:07:01.522Z",
            },
          ],
        },
      ],
    });
    const { comments, ...threadWithoutComments } = mockedThread;

    // Mocking
    mockThreadRepository.verifyThreadById = jest.fn(() => Promise.resolve());
    
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: "comment-123",
            content: "ini adalah comment-123 johndoe",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            is_delete: "0",
          },
          {
            id: "comment-234",
            content: "ini adalah comment-234 dicoding",
            username: "dicoding",
            date: "2021-08-08T07:26:21.338Z",
            is_delete: "1",
          },
        ])
      );
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation((commentId) => {
        if (commentId === "comment-123") {
          return [
            {
              id: "reply-234",
              content: "balasan reply-234 dicoding",
              username: "dicoding",
              date: "2021-08-08T08:07:01.522Z",
              is_delete: "0",
            },
          ];
        }
        return [];
      });
    mockCommentRepository.getLikesCount = jest
      .fn()
      .mockImplementation((commentId) => {
        if (commentId === "comment-123") {
          return 1;
        }
        return 0;
      });
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(threadWithoutComments));

    // create use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getDetailThread =
      await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getDetailThread).toEqual(
      new DetailThread({
        id: "thread-123",
        title: "sebuah thread",
        body: "sebuah body thread",
        date: "2021-08-08T07:19:09.775Z",
        username: "dicoding",
        comments: [
          {
            id: "comment-123",
            content: "ini adalah comment-123 johndoe",
            username: "johndoe",
            date: "2021-08-08T07:22:33.555Z",
            replies: [
              {
                id: "reply-234",
                content: "balasan reply-234 dicoding",
                username: "dicoding",
                date: "2021-08-08T08:07:01.522Z",
              },
            ],
            likeCount: 1,
          },
          {
            id: "comment-234",
            content: "**komentar telah dihapus**",
            username: "dicoding",
            date: "2021-08-08T07:26:21.338Z",
            replies: [],
            likeCount: 0,
          },
        ],
      })
    );
    expect(mockThreadRepository.verifyThreadById).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      "thread-123"
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      "comment-123"
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      "comment-234"
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith("thread-123");
    // Note : Verifikasi semua pemanggilan fungsi mock. 
    // Sesuaikan pula untuk implementasi unit test usecase yang lain.
  });
});
