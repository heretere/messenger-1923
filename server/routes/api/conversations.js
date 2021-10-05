const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, fn, col } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const messagesRouter = require("./messages");

// expects conversionId param to be passed in from url
// updates all messages not sent by user to read = true
router.put("/:conversationId/messages", async (req, res, next) => {
  try {
    if (!req.user) return res.sendStatus(401);
    const { conversationId } = req.params;

    const convo = await Conversation.findOne({
      where: {
        [Op.or]: {
          user1Id: req.user.id,
          user2Id: req.user.id,
        },
        [Op.and]: {
          id: conversationId,
        },
      },
    });

    if (!convo) return res.sendStatus(401);

    await Message.update(
      { read: true },
      {
        where: {
          conversationId: conversationId,
          senderId: {
            [Op.not]: req.user.id,
          },
        },
      }
    );

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      convoJSON.otherUser.online = onlineUsers.includes(convoJSON.otherUser.id);

      // set properties for notification count and latest message preview
      const latestMessage = convoJSON.messages[convoJSON.messages.length - 1];
      convoJSON.latestMessageText = latestMessage.text;
      convoJSON.latestMessageTime = Date.parse(latestMessage.createdAt);
      conversations[i] = convoJSON;

      //set unread count
      convoJSON.unreadCount = await Message.count({
        where: {
          conversationId: {
            [Op.eq]: convoJSON.id,
          },
          senderId: {
            [Op.not]: userId,
          },
          read: {
            [Op.eq]: false,
          },
        },
      });
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
