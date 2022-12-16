const hapi = require("@hapi/hapi")
const Joi = require("joi")
const payloadSchema = Joi.object({
    username: Joi.string().min(2).max(15).required(),
    password: Joi.string().min(8).max(15).required()
})

const init = async() => {
    const server = hapi.server({
        port: 4000,
        host: "localhost",
        routes: {
            cors: true,
        }
    })
    const io = require("socket.io")(server.listener, {
        cors: {
            origin: "http://localhost:3000",
          }
    })
    io.on("connection", (socket) => {
        console.log("user connected")
    } )
    await server.start()
    console.log("server running on %s",server.info.uri)

    server.route({
        method: "GET",
        path: "/",
        handler: (req, res) => {
            return "Server ready"
        }
    })

    server.route({
        method: "POST",
        path: "/login",
        handler: (req, res) => {
            return req.payload.username
        },
        options: {
            validate: {
              payload: Joi.object({
                username: Joi.string().min(2).max(15).required(),
                password: Joi.string().min(8).max(15)
              }),
              options:{
                allowUnknown: true
              }
            },
        
        }
    })

   
}

init()