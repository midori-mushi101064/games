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

//初期化
function reset() {
    //変数等の初期化
    gameReset();
    //タッチの初期化
    touchReset();
}

//ゲームを進める
function step() {
    const X = touchX >= 10 && touchX <= 90;
    const Y = touchY >= 10 && touchY <= 90;
    if (touchUp && X & Y) {
        document.getElementById("menu-toggle").checked = true;
    }
    const check = document.getElementById("menu-toggle").checked;
    const Down = touchDown && !check && !(X & Y);
    const Up = touchUp && !check && !(X & Y);
    if (isClick && startCount <= 0) {
        const isAttack = (Up) || (keyJustPress('ArrowRight') || keyJustPress('ArrowLeft'));
        const R = keyPress('ArrowRight');
        const L = keyPress('ArrowLeft');
        //console.log(keyPressed);
        switch (gameMode) {
            //連打バトル
            case 'rennda':
                if (win == 0) {
                    if (isAttack) {
                        if (touchX < csX() || R) {
                            sound("assets/sounds/panch1.mp3", 'start');
                            score += clickValue;
                        }
                        else if (touchX >= csX() || L) {
                            sound("assets/sounds/panch2.mp3", 'start');
                            score -= clickValue;
                        }
                    }
                }
                winStep();
                break;
            //バトミントン
            case 'battominntonn':
                if (win == 0) {
                    const n = csX(-berWidth) + hanni - 50 * (berWidth / 50);
                    const m = csX(-berWidth) + score * (berWidth / 50) + earthquakeX;
                    if (isAttack) {
                        if ((touchX < csX() || L) && m <= csX(n)) {
                            if (getRundomInt(2) == 1) sound("assets/sounds/pass1.mp3", 'start'); else sound("assets/sounds/pass2.mp3", 'start', 0.5);
                            if (vScore <= 0) {
                                passNum++;
                                vScore += speedValue;
                            }
                            vScore = Math.abs(vScore);
                            vScore += speedValue;
                        }
                        if ((touchX >= csX() || R) && m >= csX(-n)) {
                            if (getRundomInt(2) == 1) sound("assets/sounds/pass1.mp3", 'start'); else sound("assets/sounds/pass2.mp3", 'start', 0.5);
                            if (vScore >= 0) {
                                passNum++;
                                vScore += speedValue;
                            }
                            vScore = Math.abs(vScore);
                            vScore *= -1;
                        }
                    }
                    if ((Down && (((touchX < csX() || L) && m <= csX(n)) || ((touchX >= csX() || R) && m >= csX(-n))))) {
                        score += vScore * 0.3;
                    }
                    else {
                        score += vScore;
                    }
                }
                winStep();
                break;
            //刹那の見切り
            case 'setuna':
                if (win == 0) {
                    if (Down || R || L) {
                        sound("assets/sounds/slash2.mp3", 'start', 0.5);
                        sound("assets/sounds/slash3.mp3", 'start', 0.3);
                        sound("assets/sounds/slash4.mp3", 'start');
                        sound("assets/sounds/window.mp3", 'stop');
                        if (touchX < csX() || R) {
                            score = 100;
                        }
                        else if (touchX >= csX() || L) {
                            score = 0;
                        }
                    }
                }
                winStep();
                startCount--;
                break;
        }
    }
    else {
        const P = keyPress('any');
        if (Up && !isClick) {
            valueReset();
        }
        if (gameMode == 'setuna') {
            if ((Up || P) && !isClick) {
                sound("assets/sounds/window.mp3", 'loop');
                sound("assets/sounds/slash1.mp3", 'start', 0.2);
                isClick = true;
            }
            if (isClick) startCount--;
            if (startCount <= 0) {
                sound("assets/sounds/start.mp3", 'start');
                sound("assets/sounds/window.mp3", 'stop');
            }
        }
        else {
            if ((Up || P) && !isClick) {
                sound("assets/sounds/count.mp3", 'start')
                isClick = true;
            }
            if (isClick) startCount--;
            if (isClick && startCount / 50 == Math.floor(startCount / 50) && !startCount <= 0) sound("assets/sounds/count.mp3", 'start');
            if (startCount <= 0) sound("assets/sounds/start.mp3", 'start');
        }
    }
}

