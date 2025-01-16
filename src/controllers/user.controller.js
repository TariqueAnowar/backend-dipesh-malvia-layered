const UserRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

class UserController {
  constructor() {
    this.repository = new UserRepository();
  }

  /**
   * Register a user
   * @desc Register a user
   * @route POST /api/users/register
   * @access public
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @param {string} req.body.username - Username of the user
   * @param {string} req.body.password - Password of the user
   * @param {string} req.body.email - Email of the user
   */
  RegisterUser = async (req, res, next) => {
    try {
      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        throw new ApiError(httpStatus.BAD_REQUEST, "All fields are mandatory");
      }

      const userAvailable = await this.repository.FindByEmail(email);

      if (userAvailable) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
      }

      // Hash the password before saving to the database
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await this.repository.CreateUser(
        username,
        hashedPassword,
        email
      );

      if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user data");
      }

      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Login a user
   * @desc Login a user
   * @route POST /api/users/login
   * @access public
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @param {string} req.body.email - Email of the user
   * @param {string} req.body.password - Password of the user
   */
  LoginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Missing input or fields");
      }

      const user = await this.repository.FindByEmail(email);

      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
          {
            user: {
              id: user.id,
              email: user.email,
            },
          },
          config.jwt.secret,
          { expiresIn: config.jwt.accessExpirationMinutes }
        );

        res.status(200).json({
          user: {
            role: "",
            username: user.username,
            name: "",
            email: user.email,
            isEmailVerified: "false",
            id: user.id,
          },
          tokens: {
            access: {
              token: accessToken,
              expires: config.jwt.accessExpirationMinutes,
            },
            refresh: {
              token: "",
              expires: "",
            },
          },
        });
      } else {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Invalid email or password"
        );
      }
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get current user from DB
   * @desc Current user from DB
   * @route GET /api/users/currentUser
   * @access private
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  CurrentUser = async (req, res, next) => {
    try {
      const email = req.user.email;
      const user = await this.repository.FindByEmail(email);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }
      res.status(200).json({ currentUser: user });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Get current user token
   * @desc Current user token
   * @route GET /api/users/currentToken
   * @access private
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  CurrentToken = async (req, res, next) => {
    try {
      res.status(200).json({ currentToken: req.user });
    } catch (err) {
      next(err);
    }
  };

  // ... other controller methods
}

module.exports = UserController;
