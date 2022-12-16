const express = require("express")
const http = require("http")
const app = express()
// const { Server } = require("socket.io")
const server = http.createServer(app)
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000"
    }
})

app.get("/", (req, res) => {
    res.send("From server : hi !!!")
})
let onlineUsers = []
let addOnlineUser = (data) => {
    console.log(data)
    !onlineUsers.some(user => user.socketId === data.socketId) && onlineUsers.push(data)
    console.log("after adding : ",onlineUsers)
}
let deleteUser = (socketId) => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
    console.log("after deleting : ",onlineUsers)
}

server.listen(3020, () => {
    console.log("server running at port : 3020")
    io.on("connection", (socket) => {
        console.log("user connected : ",socket.id)
        socket.on("disconnect", () => {
            console.log("user disconnected : ",socket.id)
            deleteUser(socket.id)
        })
        socket.on("chat", (data) => {
            console.log("from client : ",data.name)
            addOnlineUser({name: data.name, socketId: socket.id})
        })
        // socket.disconnect()
    })
})
