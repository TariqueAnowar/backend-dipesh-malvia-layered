const express = require("express");
const ContactController = require("../controllers/contact.controller");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();
const contactController = new ContactController();

router.get("/", validateToken, contactController.GetContacts);
router.post("/", validateToken, contactController.CreateContact);

router.get("/:id", validateToken, contactController.GetContact);
router.put("/:id", validateToken, contactController.UpdateContact);
router.delete("/:id", validateToken, contactController.DeleteContact);

module.exports = router;
