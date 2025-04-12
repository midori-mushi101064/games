// poko.js

//持ちポコを定義
let Mypoko = [];
//盤面上にあるポコを定義
let pokoNum = [];
//発射待ちポコを定義
let pokoWait = [];

//ポコのクラスを定義
class Poko {
    constructor(name, src, step, x, y, r) {
        this.name = name;
        this.src = src;
        this.step = step;
        this.x = x;
        this.y = y;
        this.r = r;
        this.size = 100;
        this.removeFlag = false;
        this.date1 = 0;
        this.date2 = 0;
    }

}

//ポコのリストを定義
const pokolist = [
    { name: 'poko', src: 'assets/poko/ポコ.png', step: 3 },
    { name: 'ringo', src: 'assets/poko/りんご.png', step: 2 },
    { name: '90dopoko', src: 'assets/poko/90度ポコ.png', step: 5 },
    { name: 'bomu', src: 'assets/poko/ボム.png', step: 1.5 },
    { name: 'bomu2', src: 'assets/poko/ボム2.png', step: 0 },
    { name: 'inoshishi', src: 'assets/poko/イノシシ.png', step: 3 },
    { name: 'bu-merann', src: 'assets/poko/ブーメラン.png', step: 4 },
];

//変数の初期化
function pokoReset() {
    Mypoko = [0, 1, 2, 3, 5, 6];
    pokoNum = [];
}

//ポコをチャージ
function pokoCharge() {
    let p;
    //持ちポコがないならポコを、持ちポコがあるならランダムなポコを定義
    if (Mypoko.length == 0) {
        //ポコを定義
        p = 0
    }
    else {
        //持ちポコの中からランダムなポコを定義
        p = Mypoko[getRundomInt(Mypoko.length) - 1];
    }
    //ポコのデータを取得
    p = pokolist[p];
    //発射待ちのポコに追加
    pokoWait.push(p);
}

//ポコを作る
function pokoMake() {
    //もしチャージがないなら
    if (pokoWait.length == 0) {
        //音をならす
        sound('assets/sounds/noCharge.mp3', 'start');
        pokoCharge();
    }
    //もしチャージがあるなら
    else {
        //音をならす
        sound('assets/sounds/shot.mp3', 'start');
        //データを取得
        let p = pokoWait[0];
        //新たなポコを作成
        p = new Poko(p.name, p.src, p.step, paddleX, paddleY - pokoHeight, getAngle(paddleX, paddleY - pokoHeight, touchX, touchY));
        //チャージから削除
        pokoWait.splice(0, 1)
        //盤面に追加
        pokoNum.push(p);
    }
}

//ポコを描画する
function pokoRender() {
    //盤面上にあるポコを描画
    //盤面上にあるポコの数だけ繰り返す
    for (let i = 0; i < pokoNum.length; i++) {
        //データを取得
        let p = pokoNum[i];
        let r = p.r;
        //ブーメランなら回転
        if (p.name == 'bu-merann') {
            r += p.date1;
        }
        //ポコを描画
        imgCR(p.src, p.x, p.y, 0.01 * p.size * pokoWidth, 0.01 * p.size * pokoHeight, r);
    }
    //発射待ちのポコを描画
    if (pokoWait.length > 0) {
        //データを取得
        const p = pokoWait[0]
        //ポコを描画
        imgCR(p.src, paddleX, paddleY - pokoHeight, pokoWidth, pokoHeight, getAngle(paddleX, paddleY - pokoHeight, touchX, touchY));
    }
}

