import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Avatar, Badge, Box, styled, Typography} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
    date: {
        fontSize: 11,
        color: "#BECCE2",
        fontWeight: "bold",
        marginBottom: 5,
    },
    text: {
        fontSize: 14,
        color: "#91A3C0",
        letterSpacing: -0.2,
        padding: 8,
        fontWeight: "bold",
    },
    bubble: {
        background: "#F4F6FA",
        borderRadius: "10px 10px 0 10px",
    },
    avatar: {
        height: 30,
        width: 30,
        marginTop: 6,
    },
}));

const StyledBadge = styled(Badge)(() => ({
    "& .MuiBadge-badge": {
        top: 22,
        right: 200,
    },
}));

const SenderBubble = (props) => {
    const classes = useStyles();
    const {time, text, showAvatar, otherUser} = props;
    return (
        <Box className={classes.root}>
            <Typography className={classes.date}>{time}</Typography>
            <Box className={classes.bubble}>
                <Typography className={classes.text}>{text}</Typography>
            </Box>
            {showAvatar && <Avatar className={classes.avatar} alt={otherUser.username} src={otherUser.photoUrl}/>}
        </Box>
    );
};

export default SenderBubble;
