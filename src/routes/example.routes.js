const express = require("express");
const { authenticateJWT, authorizeRole } = require("../middleware/auth");
const controller = require("../controllers/example.controller");

const router = express.Router();

// Admin only route
router.get(
  "/admin-resource",
  authenticateJWT,
  authorizeRole("admin"),
  controller.method
);

// User only route
router.get(
  "/user-resource",
  authenticateJWT,
  authorizeRole("user"),
  controller.method
);

// Both admin and user route
router.get(
  "/shared-resource",
  authenticateJWT,
  authorizeRole("admin", "user"),
  controller.method
);

module.exports = router;
