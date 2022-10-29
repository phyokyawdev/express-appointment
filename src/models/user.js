const mongoose = require("mongoose");
const passwordService = require("../services/password");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "patient"],
      default: "patient",
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await passwordService.hash(this.get("password"));
    this.set("password", hashedPassword);
  }
  next();
});

UserSchema.methods.isValidPassword = async function (payload) {
  const isValid = await passwordService.compare(payload, this.password);
  return isValid;
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
