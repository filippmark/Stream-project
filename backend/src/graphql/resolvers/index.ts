const userResolvers = require("./user");
const chatRoomResolvers = require("./chatRoom");

module.exports = {
  ...userResolvers,
  ...chatRoomResolvers
};
