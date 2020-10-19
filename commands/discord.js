// !discord

const fs = require('fs');

exports.run = async function discord(client, channel, user, message, self, args, ops, viewer){
	var mysocial = fs.readFileSync(__dirname + '/../info/social.json');
	var social = JSON.parse(mysocial);

	client.say(channel, "/me Discord: " + social.Discord);
};
