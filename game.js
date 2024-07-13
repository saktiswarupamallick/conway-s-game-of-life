const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20;
const gridWidth = canvas.width / cellSize;
const gridHeight = canvas.height / cellSize;
let grid = Array.from({ length: gridWidth }, () => Array(gridHeight).fill(0));
let intervalId = null;

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ddd';
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            if (grid[x][y] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
            ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
    }
}

function getNextState() {
    const newGrid = Array.from({ length: gridWidth }, () => Array(gridHeight).fill(0));
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            const aliveNeighbors = countAliveNeighbors(x, y);
            if (grid[x][y] === 1) {
                newGrid[x][y] = (aliveNeighbors === 2 || aliveNeighbors === 3) ? 1 : 0;
            } else {
                newGrid[x][y] = (aliveNeighbors === 3) ? 1 : 0;
            }
        }
    }
    return newGrid;
}

function countAliveNeighbors(x, y) {
    const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;
    for (const [dx, dy] of neighbors) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < gridWidth && ny < gridHeight) {
            count += grid[nx][ny];
        }
    }
    return count;
}

function updateGrid() {
    grid = getNextState();
    drawGrid();
}

function startGame() {
    if (intervalId === null) {
        intervalId = setInterval(updateGrid, 100);
    }
}

function stopGame() {
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

function randomStart() {
    grid = Array.from({ length: gridWidth }, () =>
        Array.from({ length: gridHeight }, () => Math.random() < 0.2 ? 1 : 0)
    );
    drawGrid();
}

function writeName(name) {
    const nameArray = name.toUpperCase().split('');
    const namePattern = [
        [1, 1, 1, 1, 1], // Example pattern for each letter
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ];

    let xOffset = Math.floor(gridWidth / 2) - (nameArray.length * namePattern[0].length / 2);
    let yOffset = Math.floor(gridHeight / 2) - (namePattern.length / 2);

    for (let i = 0; i < nameArray.length; i++) {
        for (let row = 0; row < namePattern.length; row++) {
            for (let col = 0; col < namePattern[row].length; col++) {
                const x = xOffset + i * namePattern[row].length + col;
                const y = yOffset + row;
                if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
                    grid[x][y] = namePattern[row][col];
                }
            }
        }
    }
    drawGrid();
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('stopBtn').addEventListener('click', stopGame);
document.getElementById('randomBtn').addEventListener('click', randomStart);
document.getElementById('writeNameBtn').addEventListener('click', () => {
    const name = prompt('Enter your name:');
    if (name) {
        writeName(name);
    }
});

drawGrid();
