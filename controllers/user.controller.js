require("dotenv").config();
const UserRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserController {
  constructor() {
    this.repository = new UserRepository();
  }

  //@desc Register a user
  //@route POST /api/users/register
  //@access public
  RegisterUser = async (req, res, next) => {
    try {
      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        res.status(400);
        throw new Error("All fields are mandatory");
      }

      const userAvailable = await this.repository.FindByEmail(email);

      if (userAvailable) {
        res.status(400);
        throw new Error("User already exists");
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
        res.status(400);
        throw new Error("Invalid user data");
      }

      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  //@desc Login a user
  //@route POST /api/users/login
  //@access public
  LoginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error("Missing input/fields");
      }

      const user = await this.repository.FindByEmail(email);

      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
          {
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.status(200).json({ accessToken });
      } else {
        res.status(401);
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      next(err);
    }
  };

  //@desc Current user
  //@route GET /api/users/currentUser
  //@access private
  CurrentUser = async (req, res, next) => {
    try {
      const email = req.user.email;
      const user = await this.repository.FindByEmail(email);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  //@desc Current user token
  //@route GET /api/users/currentToken
  //@access private
  CurrentToken = async (req, res, next) => {
    try {
      res.status(200).json(req.user);
    } catch (err) {
      next(err);
    }
  };

  // ... other controller methods
}

module.exports = UserController;
