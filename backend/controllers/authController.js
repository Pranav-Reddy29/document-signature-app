const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } =
      req.body;

    const existingUser =
      await prisma.user.findUnique({
        where: { email },
      });

    if (existingUser) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          password:
            hashedPassword,
        },
      });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token:
        generateToken(user.id),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await prisma.user.findUnique({
        where: { email },
      });

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token:
          generateToken(user.id),
      });
    }

    res.status(401).json({
      message:
        "Invalid Credentials",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};