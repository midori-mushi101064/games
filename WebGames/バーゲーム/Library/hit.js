// hit.js

// 長方形の当たり判定
function hit(x1, y1, h1, w1, x2, y2, h2, w2) {
    // x1, y1, h1, w1, x2, y2, h2, w2 を数値に変換
    x1 = Number(x1);
    y1 = Number(y1);
    h1 = Number(h1);
    w1 = Number(w1);
    x2 = Number(x2);
    y2 = Number(y2);
    h2 = Number(h2);
    w2 = Number(w2);
    // 当たり判定の範囲を求める
    let left1 = x1;
    let right1 = x1 + w1;
    let top1 = y1;
    let bottom1 = y1 + h1;
    let left2 = x2;
    let right2 = x2 + w2;
    let top2 = y2;
    let bottom2 = y2 + h2;
    // 判定を行う
    return (left1 <= right2 && right1 >= left2 && top1 <= bottom2 && bottom1 >= top2);
}

// 円の当たり判定
function hitC(x1, y1, r1, x2, y2, r2) {
    // x1, y1, r1, x2, y2, r2 を数値に変換
    x1 = Number(x1);
    y1 = Number(y1);
    r1 = Number(r1);
    x2 = Number(x2);
    y2 = Number(y2);
    r2 = Number(r2);
    // 2点間の距離を求める
    let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    // 判定を行う
    return (distance <= r1 + r2);
}

// 長方形と円の当たり判定
function hitRC(rx, ry, rw, rh, cx, cy, cr) {
    rx = Number(rx);
    ry = Number(ry);
    rw = Number(rw);
    rh = Number(rh);
    cx = Number(cx);
    cy = Number(cy);
    cr = Number(cr);

    let nx = Math.max(rx, Math.min(cx, rx + rw));
    let ny = Math.max(ry, Math.min(cy, ry + rh));

    return Math.pow(nx - cx, 2) + Math.pow(ny - cy, 2) <= Math.pow(cr, 2);
}