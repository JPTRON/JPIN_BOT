// !give [user] [quantity]

const fs = require("fs");

exports.run = async function give(client, channel, user, message, self, args, ops, viewer){

	var mypointconfig = fs.readFileSync(__dirname + '/../info/points.json');
	var pointconfig = JSON.parse(mypointconfig);
	var camp = message.split(" ");
	var taggeduser = camp[1];
	var quantity =  + camp[2];
	var keys = Object.keys(viewer);
	var i = 0;
	var users = 0;
	var equal = false;

	if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){


		if(!taggeduser){
			client.say(channel, "/me Não foi possível realizar a operação: utilizador e quantidade de " + pointconfig.Name + " não providenciados.");
			return;
		};

		if(!quantity){
			client.say(channel, "/me Não foi possível realizar a operação: quantidade de " + pointconfig.Name + " não providenciada.");
			return;
		};

		if(taggeduser === "all"){
			for(i; i < keys.length; i++){
			var username = keys[i];
			if(viewer[username].online === 1){
				users++;
				viewer[username].points += quantity;
			};
		};
			fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));
			client.say(channel, "/me Operação realizada com sucesso: " + users + " utilizadores receberam " + quantity + " " + pointconfig.Name + ".");
		} else {
			for(i; i < keys.length; i++){
				var username = keys[i];
				if(taggeduser === username){
					equal = true;

				};
			};

			if(equal == false){
				client.say(channel, "/me Não foi possível realizar a operação: utilizador não existe.");
			} else {
				viewer[taggeduser].points += quantity;
				fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));
				client.say(channel, "/me Operação realizada com sucesso: " + taggeduser + " recebeu " + quantity + " " + pointconfig.Name + ".");
			};
		};
	};
};
