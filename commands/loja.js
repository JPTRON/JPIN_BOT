// !loja

const fs = require("fs");

exports.run = async function loja(client, channel, user, message, self, args, ops, viewer){
	var myinfo = fs.readFileSync(__dirname + '/../info/info.json');
	var info = JSON.parse(myinfo);
	var myloja = fs.readFileSync(__dirname + '/../data/loja.json');
	var loja = JSON.parse(myloja);
	var itemkeys = Object.keys(loja.Items);
	var item = loja.Items.map(x => x);
	var items = "";

	client.whisper(user['username'], `Loja do canal: ${info.Channel}`);

	for(i = 0; i < itemkeys.length; i++){
		items += `ID: ${item[i].Id} | Nome: ${item[i].Nome} | Preço: ${item[i].Price} .............`;
	};

	client.whisper(user['username'], items);
	client.say(channel, `/me ${user['username']} enviei a lista da loja para os sussuros.`);
};
