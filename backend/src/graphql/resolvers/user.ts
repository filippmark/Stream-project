const jwt = require("jsonwebtoken");

interface userInput {
  email: string;
  password: string;
}

module.exports = {
  login: async (args: userInput) => {
    const { email, password } = args;
    try{
      let user = User.findOne({where: {email}});
      if (user){
        let isValid = await bcrypt.compare(password, user.password);
        if (isValid){
          const token: string =  jwt.sign(
            { userId: user.id, email: user.email },
            process.env.SECURE_KEY,
            { expiresIn: "1h" })
          return { userId: user.id, token, tokenExpiration: 1 };
        }else{
          throw new Error("Password is incorrect");
        }
      }else{
        throw new Error("There is no such user");
      }
    }catch(err){
      throw err;
    }
  },

  createNewUser: async (args: userInput): Promise<User> => {
    const { email, password } = args;
    try{
      const userReged = await User.findOne({where: {email}});
      if (!userReged){
        const user  = await User.create({email, password});
        return {...user};
      }
      throw new Error("This email is not available for registration")
    }catch(err){
      throw err;
    }
  }
};