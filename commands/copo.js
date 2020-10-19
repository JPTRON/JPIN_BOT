// !copo [vote]

const fs = require("fs");
const server = require("../server.js");
var started = 0;

exports.run = async function copo(client, channel, user, message, self, args, ops, viewer){

	var camp = message.split(" ");
	var vote = camp[1];
	var mygatodata = fs.readFileSync(__dirname + '/../views/layouts/gato.json');
	var gatodata = JSON.parse(mygatodata);
	var mygatoSetup = fs.readFileSync(__dirname + '/../info/gatoSetup.json');
	var gatoSetup = JSON.parse(mygatoSetup);
	var mypointconfig = fs.readFileSync(__dirname + '/../info/points.json');
	var pointconfig = JSON.parse(mypointconfig);
	var copoGenerated = gatodata["Copo"];
	var winners = "";
	var i = 0;
	var keys = Object.keys(gatodata["Votos"]);


	if(started === 0 && vote === "start"){
		if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){
				server.StartServer();
				client.say(channel, "/me MiniGame do gato no copo já pode começar! Votem ao digitar !copo (1 / 2 / 3)");
				started = 1;
				return
			} else { return }
	};

	if(started === 1){
			if(!gatodata["Votos"][user['username']]){
					if(!vote){
						client.say(channel, "/me Não foi possível realizar a operação: voto em falta.");
						return;
					};

					if(vote === "1"){
						gatodata["Votos"][user['username']] = {voto: 1};
					} else if(vote === "2"){
						gatodata["Votos"][user['username']] = {voto: 2};
					} else if(vote === "3") {
						gatodata["Votos"][user['username']] = {voto: 3};
					} else { return }

					fs.writeFileSync(__dirname + '/../views/layouts/gato.json', JSON.stringify(gatodata, null, 2));

					keys = Object.keys(gatodata["Votos"]);

					if(keys.length === 1){
						var timer = setTimeout(voteEnding, (gatoSetup.Timer * 1000));
						client.say(channel, "/me COMEÇOU! Tempo da votação: " + gatoSetup.Timer + " segundos | Prémio: " + gatoSetup.Reward + " " + pointconfig.Name);
					};

					client.say(channel, "/me Operação realizada com sucesso: " + user['display-name'] + " votou no copo " + vote);
				};
		};

	function voteEnding(){
		mygatodata = fs.readFileSync(__dirname + '/../views/layouts/gato.json');
		gatodata = JSON.parse(mygatodata);
		keys = Object.keys(gatodata["Votos"]);
		started = 0;

		for(i; i < keys.length; i++){
			var username = keys[i];
			if(gatodata["Votos"][username].voto === copoGenerated){
				winners = winners + " @" + username;
				viewer[username].points += gatoSetup.Reward;
				fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));
			};

		};
		client.say(channel, "/me As votações estão encerradas, parabéns a quem votou no copo " + copoGenerated + " : " + winners);
		server.EndMinigame();
		var wait = setTimeout(holdServer, 10000);
	};

	function holdServer(){
		server.HoldServer();
	};
};
