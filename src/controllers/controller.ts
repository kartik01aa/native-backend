import { NextFunction, RequestHandler, Response } from "express";
import { User, Category } from "../models/schema";
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import Jwt from "jsonwebtoken";
import { ICategory } from "../../types";
import { AuthRequest } from "../middleware/checkAuth";

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const pass: RegExp =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;

    // check input for correctness
    if (!pass.test(password.toString()))
      return res.status(400).json({
        msg: "Enter valid password with uppercase, lowercase, number & @",
      });
    if (!expression.test(email.toString()))
      return res.status(400).json({ msg: "Enter valid email" });

    const existinguser = await User.findOne({ email });

    if (existinguser) {
      return res.status(407).json({ message: "User already Exist" });
    }
    // password hashing
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password.toString(), salt);
    await new User({ name, email, password: hashPassword }).save();

    res.status(200).json({ msg: "New user registered" });
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existinguser = await User.findOne({ email });
    // console.log(existinguser,"Email  ",email)
    //if user is not found
    if (!existinguser) {
      return res.status(407).json({ message: "User not Exist" });
    }
    const isMatch = compareSync("" + password, existinguser.password);
    //if password doens't match
    if (!isMatch) {
      return res.status(407).json({ message: "Password not match" });
    }
    const id = existinguser._id;
    let refereshToken = "",
      AccessToken = "";

    refereshToken = await Jwt.sign(
      { id },
      process.env.JWT_REFRESH_SECRET_KEY!,
      {
        expiresIn: "2h",
      }
    );
    AccessToken = await Jwt.sign({ id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "30m",
    });
    res.cookie("authToken", AccessToken, { httpOnly: true });
    res.cookie("refreshToken", refereshToken, { httpOnly: true });

    res.status(201).json({
      refereshToken,
      AccessToken,
      message: "User logged in successfully",
    });

    next();
  } catch (err) {
    res.status(407).json({ message: err });
  }
};

export const getAllCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { user } = req;
    const category = await Category.find({ user: user }).exec();
    console.log(category);
    res.status(200).json({ category });
  } catch (err) {
    res.status(407).json({ message: err });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { color, icon, isEditable, name }: ICategory = req.body;
    const { user } = req;
    console.log(user);

    const category = await Category.create({
      color,
      icon,
      isEditable,
      name,
      user,
    });
    console.log(category);
    return res.status(200).json({ category });
  } catch (err) {
    res.status(407).json({ message: err });
  }
};
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await Category.deleteMany({ _id: id });
    return res.status(200).json({ msg: "Category deleted" });
  } catch (err) {
    res.status(407).json({ message: err });
  }
};
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { _id, color, icon, isEditable, name }: ICategory = req.body;

    await Category.updateOne(
      { _id },
      {
        $set: {
          name,
          color,
          icon,
          isEditable,
        },
      }
    );
    return res.status(200).json({ msg: "Category updated" });
  } catch (err) {
    res.status(407).json({ message: err });
  }
};
