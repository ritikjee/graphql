import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import { authenticate } from "../middleware/auth-middleware";

export const authRootValue = {
  register: async ({
    name,
    email,
    userName,
    password,
  }: {
    name: string;
    email: string;
    userName: string;
    password: string;
  }) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!emailRegex.test(email)) {
      throw new Error("Invalid email");
    }

    if (!passwordRegex.test(password)) {
      throw new Error(
        "Password must contain at least 8 characters, including uppercase, lowercase letters and numbers"
      );
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userExists = await db.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            userName,
          },
        ],
      },
    });

    if (userExists) {
      throw new Error("User already exists");
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        userName,
        password: hashedPassword,
      },
    });

    if (!user) {
      throw new Error("User not created");
    }

    return {
      id: user.id,
      username: user.userName,
    };
  },

  login: async ({
    identifier,
    password,
  }: {
    identifier: string;
    password: string;
  }) => {
    const user = await db.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            userName: identifier,
          },
        ],
      },
    });
    if (!user) {
      throw new Error("No such user found");
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      throw new Error("Invalid password");
    }

    const token = jsonwebtoken.sign(
      { id: user.id, username: user.userName },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10d",
      }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.userName,
      },
    };
  },

  getUserInfo: authenticate(async (parent, args, context) => {
    return {
      id: context.user?.id,
      username: context.user?.userName,
    };
  }),
};
