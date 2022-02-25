const Dialogs = require("dialogs")
var dialog = Dialogs(opts={});

var comButton = document.getElementById("ComSave");
var createButton = document.getElementById("ComCreate");

var mycommands = fs.readFileSync(__dirname + '/../data/customcommands.json');
var customcommands = JSON.parse(mycommands);
var comkeys = Object.keys(customcommands);

listCommands();

function listCommands()
{
    fs.readdir(__dirname + '/../commands', (err, files) => {
		for(i = 0; i < files.length; i++)
        {
			var name = files[i];
			name = name.substring(0, files[i].length - 3);
			
            var div = document.createElement("div");
            var br = document.createElement("br");
            var list = document.getElementById("comandos1");

            div.classList.add("listElement");
            div.innerText = name;
            div.appendChild(br);
            list.appendChild(div);
		};
	});

    for(i = 0; i < comkeys.length; i++)
    {
        var comando = "" + comkeys[i];       

        var div = document.createElement("div");
        var inputTxt = document.createElement("input");
        var br = document.createElement("br");
        var del = document.createElement("button");
        var list = document.getElementById("comandos2");

        inputTxt.type = "text";
        inputTxt.id = "inputTxt";
        inputTxt.placeholder = "Resposta";
        inputTxt.value = customcommands[comando].resposta;
        inputTxt.required = true;

        del.id = comkeys[i];
        del.innerText = "X";
        del.style.backgroundColor = "red";
        del.style.color = "white";
        del.classList.add("btn");
        del.setAttribute("onclick", "delCom()");

        div.classList.add("listElement");
        div.innerText = comando;       
        div.appendChild(inputTxt);

        if(customcommands[comando].hasOwnProperty("contador"))
        {
            var input = document.createElement("input");
            input.type = "number";
            input.id = "input";
            input.min = "0";
            input.step = "1";
            input.placeholder = "Cont.";
            input.value = customcommands[comando].contador;
            input.required = true;

            div.appendChild(input);
        }

        div.appendChild(del);
        div.appendChild(br);
        list.appendChild(div);
    };
}

function delCom()
{
    var com = $(event.target).attr("id");

    dialog.confirm("Atenção!! Ação irreversível, pretende eliminar o comando?", ok => {
        if(ok === true)
        {
            delete customcommands[com];
            fs.writeFileSync(path.join(__dirname + '/../data/customcommands.json'), JSON.stringify(customcommands, null, 2));

            clear();
        }    
    });
}

comButton.onclick = function()
{
    if(document.forms['commandsForm'].reportValidity() === true)
    {
        var list = document.getElementById("comandos2").getElementsByClassName("listElement");

        for (var i = 0; i < list.length; i++) 
        {
            var currCom = list[i];
            var res = currCom.children[0].value;   
            var equal = 0;

            customcommands[comkeys[i]].resposta = res;

            var resHandler = res.split(" ").slice();

            for(var x = 0; x < resHandler.length; x++)
            {
                if(resHandler[x] === "${cont}")
                {
                    equal = 1;
                }
            }

            if(equal === 0 && customcommands[comkeys[i]].hasOwnProperty("contador"))
            {
                delete customcommands[comkeys[i]].contador;
            }
            
            if(equal === 1)
            {
                if(!customcommands[comkeys[i]].hasOwnProperty("contador"))
                {
                    customcommands[comkeys[i]].contador = +0;
                }
                else
                {
                    var cont = currCom.children[1].value;

                    customcommands[comkeys[i]].contador = +cont;
                }     
            }

            fs.writeFileSync(path.join(__dirname + '/../data/customcommands.json'), JSON.stringify(customcommands, null, 2));
        }

        clear();
    }
}

function clear()
{
    $("#comandos1").empty();
    $("#comandos2").empty();

    mycommands = fs.readFileSync(__dirname + '/../data/customcommands.json');
    customcommands = JSON.parse(mycommands);
    comkeys = Object.keys(customcommands);

    listCommands();
}

function createCom()
{
    createButton.disabled = true;

    var div = document.createElement("div");
    var inputName = document.createElement("input");
    var inputTxt = document.createElement("input");
    var br = document.createElement("br");
    var create = document.createElement("button");
    var del = document.createElement("button");
    var list = document.getElementById("comandos2");

    inputName.type = "text";
    inputName.id = "inputName";
    inputName.placeholder = "Nome";
    inputName.required = true;

    inputTxt.type = "text";
    inputTxt.id = "novares";
    inputTxt.placeholder = "Resposta";
    inputTxt.required = true;

    create.innerText = "✓";
    create.style.backgroundColor = "green";
    create.style.color = "white";
    create.classList.add("btn")
    create.setAttribute("onclick", "addCom()");

    del.innerText = "X";
    del.style.backgroundColor = "red";
    del.style.color = "white";
    del.classList.add("btn");
    del.setAttribute("onclick", "cancel()");

    div.classList.add("listElement");
    div.appendChild(inputName);
    div.appendChild(inputTxt);

    div.appendChild(create);
    div.appendChild(del);
    div.appendChild(br);
    list.appendChild(div);
}

function addCom()
{
    var nome = document.getElementById("inputName").value;
    var res = document.getElementById("novares").value;
    var resHandler = res.split(" ").slice();
    var equal = 0;
    
    for(var x = 0; x < resHandler.length; x++)
    {
        if(resHandler[x] === "${cont}")
        {
            equal = 1;
        }
    }

    if(/\S/.test(nome)&& /\S/.test(res))
    {
        nome = nome.split(" ").join("");

        for (var i = 0; i < comkeys.length; i++) 
        {
            if(nome == comkeys[i])
            {
                dialog.alert(`Comando ${nome} já existente.`);
                return;
            }
        }
        
        if(equal === 1)
        {
            customcommands[nome] = {
                resposta: res,
                contador: + 0
            };
        }
        else
        {
            customcommands[nome] = {
                resposta: res
            };
        }
        
        fs.writeFileSync(path.join(__dirname + '/../data/customcommands.json'), JSON.stringify(customcommands, null, 2));

        createButton.disabled = false;
        clear();  
    }
    else
    {
        dialog.alert(`Preencha todos os campos.`);
    }
}

function cancel()
{
    createButton.disabled = false;
    clear();
}