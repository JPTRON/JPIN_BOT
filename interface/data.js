var pointsButton = document.getElementById("pointsSave");
var storeButton = document.getElementById("storeSave");
var giveawayButton = document.getElementById("giveawaySave");

var itemCreateButton = document.getElementById("itemCreate");

var data;
var viewer;
var viewerKeys;

var store;
var items;
var itemsKeys;
var item;

var giveaway;
var users;
var usersKeys;
var usersArray;

var user = [];
var tickets = [];

showPoints();
showStore();
showGiveaway();

function showPoints()
{
    data = fs.readFileSync(__dirname + '/../data/data.json');
	viewer = JSON.parse(data);
    viewerKeys = Object.keys(viewer);
    viewerKeys.sort();

    for(i = 0; i < viewerKeys.length; i++)
    {
        var name = "" + viewerKeys[i];
        
        var div = document.createElement("div");
        var input = document.createElement("input");
        var br = document.createElement("br");
        var list = document.getElementById("DataPoints");

        input.type = "number";
        input.id = "input";
        input.placeholder = "Pontos";
        input.value = viewer[name].points;
        input.required = true;

        div.classList.add("listElement");
        div.innerText = name;
        div.appendChild(input);
        div.appendChild(br);
        list.appendChild(div);
    };
}

function showStore()
{
    store = fs.readFileSync(__dirname + '/../data/loja.json');
	items = JSON.parse(store);
    itemsKeys = Object.keys(items.Items);
    item = items.Items.map(x => x);

    for(i = 0; i < itemsKeys.length; i++)
    {
        var name = "" + item[i].Nome;
        
        var div = document.createElement("div");
        var input = document.createElement("input");
        var input2 = document.createElement("input");
        var del = document.createElement("button");
        var br = document.createElement("br");
        var list = document.getElementById("DataStore");

        input.type = "number";
        input.id = "input";
        input.placeholder = "Preço";
        input.value = item[i].Price;
        input.min = "0";
        input.step = "1";
        input.required = true;

        del.id = itemsKeys[i];
        del.innerText = "X";
        del.style.backgroundColor = "red";
        del.style.color = "white";
        del.classList.add("btn");
        del.setAttribute("onclick", "delItem()");

        div.classList.add("listElement");
        div.innerText = `Id: ${item[i].Id} | ${name}`;
        div.appendChild(input);

        input2.type = "number";
        input2.id = "input";
        input2.placeholder = "Quant.";
        input2.min = "0";
        input2.step = "1";
        input2.required = true;

        if(item[i].hasOwnProperty("Quantity"))
        {
            input2.value = item[i].Quantity;
        }
        else
        {
            input2.value = 0;
        }

        div.appendChild(input);
        div.appendChild(input2);
        div.appendChild(del);
        div.appendChild(br);
        list.appendChild(div);
    };
}

function showGiveaway()
{
    giveaway = fs.readFileSync(__dirname + '/../data/sorteio.json');
	users = JSON.parse(giveaway);
    usersKeys = Object.keys(users.Participantes);
    usersArray = users.Participantes.map(x => x);
    usersArray.sort();

    var prev;

    for(var i = 0; i < usersArray.length; i++)
    {
        if(usersArray[i] !== prev)
        {
            user.push(usersArray[i]);
            tickets.push(1);
        }
        else
        {
            tickets[tickets.length - 1]++;
        }

        prev = usersArray[i];
    };

    var list = document.getElementById("DataGiveaway");
    var br = document.createElement("br");

    var configs = document.createElement("div");
    var ticketPrice = document.createElement("input");
    var ticketMax = document.createElement("input");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");

    span1.innerText = "Preço: ";
    span2.innerText = "Max: ";

    ticketPrice.type = "number";
    ticketPrice.id = "input";
    ticketPrice.placeholder = "Preço";
    ticketPrice.min = "0";
    ticketPrice.step = "1";
    ticketPrice.required = true;

    ticketMax.type = "number";
    ticketMax.id = "input";
    ticketMax.placeholder = "Max";
    ticketMax.min = "0";
    ticketMax.step = "1";
    ticketMax.required = true;

    list.appendChild(configs);

    if(users["Price"] === "OFF")
    {
        document.getElementById("giveawayTurn").innerHTML = "ON";
    }
    else
    {
        ticketPrice.value = users.Price;
        ticketPrice.disabled = true; 
        ticketMax.value = users.Maximo;
        ticketMax.disabled = true;

        document.getElementById("giveawayTurn").innerHTML = "OFF";
    }

    configs.id = "giveawayConfig";
    configs.appendChild(span1);
    configs.appendChild(ticketPrice);
    configs.appendChild(span2);
    configs.appendChild(ticketMax);
    configs.classList.add("listElement");

    for(i = 0; i < user.length; i++)
    {
        var name = "" + user[i]; 
        
        var div = document.createElement("div");
        var span = document.createElement("span");
        
        div.classList.add("listElement");
        div.innerText = name;

        span.innerText = tickets[i];
        span.style.float = "right";

        div.appendChild(span);
        div.appendChild(br);
        list.appendChild(div);
    };
}

