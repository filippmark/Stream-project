import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { User } from "../../models/User";
import { Op } from "sequelize";
import { isEmail } from "validator";

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

export const login = async (
  parent: any,
  args: {
    userInput: IUserInput;
  }
): Promise<ILogin> => {
  const { email, password } = args.userInput;
  try {
    if (isEmail(email)) {
      let user = await User.findOne({ where: { email } });
      if (user) {
        let isValid = await compare(password, user.dataValues.password);
        if (isValid) {
          const token: string = sign(
            { userId: user.dataValues.id, email: user.email },
            "filimon777"
          );
          return { userId: user.dataValues.id, token, tokenExpiration: 1 };
        } else {
          throw new Error("Password is incorrect");
        }
      } else {
        throw new Error("There is no such user");
      }
    } else {
      throw new Error("There is incorrect email");
    }
  } catch (err) {
    throw err;
  }
};

export const createNewUser = async (
  parent: any,
  args: {
    userInput: IUserInput;
  }
): Promise<IUser> => {
  const { email, password } = args.userInput;
  try {
    if (isEmail(email)) {
      const userReged = await User.findOne({ where: { email } });
      if (!userReged) {
        const user = await User.create({ email, password });
        console.log(user);
        return { ...user.dataValues, password: null };
      }
      throw new Error("This email is not available for registration");
    } else {
      throw new Error("This email is incorrect");
    }
  } catch (err) {
    throw err;
  }
};

export const usersByEmail = async (
  parent: any,
  args: { partOfName: string }
): Promise<[IUser]> => {
  try {
    const users = User.findAll({
      where: { email: { [Op.like]: `%${args.partOfName}%` } }
    });
    return users.map((user: { dataValues: any }) => {
      return { ...user.dataValues, password: null };
    });
  } catch (error) {
    throw error;
  }
};
