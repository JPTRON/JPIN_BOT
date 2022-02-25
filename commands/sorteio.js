// !sorteio [tickets] | !sorteio start [setprice] [max] | !sorteio end

const fs = require('fs');

exports.run = async function sorteio(client, channel, user, message, self, args, ops, viewer){

	var mypointconfig = fs.readFileSync(__dirname + '/../info/points.json');
	var pointconfig = JSON.parse(mypointconfig);
	var mysorteio = fs.readFileSync(__dirname + '/../data/sorteio.json');
	var sorteio = JSON.parse(mysorteio);
	var camp = message.split(" ");
	var tickets = camp[1];
	var setprice = camp[2];
	var max = camp[3];
	var i;
	var price = sorteio.Price;

	if(price === "OFF" && tickets === "start"){
		if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){
				if(!setprice || isNaN(setprice) || setprice < 0){
					client.say(channel, "/me Não foi possível realizar a operação: preço dos tickets inválido ou não providenciado.");
					return;
				}
				if(!max || isNaN(max) || max < 0){
					client.say(channel, "/me Não foi possível realizar a operação: máximo de tickets inválido ou não providenciado.");
					return;
				}
				client.say(channel, "/me Operação realizada com sucesso: Sorteio iniciado! Preço por ticket: " + setprice + " " + pointconfig.Name + " | Máximo de tickets: " + max);
				sorteio = {
					Price: + setprice,
					Maximo: + max,
					Participantes: []
				};
				fs.writeFileSync(__dirname + '/../data/sorteio.json', JSON.stringify(sorteio, null, 2));
				return;
			} else { return }
	};

	if(tickets === "end" && price !== "OFF"){
		if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){
				var keys = Object.keys(sorteio["Participantes"]);

				client.say(channel, "/me Operação realizada com sucesso: Sorteio finalizado!");

				var generated = Math.floor(Math.random() * keys.length);
				var participante = sorteio["Participantes"].map(x => x);
				client.say(channel, "/me O vencedor do sorteio foi: @" + participante[generated]);

				 sorteio = {
					Price: "OFF",
					Maximo: 0,
					Participantes: []
				};
				fs.writeFileSync(__dirname + '/../data/sorteio.json', JSON.stringify(sorteio, null, 2));
				 return;
			} else { return }
	};

	if(price !== "OFF"){

		if(!tickets || isNaN(tickets) || tickets <= 0){
			client.say(channel, "/me Não foi possível realizar a operação: número de tickets inválido ou não providenciado.");
			return;
		}

		if(!viewer[user['username']])
		{
			viewer[user['username']] = {
				online: 1,
				points: 0
			};
			fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));
			client.say(channel, "/me Não foi possível realizar a operação: " + user['username'] + " não tem " + pointconfig.Name + " suficientes para comprar " + tickets + " ticket(s).");
		}
		else if((tickets * price) > viewer[user['username']].points)
		{
			client.say(channel, "/me Não foi possível realizar a operação: " + user['username'] + " não tem " + pointconfig.Name + " suficientes para comprar " + tickets + " ticket(s).");
		}
		else if(sorteio.Participantes.filter(function(x){return x === user['username']}).length === sorteio.Maximo)
		{
			client.say(channel, "/me Não foi possível realizar a operação: " + user['username'] + " já comprou o máximo de tickets aceites.");
		}
		else
		{
			client.say(channel, "/me Operação realizada com sucesso: " + user['display-name'] + " comprou " + tickets + " ticket(s) para o sorteio.");
			viewer[user['username']].points -= tickets * price;
			fs.writeFileSync(__dirname + '/../data/data.json', JSON.stringify(viewer, null, 2));

			for(i = 0; i < tickets; i++){
				sorteio["Participantes"].push(user['username']);
				fs.writeFileSync(__dirname + '/../data/sorteio.json', JSON.stringify(sorteio, null, 2));
			};
		};
	};

};
