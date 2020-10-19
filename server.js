const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');
const port = 8080;

var server;
var genNum;
var alreadyStarted = 0;
console.log("server:" + __dirname);

module.exports = {
  StartServer: function(){
    if(alreadyStarted === 1){
      server.close();
    }

    const app = express();
    var generated = Math.floor(Math.random() * 3) + 1;
    genNum = generated;

    var gatovotos = {
      "Copo": generated,
      "Votos": {}
    };

    fs.writeFileSync(__dirname + '/views/layouts/gato.json', JSON.stringify(gatovotos, null, 2));

    app.engine('handlebars', exphbs());
    app.set('view engine', 'handlebars');

    app.get('/', (request, response) => {
      response.render('antes', {
        coponr: generated
      });
    });

    server = app.listen(port, () => console.log(`Server aberto: localhost:${port}`));
    alreadyStarted = 1;
  },

  EndMinigame: function(){
    server.close();
    const app = express();
    app.engine('handlebars', exphbs());
    app.set('view engine', 'handlebars');

    app.get('/', (request, response) => {
      response.render('depois', {
        coponr: genNum
      });
    });

    server = app.listen(port, () => console.log("Gato revelado!"));
  },

  HoldServer: function(){
    if(alreadyStarted === 1){
      server.close();
    }
    const app = express();
    app.engine('handlebars', exphbs());
    app.set('view engine', 'handlebars');

    app.get('/', (request, response) => {
      response.render('hold');
    });

    server = app.listen(port, () => console.log("Holding server!"));
    alreadyStarted = 1;
  }
};
