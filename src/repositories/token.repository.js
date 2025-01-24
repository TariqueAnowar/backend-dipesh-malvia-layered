const TokenModel = require("../models/token.model");

class TokenRepository {
  async create(tokenBody) {
    return TokenModel.create(tokenBody);
  }

  async findOne(token) {
    return TokenModel.findOne(token);
  }

  async deleteMany(token) {
    return TokenModel.deleteMany(token);
  }

  // Add more methods as needed
}

module.exports = new TokenRepository();
