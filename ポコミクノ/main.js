// main.js


//読み込まれたら初期化
window.onload = async function () {
    //canvasの初期化
    canvasReset();
    //その他の初期化
    reset();
    //クリックまで待つ
    await waitForTouchUp();
    sound('assets/sounds/bgm/title.mp3', 'loop', 0.3);
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
let paddleX;
let paddleY;
let pointerX;
let pointerY;
let paddleWidth;
let arrowR;
const pokoWidth = 50;
const pokoHeight = 50;
const mikunoWidth = 50;
const mikunoHeight = 50;
const wakuWidth = 720;

let scene;

//初期化
function reset() {
    //タッチの初期化
    touchReset();
    //ポコの初期化
    pokoReset();
    //ミクノの初期化
    mikunoReset();
    //変数の初期化
    paddleX = csX(0);
    paddleY = screenSizeH - 100;
    paddleWidth = 100;
    touchX = csX(0);
    scene = 'title';
    cursorX = csX(0);
    cursorY = csY(0);
    arrowR = -90;
    isCursor = false;
    trails = [];
}
//ゲームを進める
function step() {
    //
    trailStep();
    //疑似カーソルの進行
    cursorStep();
    //カーソルの位置を決める
    if (isCursor) {
        pointerX = cursorX;
        pointerY = cursorY;
    }
    else {
        pointerX = touchX;
        pointerY = touchY;
    }
    //矢印の角度を決める
    if (!isCursor || (isCursor && cursorMode == 1)) {
        arrowR = getAngle(paddleX, paddleY - pokoHeight, pointerX, pointerY);
    }
    //パドルの進行
    paddleStep();
    //ポコの進行
    pokoStep();
}
//描画
function Render() {
    //
    trailRender();
    //枠の描画
    wakuRender();
    //ミクノの描画
    mikunoRender();
    //ポコの描画
    pokoRender();
    //パドルの描画
    paddleRender();
    //矢印の描画
    arrowRender();
    //疑似カーソルの描画
    cursorRender();
}

//パドルの進行
function paddleStep() {
    //シフトキーが押されて無いとき動く
    for (let i = 0; i < 10; i++) {
        if (!keyPress('Shift') && !touchDown2) {
            trail(paddleX, paddleY, 90, paddleWidth, 5);
            paddleX += (pointerX - paddleX) * 0.004;
        }

        /*枠の当たり判定*/
        //変数の宣言
        const w = paddleWidth / 2 + 5;
        const wakuW = wakuWidth / 2;
        //当たり判定を計算
        const left = Number(paddleX - w);
        const right = Number(paddleX + w);
        //枠の左右の判定
        if (csX(0) - wakuW >= left || csX(0) + wakuW <= right) {
            //X座標がそれ以上増えないようにする
            paddleX = (csX(0) - wakuW >= left) ? csX(0) - wakuW + w : csX(0) + wakuW - w;
        }
    }
    //クリックかスペースキーを押したらポコを発射
    if (touchUp || keyJustPress(' ')) {
        pokoMake();
    }
}

//パドルの描画
function paddleRender() {
    //キャンバスを取得
    const ctx = canvas.getContext('2d');
    //線を描く
    ctx.save();
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(paddleX - paddleWidth / 2, paddleY);
    ctx.lineTo(paddleX + paddleWidth / 2, paddleY);
    ctx.stroke();
    ctx.restore();
}

//矢印の描画
function arrowRender() {
    //変数を定義
    const x = getMoveX(paddleX, arrowR, 60);
    const y = getMoveY(paddleY - pokoHeight, arrowR, 60);
    //キャンバスを取得
    const ctx = canvas.getContext('2d');
    //線を描く
    ctx.save();
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(getMoveX(x, arrowR + 225, 30), getMoveY(y, arrowR + 225, 30));
    ctx.lineTo(x, y);
    ctx.lineTo(getMoveX(x, arrowR + 135, 30), getMoveY(y, arrowR + 135, 30));
    ctx.stroke();
    ctx.restore();
}

//左右の枠線の描画
function wakuRender() {
    //キャンバスを取得
    const ctx = canvas.getContext('2d');
    const w = wakuWidth / 2 + 5;
    const x = csX(0);
    //線を描く
    ctx.save();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#a8e4f0";
    ctx.beginPath();
    ctx.moveTo(x - w, 0);
    ctx.lineTo(x - w, screenSizeH);
    ctx.moveTo(x + w, 0);
    ctx.lineTo(x + w, screenSizeH);
    ctx.stroke();
    ctx.restore();
}

console.error('内部データをいじってクリアしても楽しくないんじゃないかな？');