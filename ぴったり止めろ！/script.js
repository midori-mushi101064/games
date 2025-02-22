let timerInterval;
let startTime;
let isRunning = false;
let isHiddenMode = false;
let targetTime = getRandomTargetTime(); // 目標時間（秒）

const timerElement = document.getElementById('timer');
const targetTimeElement = document.getElementById('target-time');
const buttonElement = document.getElementById('start-stop-button');
const toggleModeButton = document.getElementById('toggle-mode-button');
const shareButton = document.getElementById('share-button');
const scoreElement = document.getElementById('score');
const startSound = document.getElementById('start-sound');
const stopSound = document.getElementById('stop-sound');
const clickSound = document.getElementById('click-sound');

targetTimeElement.textContent = `目標時間: ${targetTime}秒`;

buttonElement.addEventListener('click', () => {
    if (isRunning) {
        clearInterval(timerInterval);
        const elapsedTime = (Date.now() - startTime) / 1000;
        const difference = Math.abs(elapsedTime - targetTime);
        let score;
        if (difference < 0.01) {
            score = '★★★★★';
        } else if (difference < 0.50) {
            score = '★★★★';
        } else if (difference < 1.00) {
            score = '★★★';
        } else if (difference < 2.00) {
            score = '★★';
        } else {
            score = '★';
        }
        scoreElement.textContent = `スコア: ${score} (${elapsedTime.toFixed(2)}秒) 目標時間: ${targetTime}秒 モード: ${isHiddenMode ? '非表示' : '表示'}`;
        buttonElement.textContent = 'スタート';
        targetTime = getRandomTargetTime();
        targetTimeElement.textContent = `目標時間: ${targetTime}秒`;
        if (isHiddenMode) {
            timerElement.textContent = `${elapsedTime.toFixed(2)}秒`;
        }
        stopSound.play();
    } else {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedTime = (Date.now() - startTime) / 1000;
            if (!isHiddenMode) {
                timerElement.textContent = `${elapsedTime.toFixed(2)}秒`;
            }
        }, 10);
        scoreElement.textContent = '';
        buttonElement.textContent = 'ストップ';
        startSound.play();
    }
    isRunning = !isRunning;
});

toggleModeButton.addEventListener('click', () => {
    isHiddenMode = !isHiddenMode;
    if (isHiddenMode) {
        timerElement.textContent = '???';
        toggleModeButton.textContent = '秒数表示モード';
    } else {
        timerElement.textContent = '0.00秒';
        toggleModeButton.textContent = '秒数非表示モード';
    }
    clickSound.play();
});

shareButton.addEventListener('click', () => {
    const scoreText = scoreElement.textContent;
    if (scoreText) {
        navigator.clipboard.writeText(scoreText).then(() => {
            alert('結果がクリップボードにコピーされました！');
        });
    } else {
        alert('まずはゲームをプレイしてください！');
    }
    clickSound.play();
});

function getRandomTargetTime() {
    return (Math.random() * 10).toFixed(2);
}