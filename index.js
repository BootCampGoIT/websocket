const express = require("express");
const path = require("path");
const WebSocket = require("ws");
const PORT = 3000;
const socketServer = new WebSocket.Server({ port: 3001 });

const messagesArr = [];

socketServer.on("connection", (ws) => {
  ws.on("message", (message) => {
    messagesArr.push(JSON.parse(message));
    socketServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const messageResponse = {
          type: "msg",
          message: JSON.parse(message),
        };
        client.send(JSON.stringify(messageResponse));
      }
    });
  });

  const firstResponse = {
    type: "store",
    messages: messagesArr,
  };

  ws.send(JSON.stringify(firstResponse));
});

const app = express();

app.use("/", express.static(path.resolve(__dirname, "static")));

app.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
