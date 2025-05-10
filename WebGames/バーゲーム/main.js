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
    //ボタンの位置を定義
    const X = touchX >= 10 && touchX <= 90;
    const Y = touchY >= 10 && touchY <= 90;
    //ボタンが押されたら
    if (touchUp && X & Y) {
        //メニューバーを開く
        document.getElementById("menu-toggle").checked = true;
    }
    /*変数の定義*/
    //メニューバーを開いているか
    const check = document.getElementById("menu-toggle").checked;
    //ボタン以外の場所をタッチしたか
    const Down = touchDown && !check && !(X & Y);
    const Up = touchUp && !check && !(X & Y);
    //カウントダウンが終わったなら
    if (isClick && startCount <= 0) {
        //クリックまたは矢印キー
        const isAttack = (Up) || (keyJustPress('ArrowRight') || keyJustPress('ArrowLeft'));
        const R = keyPress('ArrowRight');
        const L = keyPress('ArrowLeft');
        //ゲームモードごとの動作
        switch (gameMode) {
            //連打バトル
            case 'rennda':
                //勝者が決まっていないなら
                if (win == 0) {
                    //クリックされたとき
                    if (isAttack) {
                        //左側の処理
                        if (touchX < csX() || R) {
                            sound("assets/sounds/panch1.mp3", 'start');
                            score += clickValue;
                        }
                        //右側の処理
                        else if (touchX >= csX() || L) {
                            sound("assets/sounds/panch2.mp3", 'start');
                            score -= clickValue;
                        }
                    }
                }
                break;
            //バトミントン
            case 'battominntonn':
                //勝者がいないなら
                if (win == 0) {
                    /*変数を定義*/
                    //跳ね返せる範囲
                    const n = csX(-berWidth) + hanni - 50 * (berWidth / 50);
                    //バーの位置
                    const m = csX(-berWidth) + score * (berWidth / 50);
                    //クリックされたとき
                    if (isAttack) {
                        //左側の処理
                        if ((touchX < csX() || L) && m <= csX(n)) {
                            //まだ跳ね返していないなら
                            if (vScore <= 0) {
                                //ランダムな音をならす
                                if (getRundomInt(2) == 1) sound("assets/sounds/pass1.mp3", 'start'); else sound("assets/sounds/pass2.mp3", 'start', 0.5);
                                //パス回数を上げる
                                passNum++;
                                //正の数に直す
                                vScore = Math.abs(vScore);
                                //スピードを上げる
                                vScore += speedValue;
                            }
                        }
                        //右側の処理
                        if ((touchX >= csX() || R) && m >= csX(-n)) {
                            //まだ跳ね返していないなら
                            if (vScore >= 0) {
                                //ランダムな音をならす
                                if (getRundomInt(2) == 1) sound("assets/sounds/pass1.mp3", 'start'); else sound("assets/sounds/pass2.mp3", 'start', 0.5);
                                //パス回数を上げる
                                passNum++;
                                vScore = Math.abs(vScore);
                                vScore += speedValue;
                                vScore *= -1;
                            }
                        }
                    }
                    //範囲内で長押し中
                    if ((Down && (((touchX < csX() || L) && m <= csX(n)) || ((touchX >= csX() || R) && m >= csX(-n))))) {
                        //速度を遅くする
                        score += vScore * 0.3;
                    }
                    //それ以外
                    else {
                        //通常の速度でバーを動かす
                        score += vScore;
                    }
                }
                break;
            //刹那の見切り
            case 'setuna':
                //勝者がいないなら
                if (win == 0) {
                    //クリックされたとき
                    if (Down || R || L) {
                        //音をならす
                        sound("assets/sounds/slash2.mp3", 'start', 0.5);
                        sound("assets/sounds/slash3.mp3", 'start', 0.3);
                        sound("assets/sounds/slash4.mp3", 'start');
                        sound("assets/sounds/window.mp3", 'stop');
                        //左側の処理
                        if (touchX < csX() || R) {
                            score = 100;
                        }
                        //右側の処理
                        else if (touchX >= csX() || L) {
                            score = 0;
                        }
                    }
                }
                //スタート後もカウントを下げる
                startCount--;
                break;
        }
    }
    //カウントダウン
    else {
        //何らかのキーが押されたら
        const P = keyPress('any');
        //初めてクリックされたとき
        if ((Up || P) && !isClick) {
            //変数をリセット
            valueReset();
        }
        //クリック済みならカウントを下げる
        if (isClick) startCount--;
        //モードが刹那の見切りなら
        if (gameMode == 'setuna') {
            //初めてクリックされたとき
            if ((Up || P) && !isClick) {
                //音を鳴らす
                sound("assets/sounds/window.mp3", 'loop');
                sound("assets/sounds/slash1.mp3", 'start', 0.2);
                //クリック済みにする
                isClick = true;
            }
            //カウントが0以下なら
            if (startCount <= 0) {
                //スタート音を鳴らす
                sound("assets/sounds/start.mp3", 'start');
                //風の音を止める
                sound("assets/sounds/window.mp3", 'stop');
            }
        }
        //その他のモードなら
        else {
            //初めてクリックされたとき
            if ((Up || P) && !isClick) {
                //音を鳴らす
                sound("assets/sounds/count.mp3", 'start')
                //クリック済みにする
                isClick = true;
            }
            //カウントが下がったとき(3→2や2→1の時)に音をならす
            if (isClick && startCount / 50 == Math.floor(startCount / 50) && !startCount <= 0) sound("assets/sounds/count.mp3", 'start');
            //スタート音をならす
            if (startCount <= 0) sound("assets/sounds/start.mp3", 'start');
        }
    }
    //勝利の処理
    winStep();
}

