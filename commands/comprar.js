// !comprar [id]

const fs = require("fs");

exports.run = async function comprar(client, channel, user, message, self, args, ops, viewer){
	var camp = message.split(" ");
	var id = + camp[1];
	var myloja = fs.readFileSync(__dirname + '/../data/loja.json');
	var loja = JSON.parse(myloja);
	var mypointconfig = fs.readFileSync(__dirname + '/../info/points.json');
	var pointconfig = JSON.parse(mypointconfig);
	var itemkeys = Object.keys(loja.Items);
	var item = loja.Items.map(x => x);
	var equal = 0;
	var y;


		if(!id){
			client.say(channel, "/me Não foi possível realizar a operação: ID não providenciado.");
			return;
		};

		if(!viewer[user['username']]){
			viewer[user['username']] = {
				online: 1,
				points: 0
			};
			fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));
		};

		for(i = 0; i < itemkeys.length; i++){
		console.log(item[i]);
			if(id === item[i].Id){
				equal = 1;
				y = i;
			};
		};

		if(equal === 1){

			if(item[y].Price > viewer[user['username']].points){

				client.say(channel, "/me Não foi possível realizar a operação: " + user['username'] + " não tem " + pointconfig.Name + " suficientes para comprar esse Item.");

			} else {
				viewer[user['username']].points -= item[y].Price;
				fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));

				client.say(channel, "/me Operação realizada com sucesso: Item '" + item[y].Nome + "' comprado por " + user['username'] + "!");

				if(item[y].hasOwnProperty("Quantity")){
					item[y].Quantity--;

					if(item[y].Quantity === 0){
						client.say(channel, "/me '" + item[y].Nome + "' esgotado!");
						loja.Items.splice(y, 1);
					};

					fs.writeFileSync(__dirname + '/../data/loja.json', JSON.stringify(loja, null, 2));
				};
			};

		} else {
			client.say(channel, "/me Não foi possível realizar a operação: não existe nenhum item com esse ID.");
		};

};
