import io from "socket.io-client";
import store from "./store";
import {
  addOnlineUser,
  removeOfflineUser,
  setNewMessage,
  updateReadMessages,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    store.dispatch(
      setNewMessage(
        data.message,
        data.sender,
        store.getState().activeConversation
      )
    );
  });

  socket.on("read-conversation", (data) => {
    store.dispatch(updateReadMessages(data.conversationId, data.otherUserId));
  });
});

export default socket;
