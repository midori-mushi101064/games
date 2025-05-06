let sounds = [];

// Soundクラス Audioを継承
class Sound extends Audio {
    // コンストラクタ
    constructor(src) {
        // 親クラスのコンストラクタを呼び出す
        super(src);
        // autoplayを無効にする
        this.autoplay = false;
        // 初期音量を設定（必要に応じて変更）
        this.volume = 1;
    }

    // 音声再生
    start() {
        // 再生中の音源を先頭にする
        this.currentTime = 0;
        // ミュートを無効にする
        this.muted = false;
        // 音声を再生
        this.play();
    }

    // 音声ループ
    loop() {
        // ループ再生されるようにする
        super.loop = true;
        // 音声再生
        this.start();
    }

    // 音声を停止
    stop() {
        // 音声を一時停止する
        this.pause();
        // 再生場所を最初に戻す
        this.currentTime = 0;
    }

    // 音量を変更
    setVolume(volume) {
        // 音量を設定（0〜1の範囲）
        this.volume = Math.min(1, Math.max(0, volume)); // 範囲を制限
        this.volume = volume;  // 設定した音量を適用
    }
}

function sound(a, b, volume) {
    if (sounds.indexOf(a) == -1) {
        let sound = new Sound(a);
        sounds.push(a);
        sounds[a] = sound;
    }

    // 音量の変更があれば適用
    if (volume !== undefined) {
        sounds[a].setVolume(volume);
    }

    switch (b) {
        case 'start':
            sounds[a].start();
            break;
        case 'loop':
            sounds[a].loop();
            break;
        case 'stop':
            sounds[a].stop();
            break;
        default:
            console.error('error');
            break;
    }
}
