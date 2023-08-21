const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const replyPayload = {
      ...request.payload,
      commentId: request.params.commentId,
      threadId: request.params.threadId,
      owner: request.auth.credentials.id,
    };
    const addedReply = await addReplyUseCase.execute(replyPayload);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const replyPayload = {
      replyId: request.params.replyId,
      owner: request.auth.credentials.id,
    };
    await deleteReplyUseCase.execute(replyPayload);

    return {
      status: 'success',
    };
  }
}

module.exports = ReplyHandler;
