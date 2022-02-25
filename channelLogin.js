const {app, BrowserWindow, session, dialog} = require('electron');
const fs = require('fs');
const axios = require('axios');
const url = require('url');

const myurl = 'https://id.twitch.tv/oauth2/authorize?client_id=kis6cdz6giaoxfz6u0453x797jz7xx&redirect_uri=http://localhost&response_type=token&scope=chat:read+chat:edit+channel:manage:broadcast+whispers:edit';

var myCredentials = fs.readFileSync(__dirname + '/electron-info/credentials.json');
var credentials = JSON.parse(myCredentials);
var myinfo = fs.readFileSync(__dirname + '/info/info.json');
var info = JSON.parse(myinfo);

var token = credentials.token;
var login = credentials.login;
var id = credentials.id;
var channel = info.Channel;
var prefix = info.Prefix;

var win;

function boot()
{  
    var handler = 0;
    return new Promise((res, rej) => 
    { 
        win = new BrowserWindow
        ({
            width: 400,
            height: 650,
            resizable: true,
            webPreferences: {
                nativeWindowOpen: true
            }
        });

        win.removeMenu();
        win.loadURL(myurl);

        const ses = win.webContents.session;
        //ses.clearStorageData();
        dialog.showErrorBox = function(title, content) {}; 

        win.webContents.on('will-navigate', function (event, newUrl)
        {
            var urlObj = url.parse(newUrl);
            if(urlObj.hash !== null && handler === 0)
            {
                handler = 1;
                token = urlObj.hash.split("&")[0].slice(14);

                axios.get('https://id.twitch.tv/oauth2/validate', 
                {
                    headers: {Authorization: `OAuth ${token}`}
                })
                .then(function (response) 
                {
                    login = response.data.login;
                    id = response.data.user_id;

                    credentials = 
                    {
                        token: token,
                        login: login,
                        id: +id
                    };

                    fs.writeFileSync(__dirname + '/electron-info/credentials.json', JSON.stringify(credentials, null, 2));
                    ID();
                })
                .catch(e => 
                {
                    console.log(e);
                    res(false);
                });
            }

            function ID()
            {
                axios.get(`https://api.twitch.tv/kraken/channels/${credentials.id}`, 
                {
                    headers: {Accept: 'application/vnd.twitchtv.v5+json',
                    'Client-ID': 'kis6cdz6giaoxfz6u0453x797jz7xx'
                    }
                })
                .then(function (response) 
                {
                    let displayname = response.data.display_name;
                    
                    info = 
                    {
                        Channel: displayname,
                        Prefix: prefix
                    }

                    fs.writeFileSync(__dirname + '/info/info.json', JSON.stringify(info, null, 2));
                    win.loadURL(`https://www.twitch.tv/${displayname}/chat?darkpopout`);
                    res(true);           
                })
                .catch(e => 
                {
                    console.log(e);
                    ID();
                });
            };
        }); 
       
        win.on('closed', () => {
            res(false);
        });         
    });
};

function closeChat()
{
    win.close();
};

exports.closeChat = closeChat;
exports.boot = boot;


//app.on('ready', boot);

