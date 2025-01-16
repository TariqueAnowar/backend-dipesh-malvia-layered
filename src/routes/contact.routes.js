const express = require("express");
const ContactController = require("../controllers/contact.controller");
const authenticateJWT = require("../middleware/auth");

const router = express.Router();
const contactController = new ContactController();

router.use(authenticateJWT);

router.get("/", contactController.GetContacts);
router.post("/", contactController.CreateContact);

router.get("/:id", contactController.GetContact);
router.put("/:id", contactController.UpdateContact);
router.delete("/:id", contactController.DeleteContact);

module.exports = router;
