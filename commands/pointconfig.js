// !pointconfig [quantity] [minutes]
// REQUIRE RESTART

const fs = require("fs");

exports.run = async function pointconfig(client, channel, user, message, self, args, ops, viewer){
	var camp = message.split(" ");
	var quantity = + camp[1];
	var minutes = + camp[2];
	var mypointconfig = fs.readFileSync(__dirname + '/../info/points.json');
	var pointconfig = JSON.parse(mypointconfig);

	if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){


		if(!quantity){
			client.say(channel, "/me Não foi possível realizar a operação: quantidade de " + pointconfig.Name + " e minutos não providenciados.");
			return;
		}

		if(!minutes){
			client.say(channel, "/me Não foi possível realizar a operação: minutos não providenciados.");
			return;
		}

		if(quantity < 0){
			client.say(channel, "/me Não foi possível realizar a operação: quantidade de " + pointconfig.Name + " inválida.");
			return;
		};

		pointconfig = {
			Name: pointconfig.Name,
			Quantity: quantity,
			Minutes: minutes
		};

		fs.writeFileSync(__dirname + '/../info/points.json', JSON.stringify(pointconfig, null, 2));
		client.say(channel, "/me Operação realizada com sucesso: " + quantity + " " + pointconfig.Name + " a cada " + minutes + " minutos.");

		console.log(pointconfig);
	};
};
