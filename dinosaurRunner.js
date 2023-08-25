function drawTheRoad() {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d")
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.moveTo(0, 200)
    ctx.lineTo(600, 200)
    ctx.stroke()
    dinosaur.draw()
}

class dino {
    constructor() {
        this.x = 20
        this.y = 180
        this.vy = 10
        this.width = 20
        this.height = 20
    }
    draw() {
        let canvas = document.getElementById("canvas")
        let ctx = canvas.getContext("2d")
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let dinosaur = new dino()

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)
let spacePressed = false

function keyDownHandler(event) {
    if (event.keyCode === 32) {
        spacePressed = true
        if (spacePressed === true && startGame === false) {
            start()
        }
    }
}

function keyUpHandler(event) {
    if (event.keyCode === 32) {
        spacePressed = false
    }
}

let raf
let jumpAndFall = false

function drawDino() {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawTheRoad()
    ctx.font = "30px serif"
    ctx.fillText("score:" + score, 500, 20)
    dinosaur.draw()
    if ((dinosaur.y === 180 && spacePressed == true) || jumpAndFall == true) {
        jumpAndFall = true
        dinosaur.y -= dinosaur.vy
        dinosaur.vy -= 1.5
    }
    if (dinosaur.y > 160) {
        dinosaur.y = 180
        jumpAndFall = false
        dinosaur.vy = 20
    }
    if (isBlockHit) {
        endGameMenu()
        return
    }
    moveTheObstacles()
    raf = window.requestAnimationFrame(drawDino)
}

let startGame = false
let clearScore

function start() {
    arrayOfBlocks()
    window.cancelAnimationFrame(raf)
    drawDino()
    startGame = true
    clearScore = setInterval(playerScore, 1000)
}

class obstacles {
    constructor() {
        this.randomHeight = Math.floor(Math.random() * 3)
        this.x = 700 
        this.y = 200 - (this.randomHeight + 1) * 20
        this.vx = 7
        this.width = 20
        this.randomBlocks = Math.floor(Math.random() * 3)
    }
    drawTheObstacles() {
        let canvas = document.getElementById("canvas")
        let ctx = canvas.getContext("2d")
        for (let i = 0; i <= this.randomBlocks; ++i) {
            ctx.fillRect(this.x + i * 23, this.y, this.width, 200 - this.y)
        }
    }
}

let blocks = new Array(50)

function arrayOfBlocks() {
    for (let i = 0; i < blocks.length; ++i) {
        blocks[i] = new obstacles()
        blocks[i].x = blocks[i].x + i * 250
    }
}

function moveTheObstacles() {
    for (let i = 0; i < blocks.length; ++i) {
        blocks[i].drawTheObstacles()
        blocks[i].x -= blocks[i].vx
        hitTheBlocks(i)
        if (blocks[blocks.length - 1].x < 0) {
            arrayOfBlocks()
            return
        }
    }
}

let isBlockHit = false

function hitTheBlocks(i) {
    if (((dinosaur.x + dinosaur.width) > blocks[i].x && dinosaur.x < blocks[i].x + blocks[i].width * blocks[i].randomBlocks + blocks[i].width) && ((dinosaur.y + dinosaur.height) > blocks[i].y)) {
        isBlockHit = true
    }
}

let score = 0

function playerScore() {
    ++score
}

let menuBoxX = 150
let menuBoxY = 30
let menuBoxWidth = 250
let menuBoxHeight = 150

let restartBoxX = 190
let restartBoxY = 100
let restartBoxWidth = 150
let restartBoxHeight = 60

let restartX = 210
let restartY = 140

function endGameMenu() {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d")
    ctx.fillStyle = "grey"
    ctx.fillRect(menuBoxX, menuBoxY, menuBoxWidth, menuBoxHeight)
    ctx.fillStyle = "black"
    ctx.font = "35px serif"
    ctx.fillText("Your score:" + score, 180, 70)
    ctx.fillStyle = "white"
    ctx.fillRect(restartBoxX, restartBoxY, restartBoxWidth, restartBoxHeight)
    ctx.fillStyle = "black"
    ctx.font = "40px serif"
    ctx.fillText("Restart", restartX, restartY)
    canvas.addEventListener("click", restartTheGame, true)
}

function restartTheGame(event) {
    let elemLeft = canvas.offsetLeft,
        elemTop = canvas.offsetTop
    let x = event.pageX - elemLeft,
        y = event.pageY - elemTop
    if (x >= restartBoxX && x <= restartBoxX + restartBoxWidth && y >= restartBoxY && y <= restartBoxY + restartBoxHeight) {
        score = 0
        clearInterval(clearScore)
        clearScore = null
        isBlockHit = false
        arrayOfBlocks()
        dinosaur = new dino()
        window.cancelAnimationFrame(raf)
        drawDino()
        clearScore = setInterval(playerScore, 1000)
        canvas.removeEventListener("click", restartTheGame, true)
    }
}

window.onload = drawTheRoad
