const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  // body: Joi.object().keys({
  //   email: Joi.string().required().email(),
  //   password: Joi.string().required().custom(password),
  //   name: Joi.string().required(),
  //   role: Joi.string().required().valid("user", "admin"),
  // }),
};

const getUsers = {
  // query: Joi.object().keys({
  //   name: Joi.string(),
  //   role: Joi.string(),
  //   sortBy: Joi.string(),
  //   limit: Joi.number().integer(),
  //   page: Joi.number().integer(),
  // }),
};

const getUser = {
  // params: Joi.object().keys({
  //   userId: Joi.string().custom(objectId),
  // }),
};

const updateUserSchema = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const updateProfileSchema = {
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUserSchema = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUserSchema,
  deleteUserSchema,
  updateProfileSchema,
};
