//main.js

//数字を変える
function changeNumber(id, amount) {
    const input = document.getElementById(id);
    let currentValue = parseInt(input.value) || 0;
    currentValue += amount;
    input.value = currentValue;
    rangeNumber(id);
}

//数字を範囲内にする
function rangeNumber(id) {
    const input = document.getElementById(id);
    input.value = Math.floor(input.value);
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || Infinity;
    const value = parseInt(input.value, 10);
    if (value < min) input.value = min;
    if (value > max) input.value = max;

    if (input.name == "追加役職") {
        changeRoleList(id);
        let total1 = 1;
        let total2 = 0;
        let befor = input.value;
        while (total1 > total2) {
            total1 = 0;
            total2 = 0;
            const inputs = document.querySelectorAll('input[name="追加役職"]');
            inputs.forEach(input => {
                total1 += parseInt(input.value, 10);
            });
            const inputs2 = document.querySelectorAll('input[name="陣営"]');
            inputs2.forEach(input => {
                total2 += parseInt(input.value, 10);
            });
            if (total1 > total2) input.value--;
        }
        if (input.value !== befor) alert('合計人数より追加役職を多くすることはできません')
        if (input.value < 0) input.value = 0;
    }
    if (id == "ラバーズ" && input.value % 2 !== 0) {
        input.value--;
    }
    sound('sounds/change.mp3', 'start');
    if (input.name !== '陣営') {
        changeRoleList(id);
    }
    else {
        rangeNames();
    }
}
//
function changeRoleList(id) {
    const input = document.getElementById(id);
    let ta;
    const color = window.getComputedStyle(document.getElementById(`${id}タイトル`)).backgroundColor;
    switch (input.name) {
        case '村人陣営':
            ta = document.getElementById("role-blue-List");
            break;
        case '人狼陣営':
            ta = document.getElementById("role-red-List");
            break;
        case '第三陣営':
            ta = document.getElementById("role-green-List");
            break;
        case '追加役職':
            ta = document.getElementById("role-orange-List");
            break;
    }
    const table = ta;
    const rows = table.getElementsByTagName("tr");
    let Myrow = 0;
    for (let i = 0; i < rows.length; i++) {  // 1から(見出し除く)
        const nameCell = rows[i].cells[0];
        if (nameCell && nameCell.textContent === id) {
            Myrow = rows[i];  //
            break;  // 見つかったら終了
        }
    }
    if (input.value == 0 && Myrow !== 0) {
        Myrow.remove();
    }
    else {
        if (Myrow !== 0) {
            Myrow.cells[1].innerText = `${input.value}人`;
        }
        else {
            const newRow = table.insertRow(-1);  // 最後に追加
            newRow.insertCell(0).innerHTML = `<a href="#${id}タイトル" style = "color: black">${id}</a>`;
            newRow.insertCell(1).innerHTML = `${input.value}人`;
            newRow.insertCell(2).innerHTML = `
        <div class="number-input">
        <button onclick="changeNumber('${id}',-1)">-</button>
        <button onclick="changeNumber('${id}',1)">+</button>
        </div>
        `;
            newRow.cells[0].style.backgroundColor = color;
            newRow.cells[1].style.backgroundColor = color;
            newRow.cells[2].style.backgroundColor = color;
        }
    }
    const inputs = document.querySelectorAll('.number-input input');

    let total = 0;
    inputs.forEach(input => {
        const name = input.getAttribute('name');
        // 追加役職以外（村人陣営・人狼陣営・第三陣営）だけカウント
        if (name !== '追加役職' && name !== '陣営') {
            total += parseInt(input.value, 10);
        }
    });

    document.getElementById('total').innerText = `${total}人`;
}

const uttr = new SpeechSynthesisUtterance();  // 音声合成システムを作る
function speak(text) {
    uttr.text = text;
    window.speechSynthesis.speak(uttr);                // 読み上げ
}

