// !adcitem [price] [quantity] [name]

const fs = require('fs');

exports.run = async function adcitem(client, channel, user, message, self, args, ops, viewer){
	var mypointconfig = fs.readFileSync(__dirname + '/../info/points.json');
	var pointconfig = JSON.parse(mypointconfig);
	var myloja = fs.readFileSync(__dirname + '/../data/loja.json');
	var loja = JSON.parse(myloja);
	var camp = message.split(" ");
	var price =  + camp[1];
	var quantity = + camp[2];
	var name = camp.slice(3);
	var id = loja.contador;
	var outputQuant;


	if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){

		if(!price){
			client.say(channel, "/me Não foi possível realizar a operação: preço, quantidade e nome não providenciados.");
			return;
		};

		if(!quantity){
			client.say(channel, "/me Não foi possível realizar a operação: quantidade e nome não providenciados.");
			return;
		};

		if(!camp[3]){
			client.say(channel, "/me Não foi possível realizar a operação: nome não providenciado.");
			return;
		};
		
		if(price < 0)
		{
			client.say(channel, "/me Não foi possível realizar a operação: preço inválido.");
			return;
		};
		
		if(quantity > 0){
			outputQuant = quantity;
			var novoItem = {
				Id: loja.contador,
				Nome: name.join(" "),
				Price: price,
				Quantity: quantity
			};
		} else if(quantity === 0){
			outputQuant = "infinito";
			var novoItem = {
				Id: loja.contador,
				Nome: name.join(" "),
				Price: price
			};
		}
		else
		{
			client.say(channel, "/me Não foi possível realizar a operação: quantidade inválida.");
			return;
		};

		loja.Items.push(novoItem);
		loja.contador++;
		fs.writeFileSync(__dirname + '/../data/loja.json', JSON.stringify(loja, null, 2));

		client.say(channel, "/me Operação realizada com sucesso: Novo Item na loja | NOME: '" + novoItem.Nome + "' | PREÇO: " + novoItem.Price + " " + pointconfig.Name + " | QUANTIDADE: " + outputQuant + ".")
	};
};
