const { isValidObjectId } = require("mongoose");
const ContactModel = require("../models/contact.model");

class ContactRepository {
  async FindByUserId(user_id) {
    try {
      if (!isValidObjectId(user_id)) {
        throw new Error("Invalid user_id");
      }
      const contacts = await ContactModel.find({ user_id });
      return contacts;
    } catch (err) {
      console.error(`Error finding contact by user_id: ${user_id}`, err);
      throw err;
    }
  }

  async FindById({ _id, user_id }) {
    try {
      if (!isValidObjectId(_id) || !isValidObjectId(user_id)) {
        throw new Error("Invalid contact_id or user_id");
      }
      const contacts = await ContactModel.findOne({ user_id, _id });

      return contacts;
    } catch (err) {
      console.error(
        `Error finding contact by user_id or _id: ${(user_id, _id)}`,
        err
      );
      throw err;
    }
  }

  async CreateContact(name, email, phone, user_id) {
    try {
      if (!isValidObjectId(user_id)) {
        throw new Error("Invalid user_id");
      }
      const contact = await ContactModel.create({
        name,
        email,
        phone,
        user_id,
      });

      return contact;
    } catch (err) {
      console.error(
        `Error creating contact : ${(user_id, name, email, phone)}`,
        err
      );
      throw err;
    }
  }

  async UpdateContact({ _id, user_id, body }) {
    try {
      if (!isValidObjectId(_id) || !isValidObjectId(user_id)) {
        throw new Error("Invalid contact_id or user_id");
      }

      const updatedContact = await ContactModel.findOneAndUpdate(
        { _id, user_id },
        body,
        { new: true }
      );

      return updatedContact;
    } catch (err) {
      console.error(
        `Error updating contact by user_id and _id: ${(user_id, _id)}`,
        err
      );
      throw err;
    }
  }

  async DeleteContact({ _id, user_id }) {
    try {
      if (!isValidObjectId(_id) || !isValidObjectId(user_id)) {
        throw new Error("Invalid contact_id or user_id");
      }

      const deletedContact = await ContactModel.findOneAndDelete({
        _id,
        user_id,
      });

      return deletedContact;
    } catch (err) {
      console.error(
        `Error deleting contact by user_id and _id: ${(user_id, _id)}`,
        err
      );
      throw err;
    }
  }
}

module.exports = ContactRepository;
