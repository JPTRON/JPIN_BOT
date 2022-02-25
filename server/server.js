const express = require("express");
const port = 3000;
const app = express();
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/media', express.static(__dirname + '/../media/'));
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile(`${__dirname}/public/index.html`));
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const io = require("socket.io")(server);

app.post("/show", (req, res) => {
    io.emit(req.body.type, req.body.file);
});


io.on('connection', function (socket) {
    //console.log('a user connected');

    socket.on('disconnect', function () {
      //console.log('user disconnected');
    });
});