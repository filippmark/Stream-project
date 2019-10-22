interface userInput {
  email: string;
  password: string;
}

interface User {
  email: string;
  password: string;
  _id: string;
}

module.exports = {
  login: async (args: userInput): Promise<User> => {
    const { email, password } = args;

    return {
      email,
      password,
      _id: "kek"
    };
  },

  createNewUser: async (args: userInput): Promise<User> => {
    const { email, password } = args;
    return {
      email,
      password,
      _id: "kek"
    };
  }
};
