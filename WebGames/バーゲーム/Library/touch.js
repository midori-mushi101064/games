//touch.js

//変数の定義
let touchX = Number(0);
let touchY = Number(0);
let touchDown = false;
let touchUp = false;
let touchDown2 = false;
let touchUp2 = false;
//タッチの初期化
function touchReset() {
    canvas.onmousedown = handler;
    canvas.onmousemove = handler;
    canvas.onmouseup = handler;
    canvas.addEventListener("touchstart", handler, { passive: false });
    canvas.addEventListener("touchmove", handler, { passive: false });
    canvas.addEventListener("touchend", handler, { passive: false });
}
//タッチの情報を取得// 1本目の指のIDを覚えておく
let primaryTouchId = null;

function handler(e) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;

    let clientX, clientY;

    if (e.type === "touchstart") {
        // 新しく指が触れたとき
        if (primaryTouchId === null) {
            // まだ1本目が決まってないなら
            primaryTouchId = e.changedTouches[0].identifier;
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
            touchDown = true;
            touchUp = false;
        }

        if (e.touches.length >= 2) {
            touchDown2 = true;
            touchUp2 = false;
        }

    } else if (e.type === "touchmove") {
        // 動いた指の中に1本目があるなら座標更新
        for (let t of e.touches) {
            if (t.identifier === primaryTouchId) {
                clientX = t.clientX;
                clientY = t.clientY;
            }
        }

    } else if (e.type === "touchend" || e.type === "touchcancel") {
        // 指が離れたとき
        for (let t of e.changedTouches) {
            if (t.identifier === primaryTouchId) {
                // 1本目が離れたら
                touchDown = false;
                touchUp = true;
                primaryTouchId = null;
            }
        }

        if (e.touches.length < 2 && touchDown2) {
            touchDown2 = false;
            touchUp2 = true;
        }

    } else if (e.type === "mousedown") {
        clientX = e.clientX;
        clientY = e.clientY;
        touchDown = true;
        touchUp = false;
    } else if (e.type === "mousemove") {
        clientX = e.clientX;
        clientY = e.clientY;
    } else if (e.type === "mouseup") {
        clientX = e.clientX;
        clientY = e.clientY;
        touchDown = false;
        touchUp = true;
    }

    if (clientX !== undefined && clientY !== undefined) {
        touchX = (clientX - rect.left) * scaleX;
        touchY = (clientY - rect.top) * scaleY;
    }

    if (e.cancelable) e.preventDefault();
}


/*
function waitForTouchUp() {
    let r = 20;
    return new Promise(resolve => {
        const check = () => {
            if (touchUp || keyPress('any')) {
                resolve(); // 押された！
            } else {
                requestAnimationFrame(check); // 次のフレームでまた確認
            }

            clear();
            if (r >= 390) {
                r = 20;
                imgCR('logo.png', csX(0), csY(150), 300, 300, Math.sin(r) * 50);
            }
            else if (r >= 30) {
                r += 15;
                imgCR('logo.png', csX(0), csY(150), 300, 300, r);
            }
            else {
                r += 0.05;
                imgCR('logo.png', csX(0), csY(150), 300, 300, Math.sin(r) * 50);
            }
            textC(csX(0), csY(-150), 'クリックしてスタート', 100, "#9ef0a6");
        };
        check();
    });
}
*/