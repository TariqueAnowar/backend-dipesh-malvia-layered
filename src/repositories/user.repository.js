const UserModel = require("../models/user.model");

class UserRepository {
  async create(userBody) {
    return UserModel.create(userBody);
  }

  async findById(id) {
    return UserModel.findById(id);
  }

  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async isEmailTaken(email, excludeUserId) {
    return UserModel.isEmailTaken(email, excludeUserId);
  }

  async findAll(query) {
    return UserModel.find(query);
  }

  // Add more methods as needed
}

module.exports = new UserRepository();
