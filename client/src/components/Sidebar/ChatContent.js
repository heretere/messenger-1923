import React from "react";
import { Badge, Box, styled, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  previewTextBold: {
    fontSize: 12,
    letterSpacing: -0.17,
    fontWeight: 600,
  },
}));

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    top: 22,
    right: 25,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, unreadCount = 0 } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={
            unreadCount > 0 ? classes.previewTextBold : classes.previewText
          }
        >
          {latestMessageText}
        </Typography>
      </Box>
      <StyledBadge color="primary" badgeContent={unreadCount} />
    </Box>
  );
};

export default ChatContent;