//描画
function Render() {
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    //バーの位置を定義
    const y = csY(0) + earthquakeY;
    const x = csX(-berWidth) + score * (berWidth / 50) + earthquakeX;
    //スコアによって前後を変える
    if (score <= 50) {
        //赤いバーが前
        blueBerRender();
        RedBerRender();
    }
    else {
        //青いバーが前
        RedBerRender();
        blueBerRender();
    }
    ctx.save();
    ctx.lineCap = "round";
    //バトミントンモードなら
    if (gameMode == 'battominntonn') {
        //跳ね返し範囲を描画
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
    //設定ボタンを描画
    ctx.fillStyle = "#97e6c2";
    roundRect(10, 10, 90, 90, 20);  // 半径10pxの角丸四角形
    ctx.restore();
    img('setIcon.png', 20, 20, 70, 70);
    //勝利後なら
    if (winCount >= 10) {
        let coler;
        let text;
        if (win == 1) coler = "#25a5b0", text = '青';
        else coler = "#942626", text = '赤';
        textC(csX(), csY(25), `${text}の勝ち`, 60, coler);
        if (winCount >= 50) textC(csX(), csY(-25), 'クリックしてリスタート', 30, coler);
    }
    //刹那の見切りモードなら
    if (gameMode == 'setuna') {
        //クリックしてスタート
        if (!isClick) textC(csX(), csY(), 'クリックしてスタート', 50, '#bbf09e');
        //斬れ！
        if (startCount <= 0 && win == 0) {
            textC(csX(), csY(), ' 斬れ！', 100, '#bbf09e');
        }
    }
    //その他のモードなら
    else if (startCount > 0) {
        //クリックしてスタート
        if (!isClick) textC(csX(), csY(), 'クリックしてスタート', 50, '#bbf09e');
        //数を定義
        let n = Math.floor(startCount / 50 + 1);
        //サイズを定義
        let m = 100 + Math.floor(startCount * 5) / Math.floor(startCount / 50 + 1);
        //カウントダウンを描画
        if (isClick) textC(csX(), csY(), `${n}`, m, '#bbf09e');
    }
}
//青いバーを描画
function blueBerRender() {
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    //バーの位置を定義
    const y = csY(0) + earthquakeY;
    const x = csX(-berWidth) + score * (berWidth / 50) + earthquakeX;
    //線を描く
    ctx.save();
    ctx.lineWidth = 100;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#99ebf2";
    ctx.beginPath();
    ctx.moveTo(csX(-berWidth) + earthquakeX, y);
    //バーの位置が端なら
    if (x >= csX(-berWidth + 30)) {
        //少しだけ描画
        ctx.lineTo(x - 25, y);
    }
    //バーの位置がそれ以外なら
    else {
        //バーの位置まで描画
        ctx.lineTo(csX(-berWidth) + earthquakeX, y);
    }
    ctx.stroke();
    ctx.restore();
}
//赤いバーを描画
function RedBerRender() {
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    //バーの位置を定義
    const y = csY(0) + earthquakeY;
    const x = csX(-berWidth) + score * (berWidth / 50) + earthquakeX;
    //線を描く
    ctx.save();
    ctx.lineWidth = 100;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#f09e9e";
    ctx.beginPath();
    ctx.moveTo(csX(berWidth) + earthquakeX, y);
    //バーの位置が端なら
    if (x <= csX(berWidth - 30)) {
        //少しだけ描画
        ctx.lineTo(x + 25, y);
    }
    //バーの位置がそれ以外なら
    else {
        //バーの位置まで描画
        ctx.lineTo(csX(berWidth) + earthquakeX, y);
    }
    ctx.stroke();
    ctx.restore();
}
//勝利の処理
function winStep() {
    //ボタンの位置を定義
    const X = touchX >= 10 && touchX <= 90;
    const Y = touchY >= 10 && touchY <= 90;
    //メニューバーを開いているか
    const check = document.getElementById("menu-toggle").checked;
    //ボタン以外の場所をタッチしたか
    const Up = touchUp && !check && !(X & Y);
    //勝者がいないなら
    if (win == 0) {
        //バーの位置が右端なら
        if (score >= 100) {
            //赤の勝利
            score = 100;
            win = 1;
            //音をならす
            sound("assets/sounds/charge.mp3", 'start');
        }
        //バーの位置が左端なら
        if (score <= 0) {
            //青の勝利
            score = 0;
            win = 2;
            //音をならす
            sound("assets/sounds/charge.mp3", 'start');
        }
    }
    //勝者がいるなら
    else {
        //カウントを増やす
        winCount += (winCount <= 0) ? 0.05 : 1;
        //カウントが10より大きいなら
        if (winCount >= 10) {
            //バーのを揺らす
            earthquakeX = getRundomInt(50) - 25;
            earthquakeY = getRundomInt(50) - 25;
            //爆発済みじゃないなら
            if (!isBoom) {
                //音をならす
                sound("assets/sounds/boom.mp3", 'start');
                //爆発済みにする
                isBoom = true;
            }
        }
        //カウントが0より大きいなら
        if (winCount >= 0 && !isShot) {
            //音をならす
            sound("assets/sounds/shot.mp3", 'start');
            //発射済みにする
            isShot = true;
        }
        //バーの位置をカウントの分だけ変える
        if (win == 1) score += winCount;
        else score += -winCount;
    }
    //何らかのキーが押されたら
    const P = keyPress('any');
    //カウントが50以上でクリックされたとき
    if (winCount >= 50 && (Up || P)) {
        //ゲームをリセット
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

//ゲームをリセット
function gameReset() {
    //変数をリセット
    valueReset();
    //カウントを変更
    startCount = countMax * 50;
    //未クリックにする
    isClick = false;
}

//変数の初期化
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
    //ゲームモードごとの変数
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