//ポコの進行
function pokoStep() {
    //盤面上にあるポコの数だけ繰り返す
    for (let i = 0; i < pokoNum.length; i++) {
        //データを取得
        let p = pokoNum[i];
        let d1 = p.date1;
        let d2 = p.date2;
        //ポコが削除状態か
        if (p.removeFlag) {
            //削除状態なら小さくする
            p.size -= 5;
            //サイズが0ならリストから削除
            if (p.size <= 0) {
                pokoNum.splice(i, 1)
            }
        }
        else {
            //ポコを移動させる
            pokoMove(i);
            reflection(i);
            //行動する
            switch (p.name) {
                case 'poko':
                    break;
                case 'ringo':
                    break;
                case '90dopoko':
                    break;
                case 'bomu':
                    break;
                case 'bomu2':
                    break;
                case 'inoshishi':
                    break;
                case 'bu-merann':
                    d1 += 15;
                    break;
            }
            p.date1 = d1;
            p.date2 = d2;
        }
    }
}

//ポコの移動
function pokoMove(n, s) {
    //ポコのデータを取得
    let p = pokoNum[n];
    if (s == undefined) {
        s = p.step;
    }
    // 新しい座標を計算
    p.x = getMoveX(p.x, p.r, s);
    p.y = getMoveY(p.y, p.r, s);
}

//反射
function reflection(i) {

    //データを取得
    let p = pokoNum[i];
    //変数の宣言
    let r = p.r;
    let x = p.x;
    let y = p.y;
    const w = pokoWidth / 2;
    const h = pokoHeight / 2;
    const wakuW = wakuWidth / 2;
    const paddleW = paddleWidth / 2;

    //当たり判定を計算
    const left = Number(x - w);
    const right = Number(x + w);
    const top = Number(y - h);
    const bottom = Number(y + h);

    /*枠の判定*/
    //枠の左右の判定
    if (csX(0) - wakuW >= left || csX(0) + wakuW <= right) {
        //削除状態じゃないなら音をならす
        if (!pokoNum[i].removeFlag) {
            sound('assets/sounds/waku.mp3', 'start');
        }
        //90度ポコの場合
        if (p.name == '90dopoko') {
            //90度回す
            r += 90;
        }
        //イノシシの場合
        else if (p.name == 'inoshishi') {
            //ポコを削除
            pokoRemove(i);
        }
        //その他のポコの場合
        else {
            //反射する
            r = (r * -1) + 180;
        }
        //X座標がそれ以上増えないようにする
        x = (csX(0) - wakuW >= left) ? csX(0) - wakuW + w : csX(0) + wakuW - w;
    }
    //枠の上の判定
    if (top <= 0) {
        //削除状態じゃないなら音をならす
        if (!pokoNum[i].removeFlag) {
            sound('assets/sounds/waku.mp3', 'start');
        }
        //90度ポコの場合
        if (p.name == '90dopoko') {
            //90度回す
            r += 90;
        }
        //イノシシの場合
        else if (p.name == 'inoshishi') {
            //ポコを削除
            pokoRemove(i);
        }
        //その他のポコの場合
        else {
            //反射する
            r *= -1;
        }
        //Y座標がそれ以上上がらないようにする
        y = 0 + h;
    }
    //枠の下の判定
    if (bottom >= screenSizeH) {
        //ポコを削除
        pokoRemove(i);
    }

    /*パドルの判定*/
    //パドルの上下の判定
    if (bottom >= paddleY - 5 && top <= paddleY + 5 && x >= paddleX - paddleW && x <= paddleX + paddleW) {
        //削除状態じゃないなら音をならす
        if (!pokoNum[i].removeFlag) {
            sound('assets/sounds/waku.mp3', 'start');
        }
        //90度ポコの場合
        if (p.name == '90dopoko') {
            //90度回す
            r += 90;
        }
        //イノシシの場合
        else if (p.name == 'inoshishi') {
            //ポコを削除
            pokoRemove(i);
        }
        //その他のポコの場合
        else {
            //反射する
            r *= -1;
        }
        //Y座標をパドルの上にそろえる
        y = paddleY - w - 5;
    }


    //角度を変更
    p.r = r;
    //位置を変更
    p.x = x;
    p.y = y;

}

//ポコの削除
function pokoRemove(i) {
    //音をならす
    sound('assets/sounds/fall.mp3', 'start', 0.2);

    //削除状態にする
    pokoNum[i].removeFlag = true;
}