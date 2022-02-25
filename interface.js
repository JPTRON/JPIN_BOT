const {ipcMain, ipcRenderer, app, BrowserWindow, globalShortcut} = require('electron');

const channelLogin = require('./channelLogin.js');

const delay = ms => new Promise(res => setTimeout(res, ms));

function boot()
{  
   var win = new BrowserWindow
    ({
        width: 1280,
        height: 720,
        resizable: true,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true,
            nativeWindowOpen: true
        }
    });
    win.loadURL(`file://${__dirname}/interface/index.html`);
    win.removeMenu();
    //win.webContents.openDevTools();

    ipcMain.on("channelConnect", async (event) =>
    {
        var connect = await channelLogin.boot();
        if(connect === true)
        {
            win.webContents.executeJavaScript("channelConnected();");
            require('./bot.js').botStart();
        }
        else
        {
            win.webContents.executeJavaScript("channelConnectFailed();");
        }
    });

    ipcMain.on("channelDisconnect", function()
    {
        win.webContents.executeJavaScript("channelDisconnected();");
        require('./bot.js').botDisconnect();
        channelLogin.closeChat();
    });

    ipcMain.on("channelLogOut", function()
    {
        const ses = win.webContents.session;
        ses.clearStorageData();
    });

    ipcMain.on("restartBot", async function() 
    {    
        require('./bot.js').botDisconnect();
        require('./bot.js').botStart();
        await delay(5000);
        win.webContents.executeJavaScript("botRestarted();");
    });

    win.on('closed', () => {
        app.exit(0);
    });  

    win.on("focus", () => {
        globalShortcut.register("CommandOrControl+F", function () {
            if (win && win.webContents) 
            {
                win.webContents.send("on-find", "");
            }
        });
    });

    win.on("blur", () => {
        globalShortcut.unregister("CommandOrControl+F");
    });

    app.on("window-all-closed", () => {
        globalShortcut.unregister("CommandOrControl+F");
      });
};

app.on('ready', boot);
