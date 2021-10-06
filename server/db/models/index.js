const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const UsersConversations = require("./users_conversations");
const Reads = require("./reads");

// associations

Conversation.belongsToMany(User, { through: UsersConversations });
Message.belongsToMany(User, { through: Reads });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
};
