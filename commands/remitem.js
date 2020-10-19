// !remitem [id]

const fs = require("fs");

exports.run = async function remitem(client, channel, user, message, self, args, ops, viewer){
	var camp = message.split(" ");
	var id = + camp[1];
	var myloja = fs.readFileSync(__dirname + '/../data/loja.json');
	var loja = JSON.parse(myloja);
	var itemkeys = Object.keys(loja.Items);
	var item = loja.Items.map(x => x);
	var equal = 0;
	var y;

	if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){

		if(!id){
			client.say(channel, "/me Não foi possível realizar a operação: ID não providenciado.");
			return;
		};

		for(i = 0; i < itemkeys.length; i++){
			if(id === item[i].Id){
				equal = 1;
				y = i;
			};
		};

		if(equal === 1){
			loja.Items.splice(y, 1);
			fs.writeFileSync(__dirname + '/../data/loja.json', JSON.stringify(loja, null, 2));
			client.say(channel, "/me Operação realizada com sucesso: Item '" + item[y].Nome + "' apagado!");
		} else {
			client.say(channel, "/me Não foi possível realizar a operação: não existe nenhum item com esse ID.");
		};

	};
};
