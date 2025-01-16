const express = require("express");
const UserController = require("../controllers/user.controller");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();
const userController = new UserController();

router.post("/register", userController.RegisterUser);
router.post("/login", userController.LoginUser);
router.get("/currentUser", authenticateJWT, userController.CurrentUser);
router.get("/currentToken", authenticateJWT, userController.CurrentToken);

module.exports = router;
