// !roleta [quantity]

const fs = require("fs");

exports.run = async function roleta(client, channel, user, message, self, args, ops, viewer){

	var mypointconfig = fs.readFileSync(__dirname + '/../info/points.json');
	var pointconfig = JSON.parse(mypointconfig);
	var mypercentagem = fs.readFileSync(__dirname + '/../info/percentagens.json');
	var percentagem = JSON.parse(mypercentagem);
	var camp = message.split(" ");
	var quantity = camp[1];
	var generated = Math.floor(Math.random() * 100);
	console.log(generated);

	if(!viewer[user['username']]){
		viewer[user['username']] = {
			online: 1,
			points: 0
		};
		fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));
	};

		if(quantity === "all"){
			quantity = viewer[user['username']].points;
		};

		if(!quantity || isNaN(quantity)){
			client.say(channel, "/me Não foi possível realizar a operação: quantidade de " + pointconfig.Name + " não providenciada.");
			return;
		};

		if(quantity <= 0){
			client.say(channel, "/me Não foi possível realizar a operação: quantidade de " + pointconfig.Name + " inválida.");
			return;
		};

		if(quantity > viewer[user['username']].points){
			client.say(channel, "/me Não foi possível realizar a operação: " + user['username'] + " não tem " + pointconfig.Name + " suficientes para apostar " + quantity + " " + pointconfig.Name);
			return;
		};

		if(generated <= percentagem.Roleta){
			viewer[user['username']].points += + quantity;
			fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));
			client.say(channel, "/me PARABÉNS " + user['username'] + " : acabou de ganhar " + quantity + " " + pointconfig.Name + " na roleta.");
		} else {
			viewer[user['username']].points -= + quantity;
			fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));
			client.say(channel, "/me Mais sorte para a próxima " + user['username'] + " : acabou de perder " + quantity + " " + pointconfig.Name + " na roleta.");
		};

	};
