// !adccom [name] [response]

const fs = require("fs");

exports.run = async function adccom(client, channel, user, message, self, args, ops, viewer){
	var camp = message.split(" ");
	var name = camp[1];
	var response = camp.slice(2);
	var mycommands = fs.readFileSync(__dirname + '/../data/customcommands.json');
	var commands = JSON.parse(mycommands);
	var i;
	var equal = 0;

	if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){


		if(!name){
			client.say(channel, "/me Não foi possível realizar a operação: nome e resposta não providenciados.");
			return;
		};

		if(!camp[2]){
			client.say(channel, "/me Não foi possível realizar a operação: resposta não providenciada.");
			return;
		};
		
		if(commands[name])
		{
			client.say(channel, "/me Não foi possível realizar a operação: comando já existente.");
			return;
		};
		
		for(i = 0; i < response.length; i++){
			if(response[i] === "${cont}"){
				equal = 1;
			};
		};

		response = response.join(" ");

		if(equal === 1){
			commands[name] = {
				resposta: response,
				contador: + 0
			};
		} else {
			commands[name] = {resposta: response};
		}

		fs.writeFileSync(__dirname + '/../data/customcommands.json', JSON.stringify(commands, null, 2));
		client.say(channel, "/me Operação realizada com sucesso: comando '" + name + "' criado!");

	};
};
