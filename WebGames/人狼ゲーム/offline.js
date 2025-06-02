
let Roles;
let Peoples;
let Names;

let blue = 0;
let red = 0;
let green = 0;

let AllBlueRole = [];
let AllRedRole = [];
let AllGreenRole = [];
let AllTuikaRole = [];

window.onload = function () {
    Roles = JSON.parse(localStorage.getItem("roles"));
    Peoples = JSON.parse(localStorage.getItem("peoples"));
    Names = JSON.parse(localStorage.getItem("names"));

    if (Roles == null) {
        window.location.href = "main.html"; // ゲーム画面へ移動
    }

    blue = Peoples[0];
    red = Peoples[1];
    green = Peoples[2];

    Roles.forEach(role => {
        for (let i = 0; i < role.value; i++) {
            switch (role.type) {
                case '村人陣営':
                    AllBlueRole.push(role);
                    break;
                case '人狼陣営':
                    AllRedRole.push(role);
                    break;
                case '第三陣営':
                    AllGreenRole.push(role);
                    break;
                case '追加役職':
                    AllTuikaRole.push(role);
                    break;
            }
        }
    });
    sethtml(`<b>人狼ゲーム</b><br><button onclick="gameStart()">クリックしてスタート</button>`);
}

let players;
let turn;
let isFirstTurn;
let myturnNum;
let deadPlayers;
let deadNum;
let gameAllRole;
let shinuyotei;
let mamorareru;
let norowareru;
let skip;

let gameTurn;

let killedPlayerNum;

function gameStart() {
    sound('sounds/redWin.mp3', 'stop');
    sound('sounds/blueWin.mp3', 'stop');
    sound('sounds/noWin.mp3', 'stop');
    let thisGameRole = [[...AllBlueRole], [...AllRedRole], [...AllGreenRole]];
    let thisGamePeople = [blue, red, green];
    deadPlayers = [];
    players = [];
    gameAllRole = [...AllBlueRole, ...AllRedRole, ...AllGreenRole];
    gameAllRole = [...new Set(gameAllRole)];
    for (let i = 0; i < Names.length; i++) {
        let p = { name: '', role: '', type: '', color: '', date1: null };
        let peopleNum = -1;
        while (peopleNum == -1 || thisGamePeople[peopleNum] == 0) {
            peopleNum = Math.floor(Math.random() * 3);
        }
        thisGamePeople[peopleNum]--;
        const rolePeople = thisGameRole[peopleNum];
        const rolenum = Math.floor(Math.random() * rolePeople.length);
        const role = rolePeople[rolenum];
        thisGameRole[peopleNum].splice(rolenum, 1);

        p.name = Names[i];
        p.role = role.name;
        p.type = role.type;
        p.color = role.color;

        players.push(p);
    }
    turn = -1;
    skip = '無し';
    shinuyotei = [];
    mamorareru = [];
    norowareru = [];
    deadNum = '無し';
    isFirstTurn = true;
    gameTurn = -1;
    sound('sounds/redWin.mp3', 'start');
    sound(`sounds/start${Math.floor(Math.random() * 3) + 1}.mp3`, 'start');
    sethtml(`<b>人狼ゲーム</b><br><button>クリックしてスタート</button>`);
    setTimeout(() => {
        sound('sounds/redWin.mp3', 'stop');
        sound('sounds/start1.mp3', 'stop');
        sound('sounds/start2.mp3', 'stop');
        sound('sounds/start3.mp3', 'stop');
        nextTurn();
    }, 2000);
}

function sethtml(html) {
    const box = document.getElementById("box");
    box.innerHTML = `${html}`;
}

