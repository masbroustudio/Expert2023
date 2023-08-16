const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.addReply({})).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.verifyReplyById("")).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.verifyReplyOwner("", "")).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.getRepliesByCommentId).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
    await expect(replyRepository.deleteReply("")).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED",
    );
  });
});
