const path = require('path');

var saveButton = document.getElementById("save");

let myinfo = fs.readFileSync(path.join(__dirname + '/../info/info.json'));
let info = JSON.parse(myinfo);

let mypointconfig = fs.readFileSync(path.join(__dirname + '/../info/points.json'));
let pointconfig = JSON.parse(mypointconfig);

let myrewards = fs.readFileSync(path.join(__dirname + '/../info/rewards.json'));
let rewards = JSON.parse(myrewards);

let mypercentagens = fs.readFileSync(path.join(__dirname + '/../info/percentagens.json'));
let percentagens = JSON.parse(mypercentagens);

let mygatoSetup = fs.readFileSync(path.join(__dirname + '/../info/gatoSetup.json'));
let gatoSetup = JSON.parse(mygatoSetup);

var prefix = document.getElementById("prefix");
var nome = document.getElementById("name");
var quantity = document.getElementById("quantity");
var minutes = document.getElementById("minutes");
var bit = document.getElementById("bit");
var sub = document.getElementById("sub");
var raid = document.getElementById("raid");
var roleta = document.getElementById("roleta");
var timer = document.getElementById("timer");
var reward = document.getElementById("reward");

showConfig();

function showConfig()
{
    prefix.value = info.Prefix;

    nome.value = pointconfig.Name;
    quantity.value = pointconfig.Quantity;
    minutes.value = pointconfig.Minutes;

    bit.value = rewards.Bit;
    sub.value = rewards.Sub;
    raid.value = rewards.Raid;

    roleta.value = percentagens.Roleta;

    timer.value = gatoSetup.Timer;
    reward.value = gatoSetup.Reward;
}

saveButton.onclick = function()
{
    if(document.forms['configForm'].reportValidity() === true)
    {
        info = {
            Channel: info.Channel,
            Prefix: prefix.value
        };

        pointconfig = {
            Name: nome.value,
            Quantity: +quantity.value,
            Minutes: +minutes.value
        };

        rewards = {
            Bit: +bit.value,
            Sub: +sub.value,
            Raid: +raid.value
        };

        percentagens = {
            Roleta: +roleta.value
        };

        gatoSetup = {
            Timer: +timer.value,
            Reward: +reward.value
        };

        fs.writeFileSync(path.join(__dirname + '/../info/info.json'), JSON.stringify(info, null, 2));
        fs.writeFileSync(path.join(__dirname + '/../info/points.json'), JSON.stringify(pointconfig, null, 2));
        fs.writeFileSync(path.join(__dirname + '/../info/rewards.json'), JSON.stringify(rewards, null, 2));
        fs.writeFileSync(path.join(__dirname + '/../info/percentagens.json'), JSON.stringify(percentagens, null, 2));
        fs.writeFileSync(path.join(__dirname + '/../info/gatoSetup.json'), JSON.stringify(gatoSetup, null, 2));

        if(saveButton.innerText !== "Gravar")
        {
            saveButton.disabled = true;
            ipcRenderer.send('restartBot', {});
        }
    }
}

function botRestarted()
{
    saveButton.disabled = false;
    document.getElementById("pointsSave").disabled = false;
}