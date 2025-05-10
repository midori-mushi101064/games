// image.js

let images = []; // 画像を格納する配列

function makeImage(img) {
    // 画像が配列にない場合、新たに画像を作成
    if (images.indexOf(img) == -1) {
        // 画像を作成
        let image = new Image();
        // 画像のパスを指定
        image.src = img;
        // 画像を配列に追加
        images.push(img);
        // 画像を配列に追加
        images[img] = image;
    }
}


// 左上を原点として画像を描画
function img(img, x, y, w, h) {
    // X座標とY座標を数値に変換
    x = Number(x);
    y = Number(y);
    // 横幅と縦幅を数値に変換
    w = Number(w);
    h = Number(h);
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    // 画像が配列にない場合、新たに画像を作成
    makeImage(img);
    // 画像を canvas に描画
    ctx.drawImage(images[img], x, y, w, h);
}

// 中心を原点として画像を描画
function imgC(img, x, y, w, h) {
    // X座標とY座標を数値に変換
    x = Number(x);
    y = Number(y);
    // 横幅と縦幅を数値に変換
    w = Number(w);
    h = Number(h);
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    // 画像が配列にない場合、新たに画像を作成
    makeImage(img);
    // 中心座標を求める
    let a = x - w / 2;
    let b = y - h / 2;
    // 画像を canvas に描画
    ctx.drawImage(images[img], a, b, w, h);
}

// 左上を原点として回転できる画像を描画
function imgR(img, x, y, w, h, r) {
    // X座標とY座標を数値に変換
    x = Number(x);
    y = Number(y);
    // 横幅と縦幅を数値に変換
    w = Number(w);
    h = Number(h);
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    // 画像が配列にない場合、新たに画像を作成
    makeImage(img);
    // 中心座標を求める
    let a = x + w / 2;
    let b = y + h / 2;
    // 画像を canvas に描画
    ctx.save();
    ctx.translate(a, b);
    ctx.rotate(r * Math.PI / 180);
    ctx.translate(-1 * a, -1 * b);
    ctx.drawImage(images[img], x, y, w, h);
    ctx.restore();
}

// 中心を原点として回転できる画像を描画
function imgCR(img, x, y, w, h, r) {
    // X座標とY座標を数値に変換
    x = Number(x);
    y = Number(y);
    // 横幅と縦幅を数値に変換
    w = Number(w);
    h = Number(h);
    // canvas要素を取得
    const ctx = canvas.getContext('2d');
    // 画像が配列にない場合、新たに画像を作成
    makeImage(img);
    // 中心座標を求める
    let a = -w / 2;
    let b = -h / 2;
    // 画像を canvas に描画
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r * Math.PI / 180);
    ctx.drawImage(images[img], a, b, w, h);
    ctx.restore();
}

//中心を原点としてテキストを描画
function textC(x, y, text, px, color,) {
    //キャンバスを取得
    const ctx = canvas.getContext('2d');
    ctx.font = `${px}px 'HG創英角ﾎﾟｯﾌﾟ体'`;

    // 文字の実際の横幅を測る
    const textWidth = ctx.measureText(text).width;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    // XもYも真ん中に合わせる
    ctx.strokeText(text, x - textWidth / 2, y + px / 3);  // Yちょっと下に（調整）
    ctx.fillStyle = color;
    ctx.fillText(text, x - textWidth / 2, y + px / 3);
}

function roundRect(x, y, width, height, radius) {
    //キャンバスを取得
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
}