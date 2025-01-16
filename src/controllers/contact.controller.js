const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const ContactRepository = require("../repositories/contact.repository");

class ContactController {
  constructor() {
    this.repository = new ContactRepository();
  }

  /**
   * Get all contacts
   * @desc Get all contacts
   * @route GET /api/contacts
   * @access private
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  GetContacts = async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const contacts = await this.repository.FindByUserId(user_id);
      res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Create new contact
   * @desc Create a new contact
   * @route POST /api/contacts
   * @access private
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @param {string} req.body.name - Name of the contact
   * @param {string} req.body.email - Email of the contact
   * @param {string} req.body.phone - Phone number of the contact
   */
  CreateContact = async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;

      if (!name || !email || !phone) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Missing input or fields");
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

  /**
   * Get contact by id
   * @desc Get a contact by its ID
   * @route GET /api/contacts/:id
   * @access private
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @param {string} req.params.id - ID of the contact
   */
  GetContact = async (req, res, next) => {
    try {
      const contact = await this.repository.FindById({
        _id: req.params.id,
        user_id: req.user.id,
      });

      if (!contact) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Contact not found or user doesn't have permission"
        );
      }

      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Update contact by id
   * @desc Update a contact by its ID
   * @route PUT /api/contacts/:id
   * @access private
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @param {string} req.params.id - ID of the contact
   * @param {Object} req.body - Updated contact information
   * @param {string} [req.body.name] - Updated name of the contact
   * @param {string} [req.body.email] - Updated email of the contact
   * @param {string} [req.body.phone] - Updated phone number of the contact
   */
  UpdateContact = async (req, res, next) => {
    try {
      const { name, email, phone } = req.body;

      if (!name && !email && !phone) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Missing input or fields");
      }

      const updatedContact = await this.repository.UpdateContact({
        _id: req.params.id,
        user_id: req.user.id,
        body: req.body,
      });

      if (!updatedContact) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Contact not found or user doesn't have permission"
        );
      }

      res.status(200).json(updatedContact);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Delete contact by id
   * @desc Delete a contact by its ID
   * @route DELETE /api/contacts/:id
   * @access private
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @param {string} req.params.id - ID of the contact
   */
  DeleteContact = async (req, res, next) => {
    try {
      if (!isValidObjectId(req.params.id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid contact id");
      }

      const deletedContact = await this.repository.DeleteContact({
        _id: req.params.id,
        user_id: req.user.id,
      });

      if (!deletedContact) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Contact not found or user doesn't have permission"
        );
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
