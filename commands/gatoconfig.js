// !gatoconfig [seconds] [reward]

const fs = require("fs");

exports.run = async function gatoconfig(client, channel, user, message, self, args, ops, viewer){
	var camp = message.split(" ");
	var timer = + camp[1];
	var reward = + camp[2];
	var mygatoSetup = fs.readFileSync(__dirname + '/../info/gatoSetup.json');
	var gatoSetup = JSON.parse(mygatoSetup);
	var mypointconfig = fs.readFileSync(__dirname + '/../info/points.json');
	var pointconfig = JSON.parse(mypointconfig);

	if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){


		if(!timer){
			client.say(channel, "/me Não foi possível realizar a operação: quantidade de segundos e " + pointconfig.Name + " não providenciados.");
			return;
		}

		if(!reward){
			client.say(channel, "/me Não foi possível realizar a operação: " + pointconfig.Name + " não providenciados.");
			return;
		}
		
		if(reward < 0){
			client.say(channel, "/me Não foi possível realizar a operação: quantidade de " + pointconfig.Name + " inválida.");
			return;
		};

		gatoSetup = {
			Timer: timer,
			Reward: reward
		};

		fs.writeFileSync(__dirname + '/../info/gatoSetup.json', JSON.stringify(gatoSetup, null, 2));
		client.say(channel, "/me Operação realizada com sucesso: " + timer + " segundos de votação e " + reward + " " + pointconfig.Name + " de prémio.");

		console.log(gatoSetup);
	};
};
