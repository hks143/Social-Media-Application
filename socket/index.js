const PORT = process.env.PORT || 8900

const io = require("socket.io")(PORT, {
  cors: {
    origin: '*',
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    // console.log(userId);
    addUser(userId, socket.id);
    // console.log(users);
    io.emit("getUsers", users);
  });

 
socket.on("SendComment",({ID,comment})=>{
   io.emit("getComment",{
     ID,
     comment
   });
})
  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    // console.log(user);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
  socket.on("IncrementBadge",({ID,liker,remove,isLike})=>{
       io.emit("IncrementBadge",{
            ID,
            liker,
            remove,
            isLike

       })
  })
socket.on("ChangeFollower",({number})=>{
   io.emit("ChangeFollower",{
      number
   })
})
  socket.on("PushNotification",({notification,receiver,createdAt})=>{
      io.emit("PushNotification",{
        notification,
        receiver,
        createdAt
      })
  })
  socket.on("ONLINE",({receiver})=>{
     io.emit("ONLINE",{
        receiver
     })
  })
  socket.on("TypingSend",({id,temp})=>{
    const user = getUser(id);
    // console.log(temp);
      io.to(user?.socketId).emit("TypingReceive",temp);
  })
  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});