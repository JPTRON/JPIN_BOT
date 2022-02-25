const fetch = require("node-fetch");

function send(file, type)
{
  var data = {file: file, type: type};
  fetch("http://localhost:3000/show", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
}

exports.send = send;