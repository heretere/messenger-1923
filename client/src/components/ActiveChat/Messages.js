import React from "react";
import { Box } from "@material-ui/core";
import { OtherUserBubble, SenderBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const showAvatarMessage = messages
    .filter((message) => message.senderId === userId)
    .find(
      (message, index, arr) =>
        message.read && (index === arr.length - 1 || !arr[index + 1].read)
    );

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
            showAvatar={
              showAvatarMessage && showAvatarMessage.id === message.id
            }
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
