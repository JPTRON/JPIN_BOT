// !facebook

const fs = require('fs');

exports.run = async function facebook(client, channel, user, message, self, args, ops, viewer){
	var mysocial = fs.readFileSync(__dirname + '/../info/social.json');
	var social = JSON.parse(mysocial);

	client.say(channel, "/me Facebook: " + social.Facebook);
};
