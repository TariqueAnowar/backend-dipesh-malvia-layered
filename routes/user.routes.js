const express = require("express");
const UserController = require("../controllers/user.controller");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.RegisterUser);
router.post("/login", userController.LoginUser);
router.get("/currentUser", validateToken, userController.CurrentUser);
router.get("/currentToken", validateToken, userController.CurrentToken);

module.exports = router;
