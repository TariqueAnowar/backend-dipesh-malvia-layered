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
      throw new Error(err);
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
      throw new Error(err);
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
      throw new Error(err);
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
      throw new Error(err);
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
      throw new Error(err);
    }
  }
}

module.exports = ContactRepository;
