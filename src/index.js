//Work with canvas
let gameField = document.querySelector('#gameField');
var ctx = gameField.getContext('2d');

let nCells = 20;
let grid = gameField.width / nCells;

let count = 0;
let speed = 15;

let apple = {
    x: 10 * grid,
    y: 11 * grid,
}

let snake = {
    x: 10 * grid,
    y: 10 * grid,
    dx: 0,
    dy: 0,
    maxCells: 4,
    cells: [],
}

//Radiuses for design snake
let r_max = grid / 2 - 1;
let r_min = grid / 2 - 10;

//Draw game for start web page
function drawGame() {
    drawField();
    drawSnake();
    drawApple();
}

function drawField() {
    //boundaries
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(500, 0);
    ctx.lineTo(500, 500);
    ctx.lineTo(0, 500);
    ctx.lineTo(0, 0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(88, 0, 255)';
    ctx.stroke();

    //grid
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'rgba(88, 0, 255, 0.6)';
    for(let i = 1; i < nCells; i++) {
        ctx.beginPath();
        ctx.moveTo(i * grid, 0);
        ctx.lineTo(i * grid, 500);
        ctx.stroke();
    }
    for(let i = 1; i < nCells; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * grid);
        ctx.lineTo(500, i * grid);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.x += grid / 2;
    snake.y += grid / 2;

    for(let i = 0; i < snake.maxCells; i++) {
        snake.cells.push({x: snake.x, y: snake.y - i * grid});
        drawSnakePart(i);
    }
}

function drawSnakePart(i) {
    let x = snake.cells[i].x;
    let y = snake.cells[i].y;
    let dr = (r_max - r_min) / snake.maxCells;
    let r = r_max - i * dr;

    gradient = ctx.createRadialGradient(x, y, r, x, y, r/2);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "#00c4ff");

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = "blue";
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawApple() {
    apple.x = getRandomCoord();
    apple.y = getRandomCoord();

    drawRandomApple();
}

function getRandomCoord() {
    return (Math.floor(Math.random() * nCells) * grid) + grid/2;
}

function drawRandomApple() {
    //Check is apple in snake cells
    let isOnSnake = true;
    while(isOnSnake) {
        isOnSnake = false;
        snake.cells.forEach( (cell, index) => {
            if(cell.x == apple.x && cell.y == apple.y) {
                isOnSnake = true;
                apple.x = getRandomCoord();
                apple.y = getRandomCoord();
            }
        })
    }

    //draw apple
    let r = grid / 2 - 2;
    gradient = ctx.createRadialGradient(apple.x, apple.y, r, apple.x, apple.y, r-7);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "yellow");

    ctx.beginPath();
    ctx.arc(apple.x, apple.y, r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = gradient;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = "red";
    ctx.fill();
    ctx.shadowBlur = 0;
}

//Functions for game
//Start game
let timerId, animId;
window.addEventListener('keydown', startGame);
window.addEventListener('keydown', controlSnake);

function startGame(event) {
    if(event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 40) {
        window.removeEventListener('keydown', startGame);
        timerId = window.setInterval(timer, 1000);
        playGame();

        document.getElementById('buttonPause').classList.add('activeButton');
        document.getElementById('buttonNewGame').classList.add('activeButton');
        document.getElementById('buttonDiff').classList.remove('activeButton');
        document.getElementById('buttonResult').classList.remove('activeMenu');
        document.getElementById('buttonRules').classList.remove('activeMenu');
        document.getElementById("myDrop").classList.remove("show");
        closeRules();
        closeResult();
        pauseMessage.close();
    }
}

//Timer Format
function timer() {
    let min = document.getElementById('min');
    let sec = document.getElementById('sec');

    let newSec = sec.innerHTML;
    let newMin = min.innerHTML;

    newSec++;
    if(newSec == 60) {
        newMin++;
        if(newMin < 10 && newMin != 0)
            min.innerHTML = '0' + newMin;
        else
            min.innerHTML = newMin;
        newSec = 0;
    }

    if(newSec < 10)
        sec.innerHTML = '0' + newSec;
    else
        sec.innerHTML = newSec;
}

//Control snake direction
function controlSnake(event) {
    let olddX = snake.dx;
    let olddY = snake.dy;

    if(event.keyCode == 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    else if(event.keyCode == 38 && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = -grid;
    }
    else if(event.keyCode == 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    else if(event.keyCode == 40 && snake.dy === 0) {
        snake.dx = 0;
        snake.dy = grid;
    }

    let newX = snake.cells[0].x + snake.dx;
    let newY = snake.cells[0].y + snake.dy;

    if(newX == snake.cells[1].x &&  newY == snake.cells[1].y) {
        snake.dx = olddX;
        snake.dy = olddY;
    }
}

function playGame() {
    //Update animation
    animId = window.requestAnimationFrame(playGame);
    if (++count < speed) {
        return;
    }
    count = 0;

    //Redraw game
    ctx.clearRect(0, 0, gameField.width, gameField.height);
    drawField();
    drawRandomApple();


    snake.x += snake.dx;
    snake.y += snake.dy;
    if(snake.x >= gameField.width || snake.x < 0 || snake.y >= gameField.height || snake.y < 0){
        stopGame();
    }

    snake.cells.unshift({x: snake.x, y: snake.y});
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    snake.cells.forEach( (cell, index) => {
        drawSnakePart(index);

        if(cell.x == apple.x && cell.y == apple.y) {
            snake.maxCells++;
            document.getElementById('score').innerHTML = parseInt(score.innerHTML) + parseInt(10 * (snake.maxCells - 4)/speed);

            apple.x = getRandomCoord();
            apple.y = getRandomCoord();
        }
    })

    for(let i = 3; i < snake.cells.length; i++) {
        let x = snake.cells[0].x;
        let y = snake.cells[0].y;
        if(x == snake.cells[i].x && y == snake.cells[i].y) {
            stopGame();
        }
    }
}

//Control newGame button
let newGame = document.getElementById('buttonNewGame');
newGame.addEventListener('click', initGame);

function initGame() {
    if(newGame.classList.contains('activeButton')) {
        window.addEventListener('keydown', startGame);
        window.clearInterval(timerId);
        window.cancelAnimationFrame(animId);
        //clear timer and score
        document.getElementById('min').innerHTML = '00';
        document.getElementById('sec').innerHTML = '00';
        document.getElementById('score').innerHTML = 0;

        //clear graphics
        ctx.clearRect(0, 0, gameField.width, gameField.height);

        //Init shake and draw it
        snake.x = 10 * grid;
        snake.y = 10 * grid;
        snake.dx = 0;
        snake.dy = 0;
        snake.maxCells = 4;
        snake.cells = [];
        drawGame();

        document.getElementById('buttonPause').classList.remove('activeButton');
        pause.removeEventListener('click', removePause);
        pause.addEventListener('click', setPause);
        document.getElementById('buttonNewGame').classList.remove('activeButton');
        document.getElementById('buttonDiff').classList.add('activeButton');
        document.getElementById('buttonResult').classList.add('activeMenu');
        document.getElementById('buttonRules').classList.add('activeMenu');
        gameOver.close();
        pauseMessage.close();
    }
}

//Control pause button
let pause = document.getElementById('buttonPause');
var pauseMessage = document.getElementById('pauseMessage');
pause.addEventListener('click', setPause);

function setPause() {
    if(pause.classList.contains('activeButton')) {
        window.clearInterval(timerId);
        window.removeEventListener('keydown', startGame);
        window.cancelAnimationFrame(animId);
        pauseMessage.show();
         document.getElementById('buttonResult').classList.add('activeMenu');
        document.getElementById('buttonRules').classList.add('activeMenu');

        pause.removeEventListener('click', setPause);
        pause.addEventListener('click', removePause);
        window.removeEventListener('keydown', controlSnake);
    }
}

function removePause() {
    if(pause.classList.contains('activeButton')) {
        window.addEventListener('keydown', controlSnake);
        timerId = window.setInterval(timer, 1000);
        playGame();

        pauseMessage.close();
        document.getElementById('buttonResult').classList.remove('activeMenu');
        document.getElementById('buttonRules').classList.remove('activeMenu');
        pause.addEventListener('click', setPause);
        pause.removeEventListener('click', removePause);
    }
}

//Game over case
var gameOver = document.getElementById('gameOverMessage');
function stopGame() {
    gameOverMessage();
    window.cancelAnimationFrame(animId);
    window.clearInterval(timerId);

    document.getElementById('buttonPause').classList.remove('activeButton');
    document.getElementById('buttonNewGame').classList.add('activeButton');
    document.getElementById('buttonDiff').classList.add('activeButton');
}

function gameOverMessage() {
    document.getElementById('result').innerHTML = 'Счет: ' + score.innerHTML + '<br> Время: ' + document.getElementById('min').innerHTML + ':' + document.getElementById('sec').innerHTML;
    gameOver.show();
    writeResult();
}

let arrayResult = [];

function writeResult() {
    saveResult();
    fullTableResult();
}

function fullTableResult() {
    let rates = document.getElementById('rates');
    while (rates.children.length > 1) {
        rates.removeChild(rates.lastChild);
    }

    for(let i = 0; i < arrayResult.length; i++) {
        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        td1.innerHTML = i + 1;
        td2.innerHTML = arrayResult[i].score;
        td3.innerHTML = arrayResult[i].time;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        rates.appendChild(tr);
    }
}

function saveResult() {
    let result = {
        score: document.getElementById('score').innerHTML,
        time: document.getElementById('min').innerHTML + ':' + document.getElementById('sec').innerHTML,
    }

    arrayResult.push(result);
    arrayResult.sort(function(a,b) {
        if (parseInt(a.score) < parseInt(b.score)) {
            return 1;
        }
        if (parseInt(a.score) > parseInt(b.score))  {
            return -1;
        }
        return 0;
    })

    if(arrayResult.length > 10){
        arrayResult.pop();
    }
}

//Set diificult
let diff = document.getElementById('buttonDiff');
diff.addEventListener('click', showDifficultLevels);
function showDifficultLevels() {
    if(diff.classList.contains('activeButton'))
       document.getElementById("myDrop").classList.toggle("show");
}

let diffValue = document.getElementsByClassName('diffValue');
for (var i = 0; i < diffValue.length; i++) {
        diffValue[i].addEventListener('click', setDiff);
    }
function setDiff(){
    speed = parseInt(this.dataset.diff * 5);
    document.getElementById("myDrop").classList.toggle("show");
    document.getElementById('diffLevel').innerHTML = this.innerHTML;
}

let leftMenu = document.getElementById('buttonRules');
leftMenu.addEventListener('click', showRules);
function showRules() {
    if(leftMenu.classList.contains('activeMenu')) {
        document.getElementById("rules").classList.toggle("active");
        document.getElementById("leftSide").classList.toggle("active");
        document.getElementById("leftCenter").classList.toggle("active");
        document.getElementById("gameField").classList.toggle("activeLeft");
        document.getElementById('pauseMessage').classList.toggle("rightDialog");
        closeResult();
    }
}

function closeRules() {
 if(document.getElementById("rules").classList.contains('active')) {
        document.getElementById("rules").classList.toggle("active");
        document.getElementById("leftSide").classList.toggle("active");
        document.getElementById("leftCenter").classList.toggle("active");
        document.getElementById("gameField").classList.toggle("activeLeft");
        document.getElementById('pauseMessage').classList.remove("rightDialog");
    }
}

let rightMenu = document.getElementById('buttonResult');
rightMenu.addEventListener('click', showResult);
function showResult() {
    if(rightMenu.classList.contains('activeMenu')) {
        document.getElementById("tableResult").classList.toggle("active");
        document.getElementById("rightSide").classList.toggle("active");
        document.getElementById("rightCenter").classList.toggle("active");
        document.getElementById("gameField").classList.toggle("activeRight");
        document.getElementById('pauseMessage').classList.toggle("leftDialog");
        closeRules();
    }
}

function closeResult() {
 if(document.getElementById("tableResult").classList.contains('active')) {
        document.getElementById("tableResult").classList.toggle("active");
        document.getElementById("rightSide").classList.toggle("active");
        document.getElementById("rightCenter").classList.toggle("active");
        document.getElementById("gameField").classList.toggle("activeRight");
        document.getElementById('pauseMessage').classList.remove("leftDialog");
    }
}




