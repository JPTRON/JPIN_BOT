const {ipcRenderer } = require("electron");
const fs = require('fs');

var channel = document.getElementById("channel-name");
var channelButton = document.getElementById("channel-connect");
var saveButton = document.getElementById("save");
var logOutButton = document.getElementById("channel-logOut");

channelButton.onclick = function()
{
    if(channelButton.value === "0")
    {
        channelButton.disabled = true;
        ipcRenderer.send('channelConnect', {});    
    }
    else
    {
        channelButton.innerText = "Conectar";
        channelButton.value = "0";
        channelButton.disabled = false;
        channel.value = "";
        ipcRenderer.send('channelDisconnect', {});
    }
};

function channelConnected()
{
    channelButton.disabled = false;
    channelButton.innerText = "Desconectar";
    channelButton.value = "1";
    var myinfo = fs.readFileSync(process.cwd() + '/info/info.json');
    var info = JSON.parse(myinfo);
    channel.value = info.Channel;
    $(logOutButton).toggle();
};

function channelConnectFailed()
{
    channelButton.disabled = false;
}

function channelDisconnected()
{
    $(logOutButton).toggle(); 
};
