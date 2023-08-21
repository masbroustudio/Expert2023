class DeleteAuthenticationUseCase {
  constructor({ authenticationRepository }) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    const { refreshToken } = useCasePayload;

    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  _validatePayload(payload) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error(
        "DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }
  }
}

module.exports = DeleteAuthenticationUseCase;
