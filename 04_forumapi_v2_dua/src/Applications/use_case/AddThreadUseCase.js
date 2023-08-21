const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute({ title, body, owner }) {
    const addThread = new AddThread({
      title,
      body,
    });
    return this._threadRepository.addThread({ ...addThread, owner });
  }
}

module.exports = AddThreadUseCase;
