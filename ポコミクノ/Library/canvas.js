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
    // 背景を黒にする
    document.body.style.setProperty("background-color", "#000000")
    //canvas要素を作成
    canvas = document.createElement('canvas');
    //作成したcanvas要素をbodyタグに追加
    document.body.appendChild(canvas);
    //canvasの横幅
    canvas.width = screenSizeW;
    //canvasの縦幅
    canvas.height = screenSizeH;
    // キャンバスの位置を中心に移動する
    canvas.style.setProperty("margin", "0px auto");
    //ブラウザのサイズが変更されたとき、ReSizeを呼び出す
    addEventListener('resize', reSize, { passive: true });
    //ReSizeを呼び出す
    reSize();
}

// サイズ変更
function reSize() {
    let ratio; // ブラウザとcanvasの比率
    // ブラウザとcanvasの比率の、縦と横を計算し、小さいほうをratioに代入する
    ratio = Math.min(innerWidth / canvas.width, innerHeight / canvas.height);
    // canvasのサイズを、ブラウザに合わせて変更する
    canvas.style.width = canvas.width * ratio + 'px';
    canvas.style.height = canvas.height * ratio + 'px';
}