//Client criation
const tmi = require('tmi.js');
const fs = require('fs');

let myinfo = fs.readFileSync(__dirname + '/info/info.json');
let info = JSON.parse(myinfo);
let channel = info.Channel;

var myCredentials = fs.readFileSync(__dirname + '/electron-info/credentials.json');
var credentials = JSON.parse(myCredentials);
var token = credentials.token;

const client = new tmi.Client({
	options: { debug: true },
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: channel,
		password: "oauth:" + token
	},
	channels: [ channel ]
});


//Consts
const active = new Map();
const server = require(__dirname + '/server.js');

//Vars / Lets
let prefix = info.Prefix;
let mysocial = fs.readFileSync(__dirname + '/info/social.json');
let mypointconfig = fs.readFileSync(__dirname + '/info/points.json');
let data = fs.readFileSync(__dirname + '/data/data.json');
let myrewards = fs.readFileSync(__dirname + '/info/rewards.json');
let social = JSON.parse(mysocial);
let pointconfig = JSON.parse(mypointconfig);
let viewer = JSON.parse(data);
let keys = Object.keys(viewer);
let rewards = JSON.parse(myrewards);

var minutes = pointconfig.Minutes * 60000;
var i = 0;

// ON START
console.log(info);
console.log(social);
console.log(pointconfig);
client.connect();
server.HoldServer();

client.on('connected', function(address, port) {
	for(i; i < keys.length; i++){
			var username = keys[i];
			viewer[username].online = 0;
	};

	client.say(channel, "/color Red");
	client.say(channel, "/me Acabei de me conectar a este canal!");

});

// COMMANDS
client.on('message', async function(channel, user, message, self) {
	if(self) return;

	if(user['message-type'] === "whisper") return;

	if(!message.startsWith(prefix)) return;

	const args = message.substr(prefix.length).trim().split(/ +/g);
	var command = args.shift().toLowerCase();

	try{
		let ops = {
			active: active
		}

		if(command === pointconfig.Name){
			command = "points";
		};

		let commands = require(__dirname + '/commands/' + command + '.js');
		commands.run(client, channel, user, message, self, args, ops, viewer);
	} catch(err) {
		//console.log(err);

		var mycommands = fs.readFileSync(__dirname + '/customcommands.json');
		var customcommands = JSON.parse(mycommands);
		var comkeys = Object.keys(customcommands);

		for(i = 0; i < comkeys.length; i++){
			if(command === comkeys[i]){

				if(customcommands[command].hasOwnProperty("contador")){

					customcommands[command].contador++;
					fs.writeFileSync(__dirname + '/customcommands.json', JSON.stringify(customcommands, null, 2));

					var camp = customcommands[command].resposta.split(" ");

					for(i = 0; i < camp.length; i++){
						if(camp[i] === "${cont}"){
							camp[i] = customcommands[command].contador;
						};
					};
					customcommands[command].resposta = camp.join(" ");
				};
				client.say(channel, "/me " + customcommands[command].resposta);
				return;
			};
		};

	} finally {}
});

// DATA
function createUserData(user){
	if(!viewer[user]){
		viewer[user] = {
			online: 1,
			points: 0
		};
	} else { return };
}

function givePoints(user){
	function intervalFunc() {

		if(viewer[user].online === 1){
			viewer[user].points += pointconfig.Quantity;
			if(user.subscriber === true){
				//console.log("SUB POINTS");
				viewer[user].points += pointconfig.Quantity;
			};

			fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(viewer, null, 2));
		} else {clearInterval(pointsInterval); };
	};
		var pointsInterval = setInterval(intervalFunc, minutes);
};

client.on('join', function(channel, user){
	createUserData(user);
//console.log("JOINED:  " + user);
	viewer[user].online = 1;
	fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(viewer, null, 2));

	givePoints(user, pointconfig);
});

client.on('part', function(channel, user){
	//console.log("PARTED:  " + user);
	if(viewer[user])
	{
		viewer[user].online = 0;
		fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(viewer, null, 2));
	}
});

// ALERTS
client.on("subscription", (channel, user, method, message, userstate) => {
	client.say(channel, "/me <3 PogChamp PogChamp PogChamp Obrigado pelo subscribe @" + user);
	createUserData(user);
	viewer[user].points += rewards.Sub;
	fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(viewer, null, 2));
});

client.on("resub", (channel, user, streakMonths, message, userstate, methods) => {
	let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
	let share = ~~userstate["msg-param-should-share-streak"];

	if(share === 1 && message)
	{
		client.say(channel, "/me <3 PogChamp PogChamp PogChamp Obrigado pelo resub @" + user + " . Subscreveu um total de " + cumulativeMonths + " meses e vai numa sequência de " + streakMonths + " meses.");
	}
	else
	{
		client.say(channel, "/me <3 PogChamp PogChamp PogChamp Obrigado pelo resub @" + user + " . Subscreveu um total de " + cumulativeMonths + " meses.");
	}
	createUserData(user);
	viewer[user].points += rewards.Sub;
	fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(viewer, null, 2));
});

client.on('cheer', function(channel, user){
	client.say(channel, "/me <3 PogChamp TwitchUnity  PogChamp Obrigado pelos " + user.bits + " bits @" + user["display-name"]);
	createUserData(user);
	viewer[user].points += (user.bits * rewards.Bit);
	fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(viewer, null, 2));
});

client.on("raided", (channel, username, viewers) => {
	client.say(channel, "/me twitchRaid twitchRaid @" + user + " acabou de dar raid com " + viewers + " viewers.");
	if(viewers >= 2)
	{
		createUserData(user);
		viewer[user].points += (user.bits * rewards.Raid);
		fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(viewer, null, 2));
	}
});
// EXIT
