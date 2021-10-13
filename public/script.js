
let ws = new WebSocket("ws://localhost:5555")
let state = {event:"mov",value:"stop"}
let chat = document.querySelector("#chat")
let mousePad = document.getElementById("mouse")
let cursorLocked = false
let locker = document.getElementById("locker")

function eve(event,value){
    ws.send(JSON.stringify({event,value}))
}
ws.addEventListener("close",e=>{
    location.reload()
})
ws.addEventListener("error",e=>{
    location.reload()
})

addEventListener("keydown",({key})=>{
    if(key == "Enter"){
        eve("msg",chat.value)
        chat.value = ""
    }
    if(document.activeElement == chat) return
    if(key == "w")     eve("mov","forward")
    if(key == "s")     eve("mov","back")
    if(key == "a")     eve("mov","left")
    if(key == "d")     eve("mov","right")
    if(key == "Shift") eve("mov","sneak")
    if(key === " ")    eve("mov","jump")

})
addEventListener("keyup",e=>{
    eve("mov",stop)
    if(e.key == "t"){
        document.exitPointerLock()
        cursorLocked = false
        chat.focus()
    }
})
locker.addEventListener("pointerleave",e=>{
    cursorLocked = false
})
mousePad.addEventListener("click",e=>{
    let tmp = locker.requestPointerLock()
    tmp.then(x=>cursorLocked = true)
})
addEventListener("click",e=>{
    if(cursorLocked){
        if(e.button == 0){
            eve("attack",1)
            console.log("left")
        }
        if(e.button == 2){
            eve("use",1)
            console.log("right")
        }
    }
})
addEventListener("mousemove",e=>{
    if(ws.CLOSED && !cursorLocked)return
    state = {event:"mouse",value:{
        px:e.movementX,
        py:e.movementY
    }}
    let json = JSON.stringify(state)
    ws.send(json)
})