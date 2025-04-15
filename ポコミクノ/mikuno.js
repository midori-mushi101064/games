// mikuno.js

//ウェーブのミクノを定義
let waveMikuno = [];
//盤面上にあるミクノを定義
let mikunoNum = [];

//ミクノのクラスを定義
class Mikuno {
    constructor(name, src, hp, bairitu, x, y) {
        this.name = name;
        this.src = src;
        this.hp = hp;
        this.bairitu = bairitu;
        this.x = x;
        this.y = y;
        this.size = 0;
        this.date1 = 0;
        this.date2 = 0;
    }

}

//ミクノのリストを定義
const mikunolist = [
    { name: 'mikuno', src: 'assets/images/mikuno/シンプルミクノ.png', bairitu: 1 },
    { name: 'mikuno', src: 'assets/images/mikuno/カチカチミクノ.png', bairitu: 2 },
    { name: 'mikuno', src: 'assets/images/mikuno/コチコチミクノ.png', bairitu: 3 },
    { name: 'mikuno', src: 'assets/images/mikuno/スケスケミクノ.png', bairitu: 1 },
];

//ミクノの初期化
function mikunoReset() {
    mikunoNum = [];
}

//ミクノを描画
function mikunoRender() {
    for (let i = 0; i < mikunoNum.length; i++) {
        //データを取得
        let m = mikunoNum[i];
        //ミクノを描画
        imgC(m.src, m.x, m.y, 0.01 * m.size * mikunoWidth, 0.01 * m.size * mikunoHeight);
    }
}