function delItem()
{
    var id = +$(event.target).attr("id");

    dialog.confirm("Atenção!! Ação irreversível, pretende eliminar o item?", ok => {
        if(ok === true)
        {
            items.Items.splice(id, 1);

            fs.writeFileSync(path.join(__dirname + '/../data/loja.json'), JSON.stringify(items, null, 2));

            clearData();   
        }    
    });
}

function createItem()
{
    itemCreateButton.disabled = true;

    var div = document.createElement("div");
    var input = document.createElement("input");
    var input2 = document.createElement("input");
    var input3 = document.createElement("input");
    var br = document.createElement("br");
    var btn = document.createElement("button");
    var btn2 = document.createElement("button");
    var list = document.getElementById("DataStore");

    input.type = "text";
    input.id = "inputItemName";
    input.placeholder = "Nome";
    input.required = true;
    div.appendChild(input);
    
    input2.type = "number";
    input2.id = "price";
    input2.placeholder = "Preço";
    input2.min = "0";
    input2.step = "1";
    input2.required = true;
    div.appendChild(input2);

    input3.type = "number";
    input3.id = "quantidade";
    input3.placeholder = "Quant.";
    input3.min = "0";
    input3.step = "1";
    input3.required = true;
    div.appendChild(input3);

    btn.innerText = "✓";
    btn.style.backgroundColor = "green";
    btn.style.color = "white";
    btn.classList.add("btn");
    btn.setAttribute("onclick", "addItem()");
    div.appendChild(btn);

    btn2.innerText = "X";
    btn2.style.backgroundColor = "red";
    btn2.style.color = "white";
    btn2.classList.add("btn");
    btn2.setAttribute("onclick", "cancelItem()");
    div.appendChild(btn2);

    div.classList.add("listElement");
    div.appendChild(br);
    list.appendChild(div);
}

function addItem()
{
    var nome = document.getElementById("inputItemName").value;
    var quantidade = document.getElementById("quantidade").value;
    var price = document.getElementById("price").value;

    if(/\S/.test(nome) && quantidade != "" && price != "")
    {
        if(quantidade < 0 || price < 0)
        {
            dialog.alert(`Não são aceites valores negativos.`);
            return;
        }

        if(quantidade == 0)
        {
            var novoItem = {
                Id: items.contador,
				Nome: nome,
				Price: +price
            };
        }
        else
        {
            var novoItem = {
                Id: items.contador,
				Nome: nome,
				Price: +price,
                Quantity: +quantidade
            };
        }
        
        items.Items.push(novoItem);
        items.contador++;
        fs.writeFileSync(path.join(__dirname + '/../data/loja.json'), JSON.stringify(items, null, 2));

        itemCreateButton.disabled = false;
        clearData();  
    }
    else
    {
        dialog.alert(`Preencha todos os campos.`);
    }
}

function cancelItem()
{
    itemCreateButton.disabled = false;
    clearData();
}

