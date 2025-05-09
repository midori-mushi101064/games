// canvas.js
const screenSizeW = 1920 / 2;	// スクリーンサイズ横
const screenSizeH = 1280 / 2;	// スクリーンサイズ縦

// canvas をクリア
function clear() {
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function canvasReset() {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden'; // スクロール防止
    //document.body.style.backgroundColor = '#000000';

    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    canvas.width = screenSizeW;
    canvas.height = screenSizeH;

    canvas.style.display = 'block';
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.transform = 'translate(-50%, -50%)'; // 中央に表示
    canvas.style.zIndex = '0';  // ← canvasを一番後ろにする
    canvas.style.borderRadius = '20px';  // ← canvasの角を丸くする


    window.addEventListener('resize', reSize, { passive: true });
    reSize();
}

function reSize() {
    const scale = Math.min(window.innerWidth / screenSizeW, window.innerHeight / screenSizeH);
    canvas.style.width = `${screenSizeW * scale}px`;
    canvas.style.height = `${screenSizeH * scale}px`;
}

// フルスクリーンにする関数
function Fullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) { // iPhone対応
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { // 古いIE対応
        canvas.msRequestFullscreen();
    }
}


