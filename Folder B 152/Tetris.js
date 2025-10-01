const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;
const BLOCK_SIZE = 30;
let grid = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let gameOver = false;
let paused = false;
let tickInterval = 1000;
let lastTick = 0;
const tetronimos = [
    [[1, 1, 1, 1]], // 1
    [[1, 1], [1, 1]], // 0
    [[0, 1, 0], [1, 1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1], [0, 0, 1]]
];
const colors = [
    '#00f0f0', '#f0f000', '#a000f0', '#00f000', '#f00000', '#f0a000', '#0000f0'
];
function setup() {
    let holder = document.getElementById('sketch-holder');
    let cnv = createCanvas(GRID_WIDTH * BLOCK_SIZE, GRID_HEIGHT * BLOCK_SIZE);
    cnv.parent(holder);
    grid = Array(GRID_HEIGHT).fill().map(() => Array(GRID_WIDTH).fill(0));
    nextPiece = generateNewPiece();
    generatePiece();
    updatePanel();
    frameRate(60);
}
function draw() {
    background(255);
    if (!gameOver && !paused) {
        if (millis() - lastTick > tickInterval) {
            updatePiece();
            lastTick = millis();
        }
        drawGrid();
        drawPiece();
    } else if (gameOver) {
        drawGrid();
        drawPiece();
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(255, 0, 0);
        text('Game Over', width / 2, height / 2);
    } else if (paused) {
        drawGrid();
        drawPiece();
        textSize(32);
        textAlign(CENTER, CENTER);
        fill(80, 80, 255);
        text('Paused', width / 2, height / 2);
    }
    updatePanel();
}
function updatePanel() {
    document.getElementById('score').innerText = score;
    document.getElementById('level').innerText = level;
    document.getElementById('lines').innerText = lines;
}
function generateNewPiece() {
    const index = floor(random(tetronimos.length));
    return {
        shape: tetronimos[index],
        color: colors[index],
        x: Math.floor((GRID_WIDTH - tetronimos[index][0].length) / 2),
        y: 0
    };
}
function generatePiece() {
    currentPiece = nextPiece;
    nextPiece = generateNewPiece();
    currentPiece.x = Math.floor((GRID_WIDTH - currentPiece.shape[0].length) / 2);
    currentPiece.y = 0;
    if (colide(currentPiece)) gameOver = true;
    drawNextPiece();
}
function drawGrid() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (grid[y][x]) {
                fill(grid[y][x]);
                rect(x * BLOCK_SIZE, y *BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}
function drawPiece() {
    fill(currentPiece.color);
    stroke(40);
    strokeWeight(2);
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[0].length; x++) {
            if (currentPiece.shape[y][x]) {
                rect((currentPiece.x + x) * BLOCK_SIZE, (currentPiece.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE, 6);
            }
        }
    }
    noStroke();
}
function drawNextPiece() {
    const canvas = document.getElementById('next-piece');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!nextPiece) return;
    let shape = nextPiece.shape;
    let color = nextPiece.color;
    let block = 24;
    let offsetX = Math.floor((canvas.width - shape[0].length * block) / 2);
    let offsetY = Math.floor((canvas.height - shape.length * block) / 2);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    for (let y = 0; y < shape.length; y++) {
        for (let x =0; x < shape[0].length; x++) {
            if (shape[y][x]) {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.roundRect(offsetX + x * block, offsetY + y * block, block, block, 6);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}
function updatePiece() {
    if (gameOver || paused) return;
    currentPiece.y++;
    if (colide(currentPiece)) {
        currentPiece.y--;
        positionPiece();
        verifyLines();
        generatePiece();
    }
}
function colide(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[0].length; x++) {
            if (piece.shape[y][x]) {
                let newX = piece.x + x;
                let newY = piece.y + y;
                if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT || (newY >= 0 && grid[newY][newX])) {
                    return true;
                } 
            }
        }
    }
    return false;
}
function positionPiece() {
    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[0].length; x++) {
            if (currentPiece.shape[y][x]) {
                grid[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
            }
        }
    }
}
function verifyLines() {
    for (let y = GRID_HEIGHT - 1; y>= 0; y--) {
        if (grid[y].every(cell => cell !== 0)) {
            grid.splice(y, 1);
            grid.unshift(Array(GRID_WIDTH).fill(0));
            score += 100 * level;
            lines++;
            if (lines & 10 === 0) {
                level++;
                tickInterval.Math.max(120, 1000 - (level - 1) * 80);
            }
            updatePanel();
            y++;
        }
    }
}
function rotatePiece() {
    const newForm = currentPiece.shape[0].map((_, i) =>
    currentPiece.shape.map(row => row[row.length - 1 - i])
    );
    const tempShape = currentPiece.shape;
    currentPiece.shape = newForm;
    if (colide(currentPiece)) {
        currentPiece.shape = tempShape;
    }
}
function keyPressed() {
    if (gameOver) return;
    if (keyCode === LEFT_ARROW) {
        currentPiece.x--;
        if (colide(currentPiece)) currentPiece.x++;
    } else if (keyCode === RIGHT_ARROW) {
        currentPiece.x++;
        if (colide(currentPiece)) currentPiece.x--;
    } else if (keyCode === DOWN_ARROW) {
        currentPiece.y++;
        if (colide(currentPiece)) {
            currentPiece.y--;
            positionPiece();
            verifyLines();
            generatePiece();
        }
    } else if (keyCode === UP_ARROW) {
        rotatePiece();
    } else if (key === 'p' || key === 'P') {
        paused = !paused;
    }
}
document.getElementById('pause').onclick = () => {
    paused = !paused;
};
document.getElementById('quit').onclick = () => {
    location.reload();
};