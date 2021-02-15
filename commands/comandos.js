// !comandos

const fs = require("fs");

exports.run = async function comandos(client, channel, user, message, self, args, ops, viewer){
	var mycommands = fs.readFileSync(__dirname + '/../data/customcommands.json');
	var customcommands = JSON.parse(mycommands);
	var comkeys = Object.keys(customcommands);
	var myinfo = fs.readFileSync(__dirname + '/../info/info.json');
	var info = JSON.parse(myinfo);
	var prefix = info.Prefix;
	var comandos = "";
	var customcomandos = "";

	client.whisper(user['username'], `Comandos do canal: ${info.Channel}`);

	fs.readdir(__dirname + '/../commands', (err, files) => {
		for(i = 0; i < files.length; i++){
			var str = files[i];
			str = str.substring(0, files[i].length - 3);
			comandos += (prefix + str + ", ");
		};
		client.whisper(user['username'], comandos);
	});

		for(i = 0; i < comkeys.length; i++){
			var comando = "" + comkeys[i];
			customcomandos += (prefix + comando + ", ");
		};

	client.whisper(user['username'], customcomandos);
	client.say(channel, `/me ${user['username']} enviei a lista dos comandos para os sussuros.`);
};
