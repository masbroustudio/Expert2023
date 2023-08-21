const routes = require('./routes');
const AuthenticationHandler = require('./handler');

module.exports = {
  name: 'authentications',
  register: async (server, { container }) => {
    const authenticationHandler = new AuthenticationHandler(container);
    server.route(routes(authenticationHandler));
  },
};
