const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepoitory interface", () => {
  it("should throw error when invoke unimplemented method", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action and Assert
    await expect(replyRepository.addReply({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(replyRepository.verifyReplyOwner({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(replyRepository.getReplyByCommentId({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(replyRepository.deleteReply({})).rejects.toThrowError(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