function nextTurn() {
    sound('sounds/change.mp3', 'start');
    turn++;
    const box = document.getElementById("box");
    box.style.backgroundColor = "rgb(139, 115, 196)";
    if (turn == players.length) {
        if (!isFirstTurn) {
            sethtml(`<a style='font-size: 50px;'>朝になりました</a><br><button onclick='dessCheck();'>りょーかい！</button>`);

        }
        else {
            sethtml(`<a style='font-size: 50px;'>朝になりました</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
        }
    }
    else if (turn == players.length + 1) {
        if (gameAllRole.some(m => m.name === 'パン屋')) {
            if (players.some(m => m.role === 'パン屋')) {
                sound('sounds/pann1.mp3', 'start');
                sound('sounds/pann2.mp3', 'start');
                sethtml(`<a>1件のメッセージ</a><br><a style='font-size: 50px;'>おいしいパンが焼けました</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
            }
            else {
                sound('sounds/pann3.mp3', 'start');
                sethtml(`<a>1件のメッセージ</a><br><a style='font-size: 50px;'>パンは焼かれていませんでした</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
            }
        }
        else {
            sound('sounds/noMesse.mp3', 'start');
            sethtml(`<a style='font-size: 50px;'>特にメッセージはありません</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
        }
    }
    else if (turn == players.length + 2) {
        sound('sounds/noMesse.mp3', 'stop');
        sound('sounds/pann1.mp3', 'stop');
        sound('sounds/pann2.mp3', 'stop');
        sound('sounds/pann3.mp3', 'stop');
        if (!isFirstTurn) {
            if (skip == '会議') {
                skip = '無し';
                turn = -1;
                sethtml(`<a style='font-size: 50px;'>会議はスキップされました</a><br><button onclick='nextTurn'>りょーかい！</button>`);
            }
            else {
                if (turn >= players.length + 2 && skip == '夜') {
                    sethtml(`<b>会議</b><br><a style='font-size: 50px;'>夜はスキップされました</a><br><button onclick='voting()'>投票にうつる</button>`);
                }
                else {
                    sethtml(`<b>会議</b><br><button onclick='voting()'>投票にうつる</button>`);
                }
                if (skip == '夜') {
                    skip = '無し';
                }
                else {
                    turn = -1;
                }
            }
        }
        else {
            isFirstTurn = false;
            turn = -1;
            sethtml(`<b>会議</b><br><a style='font-size: 50px;'>一ターン目なので投票はありません</a><br><button onclick='nextTurn();'>夜にうつる</button>`);
        }
        clearCheck();
    }
    else if (isFirstTurn) {
        sethtml(`<a style='font-size: 50px;'>${players[turn].name}</a><br><a>のターンです</a><br><a>本人だけが画面を見てください。</a><br><button onclick='firstTurn();'>次へ</button>`);
    }
    else {
        myturnNum = -2;
        myTurn();
    }
    if (turn == 0) {
        gameTurn++;
        clearCheck();
    }
    if (gameTurn == 3) {
        players.filter(p => p.role == 'ともにゃん').forEach(p => {
            if (p.date1 == null) {
                p.name += '『ともにゃん』'
                p.date1 = 1;
            }
        });
    }
}

function firstTurn() {
    const p = players[turn];
    let role = p.role;
    if (role == 'エセ占い師') role = '占い師';
    switch (p.type) {
        case '村人陣営':
            sethtml(`<a>あなたの役職は</a><br><a style='font-size: 50px;'>${role}</a><br><a style='font-size: 18px;'>仲間と協力して人狼を村から追い出せ</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
            break;
        case '人狼陣営':
            sameRoleList('人狼陣営', false, `<a>あなたの役職は</a><br><a style='font-size: 50px;'>${role}</a><br><a style='font-size: 18px;'>仲間と協力して村を壊滅させよう</a><br><a>仲間</a>`, `<button onclick='nextTurn();'>りょーかい！</button>`);
            break;
        case '第三陣営':
            sethtml(`<a>あなたの役職は</a><br><a style='font-size: 50px;'>${role}</a><br><a style='font-size: 18px;'>単独行動で生き残れ</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
            break;
    }
    const box = document.getElementById("box");
    box.style.backgroundColor = p.color;
}

function voting() {
    meeting(true, `<a>投票</a>`, `<button onclick='exile();'>決定</button>`);
}

function exile() {
    const n = document.querySelector('input[name="kill"]:checked').value;
    const box = document.getElementById("box");
    if (n !== 'skip') {
        box.style.backgroundColor = "rgb(221, 109, 109)";
        const p = players[n];
        sethtml(`<a style='font-size: 50px;'>${p.name}</a><br><a>は追放された</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
        deadNum = deadPlayers.length;
        deadPlayers.push(p);
        players.splice(n, 1);
    }
    else {
        box.style.backgroundColor = "rgb(119, 164, 248)";
        deadNum = '無し';
        sethtml(`<a>だれも</a><br><a>追放されなかった</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
    }
}

function myTurn(n = 1) {
    myturnNum += n;
    const p = players[turn];
    const box = document.getElementById("box");
    if (myturnNum == -1) {
        sethtml(`<a style='font-size: 50px;'>${p.name}</a><br><a>のターンです</a><br><a>本人だけが画面を見てください。</a><br><button onclick='myTurn();'>次へ</button>`);
    }
    else if (myturnNum == 0) {
        let role = p.role;
        if (role == 'エセ占い師') role = '占い師';
        switch (p.type) {
            case '村人陣営':
                sethtml(`<a>あなたの役職は</a><br><a style='font-size: 50px;'>${role}</a><br><a style='font-size: 18px;'>仲間と協力して人狼を村から追い出せ</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                break;
            case '人狼陣営':
                sameRoleList('人狼陣営', false, `<a>あなたの役職は</a><br><a style='font-size: 50px;'>${role}</a><br><a style='font-size: 18px;'>仲間と協力して村を壊滅させよう</a><br><a>仲間</a>`, `<button onclick='myTurn();'>りょーかい！</button>`);
                break;
            case '第三陣営':
                sethtml(`<a>あなたの役職は</a><br><a style='font-size: 50px;'>${role}</a><br><a style='font-size: 18px;'>単独行動で生き残れ</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                break;
        }
        box.style.backgroundColor = p.color;
    }
    else {
        switch (p.role) {
            case '村人':
                waitRundom();
                break;
            case '占い師':
                if (myturnNum == 1) {
                    meeting(true, `<a>誰か一人、生存者の陣営を占えます</a><br><a>占いたい人を選択してください</a>`, `<button onclick='myTurn();'>占う</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    const n = document.querySelector('input[name="kill"]:checked').value;
                    if (n !== 'skip') {
                        const p = players[n];
                        box.style.backgroundColor = typeCheck(p).color;
                        sethtml(`<a>${p.name}</a><br><a>の陣営は</a><br><a style='font-size: 50px;'>${typeCheck(p).type}</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                        if (p.role == '妖狐') {
                            let kill = { Num: n, type: '自殺', fromNum: n };
                            shinuyotei.push(kill);
                        }
                        killedPlayerNum.push(n);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        myturnNum++;
                    }
                }
                else {
                    waitRundom();
                }
                break;
            case '霊媒師':
                if (myturnNum == 1) {
                    deadPlayersMeeting(true, `<a>誰か一人、死者の陣営を占えます</a><br><a>占いたい人を選択してください</a>`, `<button onclick='myTurn();'>占う</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    const n = document.querySelector('input[name="dead"]:checked').value;
                    if (n !== 'skip') {
                        const p = deadPlayers[n];
                        box.style.backgroundColor = typeCheck(p).color;
                        sethtml(`<a>${p.name}</a><br><a>の陣営は</a><br><a style='font-size: 50px;'>${typeCheck(p).type}</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                        killedPlayerNum.push(n);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        myturnNum++;
                    }
                }
                else {
                    waitRundom();
                }
                break;
            case '狩人':
                if (myturnNum == 1) {
                    meeting(true, `<a>誰か一人の死を守れます</a><br><a>守りたい人を選択してください</a>`, `<button onclick='myTurn();'>守る</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    const n = document.querySelector('input[name="kill"]:checked').value;
                    if (n !== 'skip') {
                        const p = players[n];
                        mamorareru.push(n);
                        killedPlayerNum.push(n);
                        sethtml(`<a>今夜、</a><br><a style='font-size: 50px;'>${p.name}</a><br><a>は人狼の奇襲から守られます</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        myturnNum++;
                    }
                }
                else {
                    waitRundom();
                }
                break;
            case 'パン屋':
                waitRundom();
                break;
            case 'ナイス猫又':
                waitRundom();
                break;
            case 'シェリフ':
                if (myturnNum == 1) {
                    meeting(true, `<a>誰か一人を奇襲できます</a><br><a>人外だと思う人を選択してください</a>`, `<button onclick='myTurn();'>お仕置き</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    const n = document.querySelector('input[name="kill"]:checked').value;
                    if (n !== 'skip') {
                        const p = players[n];
                        box.style.backgroundColor = "rgb(221, 109, 109)";
                        sethtml(`<a>今夜、</a><br><a style='font-size: 50px;'>${p.name}</a><br><a>を奇襲しました</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                        let kill = { Num: n, type: 'シェリフ', fromNum: turn };
                        shinuyotei.push(kill);
                        killedPlayerNum.push(n);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        myturnNum++;
                    }
                }
                else {
                    waitRundom();
                }
                break;
            case 'エセ占い師':
                if (myturnNum == 1) {
                    meeting(true, `<a>誰か一人、生存者の陣営を占えます</a><br><a>占いたい人を選択してください</a>`, `<button onclick='myTurn();'>占う</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    const n = document.querySelector('input[name="kill"]:checked').value;
                    if (n !== 'skip') {
                        const p = players[n];
                        if (Math.floor(Math.random() * 3) == 1) {
                            box.style.backgroundColor = typeCheck(p).color;
                            sethtml(`<a>${p.name}</a><br><a>の陣営は</a><br><a style='font-size: 50px;'>${typeCheck(p).type}</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                            if (p.role == '妖狐') {
                                let kill = { Num: n, type: '自殺', fromNum: n };
                                shinuyotei.push(kill);
                            }
                        }
                        else {
                            const r = Roles[Math.floor(Math.random() * Roles.length)].type;
                            box.style.backgroundColor = typeCheck(r).color;
                            sethtml(`<a>${p.name}</a><br><a>の陣営は</a><br><a style='font-size: 50px;'>${r}</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                        }
                        killedPlayerNum.push(n);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        myturnNum++;
                    }
                }
                else {
                    waitRundom();
                }
                break;
            case '狼憑き':
                waitRundom();
                break;
            case '巫女':
                const p = deadPlayers[deadNum];
                if (myturnNum == 1) {
                    if (deadNum == !'無し') {
                        if (typeCheck(p).type == '人狼陣営') {
                            sethtml(`<a>昨日会議で追放された</a><br><a>${p.name}</a><br><a>の陣営は</a><br><a style='font-size: 50px; color: rgb(221, 109, 109);'>人狼陣営</a><br><button onclick='myTurn();'>りょーかい</button>`);
                        }
                        else {
                            sethtml(`<a>昨日会議で追放された</a><br><a>${p.name}</a><br><a>の陣営は</a><br><a style='font-size: 50px; color: rgb(109, 167, 221);'>人狼陣営ではない</a><br><button onclick='myTurn();'>りょーかい</button>`);
                        }
                    }
                    else {
                        sethtml(`<a>昨日の会議では</a><br><a>だれも</a><br><a>追放されていません</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                    }
                }
                else {
                    waitRundom();
                }
                break;
            case 'タフガイ':
                waitRundom();
                break;
            case 'シールダー':
                if (myturnNum == 1) {
                    sethtml(`<a>次のターンで防御しますか？</a><br><button onclick='myTurn();'>防御する</button><button onclick='myTurn(2);'>防御しない</button>`);
                }
                else if (myturnNum == 2) {
                    mamorareru.push(turn);
                    waitRundom();
                }
                else {
                    waitRundom();
                }
                break;
            case '早起き':
                if (myturnNum == 1) {
                    sethtml(`<a>次のターンで夜をスキップしますか？</a><br><button onclick='myTurn();'>夜をスキップする</button><button onclick='myTurn(2);'>スキップしない</button>`);
                }
                else if (myturnNum == 2) {
                    waitRundom();
                    skip = (skip == '無し') ? '夜' : '会議';
                }
                else {
                    waitRundom();
                }
                break;
            case 'ゆうれい':
                waitRundom();
                break;
            case 'デッドホップ':
                waitRundom();
                break;
            ///////////
            //人狼陣営
            ///////////
            case '人狼':
                box.style.backgroundColor = "rgb(221, 109, 109)";
                if (myturnNum == 1) {
                    meeting(true, `<a>誰か一人、奇襲を行えます</a><br><a>奇襲したい人を選択してください</a>`, `<button onclick='myTurn();'>奇襲</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    const n = document.querySelector('input[name="kill"]:checked').value;
                    if (n !== 'skip') {
                        const p = players[n];
                        sethtml(`<a>今夜、</a><br><a style='font-size: 50px;'>${p.name}</a><br><a>を奇襲しました</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                        let kill = { Num: n, type: '人狼陣営', fromNum: turn };
                        shinuyotei.push(kill);
                        killedPlayerNum.push(n);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        myturnNum++;
                    }
                }
                else {
                    waitRundom();
                }
                break;
            case '猫又':
                waitRundom();
                break;
            case '狂人':
                waitRundom();
                break;
            case 'ダブルキラー':
                box.style.backgroundColor = "rgb(221, 109, 109)";
                if (myturnNum == 1) {
                    meeting(true, `<a>誰か一人、奇襲を行えます</a><br><a>奇襲したい人を選択してください</a>`, `<button onclick='myTurn();'>奇襲</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    const n = document.querySelector('input[name="kill"]:checked').value;
                    if (n !== 'skip') {
                        const p = players[n];
                        sethtml(`<a>今夜、</a><br><a style='font-size: 50px;'>${p.name}</a><br><a>を奇襲しました</a><br><button onclick='myTurn();'>りょーかい！</button>`);
                        let kill = { Num: n, type: '人狼陣営', fromNum: turn };
                        shinuyotei.push(kill);
                        killedPlayerNum.push(n);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        waitRundom();
                    }
                }
                else if (myturnNum == 3) {
                    meeting(true, `<a>誰か一人、奇襲を行えます</a><br><a>奇襲したい人を選択してください</a>`, `<button onclick='myTurn();'>奇襲</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 4) {
                    const n = document.querySelector('input[name="kill"]:checked').value;
                    if (n !== 'skip') {
                        const p = players[n];
                        sethtml(`<a>今夜、</a><br><a style='font-size: 50px;'>${p.name}</a><br><a>を奇襲しました</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
                        let kill = { Num: n, type: 'ダブルキラー', fromNum: turn };
                        shinuyotei.push(kill);
                        killedPlayerNum.push(n);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        waitRundom();
                    }
                }
                break;
            case 'イビルゲッサー':
                box.style.backgroundColor = "rgb(221, 109, 109)";
                if (myturnNum == 1) {
                    meeting(true, `<a>誰か一人、役職あてを行えます</a><br><a>役職当てが成功すると殺害できます</a><br><a>失敗すると逆に自分が死んでしまいます</a><br><a>役職当てを行う相手を選択してください</a>`, `<button onclick='myTurn();'>選択</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    const n = document.querySelector('input[name="kill"]:checked').value;
                    if (n !== 'skip') {
                        const p = players[n];
                        players[turn].date1 = n;
                        roleMeeting(true, `<a>${p.name}</a><br><a>の役職を当ててください</a>`, `<button onclick='myTurn();'>奇襲</button>`);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        waitRundom();
                    }
                }
                else if (myturnNum == 3) {
                    const n = document.querySelector('input[name="role"]:checked').value;
                    const pNum = players[turn].date1;
                    const p = players[pNum];
                    myturnNum = 0;
                    if (n == p.role) {
                        sethtml(`<a style='font-size: 50px;'>役職あて成功！</a><br><a>役職当てを続けますか？</a><br><button onclick='myTurn();'>続ける</button><br><button onclick='nextTurn();'>やめる</button>`);
                        let kill = { Num: pNum, type: 'イビルゲッサー', fromNum: turn };
                        shinuyotei.push(kill);
                        killedPlayerNum.push(pNum);
                    }
                    else {
                        sethtml(`<a style='font-size: 50px;'>役職あて失敗！</a><br><a>あなたは死にます</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
                        let kill = { Num: turn, type: '自殺', fromNum: turn };
                        shinuyotei.push(kill);
                    }
                }
                break;
            case 'ヴァンパイア':
                box.style.backgroundColor = "rgb(221, 109, 109)";
                if (myturnNum == 1) {
                    meeting(true, `<a>誰か一人の血を吸えます</a><br><a>血を吸われた人は次の会議の最中に死にます</a><br><a>血を吸いたい人を選択してください</a>`, `<button onclick='myTurn();'>血を吸う</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    const n = document.querySelector('input[name="kill"]:checked').value;
                    if (n !== 'skip') {
                        const p = players[n];
                        sethtml(`<a>今夜、</a><br><a style='font-size: 50px;'>${p.name}</a><br><a>の血を吸いました</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
                        let kill = { Num: n, type: 'ヴァンパイア', fromNum: turn };
                        shinuyotei.push(kill);
                        killedPlayerNum.push(n);
                    }
                    else {
                        box.style.backgroundColor = "rgb(119, 164, 248)";
                        myturnNum++;
                    }
                }
                else {
                    waitRundom();
                }
                break;
            case 'スキッパー':
                if (myturnNum == 1) {
                    sethtml(`<a>次のターンで会議をスキップしますか？</a><br><button onclick='myTurn();'>会議をスキップする</button><button onclick='myTurn(2);'>スキップしない</button>`);
                }
                else if (myturnNum == 2) {
                    waitRundom();
                    skip = '会議';
                }
                else {
                    waitRundom();
                }
                break;
            case '自爆魔':
                if (myturnNum == 1) {
                    meeting(false, `<a>自爆しますか？</a><br><a>自爆したら番号が上下の人</a><br><a>二人を巻き込んで自分も死にます</a>`, `<button onclick='myTurn();'>自爆！！</button><button onclick='myTurn(2);'>自爆しない</button>`, turn, killedPlayerNum);
                }
                else if (myturnNum == 2) {
                    waitRundom();
                    const n1 = (turn - 1 !== -1) ? turn - 1 : players.length - 1;
                    const n2 = (turn + 1 !== players.length) ? turn + 1 : 0;
                    let kill1 = { Num: n1, type: '自爆魔', fromNum: turn };
                    let kill2 = { Num: n2, type: '自爆魔', fromNum: turn };
                    let kill3 = { Num: turn, type: '自殺', fromNum: turn };
                    shinuyotei.push(kill1, kill2, kill3);
                }
                else {
                    waitRundom();
                }
                break;
            //第三陣営
            case '妖狐':
                waitRundom();
                break;
            case '神':
                if (myturnNum == 1) {
                    godRoleCheck(`<b style='font-size: 50px;'>プレイヤーの役職は下記の通りです</b><br>`, `<br><button onclick='myTurn();'>りょーかい！</button>`);
                }
                else {
                    waitRundom();
                }
                break;
            case 'ともにゃん':
                waitRundom();
                break;
            case '吊り人':
                waitRundom();
                break;
            default:
                sethtml(`<a>近日公開</a><br><button onclick='nextTurn();'>りょーかい！</button>`);
                break;
        }
    }
}

function meeting(checkBox = false, tophtml = 0, bottomhtml = 0, fromNum = null, killedPlayer = []) {
    let text = ``;
    if (tophtml !== 0) {
        text = `${tophtml}<br>`;
    }
    text += `<table id=meeting>`;
    let n = 0;
    for (let i = 0; i < players.length; i++) {
        if (!killedPlayer.includes(i)) {
            if (fromNum !== i) {
                const p = players[i];
                let color = (n % 2 === 0 ? "rgb(151, 231, 211)" : "rgb(111, 155, 221)");
                text += `
        <tr style="background-color: ${color}">
        `;
                if (checkBox) {
                    text += `
        <td style="width:60px">
        <input type="radio" name="kill" value="${i}" class="meetinginput"></input>
        </td>
        `;

                }
                text += `
        <td>
        <a style="width:150px">${p.name}</a>
        </td>
        <tr>
        `;
            }
            else {
                let color = (n % 2 === 0 ? "rgb(231, 151, 227)" : "rgb(177, 111, 221)");
                text += `
        <tr style="background-color: ${color}">
        `
                if (checkBox) {
                    text += `<td></td>`;
                }
                text += `
        <td>
        <b style="width:150px">あなた</b>
        </td>
        <tr>
        `;
            }
            n++;
        }
    }
    if (checkBox) {
        let color = (n % 2 === 0 ? "rgb(151, 231, 211)" : "rgb(111, 155, 221)");
        text += `
        <tr style="background-color: ${color}">
        <td style = "width:60px">
        <input type="radio" name="kill" value="skip" class="meetinginput" checked="true"></input>
        </td>
        <td>
        <a style="width:150px">スキップ</a>
        </td>
        <tr>
        `;
    }
    text += `</table>`;
    if (bottomhtml !== 0) {
        text += `<br> ${bottomhtml} `;
    }

    sethtml(text);
}

function deadPlayersMeeting(checkBox = false, tophtml = 0, bottomhtml = 0, fromNum = null, killedPlayer = []) {
    let text = ``;
    if (tophtml !== 0) {
        text = `${tophtml}<br>`;
    }
    text += `<table id=meeting>`;
    let n = 0;
    for (let i = 0; i < deadPlayers.length; i++) {
        if (!killedPlayer.includes(i)) {
            if (fromNum !== i) {
                const p = deadPlayers[i];
                let color = (n % 2 === 0 ? "rgb(151, 231, 211)" : "rgb(111, 155, 221)");
                text += `
        <tr style="background-color: ${color}">
        `;
                if (checkBox) {
                    text += `
        <td style="width:60px">
        <input type="radio" name="dead" value="${i}" class="meetinginput"></input>
        </td>
        `;

                }
                text += `
        <td>
        <a style="width:150px">${p.name}</a>
        </td>
        <tr>
        `;
            }
            else {
                let color = (n % 2 === 0 ? "rgb(231, 151, 227)" : "rgb(177, 111, 221)");
                text += `
        <tr style="background-color: ${color}">
        `
                if (checkBox) {
                    text += `<td></td>`;
                }
                text += `
        <td>
        <b style="width:150px">あなた</b>
        </td>
        <tr>
        `;
            }
            n++;
        }
    }
    if (checkBox) {
        let color = (n % 2 === 0 ? "rgb(151, 231, 211)" : "rgb(111, 155, 221)");
        text += `
        <tr style="background-color: ${color}">
        <td style = "width:60px">
        <input type="radio" name="dead" value="skip" class="meetinginput" checked="true"></input>
        </td>
        <td>
        <a style="width:150px">スキップ</a>
        </td>
        <tr>
        `;
    }
    text += `</table>`;
    if (bottomhtml !== 0) {
        text += `<br> ${bottomhtml} `;
    }

    sethtml(text);
}

function roleMeeting(checkBox = false, tophtml = 0, bottomhtml = 0) {
    let text = ``;
    if (tophtml !== 0) {
        text = `${tophtml}<br>`;
    }
    text += `<table id=meeting>`;
    let n = 0;
    for (let i = 0; i < gameAllRole.length; i++) {
        const r = gameAllRole[i];
        let color = (n % 2 === 0 ? "rgb(215, 151, 231)" : "rgb(172, 111, 221)");
        text += `
        <tr style="background-color: ${color}">
        `;
        if (checkBox) {
            text += `
        <td style="width:60px">
        <input type="radio" name="role" value="${r.name}" class="meetinginput" `;
            if (i == 0) text += `checked = "true"`;
            text += ` ></input></td>`;

        }
        text += `
        <td>
        <a style="width:150px">${r.name}</a>
        </td>
        <tr>
        `;
        n++;
    }
    text += `</table>`;
    if (bottomhtml !== 0) {
        text += `<br> ${bottomhtml} `;
    }
    sethtml(text);
}

function sameRoleList(type, checkBox = false, tophtml = 0, bottomhtml = 0) {
    let text = ``;
    if (tophtml !== 0) {
        text = `${tophtml}<br>`;
    }
    text += `<table id=meeting>`;
    let i = 0;
    players.filter(n => n.type == type).forEach(role => {
        if (!(type == '人狼陣営' && role.role == '狂人')) {
            let color = (i % 2 === 0 ? "rgb(215, 151, 231)" : "rgb(172, 111, 221)");
            text += `
        <tr style="background-color: ${color}">
        `;
            if (checkBox) {
                text += `
        <td style="width:60px">
        <input type="radio" name="role" value="${role.name}" class="meetinginput" `;
                if (i == 0) text += `checked = "true"`;
                text += ` ></input></td>`;

            }
            text += `
        <td>
        <a style="width:150px">${role.name}</a>
        </td>
        <tr>
        `;
            i++;
        }
    });
    text += `</table>`;
    if (bottomhtml !== 0) {
        text += `<br> ${bottomhtml} `;
    }
    sethtml(text);
}
function dessCheck() {
    let jinnrou = [];
    let shi = [];
    let kakuShi = [];
    for (let i = 0; i < mamorareru.length; i++) {
        const n = mamorareru[i];
        const p = players[n];
        if (!mamorareru.some(m => m && m.role === 'ともにゃん')) {
            kakuShi.push([p, n]);
            mamorareru[i] = null;
        }
    }
    for (let i = 0; i < shinuyotei.length; i++) {
        const s = shinuyotei[i];
        const pNum = Number(s.Num);
        const fromPNum = Number(s.fromNum);
        const p = [players[pNum], pNum];
        const fromP = [players[fromPNum], fromPNum];
        switch (s.type) {
            case 'シェリフ':
                if (p[0].type == '村人陣営') {
                    if (!kakuShi.some(k => k[1] === p[1])) {
                        kakuShi.push(fromP);
                    }
                }
                else {
                    if (!shi.some(k => k[1] === p[1])) {
                        shi.push(p);
                    }
                }
                break;
            case '人狼陣営':
                jinnrou.push(p);
                break;
            case 'ヴァンパイア':
                break;
            case 'イビルゲッサー':
            case '自殺':
                if (!kakuShi.some(k => k[1] === p[1])) {
                    kakuShi.push(p);
                }
                break;
            default:
                if (!shi.some(k => k[1] === p[1])) {
                    shi.push(p);
                }
                break;
        }
    }
    shi = shi.filter(n => !kakuShi.some(k => k[1] === n[1]));
    jinnrou = jinnrou.filter(n => !kakuShi.some(k => k[1] === n[1]) && !shi.some(k => k[1] === n[1]));
    let shinnda = [];
    for (let i = 0; i < kakuShi.length; i++) {
        const p = kakuShi[i][0];
        const n = kakuShi[i][1];
        if (p) {
            deadPlayers.push(p);
            shinnda.push(p.name);
            players[n] = null;
        }
    }
    for (let i = 0; i < shi.length; i++) {
        const p = shi[i][0];
        const n = shi[i][1];
        if (p && (p.role !== 'ともにゃん' && p.role !== '妖狐')) {
            if (!mamorareru.some(m => p.name === players[m].name)) {
                deadPlayers.push(p);
                shinnda.push(p.name);
                players[n] = null;
            }
        }
    }
    if (jinnrou.length !== 0) {
        const randomIndex = Math.floor(Math.random() * jinnrou.length);
        const p = jinnrou[randomIndex][0];
        const n = jinnrou[randomIndex][1];
        if (p && (p.role !== 'ともにゃん' && p.role !== '妖狐')) {
            if (!mamorareru.some(m => p.name === players[m].name)) {
                deadPlayers.push(p);
                shinnda.push(p.name);
                players[n] = null;
            }
        }
    }

    if (shinnda.length !== 0) {
        let text = `<b style='font-size: 50px;'>昨夜の死亡者</b><br><table id=meeting>`;
        for (let i = 0; i < shinnda.length; i++) {
            const s = shinnda[i];
            let color = (i % 2 === 0 ? "rgb(231, 151, 151)" : "rgb(221, 111, 111)");
            text += `
        <tr style="background-color: ${color}">
        <td>
        <a style="width:150px">${s}</a>
        </td>
        <tr>
        `;
        }
        text += `</table><br><button onclick='nextTurn();'>りょーかい！</button>`;
        sethtml(text);
        sound('sounds/dess.mp3', 'start');
    }
    else {
        sethtml(`<b style='font-size: 50px;'>だれも</b><br><b style='font-size: 50px;'>死ななかった</b><br><button onclick='nextTurn();'>りょーかい！</button>`);
        sound('sounds/noMesse.mp3', 'start');
    }
    players = players.filter(n => n !== null);
    mamorareru = mamorareru.filter(n => n !== null);

    shinuyotei = [];
    mamorareru = [];
    norowareru = [];

    turn = players.length;
}

function typeCheck(p) {
    switch (p.type) {
        case '村人陣営':
            switch (p.role) {
                case '狼憑き':
                    return { color: "rgb(221, 109, 109)", type: '人狼陣営' };
                default:
                    return { color: "rgb(109, 167, 221)", type: '村人陣営' };
            }
        case '人狼陣営':
            switch (p.role) {
                case '狂人':
                    return { color: "rgb(109, 167, 221)", type: '村人陣営' };
                default:
                    return { color: "rgb(221, 109, 109)", type: '人狼陣営' };
            }
        case '第三陣営':
            return { color: "rgb(109, 221, 146)", type: '第三陣営' };
    }
}

function makeDate(n, date1) {
    const p = players[n];
    players[n] = { ...p, date1: date1 };
}

function clearCheck() {
    let blueNum = 0;
    let redNum = 0;
    let greenNum = 0;
    for (let i = 0; i < players.length; i++) {
        const p = players[i];
        switch (p.type) {
            case '村人陣営':
                switch (p.role) {
                    case 'ゆうれい':
                        break;
                    default:
                        blueNum++;
                        break;
                }
                break;
            case '人狼陣営':
                switch (p.role) {
                    case '狂人':
                        blueNum++;
                        break;
                    default:
                        redNum++;
                        break;
                }
                break;
            case '第三陣営':
                switch (p.role) {
                    default:
                        blueNum++;
                        greenNum++;
                        break;
                }
                break;
        }
    }
    for (let i = 0; i < deadPlayers.length; i++) {
        const p = deadPlayers[i];
        switch (p.role) {
            case 'デッドホップ':
                blueNum++;
                break;
            default:
                break;
        }
    }
    let win = 0;
    let winText = '';
    let color = 'black';
    if (deadPlayers[deadNum] && deadPlayers[deadNum].role == '吊り人') {
        win = deadPlayers[deadNum].name;
        winText = '吊り人が吊られた';
        color = deadPlayers[deadNum].color;
    }
    else if (players.length == 0) {
        win = '全滅'
        winText = 'まさかの勝者なし';
        color = "#333";
    }
    if (blueNum <= redNum && greenNum == 0) {
        win = '人狼陣営'
        winText = '村は狼によって壊滅させられた';
        color = "rgb(221, 109, 109)";
    }
    else if (redNum == 0 && greenNum == 0) {
        win = '村人陣営'
        winText = '村は平和を取り戻した';
        color = "rgb(119, 164, 248)";
    }
    if (players.length <= 2 && greenNum == 1) {
        winText = 'Uncaught SyntaxError: Invalid left-hand side in assignment';
        players.filter(n => n.type == '第三陣営').forEach(p => {
            switch (p.role) {
                case '吊り人':
                    break;
                default:
                    win = p.name;
                    color = p.color;
                    switch (p.role) {
                        case '妖狐':
                            winText = '妖艶な化け狐の勝利';
                            break;
                        case '神':
                            color = "rgb(219, 221, 109)";
                            winText = '神には全てがお見通しだった';
                            break;
                        case 'ともにゃん':
                            winText = 'さぁ始マリサ';
                            break;
                    }
                    break;
            }
        });
    }
    switch (win) {
        case '全滅':
            sound('sounds/noWin.mp3', 'start');
            break;
        case '人狼陣営':
            sound('sounds/redWin.mp3', 'start');
            break;
        case '村人陣営':
            sound('sounds/blueWin.mp3', 'start');
            break;
    }
    if (win !== 0) {
        godRoleCheck(`<a style='font-size: 70px; color:${color}'>勝利</a><br><b style='font-size: 80px; color:${color}'>${win}</b><br><a style='font-size: 30px; color:${color}'>${winText}</a><br>`, `<br><button onclick='reStart();'>再スタート</button><br><button onclick='back();'>役職設定に戻る</button>`);
    }
}

function reStart() {
    sethtml(`<b>人狼ゲーム</b><br><button onclick="gameStart()">クリックしてスタート</button>`);
    const box = document.getElementById("box");
    box.style.backgroundColor = "rgb(221, 109, 109)";
}

function back() {
    window.location.href = "main.html"; // ゲーム画面へ移動
}

function waitRundom() {
    sethtml(`<a>少し待ってください</a>`);
    let load = '';
    const interval = setInterval(() => {
        sethtml(`<a>少し待ってください${load}</a>`);
        load += '.';
        //if (loaf == '...') load = '';
    }, 500); // 0.5秒ごとに更新
    setTimeout(() => {
        clearInterval(interval); // アニメーション止める
        sethtml(`<a>ボタンを押してください</a><br><button onclick='nextTurn();'>寝る</button>`);
    }, Math.floor(Math.random() * 8000) + 3000);
}


function godRoleCheck(tophtml = 0, bottomhtml = 0) {
    let text = (`${tophtml}<a style='font-size: 50px; color="rgb(84, 124, 197)";'>生存者</a><br><table id=meeting>`);
    const type = ['村人陣営', '人狼陣営', '第三陣営'];

    for (let i = 0; i < 3; i++) {
        players.filter(n => n.type == type[i]).forEach(role => {
            text += `
        <tr style="background-color: ${role.color}">
        <td>
        <a style="width:150px">${role.name}</a>
        </td>
        <td>
        <a style="width:150px">${role.role}</a>
        </td>
        <tr>
        `;
        });
    }
    text += `</table><br><a style='font-size: 50px; color="rgb(190, 90, 90)"'>死亡者</a><br><table id=meeting>`;
    for (let i = 0; i < 3; i++) {
        deadPlayers.filter(n => n.type == type[i]).forEach(role => {
            text += `
        <tr style="background-color: ${role.color}">
        <td>
        <a style="width:150px">${role.name}</a>
        </td>
        <td>
        <a style="width:150px">${role.role}</a>
        </td>
        <tr>
        `;
        });
    }
    text += (`</table>${bottomhtml}`);

    sethtml(text);
}