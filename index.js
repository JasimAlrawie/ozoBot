const mineflayer = require("mineflayer")
// const mc = require("minecraft-data")
const {WebSocketServer} = require("ws")
const express = require("express")

let web = express()
web.use(express.static("./public"))

let bot = mineflayer.createBot({
    username:"ozo",
    host:"localhost"
})
let ws = new WebSocketServer({
    port:5555
})

ws.on("connection",e=>{
    console.log("client connected")
    e.on("message",c=>{
        let state = JSON.parse(c.toString())
        if(state.event == "mov"){
            bot.controlState.forward = state.value == "forward"
            bot.controlState.back =    state.value == "back"
            bot.controlState.left =    state.value == "left"
            bot.controlState.right =   state.value == "right"
            bot.controlState.jump =    state.value == "jump"
            bot.controlState.sneak =   state.value == "sneak"
        }
        if(state.event == "msg"){
            bot.chat(state.value)
        }
        if(state.event == "mouse"){
            let {px,py} = state.value
            bot.entity.pitch -= py/250
            bot.entity.yaw -= px/400
        }
        if(state.event == "attack"){
            let bac = bot.blockAtCursor()
            if(bac)bot.dig(bac)
        }
        if(state.event == "use"){
            // idk ¯\_(ツ)_/¯
            // let refblock = bot.blockAtCursor()
            // bot.placeBlock(refblock,refblock.position)
        }
    })
})
web.listen(8888,e=>{
    console.log("server started at http://localhost:8888")
})
