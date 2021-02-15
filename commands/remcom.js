// !remcom [name]

const fs = require("fs");

exports.run = async function remcom(client, channel, user, message, self, args, ops, viewer){
	var camp = message.split(" ");
	var name = camp[1];
	var mycommands = fs.readFileSync(__dirname + '/../data/customcommands.json');
	var commands = JSON.parse(mycommands);
	var comkeys = Object.keys(commands);
	var equal = 0;

	if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){


		if(!name){
			client.say(channel, "/me Não foi possível realizar a operação: nome não providenciado.");
			return;
		};

		for(i = 0; i < comkeys.length; i++){
			if(name === comkeys[i]){
				equal = 1;
			};
		};

		if(equal === 1){
			delete commands[name];
			fs.writeFileSync(__dirname + '/../data/customcommands.json', JSON.stringify(commands, null, 2));
			client.say(channel, "/me Operação realizada com sucesso: comando '" + name + "' apagado!");
		} else {
			client.say(channel, "/me Não foi possível realizar a operação: comando não existente.");
		};


	};
};
