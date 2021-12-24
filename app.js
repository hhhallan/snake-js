const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Variables
vx = 10; // Vitesse sur X
vy = 0; // Vitesse sur Y
let appleX = 0;
let appleY = 0;
let score = 0
let bugDir = false;
let stopGame = false;

let snake = [
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150},
];

// ANIMATION
function animation() {

    if (stopGame === true) {

    } else {

        setTimeout(function () {
            bugDir = false;

            resetCanvas();
            drawApple();
            moveSnake();

            drawSnake();

            animation();

        }, 100);
    }


}
animation();
generateApple();

function resetCanvas() {
    context.fillStyle = "white";
    context.strokeStyle = "black";

    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

// POMME
function randomApple() {
    return Math.round((Math.random() * 290) / 10) * 10;
}

function generateApple() {
    appleX = randomApple();
    appleY = randomApple();

    snake.forEach((part) => {
        const snakeOnApple = part.x === appleX && part.y === appleY;

        if (snakeOnApple) generateApple();
    })
}

function drawApple() {

    context.fillStyle = "red";
    context.strokeStyle = "darkred";
    context.beginPath();
    context.arc(appleX + 5, appleY + 5, 5, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

}

// CORPS
function drawBodyPart(bodyPart) {

    context.fillStyle = "#00fe14";
    context.strokeStyle = "black";
    context.fillRect(bodyPart.x, bodyPart.y, 10, 10);
    context.strokeRect(bodyPart.x, bodyPart.y, 10, 10);

}

function drawSnake() {
    snake.forEach(bodyPart => {
        drawBodyPart(bodyPart);
    })
}


// DEPLACEMENT
function moveSnake() {

    const head = {x: snake[0].x + vx, y: snake[0].y + vy};
    snake.unshift(head);

    if (gameOver(snake[0])) {
        // return restart();
        snake.shift(head);
        restart();
        stopGame = true;
        return;
    }

    const snakeEatApple = snake[0].x === appleX && snake[0].y === appleY
    if (snakeEatApple) {
        score++;
        document.getElementById('score').innerHTML = score;
        generateApple();
    } else {
        snake.pop();
    }
}

function changeDir(event) {

    if (bugDir) return;
    bugDir = true;

    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const BOTTOM_KEY = 40;
    const LEFT_KEY = 37;

    const dir = event.keyCode;

    const goUp = vy === -10;
    const goBottom = vy === 10;
    const goRight = vx === 10;
    const goLeft = vx === -10;

    if (dir === UP_KEY && !goBottom) {vx = 0; vy = -10}
    if (dir === BOTTOM_KEY && !goUp) {vx = 0; vy = 10}
    if (dir === RIGHT_KEY && !goLeft) {vx = 10; vy = 0}
    if (dir === LEFT_KEY && !goRight) {vx = -10; vy = 0}
}

function gameOver(head) {

    let snakeWoHead = snake.slice(1, -1);
    let bit = false;

    snakeWoHead.forEach(part => {
        if (part.x === head.x && part.y === head.y) {
            bit = true;
        }
    })

    let GAME_OVER = false;
    if (bit || head.x === -10 || head.x === canvas.width || head.y === -10 || head.y === canvas.height) {
        GAME_OVER = true;
    }

    return GAME_OVER;
}

// TOUCHE EVENTS
document.addEventListener('keydown', changeDir);

// RESTART
function restart() {
    const restart = document.getElementById('restart');
    restart.style.display = "block";

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 32) document.location.reload(true);
    })
}