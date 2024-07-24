const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const backgroundMusic = document.getElementById('background-music');
const gameOverSound = document.getElementById('game-over-sound');
backgroundMusic.play();

let fruits = [];
let basket = { x: canvas.width / 2 - 20, y: canvas.height - 40, width: 40, height: 20 };
let score = 0;
let gameRunning = true;

// Vẽ giỏ
function drawBasket() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

// Vẽ quả
function drawFruit(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Cập nhật và vẽ trò chơi
function updateGameArea() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ giỏ
    drawBasket();

    // Thêm logic vẽ và cập nhật vị trí quả
    for (let i = 0; i < fruits.length; i++) {
        drawFruit(fruits[i].x, fruits[i].y, fruits[i].color);
        fruits[i].y += 2;

        // Kiểm tra nếu quả chạm đáy
        if (fruits[i].y > canvas.height) {
            gameRunning = false;
            gameOverSound.play();
            alert("Game Over! Score: " + score);
            saveScore(score);
            return;
        }

        // Kiểm tra nếu quả vào giỏ
        if (
            fruits[i].y + 10 >= basket.y &&
            fruits[i].x >= basket.x &&
            fruits[i].x <= basket.x + basket.width
        ) {
            fruits.splice(i, 1);
            score++;
            updateLeaderboard();
        }
    }

    requestAnimationFrame(updateGameArea);
}

// Khởi tạo quả ngẫu nhiên
setInterval(() => {
    let x = Math.random() * (canvas.width - 20) + 10;
    let colors = ['red', 'green', 'yellow', 'orange', 'purple'];
    let color = colors[Math.floor(Math.random() * colors.length)];
    fruits.push({ x: x, y: 0, color: color });
}, 1000);

// Cập nhật bảng xếp hạng
function updateLeaderboard() {
    const scores = document.getElementById('scores');
    scores.innerHTML = '';
    const li = document.createElement('li');
    li.textContent = `Score: ${score}`;
    scores.appendChild(li);
}

// Lưu điểm số vào localStorage
function saveScore(score) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
    displayScores();
}

// Hiển thị bảng xếp hạng từ localStorage
function displayScores() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    const scoresList = document.getElementById('scores');
    scoresList.innerHTML = '';
    scores.sort((a, b) => b - a).slice(0, 10).forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. Score: ${score}`;
        scoresList.appendChild(li);
    });
}

// Bắt đầu trò chơi
updateGameArea();
displayScores();

// Điều khiển giỏ bằng chuột
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    basket.x = event.clientX - rect.left - basket.width / 2;
});

// Chia sẻ trò chơi
document.getElementById('share-button').addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link chia sẻ đã được sao chép vào clipboard!');
    });
});
