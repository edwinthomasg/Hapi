"use strict" // to fix mistakes

const hapi = require("@hapi/hapi")
const joi = require("joi")
const path = require("path")
const Boom = require("@hapi/boom")
const qs = require("qs")

const dataSchema = joi.object({
    name: joi.string().min(2).max(20),
    age: joi.number().min(18).max(60),
    company: joi.string()
})
const customPlugin = {
    name: "customPlugin",
    version: "1.0.0",
    register: async function(server, options){
        server.route({
            method: "GET",
            path: "/home",
            handler: (req, res) => {
                return `Hi from custom plugin, ${options.name}`
            }
        })
        server.decorate("toolkit", "customPlugin");
        await setTimeout(() => {
            console.log("Log statement inside set timeout")
        },3000)
        console.log("All the task has been completed.")
    }  
}

const init = async () => {
    const server = hapi.Server({
        port: 3030,
        host: "localhost",
        routes: {
            files: {
                relativeTo: path.join(__dirname,"public")
            }
        },
        query: {
            parser: (query) => {
                return qs.parse(query)
            }
        }
    })
    await server.start()
    console.log(`Server running on ${server.info.uri}`)

    //configuring cookie
    server.state("username",{
        ttl: null,
        isSecure: true,
        isHttpOnly: true
    })
    
    // to load the custom plugin and can pass args in options
    await server.register({
        plugin: customPlugin,
        options: {
            name: "edwin"
        }
    })

    // extension points - it will redirect all the route lookup to specified path
    // server.ext("onRequest", function (request, h) {

    //     request.setUrl("/data/json");
    //     return h.continue;
    // });
    
    server.route({
        method: "GET",
        path: "/",
        handler: (req, res) => 
        {
            return "Get started with hapi js!"
        }
        
    })

    server.route({
        method: "GET",
        path: "/user/{id?}",
        handler: (req, res) => 
        {
            let userId = req.params.id ? req.params.id : "No User Id"
            return userId
        }
        
    })

    server.route({
        method: "GET",
        path: "/user-profile",
        handler: (req, res) => 
        {
           return "Hi User"
        }
        
    })

    server.route({
        method: "GET",
        path: "/userprofile",
        handler: (req, res) => 
        {
           return res.redirect("/user-profile")
        }
    })
    // hapi by default return the result in json for js object
    server.route({
        method: "GET",
        path: "/data/json",
        handler: (req, res) => {
            let user = {
                name: "edwin",
                age: 22,
                company: "aspire systems"
            }
            return user
        },
        options: {
            response: {
                schema: dataSchema,
               
            }
        }
    })
    // with joi validation
    server.route({
        method: "POST",
        path: "/login",
        handler: (req, res) => {
            console.log(req.payload)
            return req.payload.email
        },
        options: {
          validate: {
            payload: joi.object({
                username: joi.string().min(2).max(10).required(),
                email: joi.string().required(),
                password: joi.string().required()
            }),
            options: {
                allowUnknown: true
            }
          }  
        }
    })
    await server.register(require("@hapi/vision"))
    server.views({
        engines: {
            ejs: require("ejs"),
            pug: require("pug")
        },
        relativeTo: `${__dirname}/template-engine`,
        path: "views"
    })

    //render templates
    server.route({
        method: "GET",
        path: "/template-engine/ejs",
        handler: (req, res) => {
            return res.view("demo.ejs", {
                name: "edwin",
                age: 22
            })
        }
    })
        //render templates
        server.route({
            method: "GET",
            path: "/template-engine/pug",
            handler: (req, res) => {
                return res.view("demo.pug", {
                    name: "edwin",
                    age: 22
                })
            }
        })

    await server.register(require("@hapi/inert"))
    //serving static files
    server.route({
        method: "GET",
        path: "/file/{filename}",
        // handler: (req, res) => {
        //     return res.file("friends.jpg")
        // },
        // or 
        handler: {
            file: function(req){
                return req.params.filename
            }
        }
    })
    //serving static files from public folder
    server.route({
        method: "GET",
        path: "/files/{path*}",
        handler: {
            directory: {
                path: "."
            }
        }
    })

    server.route({
        method: "GET",
        path: "/records",
        handler: (req, res) => {
            throw Boom.notFound("No records found")
        }
    })

    server.route({
        method: "GET",
        path: "/product/{id*}",
        handler: (req, res) => {
            let result = req.params.id.split('/')
            return `Id 1 : ${result[0]} \n Id 2 : ${result[1]} \n Id 3 : ${result[2]} \n Id 4 : ${result[3]}`
        }
    })

    // working with query params for simple
    server.route({
        method: "GET",
        path: "/phone",
        handler: (req, res) => {
            return req.query
        }
    })
    
    //404 page not found error handling
    server.route({
        method: "*",
        path: "/{any*}",
        handler: (req, res) => {
            return res.response("No page found").code(404)
        }
    })
}


process.on("unhandledRejection", (err) => {
    console.log(err)
    process.exit()
})

init()