//描画
function Render() {
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    const y = csY(0) + earthquakeY;
    const x = csX(-berWidth) + score * (berWidth / 50) + earthquakeX;
    //スコアによって前後を変える
    if (score <= 50) {
        blueBerRender();
        RedBerRender();
    }
    else {
        RedBerRender();
        blueBerRender();
    }
    ctx.save();
    ctx.lineCap = "round";
    if (gameMode == 'battominntonn') {
        ctx.strokeStyle = "#f0dd9e";
        ctx.lineWidth = 20;
        ctx.beginPath();
        const n = csX(-berWidth) + hanni - 50 * (berWidth / 50);
        ctx.moveTo(csX(-n), y + 25);
        ctx.lineTo(csX(-n), y - 25);
        ctx.moveTo(csX(n), y + 25);
        ctx.lineTo(csX(n), y - 25);
        ctx.stroke();
        textC(csX(), csY(150), `${passNum}`, 100, '#bbf09e');
    }
    //境目の火花(？)を描画
    ctx.strokeStyle = "#f7f7df";
    ctx.lineWidth = 50;
    ctx.beginPath();
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x, y - 50);
    ctx.stroke();
    //
    ctx.fillStyle = "#97e6c2";
    roundRect(10, 10, 90, 90, 10);  // 半径10pxの角丸四角形
    ctx.restore();
    img('setIcon.png', 20, 20, 70, 70);
    if (winCount >= 10) {
        let coler;
        let text;
        if (win == 1) coler = "#25a5b0", text = '青';
        else coler = "#942626", text = '赤';
        textC(csX(), csY(25), `${text}の勝ち`, 60, coler);
        if (winCount >= 50) textC(csX(), csY(-25), 'クリックしてリスタート', 30, coler);
    }
    if (gameMode == 'setuna') {
        if (!isClick) textC(csX(), csY(), 'クリックしてスタート', 50, '#bbf09e');
        if (startCount <= 0 && win == 0) {
            textC(csX(), csY(), ' 斬れ！', 100, '#bbf09e');
        }
    }
    else if (startCount > 0) {
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
    const x = csX(-berWidth) + score * (berWidth / 50) + earthquakeX;
    //線を描く
    ctx.save();
    ctx.lineWidth = 100;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#99ebf2";
    ctx.beginPath();
    ctx.moveTo(csX(-berWidth) + earthquakeX, y);
    if (x >= csX(-berWidth + 30)) {
        ctx.lineTo(x - 25, y);
    }
    else {
        ctx.lineTo(csX(-berWidth) + earthquakeX, y);
    }
    ctx.stroke();
    ctx.restore();
}

function RedBerRender() {
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    const y = csY(0) + earthquakeY;
    const x = csX(-berWidth) + score * (berWidth / 50) + earthquakeX;
    //線を描く
    ctx.save();
    ctx.lineWidth = 100;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#f09e9e";
    ctx.beginPath();
    ctx.moveTo(csX(berWidth) + earthquakeX, y);
    if (x <= csX(berWidth - 30)) {
        ctx.lineTo(x + 25, y);
    }
    else {
        ctx.lineTo(csX(berWidth) + earthquakeX, y);
    }
    ctx.stroke();
    ctx.restore();
}
function winStep() {
    const X = touchX >= 10 && touchX <= 90;
    const Y = touchY >= 10 && touchY <= 90;
    const check = document.getElementById("menu-toggle").checked;
    const Up = touchUp && !check && !(X & Y);
    if (win == 0) {
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
    const P = keyPress('any');
    if (winCount >= 50 && (Up || P)) {
        gameReset();
    }
}


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
let startCount;
let speedValue;
let chargeTime;
let chargeValue;
let hanni;
let vScore;
let berWidth;
let passNum;

function gameReset() {
    valueReset();
    startCount = countMax * 50;
    isClick = false;
}

function valueReset() {
    //変数の初期化
    score = 50;
    win = 0;
    winCount = -2;
    earthquakeX = 0;
    earthquakeY = 0;
    isShot = false;
    isBoom = false;
    console.log(vScore);
    gameMode = document.getElementById("mode").value;
    switch (gameMode) {
        case 'rennda':
            clickValue = Number(document.getElementById("click").value);
            countMax = Number(document.getElementById("renndaCount").value);
            berWidth = 200;
            break;
        case 'battominntonn':
            speedValue = Number(document.getElementById("speedValue").value) / 50;
            hanni = Number(document.getElementById("hanni").value) * 3;
            countMax = Number(document.getElementById("battominntonnCount").value);
            berWidth = Number(document.getElementById("berWidth").value);
            passNum = 0;
            vScore = (getRundomInt(2) == 1) ? 0.5 : -0.5;
            break;
        case 'setuna':
            countMax = getRundomInt(Number(document.getElementById("timeMax").value) + (Number(document.getElementById("timeMin").value) - 1));
            break;
    }
    if (countMax <= 0) countMax = 0.01;
    //音を止める
    sound("assets/sounds/boom.mp3", 'stop');
    sound("assets/sounds/shot.mp3", 'stop');
    sound("assets/sounds/charge.mp3", 'stop');
}