window.onload = function () {
    const inputs = document.querySelectorAll('.number-input input');

    inputs.forEach(input => {
        const name = input.getAttribute('name');
        if (name !== '陣営') {
            const color = window.getComputedStyle(document.getElementById(`${input.id}タイトル`)).backgroundColor;
            const newLink = document.createElement("a");
            newLink.href = `#${input.id}タイトル`;
            newLink.textContent = `${input.id}`;
            newLink.style.color = color;
            const newLi = document.createElement("li");
            newLi.appendChild(newLink);
            document.getElementById("allrolelist").appendChild(newLi);
        }
    });
}

function offline() {
    let roles = [];
    let peoples = [];
    let peopleNames = [];
    const inputs = document.querySelectorAll('.number-input input');

    inputs.forEach(input => {
        const name = input.getAttribute('name');
        if (name !== '陣営') {
            if (input.value > 0) {
                let role = { name: '', value: 0, type: '', color: '' };
                role.name = input.id;
                role.value = parseInt(input.value, 10);
                role.type = input.name;
                role.color = color = window.getComputedStyle(document.getElementById(`${input.id}タイトル`)).backgroundColor;
                roles.push(role);
            }
        }
        else {
            peoples.push(parseInt(input.value, 10));
        }
    });

    const inputs2 = document.querySelectorAll('.nameinput');
    inputs2.forEach(input => {
        peopleNames.push(input.value);
    });


    let roleNum = [0, 0, 0];

    roles.forEach(role => {
        for (let i = 0; i < role.value; i++) {
            switch (role.type) {
                case '村人陣営':
                    roleNum[0]++;
                    break;
                case '人狼陣営':
                    roleNum[1]++;
                    break;
                case '第三陣営':
                    roleNum[2]++;
                    break;
                case '追加役職':
                    break;
            }
        }
    });

    let isOk = true;

    if (roleNum[0] > peoples[0] || roleNum[1] > peoples[1].value || roleNum[2] > peoples[2].value) {
        isOk = false;
    }

    if (roles.length > 0 && peoples.length > 0 && peopleNames.length > 0 && isOk) {
        localStorage.setItem("roles", JSON.stringify(roles));
        localStorage.setItem("peoples", JSON.stringify(peoples));
        localStorage.setItem("names", JSON.stringify(peopleNames));
        window.location.href = "offline.html"; // ゲーム画面へ移動
    }
    else {
        let text = "";
        if (!isOk) {
            if (roleNum[0] < peoples[0]) text += " 村人陣営 ";
            if (roleNum[1] < peoples[1].value) text += " 人狼陣営 ";
            if (roleNum[2] < peoples[2].value) text += " 第三陣営 ";
            alert(`${text}の役職の人数が足りません`);
        }
        else {
            if (roles.length <= 0) text += " 役職 ";
            if (peoples.length <= 0) text += " 陣営の人数 ";
            if (peopleNames.length <= 0) text += " プレイヤーの名前 ";
            alert(`${text}を設定してください`);
        }
    }
}

function generateRandomName(length = 6) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let name = "";
    for (let i = 0; i < length; i++) {
        name += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return name.charAt(0).toUpperCase() + name.slice(1); // 最初の文字を大文字に
}

function rangeNames() {
    const table = document.getElementById("peoplenameSet");
    const rows = table.getElementsByTagName("tr");
    const inputs = document.querySelectorAll('input[name="陣営"]');
    let total = 0;
    inputs.forEach(input => {
        total += parseInt(input.value, 10);
    });
    let n = (rows.length - 2 < total) ? 1 : -1;
    while (rows.length - 2 !== total) {
        if (n == 1) {
            const input = document.createElement("input");
            if (document.getElementById("namecheckbox").checked == true) {
                input.className = "nameinput";
                input.name = "playerName";
                input.value = generateRandomName();
            } else {
                input.className = "nameinput";
                input.name = "playerName";
            }
            input.style.backgroundColor = getRandomColor();
            newRow.insertCell(0).appendChild(input);
        }
        else if (rows.length > 2) {
            rows[1].remove();
        }
        document.getElementById('peopletotal').innerText = `${rows.length - 2}人`;
        document.getElementById('peoplenametotal').innerText = `${rows.length - 2}人`;
    }
}

