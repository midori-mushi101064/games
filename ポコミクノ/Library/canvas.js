// canvas.js
const screenSizeW = 1920;	// スクリーンサイズ横
const screenSizeH = 1280;	// スクリーンサイズ縦

// canvas をクリア
function clear() {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function canvasReset() {
    document.body.style.setProperty("background-color", "#000000");

    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = screenSizeW * dpr;
    canvas.height = screenSizeH * dpr;

    canvas.style.width = screenSizeW + 'px';
    canvas.style.height = screenSizeH + 'px';
    canvas.style.setProperty("margin", "0px auto");
    canvas.style.setProperty("display", "block");

    let ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // スケーリング！

    addEventListener('resize', reSize, { passive: true });
    reSize();
}

function reSize() {
    let ratio = Math.min(innerWidth / screenSizeW, innerHeight / screenSizeH);
    canvas.style.transform = `scale(${ratio})`;
    canvas.style.transformOrigin = 'top left';

    // キャンバスを中央に表示する
    const left = (innerWidth - screenSizeW * ratio) / 2;
    const top = (innerHeight - screenSizeH * ratio) / 2;
    canvas.style.position = 'absolute';
    canvas.style.left = left + 'px';
    canvas.style.top = top + 'px';
}
