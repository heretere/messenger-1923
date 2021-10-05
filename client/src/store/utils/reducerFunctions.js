export const addMessageToStore = (state, payload) => {
  const { message, sender, activeConversation } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    newConvo.latestMessageTime = Date.parse(message.createdAt);
    newConvo.unreadCount = 1;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.latestMessageTime = Date.parse(message.createdAt);

      if (
        activeConversation &&
        activeConversation !== convoCopy.otherUser.username
      )
        convoCopy.unreadCount += 1;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateReadCountToStore = (state, payload) => {
  const { conversationId, otherUserId } = payload;

  return state.map((convo) => {
    if (convo.id !== conversationId) return convo;
    const convoCopy = { ...convo };
    let updated = false;
    convoCopy.messages = convoCopy.messages.map((message) => {
      if (message.senderId === otherUserId && !message.read) {
        updated = true;
        return { ...message, read: true };
      } else return message;
    });
    convoCopy.unreadCount = 0;
    return updated ? convoCopy : convo;
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.latestMessageTime = Date.parse(message.createdAt);
      convoCopy.unreadCount = 0;
      return convoCopy;
    } else {
      return convo;
    }
  });
};
