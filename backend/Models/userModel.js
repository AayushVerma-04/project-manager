const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userProjects: [{ type: mongoose.Types.ObjectId, ref: "Project" }],
  otherProjects: [{ type: mongoose.Types.ObjectId, ref: "Project" }],
  tasks: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
  tags: [{ type: String, lowercase: true, trim: true }],
}, { timestamps: true });


userSchema.statics.signup = async function (username, email, password) {
  if (!email || !password || !username) {
    throw Error("All fields are required");
  }
  if (validator.isNumeric(username)) {
    throw Error("Username cannot be a number");
  }
  if (!validator.isEmail(email)) {
    throw Error("Enter a valid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  email = email.toLowerCase();

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use!");
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const newUser = { username, email, password: hashed, tasks: [] };
  const user = await this.create(newUser);

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw Error("Enter a valid email");
  }
  email = email.toLowerCase();

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Email does not exist");
  }

  const hashed = user.password;
  const comp = await bcrypt.compare(password, hashed);
  if (!comp) {
    throw Error("Incorrect password");
  }

  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User