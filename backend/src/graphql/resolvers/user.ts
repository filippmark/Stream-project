import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { User } from "../../models/User";

interface IUserInput {
  email: string;
  password: string;
}

interface ILogin {
  userId: number;
  token: string;
  tokenExpiration: number;
}

interface IUser {
  id: number;
  email: string;
  password: string;
}

export const login = async (args: {
  userInput: IUserInput;
}): Promise<ILogin> => {
  const { email, password } = args.userInput;
  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      console.log(password);
      console.log(user);
      let isValid = await bcrypt.compare(password, user.dataValues.password);
      console.log(isValid);
      if (isValid) {
        const token: string = jwt.sign(
          { userId: user.dataValues.id, email: user.email },
          "filimon777",
          { expiresIn: "1h" }
        );
        return { userId: user.dataValues.id, token, tokenExpiration: 1 };
      } else {
        throw new Error("Password is incorrect");
      }
    } else {
      throw new Error("There is no such user");
    }
  } catch (err) {
    throw err;
  }
};

export const createNewUser = async (args: {
  userInput: IUserInput;
}): Promise<IUser> => {
  const { email, password } = args.userInput;
  console.log(email);
  try {
    const userReged = await User.findOne({ where: { email } });
    if (!userReged) {
      const user = await User.create({ email, password });
      console.log(user);
      return { ...user.dataValues, password: null };
    }
    throw new Error("This email is not available for registration");
  } catch (err) {
    throw err;
  }
};
