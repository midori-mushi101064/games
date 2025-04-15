//trail.js
let trails = [];

function trail(x, y, r, w, s) {
    // 軌跡に現在の位置を追加
    trails.push({ x: x, y: y, r: r, w: w, s: s, alpha: 0.8 });
}

function trailStep() {

    // 軌跡の透明度を少しずつ下げる
    for (let t of trails) {
        t.alpha -= 0.05;
        t.s -= 0.1;
    }

    // αが0以下のものは削除
    trails = trails.filter(t => t.alpha > 0);
    trails = trails.filter(t => t.s > 0);
}

function trailRender() {
    //キャンバスを取得
    const ctx = canvas.getContext('2d');
    // 軌跡を描画
    for (let t of trails) {
        ctx.save();
        ctx.fillStyle = `rgba(237, 244, 247, ${t.alpha})`;
        ctx.beginPath();
        const s = t.w / 2 - t.s / 2;
        ctx.arc(getMoveX(t.x, t.r + 90, s), getMoveY(t.y, t.r + 90, s), t.s * 10 / 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.arc(getMoveX(t.x, t.r - 90, s), getMoveY(t.y, t.r - 90, s), t.s * 10 / 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}