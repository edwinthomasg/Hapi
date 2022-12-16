import React, { useEffect, useState } from "react";
import {io} from "socket.io-client"
const SocketComponent = () => {
    const [socket, setSocket] = useState("")
    const [name, setName] = useState("")
    useEffect(() => {
        setSocket(io("http://localhost:4000"))
    },[])
    useEffect(() => {
        console.log("socket: ",socket)    
    },[socket])
    const changeHandler = (event) => {
        setName(event.target.value)
    }
    const submitHandler = () => {
        console.log("socket at submit : ",socket)
        if(socket)
        socket.emit("chat", {name})
    }
    const logoutHandler = () => {
        if(socket)
        socket.disconnect()
    }
    return(<>
        <p>Hello World</p>
        <input type="text" value={name} onChange={changeHandler}></input>
        <input type="button" value="submit" onClick={submitHandler}></input>
        <input type="button" value="logout" onClick={logoutHandler}></input>
    </>)
}

export default SocketComponent