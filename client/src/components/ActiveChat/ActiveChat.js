import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Header, Input, Messages } from "./index";
import { connect } from "react-redux";
import { readMessages } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  messagesContainer: {
    maxHeight: "75vh",
    overflow: "auto",
  },
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, updateReadMessages, conversation = {} } = props;

  useEffect(() => {
    if (
      !conversation ||
      !conversation.otherUser ||
      !conversation.messages.some(
        (message) =>
          message.senderId === conversation.otherUser.id && !message.read
      )
    )
      return;

    updateReadMessages(conversation.id, conversation.otherUser.id);
  }, [conversation, updateReadMessages]);

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Box className={classes.messagesContainer}>
              <Messages
                messages={conversation.messages}
                otherUser={conversation.otherUser}
                userId={user.id}
              />
            </Box>
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) =>
          conversation.otherUser.username === state.activeConversation
      ),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateReadMessages: (conversationId, otherUserId) => {
      dispatch(readMessages(conversationId, otherUserId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
