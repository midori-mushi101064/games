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
//タッチの情報を取得
function handler(e) {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;

    let clientX, clientY;

    // タッチの場合
    if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches[0]) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
    } else {
        // マウス操作
        clientX = e.clientX;
        clientY = e.clientY;
    }

    touchX = (clientX - rect.left) * scaleX;
    touchY = (clientY - rect.top) * scaleY;

    if (e.type === "mousedown" || e.type === "touchstart") {
        touchDown = true;
        touchUp = false;
    }

    if (e.type === "mouseup" || e.type === "touchend") {
        touchDown = false;
        touchUp = true;
    }

    if (e.touches && e.touches[1]) {
        touchDown2 = true;
        touchUp2 = false;
    } else {
        if (touchDown2) {
            touchDown2 = false;
            touchUp2 = true;
        }
    }

    // デフォルト動作を止める（スクロールなど）
    if (e.cancelable) e.preventDefault();
}

function waitForTouchUp() {
    let r = 20;
    return new Promise(resolve => {
        const check = () => {
            if (touchUp) {
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