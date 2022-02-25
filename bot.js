//Client criation
const tmi = require('tmi.js');
const fs = require('fs');

function botStart()
{
	let myinfo = fs.readFileSync(__dirname + '/info/info.json');
	let info = JSON.parse(myinfo);
	let channel = info.Channel;

	var myCredentials = fs.readFileSync(__dirname + '/electron-info/credentials.json');
	var credentials = JSON.parse(myCredentials);

	const client = new tmi.Client({
		options: { debug: true },
		connection: {
			secure: true,
			reconnect: true
		},
		identity: {
			username: credentials.login,
			password: "oauth:" + credentials.token
		},
		channels: [ channel ]
	});


	//Consts
	const active = new Map();
	const mediaHandler = require(__dirname + '/server/mediaHandler.js');

	//Vars / Lets
	let prefix = info.Prefix;
	let mypointconfig = fs.readFileSync(__dirname + '/info/points.json');
	let data = fs.readFileSync(__dirname + '/data/data.json');
	let myrewards = fs.readFileSync(__dirname + '/info/rewards.json');
	let pointconfig = JSON.parse(mypointconfig);
	let viewer = JSON.parse(data);
	let keys = Object.keys(viewer);
	let rewards = JSON.parse(myrewards);

	var minutes = pointconfig.Minutes * 60000;
	var i = 0;

	// ON START
	console.log(info);
	console.log(pointconfig);
	require(__dirname + '/server/server.js');
	client.connect();
	//server.HoldServer();


	client.on('connected', function(address, port) {		
		for(i; i < keys.length; i++)
		{
			var username = keys[i];
			viewer[username].online = 0;
		};

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
			
			data = fs.readFileSync(__dirname + '/data/data.json');
			viewer = JSON.parse(data);			

			runCustomCom(command);
			runMediaRequest(command);

			let commands = require(__dirname + '/commands/' + command + '.js');
			commands.run(client, channel, user, message, self, args, ops, viewer);
		} catch(err) {
			//console.log(err);
		} finally {}
	});

	// Run Custom commands
	function runCustomCom(command)
	{
		var mycommands = fs.readFileSync(__dirname + '/data/customcommands.json');
		var customcommands = JSON.parse(mycommands);
		var comkeys = Object.keys(customcommands);

		for(i = 0; i < comkeys.length; i++){
			if(command === comkeys[i]){

				if(customcommands[command].hasOwnProperty("contador")){

					customcommands[command].contador++;
					fs.writeFileSync(__dirname + '/data/customcommands.json', JSON.stringify(customcommands, null, 2));

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
	};

	// Run Media Request
	function runMediaRequest(media)
	{
		fs.readdir(__dirname + '/media', (err, files) => {
			for(i = 0; i < files.length; i++)
			{
				if(media === files[i].split('.').shift())
				{
					if(/\.(mp4|webm)$/i.test("." + files[i].split('.').pop()))
					{
						mediaHandler.send(files[i], "video");
					}
					else if(/\.(mp3|aac|ogg|flac|wav)$/i.test("." + files[i].split('.').pop()))
					{
						mediaHandler.send(files[i], "sound");
					}
					else if(/\.(png|jpeg|jpg|gif|apng)$/i.test("." + files[i].split('.').pop()))
					{
						mediaHandler.send(files[i], "image");
					}
				}
			};
		});
	}

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

	function botDisconnect()
	{
		client.disconnect();
	}

	exports.botDisconnect = botDisconnect;
};

exports.botStart = botStart;