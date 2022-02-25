var logOutButton = document.getElementById("channel-logOut");

logOutButton.onclick = function()
{
    channelButton.innerText = "Conectar";
    channelButton.value = "0";
    channelButton.disabled = false;
    channel.value = "";
    ipcRenderer.send('channelDisconnect', {});
    ipcRenderer.send('channelLogOut', {});
};
