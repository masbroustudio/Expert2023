const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const AuthenticationTokenManager = require('../../../../Applications/security/AuthenticationTokenManager');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const jwtTokenManager = this._container.getInstance(AuthenticationTokenManager.name);

    // Handling payload just undefined
    request.payload = request.payload ?? {};

    // Handling authHeader
    const authHeader = (request.headers.authorization && request.headers.authorization.split(' ')[1]) || null;
    if (authHeader) {
      const {id} = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const addedThread = await addThreadUseCase.execute(request.payload);

    const response = h.response({
      'status': 'success',
      'data': {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const jwtTokenManager = this._container.getInstance(AuthenticationTokenManager.name);

    // Handling payload just undefined
    request.payload = request.payload ?? {};

    // Handling authHeader
    const authHeader = (request.headers.authorization && request.headers.authorization.split(' ')[1]) || null;
    if (authHeader) {
      const {id} = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const threadId = (request.params && request.params.threadId);
    request.payload.threadId = threadId;

    const addedComment = await addCommentUseCase.execute(request.payload);

    const response = h.response({
      'status': 'success',
      'data': {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const jwtTokenManager = this._container.getInstance(AuthenticationTokenManager.name);

    // Handling payload just undefined
    request.payload = request.payload ?? {};

    // Handling authHeader
    const authHeader = (request.headers.authorization && request.headers.authorization.split(' ')[1]) || null;
    if (authHeader) {
      const {id} = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const threadId = (request.params && request.params.threadId);
    const commentId = (request.params && request.params.commentId);
    request.payload.threadId = threadId;
    request.payload.commentId = commentId;

    const addedReply = await addReplyUseCase.execute(request.payload);

    const response = h.response({
      'status': 'success',
      'data': {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const jwtTokenManager = this._container.getInstance(AuthenticationTokenManager.name);

    // Handling payload just undefined
    request.payload = request.payload ?? {};

    // Handling authHeader
    const authHeader = (request.headers.authorization && request.headers.authorization.split(' ')[1]) || null;
    if (authHeader) {
      const {id} = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const threadId = (request.params && request.params.threadId);
    const commentId = (request.params && request.params.commentId);
    const replyId = (request.params && request.params.replyId);
    request.payload.threadId = threadId;
    request.payload.commentId = commentId;
    request.payload.replyId = replyId;

    await deleteReplyUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteForumThreadCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const jwtTokenManager = this._container.getInstance(AuthenticationTokenManager.name);

    // Handling payload just undefined
    request.payload = request.payload ?? {};

    // Handling authHeader
    const authHeader = (request.headers.authorization && request.headers.authorization.split(' ')[1]) || null;
    if (authHeader) {
      const {id} = await jwtTokenManager.decodePayload(authHeader);
      request.payload.owner = id;
    }

    const threadId = (request.params && request.params.threadId);
    const commentId = (request.params && request.params.commentId);
    request.payload.threadId = threadId;
    request.payload.commentId = commentId;

    await deleteForumThreadCommentUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);

    const threadId = (request.params && request.params.threadId);
    const thread = await getThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {thread},
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
