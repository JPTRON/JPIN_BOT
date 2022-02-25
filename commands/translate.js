// !translate [language] [sentence]

const fetch = require("node-fetch");
//const translatemsg = require('translate-google');

exports.run = async function translate(client, channel, user, message, self, args, ops, viewer){

	var camp = message.split(" ");
	var language = camp[1];

	if(!language){
		client.say(channel, "/me Não foi possível realizar a tradução: idioma e frase não providenciados. Lista de idiomas suportados: https://github.com/shikar/NODE_GOOGLE_TRANSLATE/blob/master/languages.js");
		return;
	};

	var originalSentence =  message.slice(camp[0].length + language.length + 2);

	if(!originalSentence){
		client.say(channel, "/me Não foi possível realizar a tradução: frase não providenciada.");
		return;
	};

/*	try{

		var translatedSentence =  await translatemsg(originalSentence, {to: language});
		client.say(channel, "/me Mensagem de @" + user["display-name"] + " traduzida para " + language +" : " + translatedSentence);

	} catch (err){
		client.say(channel, "/me Não foi possível realizar a tradução: idioma não existe / não é suportado. Lista de idiomas suportados: https://prnt.sc/1132i9h");
		return;
	};
*/
	const res = await fetch("https://libretranslate.de/translate", {
		method: "POST",
		body: JSON.stringify({
			q: originalSentence,
			source: "auto",
			target: language
		}),
		headers: { "Content-Type": "application/json" }
	})
	.then(res => res.json())
	.then(res => {
		if(res.translatedText)
		{
			client.say(channel, "/me Mensagem de @" + user["display-name"] + " traduzida para " + language +" : " + res.translatedText);
		}
		console.log(res);
	})
	.catch(err => 
	{
		console.log(err);
		client.say(channel, "/me Não foi possível realizar a tradução: idioma não existe / não é suportado. Lista de idiomas suportados: https://prnt.sc/1132i9h");
		return;
	});
	

};
