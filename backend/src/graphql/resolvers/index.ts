const userResolvers = require("./user");
const chatRoomResolvers = require("./chatRoom");

export = {
  ...userResolvers,
  ...chatRoomResolvers
};
