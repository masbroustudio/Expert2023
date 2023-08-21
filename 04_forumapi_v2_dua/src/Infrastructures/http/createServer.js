const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const replies = require('../../Interfaces/http/api/replies');
const likes = require('../../Interfaces/http/api/likes');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifact) => ({
      isValid: true,
      credentials: {
        id: artifact.decoded.payload.id,
      },
    }),
  });

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => ({
        status: 'success',
        message: 'Hello World!',
      }),
    },
  ]);

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
    {
      plugin: likes,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const errorResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        errorResponse.code(translatedError.statusCode);
        return errorResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      const errorResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      errorResponse.code(500);
      return errorResponse;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
