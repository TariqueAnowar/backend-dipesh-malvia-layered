const UserModel = require("../models/user.model");

class UserRepository {
  async FindByEmail(email) {
    try {
      const existingCustomer = await UserModel.findOne({ email: email });
      return existingCustomer;
    } catch (err) {
      throw new Error(err);
    }
  }

  async CreateUser(username, hashedPassword, email) {
    try {
      const user = await UserModel.create({
        username,
        password: hashedPassword,
        email,
      });

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = UserRepository;
