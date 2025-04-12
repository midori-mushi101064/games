let keyPressed = {}; // 押されているキーを記録するオブジェクト

// キーが押されたら true にする
document.addEventListener('keydown', function (event) {
    keyPressed[event.key] = true;
});

// キーが離されたら false にする
document.addEventListener('keyup', function (event) {
    keyPressed[event.key] = false;
});

function keyPress(keyCode) {
    return keyPressed[keyCode];
}