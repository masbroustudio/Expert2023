const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");
const GetThreadUseCase = require("../../../../Applications/use_case/GetThreadUseCase");
const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");
const LikeCommentUseCase = require("../../../../Applications/use_case/LikeCommentUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);

    const threadId = request.params && request.params.threadId;
    const thread = await getThreadUseCase.execute(threadId);

    const response = h.response({
      status: "success",
      data: { thread },
    });
    response.code(200);

    return response;
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const jwtTokenManager = this._container.getInstance(
      AuthenticationTokenManager.name
    );

    // Handling payload just undefined
    request.payload = request.payload ?? {};

    // Handling authHeader
    const authHeader =
      (request.headers.authorization &&
        request.headers.authorization.split(" ")[1]) ||
      null;
    if (authHeader) {
      const { id } = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const addedThread = await addThreadUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const jwtTokenManager = this._container.getInstance(
      AuthenticationTokenManager.name
    );

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );

    request.payload = request.payload ?? {};

    const authHeader =
      (request.headers.authorization &&
        request.headers.authorization.split(" ")[1]) ||
      null;

    if (authHeader) {
      const { id } = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const threadId = request.params && request.params.threadId;

    request.payload.threadId = threadId;

    const addedComment = await addCommentUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);

    return response;
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const jwtTokenManager = this._container.getInstance(
      AuthenticationTokenManager.name
    );

    request.payload = request.payload ?? {};

    const authHeader =
      (request.headers.authorization &&
        request.headers.authorization.split(" ")[1]) ||
      null;

    if (authHeader) {
      const { id } = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const threadId = request.params && request.params.threadId;
    const commentId = request.params && request.params.commentId;

    request.payload.threadId = threadId;
    request.payload.commentId = commentId;

    const addedReply = await addReplyUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedReply,
      },
    });
    response.code(201);

    return response;
  }

  async deleteCommentHandler(request, h) {
    const jwtTokenManager = this._container.getInstance(
      AuthenticationTokenManager.name
    );
    const deleteThreadCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    request.payload = request.payload ?? {};

    const authHeader =
      (request.headers.authorization &&
        request.headers.authorization.split(" ")[1]) ||
      null;

    if (authHeader) {
      const { id } = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const threadId = request.params && request.params.threadId;
    const commentId = request.params && request.params.commentId;

    request.payload.threadId = threadId;
    request.payload.commentId = commentId;

    await deleteThreadCommentUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
    });
    response.code(200);

    return response;
  }

  async deleteReplyHandler(request, h) {
    const jwtTokenManager = this._container.getInstance(
      AuthenticationTokenManager.name
    );
    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );

    request.payload = request.payload ?? {};

    const authHeader =
      (request.headers.authorization &&
        request.headers.authorization.split(" ")[1]) ||
      null;

    if (authHeader) {
      const { id } = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const threadId = request.params && request.params.threadId;
    const commentId = request.params && request.params.commentId;
    const replyId = request.params && request.params.replyId;

    request.payload.threadId = threadId;
    request.payload.commentId = commentId;
    request.payload.replyId = replyId;

    await deleteReplyUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
    });
    response.code(200);

    return response;
  }

  async putLikeCommentHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(
      LikeCommentUseCase.name
    );
    const jwtTokenManager = this._container.getInstance(
      AuthenticationTokenManager.name
    );

    request.payload = request.payload ?? {};

    const authHeader =
      (request.headers.authorization &&
        request.headers.authorization.split(" ")[1]) ||
      null;

    if (authHeader) {
      const { id } = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const threadId = request.params && request.params.threadId;
    const commentId = request.params && request.params.commentId;

    request.payload.threadId = threadId;
    request.payload.commentId = commentId;

    await likeCommentUseCase.execute(request.payload);

    const response = h.response({
      status: "success",
    });

    response.code(200);

    return response;
  }
}

module.exports = ThreadsHandler;
