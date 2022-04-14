import express from "express";
import http from "http";
import WebSocket from "ws";

const path = require('path');

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname , "/views")); 
app.use('*/js',express.static('public/js'));
app.get("/", (_ ,res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss =  new WebSocket.Server({server});

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    socket.on("close",() => console.log("Disconnected from the browser"));
    socket.on("message",(msg) => {
        const message = JSON.parse(msg);
        console.log(message);
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${sockets["nickname"]}: ${message.payload} `));
                break;
            case "nickname":
                sockets["nickname"] = message.payload;
                break;
        }
    });
});

server.listen(3000, handleListen);