// !set [platform] [link]

const fs = require("fs");

exports.run = async function set(client, channel, user, message, self, args, ops, viewer){
	var camp = message.split(" ");
	var platform = camp[1];
	var link = camp[2];
	var mysocial = fs.readFileSync(__dirname + '/../info/social.json');
	var social = JSON.parse(mysocial);

	if(user["user-type"] === "mod" || user.username === channel.replace("#", "")){


		if(!platform){
			client.say(channel, "/me Não foi possível realizar a operação: plataforma e link não providenciados.");
			return;
		};

		if(platform !== "youtube" && platform !== "facebook" && platform !== "twitter" && platform !== "discord" && platform !== "steam"){
			client.say(channel, "/me Não foi possível realizar a operação: plataforma inválida.");
			return;
		};

		if(!link){
			client.say(channel, "/me Não foi possível realizar a operação: link não providenciado.");
			return;
		};

		var platformCapitalized = platform.charAt(0).toUpperCase() + platform.slice(1);
		social[platformCapitalized] = link;

		fs.writeFileSync(__dirname + '/../info/social.json', JSON.stringify(social, null, 2));
		client.say(channel, "/me Operação realizada com sucesso: " + platformCapitalized + " : " + link);

		console.log(social);
	};
};
