const httpStatus = require("http-status");
const asyncHandler = require("express-async-handler");
const UserService = require("../services/user.service");

class UserController {
  getUsers = asyncHandler(async (req, res) => {
    const query = req.query.isEmpty ? req.query : { role: "user" };
    const users = await UserService.getUsers(query);
    res.status(httpStatus.OK).json(users);
  });

  updateUser = asyncHandler(async (req, res) => {
    const user = await UserService.updateUserById(req.params.userId, req.body);
    res.status(httpStatus.OK).json(user);
  });

  deleteUser = asyncHandler(async (req, res) => {
    await UserService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
  });

  getProfile = asyncHandler(async (req, res) => {
    const user = await UserService.getUserById(req.user.id);
    res.status(httpStatus.OK).json(user);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const user = await UserService.updateUserById(req.user.id, req.body);
    res.status(httpStatus.OK).json(user);
  });
}

module.exports = new UserController();
