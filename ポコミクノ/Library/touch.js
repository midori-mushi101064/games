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
    canvas.addEventListener("touchstart", handler)
    canvas.addEventListener("touchmove", handler)
    canvas.addEventListener("touchend", handler)
}
//タッチの情報を取得
function handler(e) {
    //ずれを修正
    let rect = canvas.getBoundingClientRect();

    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    //XY座標を取得
    if (e.touches && e.touches[0]) {
        touchX = (e.touches[0].clientX - rect.left) * scaleX;
        touchY = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
        touchX = (e.clientX - rect.left) * scaleX;
        touchY = (e.clientY - rect.top) * scaleY;
    }
    //タッチ中か
    if (e.type === "mousedown" || e.type === "touchstart") {
        touchDown = true;
        touchUp = false;
    }

    if (e.type === "mouseup" || e.type === "touchend") {
        touchDown = false;
        touchUp = true;
    }

    // 2本目の指がある場合
    if (e.touches && e.touches[1]) {
        touchDown2 = true;
        touchUp2 = false;
    } else {
        // 指が1本以下になった瞬間、2本目が離されたとみなす
        if (touchDown2) {
            touchDown2 = false;
            touchUp2 = true;
        }
    }
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