function turn()
{
    if($(event.target).text() === "ON")
    {
        if(document.forms['giveawayForm'].reportValidity() === true)
        {
            users["Price"] = +document.getElementById("giveawayConfig").children[1].value;
            users["Maximo"] = +document.getElementById("giveawayConfig").children[3].value;

            fs.writeFileSync(path.join(__dirname + '/../data/sorteio.json'), JSON.stringify(users, null, 2));
        
            $(event.target).text("OFF");
            clearData(); 
        }
    }
    else
    {
        dialog.confirm("Atenção!! Ação irreversível, pretende encerrar o sorteio?", ok => {
            if(ok === true)
            {
                dialog.confirm(`Ok: Sortear vencedor \n Cancel: Cancelar sorteio e devolver pontos`, ok => {
                    giveaway = fs.readFileSync(__dirname + '/../data/sorteio.json');
                    users = JSON.parse(giveaway);
                    usersKeys = Object.keys(users.Participantes);
                    usersArray = users.Participantes.map(x => x);
                    
                    if(ok === true)
                    {                        
                        if(usersArray.length === 0)
                        {
                            dialog.alert("Sem participantes para sortear.");

                            resetJson();
                            $("#giveawayTurn").text("ON");
                            clearData(); 
                        }
                        else
                        {
                            var generated = Math.floor(Math.random() * usersKeys.length);
    
                            dialog.alert(`O vencedor do sorteio foi: @${usersArray[generated]}`);

                            resetJson();
                            $("#giveawayTurn").text("ON");
                            clearData(); 
                        }    
                    }
                    else
                    {   
                        if(usersArray.length === 0)
                        {
                            dialog.alert("Sem participantes para devolver pontos.");
                        }
                        else
                        {
                            for(var i = 0; i < user.length; i++)
                            {
                                viewer[user[i]].points += tickets[i] * users.Price;
                            }

                            fs.writeFileSync(path.join(__dirname + '/../data/data.json'), JSON.stringify(viewer, null, 2));

                            dialog.alert("Pontos devolvidos com sucesso.");

                            resetJson();
                            $("#giveawayTurn").text("ON");
                            clearData();
                        }
                    }
                });                
            }    
        });  
    }

    function resetJson()
    {
        users = {
            Price: "OFF",
            Maximo: 0,
            Participantes: []
        };

            fs.writeFileSync(path.join(__dirname + '/../data/sorteio.json'), JSON.stringify(users, null, 2));
    }
}

pointsButton.onclick = function()
{
    if(document.forms['pointsForm'].reportValidity() === true)
    {
        var list = document.getElementById("DataPoints").getElementsByClassName("listElement");

        for (var i = 0; i < list.length; i++) 
        {
            var currViewer = list[i];
            var point = currViewer.children[0].value;

            viewer[viewerKeys[i]].points = +point;
        }

        fs.writeFileSync(path.join(__dirname + '/../data/data.json'), JSON.stringify(viewer, null, 2));
        clearData(); 

        if(pointsButton.innerText !== "Gravar")
        {
            pointsButton.disabled = true;
            ipcRenderer.send('restartBot', {});
        }
    }
}

storeButton.onclick = function()
{
    if(document.forms['storeForm'].reportValidity() === true)
    {
        var list = document.getElementById("DataStore").getElementsByClassName("listElement");

        for (var i = 0; i < list.length; i++) 
        {
            item[i].Price = +list[i].children[0].value;

            if(list[i].children[1].value == 0 && item[i].hasOwnProperty("Quantity"))
            {
                delete item[i].Quantity;
            }
            else if(list[i].children[1].value > 0)
            {
                item[i].Quantity = +list[i].children[1].value;
            }
        }

        fs.writeFileSync(path.join(__dirname + '/../data/loja.json'), JSON.stringify(items, null, 2));
        clearData(); 
    }
}

function clearData()
{
    user = [];
    tickets = [];

    $("#DataPoints").empty();
    $("#DataStore").empty();
    $("#DataGiveaway").empty();

    data = fs.readFileSync(__dirname + '/../data/data.json');
	viewer = JSON.parse(data);
    viewerKeys = Object.keys(viewer);

    store = fs.readFileSync(__dirname + '/../data/loja.json');
	items = JSON.parse(store);
    itemsKeys = Object.keys(items.Items);
    item = items.Items.map(x => x);

    giveaway = fs.readFileSync(__dirname + '/../data/sorteio.json');
	users = JSON.parse(giveaway);
    usersKeys = Object.keys(users.Participantes);
    usersArray = users.Participantes.map(x => x);

    showPoints();
    showStore();
    showGiveaway();
}

