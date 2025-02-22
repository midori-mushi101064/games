let timeLeft, clickCount, timerId;

document.getElementById('clickButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', startGame);

function startGame() {
    const stage = document.getElementById('stage').value;
    const color = document.getElementById('color').value;
    const shape = document.getElementById('shape').value;
    const clickButton = document.getElementById('clickButton');
    const restartButton = document.getElementById('restartButton');

    clickButton.style.backgroundColor = color;
    clickButton.className = shape;

    timeLeft = parseInt(stage);
    clickCount = 0;
    document.getElementById('result').textContent = '';
    document.getElementById('timer').textContent = `制限時間: ${timeLeft}秒`;
    clickButton.textContent = 'クリック！';
    clickButton.disabled = false;
    restartButton.style.display = 'none';

    clickButton.removeEventListener('click', startGame);
    clickButton.addEventListener('click', clickButtonHandler);

    timerId = setInterval(countDown, 1000);
}

function countDown() {
    timeLeft--;
    document.getElementById('timer').textContent = `制限時間: ${timeLeft}秒`;
    if (timeLeft <= 0) {
        endGame();
    }
}

function clickButtonHandler(event) {
    clickCount++;
    document.getElementById('result').textContent = `クリック数: ${clickCount}`;

    const clickSound = new Audio('click.mp3');
    clickSound.play();

    createBurst(event.clientX, event.clientY);
    createParticles(event.clientX, event.clientY);
}

function endGame() {
    clearInterval(timerId);
    const clickButton = document.getElementById('clickButton');
    const restartButton = document.getElementById('restartButton');

    clickButton.textContent = '終了';
    clickButton.disabled = true;
    clickButton.removeEventListener('click', clickButtonHandler);

    const stopSound = new Audio('stop.mp3');
    stopSound.play();

    restartButton.style.display = 'block';
}

function createBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'burst';
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
}

function createParticles(x, y) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
        particle.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}
