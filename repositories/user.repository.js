const UserModel = require("../models/user.model");

class UserRepository {
  async FindByEmail(email) {
    try {
      const existingCustomer = await UserModel.findOne({ email: email });
      return existingCustomer;
    } catch (err) {
      console.error(`Error finding user by email: ${email}`, err);
      throw err;
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
      console.error(
        `Error creating user by username, hashedPassword, email: ${
          (username, hashedPassword, email)
        }`,
        err
      );
      throw err;
    }
  }
}

module.exports = UserRepository;
