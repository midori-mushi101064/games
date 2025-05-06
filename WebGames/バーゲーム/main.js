// main.js

//読み込まれたら初期化
window.onload = async function () {
    //canvasの初期化
    canvasReset();
    //その他の初期化
    reset();
    //クリックまで待つ
    //await waitForTouchUp();
    //ゲームメインを呼び出す
    gameMain();
}

console.time("処理時間");

//ゲームメイン
function gameMain() {
    //canvasをクリア
    clear();
    //ゲームを進める
    step();
    //描画
    Render();
    //タッチ後の処理
    touchUp = false;
    //タッチ後の処理
    touchUp2 = true;
    //キーの処理
    keyJustPressed = {};
    //再びゲームを呼び出す
    requestAnimationFrame(gameMain);
}

console.timeEnd("処理時間");  // 処理時間: 50ms（例）

//変数の定義
let score;
let win;
let winCount;
let earthquakeX;
let earthquakeY;
let isShot;
let isBoom;
let clickValue;
let gameMode;
let stertCount;
//初期化
function reset() {
    //変数等の初期化
    gameReset();
    //タッチの初期化
    touchReset();
}

//ゲームを進める
function step() {
    if (isClick && startCount <= 0) {
        switch (gameMode) {
            case 'rennda':

                if (win == 0) {
                    if (touchUp && touchX < csX()) {
                        sound("assets/sounds/panch1.mp3", 'start');
                        score += clickValue;
                    }
                    if (touchUp && touchX >= csX()) {
                        sound("assets/sounds/panch2.mp3", 'start');
                        score -= clickValue;
                    }
                    if (score >= 100) {
                        score = 100;
                        win = 1;
                        sound("assets/sounds/charge.mp3", 'start');
                    }
                    if (score <= 0) {
                        score = 0;
                        win = 2;
                        sound("assets/sounds/charge.mp3", 'start');
                    }
                }
                else {
                    winCount += (winCount <= 0) ? 0.05 : 1;
                    if (winCount >= 10) {
                        earthquakeX = getRundomInt(50) - 25;
                        earthquakeY = getRundomInt(50) - 25;
                        if (!isBoom) {
                            sound("assets/sounds/boom.mp3", 'start');
                            isBoom = true;
                        }
                    }
                    if (winCount >= 0 && !isShot) {
                        sound("assets/sounds/shot.mp3", 'start');
                        isShot = true;
                    }
                    if (win == 1) score += winCount;
                    else score += -winCount;
                }
                if (winCount >= 10 && touchUp) {
                    gameReset();
                }
                break;
            case 'battominntonn':
                break;
            case 'setuna':
                break;
        }
    }
    else {
        if (touchUp && !isClick) {
            sound("assets/sounds/count.mp3", 'start')
            isClick = true;
            valueReset();
        }
        if (isClick) startCount--;
        if (isClick && startCount / 50 == Math.floor(startCount / 50) && !startCount <= 0) sound("assets/sounds/count.mp3", 'start');
        if (startCount <= 0) sound("assets/sounds/start.mp3", 'start');
    }
}

//描画
function Render() {
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    const y = csY(0) + earthquakeY;
    const x = csX(-200) + score * 4 + earthquakeX;
    //スコアによって前後を変える
    if (score <= 50) {
        blueBerRender();
        RedBerRender();
    }
    else {
        RedBerRender();
        blueBerRender();
    }
    //境目の火花(？)を描画
    ctx.strokeStyle = "#f7f7df";
    ctx.lineWidth = 50;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x, y - 50);
    ctx.stroke();
    ctx.restore();
    if (winCount >= 10) {
        let coler;
        let text;
        if (win == 1) coler = "#25a5b0", text = '青';
        else coler = "#942626", text = '赤';
        textC(csX(), csY(25), `${text}の勝ち`, 60, coler);
        textC(csX(), csY(-25), 'クリックしてリスタート', 30, coler);
    }
    if (startCount > 0) {
        if (!isClick) textC(csX(), csY(), 'クリックしてスタート', 50, '#bbf09e');
        let n = Math.floor(startCount / 50 + 1);
        let m = 100 + Math.floor(startCount * 5) / Math.floor(startCount / 50 + 1);
        if (isClick) textC(csX(), csY(), `${n}`, m, '#bbf09e');
    }
}

function blueBerRender() {
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    const y = csY(0) + earthquakeY;
    const x = csX(-200) + score * 4 + earthquakeX;
    //線を描く
    ctx.save();
    ctx.lineWidth = 100;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#99ebf2";
    ctx.beginPath();
    ctx.moveTo(csX(-200) + earthquakeX, y);
    if (score >= 10) {
        ctx.lineTo(x - 25, y);
    }
    else {
        ctx.lineTo(csX(-200) + earthquakeX, y);
    }
    ctx.stroke();
    ctx.restore();
}

function RedBerRender() {
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    const y = csY(0) + earthquakeY;
    const x = csX(-200) + score * 4 + earthquakeX;
    //線を描く
    ctx.save();
    ctx.lineWidth = 100;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#f09e9e";
    ctx.beginPath();
    ctx.moveTo(csX(200) + earthquakeX, y);
    if (score <= 90) {
        ctx.lineTo(x + 25, y);
    }
    else {
        ctx.lineTo(csX(200) + earthquakeX, y);
    }
    ctx.stroke();
    ctx.restore();
}

function gameReset() {
    valueReset();
    startCount = countMax * 50;
    isClick = false;
}

function valueReset() {
    //変数の初期化
    score = 50;
    win = 0;
    winCount = -3;
    earthquakeX = 0;
    earthquakeY = 0;
    isShot = false;
    isBoom = false;
    gameMode = document.getElementById("mode").value;
    clickValue = Number(document.getElementById("click").value);
    countMax = Number(document.getElementById("count").value);
    if (countMax <= 0) countMax = 0.01;
    //音を止める
    sound("assets/sounds/boom.mp3", 'stop');
    sound("assets/sounds/shot.mp3", 'stop');
    sound("assets/sounds/charge.mp3", 'stop');
}