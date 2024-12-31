const Contact = require("../models/contact.model");
const { isValidObjectId } = require("mongoose");
const ContactRepository = require("../repositories/contact.repository");

class ContactController {
  constructor() {
    this.repository = new ContactRepository();
  }

  //@desc Get all contacts
  //@route GET /api/contacts
  //@access private
  GetContacts = async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const contacts = await this.repository.FindByUserId(user_id);
      res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  };

  //@desc Create new contact
  //@route POST /api/contacts
  //@access private
  CreateContact = async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;

      if (!name || !email || !phone) {
        res.status(400);
        throw new Error("Missing input or fields");
      }

      const contact = await this.repository.CreateContact(
        name,
        email,
        phone,
        req.user.id
      );

      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  };

  //@desc Get contact by id
  //@route GET /api/contacts/:id
  //@access private
  GetContact = async (req, res, next) => {
    try {
      const contact = await this.repository.FindById({
        _id: req.params.id,
        user_id: req.user.id,
      });

      if (!contact) {
        res.status(404);
        throw new Error("Contact not found or user doesn't have permission");
      }

      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  };

  //@desc Update contact by id
  //@route PUT /api/contacts/:id
  //@access private
  UpdateContact = async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;

      if (!name && !email && !phone) {
        res.status(400);
        throw new Error("Missing input or fields");
      }

      const updatedContact = await this.repository.UpdateContact({
        _id: req.params.id,
        user_id: req.user.id,
        body: req.body,
      });

      if (!updatedContact) {
        res.status(404);
        throw new Error("Contact not found or user doesn't have permission");
      }

      res.status(200).json(updatedContact);
    } catch (err) {
      next(err);
    }
  };

  //@desc Delete contact by id
  //@route DELETE /api/contacts/:id
  //@access private
  DeleteContact = async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        res.status(400);
        throw new Error("Invalid contact id");
      }

      const deletedContact = await this.repository.DeleteContact({
        _id: req.params.id,
        user_id: req.user.id,
      });

      if (!deletedContact) {
        res.status(404);
        throw new Error("Contact not found or user doesn't have permission");
      }

      res
        .status(200)
        .json({ message: "Contact deleted successfully", deletedContact });
    } catch (err) {
      next(err);
    }
  };

  // ... other controller methods
}

module.exports = ContactController;
