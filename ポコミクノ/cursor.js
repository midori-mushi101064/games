//cursor.js

//変数の定義
let cursorX;
let cursorY;
let isCursor;
let cursorMode = 2;

//カーソルの進行
function cursorStep() {
    //矢印キーがどれか押されたら疑似カーソルモードに切り替える
    if (keyPress('ArrowRight') || keyPress('ArrowLeft') || keyPress('ArrowUp') || keyPress('ArrowDown') && !isCursor) {
        isCursor = true;
    }
    //疑似カーソルのX座標を変える
    if (keyPress('ArrowRight')) {
        cursorX += 10;
    }
    else if (keyPress('ArrowLeft')) {
        cursorX -= 10;
    }
    //カーソルのY座標を変える
    if (keyPress('ArrowUp')) {
        //モードが2なら角度を変える
        if (cursorMode == 1) {
            cursorY -= 10;
        }
        else {
            arrowR += 5;
        }
    }
    else if (keyPress('ArrowDown')) {
        //モードが2なら角度を変える
        if (cursorMode == 1) {
            cursorY += 10;
        }
        else {
            arrowR -= 5;
        }
    }
    //枠の当たり判定
    if (cursorX <= 0 || cursorX >= screenSizeW) {
        cursorX = (cursorX <= 0) ? 0 : screenSizeW;
    }
    if (cursorY <= 0 || cursorY >= screenSizeH) {
        cursorY = (cursorY <= 0) ? 0 : screenSizeH;
    }
    //疑似カーソルモードならマウスカーソルを隠す
    if (isCursor) {
        document.body.classList.add("hide-cursor");
    }
    else {
        document.body.classList.remove("hide-cursor");
        cursorX = touchX;
        cursorY = touchY;
    }
}

//カーソルの描画
function cursorRender() {
    //モードが1なら描画
    if (isCursor && cursorMode == 1) {
        //キャンバスを取得
        const ctx = canvas.getContext('2d');
        //線を描く
        ctx.save();
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#0d75b5";
        ctx.beginPath();
        ctx.moveTo(cursorX - 10, cursorY);
        ctx.lineTo(cursorX + 10, cursorY);
        ctx.moveTo(cursorX, cursorY - 10);
        ctx.lineTo(cursorX, cursorY + 10);
        ctx.stroke();
        ctx.restore();
    }
}