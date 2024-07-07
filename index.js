const express = require("express")
const fs = require("fs")
const path = require('path');

app = express();

obGlobal = 
{
    obErori: null,
    obImagini: null
}

vecFoldere = ["temp", "temp1"];

for (let folder of vecFoldere)
{
	let cale = path.join(__dirname, folder);

	if (!fs.existsSync(cale))
		fs.mkdirSync(cale);
} 

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));

app.use(/^\/resurse(\/(?=[a-zA-Z0-9])+[a-zA-Z0-9]*)*/, function(req, res)
{
    afisEroare(res, 403);
});

app.use(function(req, res, next)
{
    if (req.url.endsWith('/') && req.url !== '/') 
    {
        const redirectUrl = req.url.slice(0, -1);
        res.redirect(301, redirectUrl);
    } 
    else
        next();
});

app.get(["/index","/","/home"], function(req, res)
{
    console.log("request " + req.url);

    res.render("pagini/index", 
    {
        imagini: calcImagini()
    });
})

app.get("/galerie", function(req, res)
{
    console.log("request " + req.url);
    
    res.render("pagini/galerie", 
    {
        imagini: calcImagini()
    });
})

app.get("/favicon.ico", function(req, res) 
{
    console.log("request " + req.url);
    res.sendFile(__dirname + "/resurse/ico/favicon.ico");
})

app.get("/*.ejs", function(req, res)
{
    console.log("request " + req.url);
    afisEroare(res, 400);
})

app.get("/*", function(req, res)
{
    console.log("request " + req.url);

    res.render("pagini" + req.url, function(err, rezRender)
    {
        if(err)
        {
            if(err.message.startsWith("Failed to lookup view"))
                afisEroare(res, 404);
            else
                afisEroare(res);
        }
        else
        {
            res.send(rezRender);
        }
    });
})

function initErori()
{
    var continut = fs.readFileSync(__dirname + "/resurse/json/erori.json").toString("utf-8");
    var obErori = JSON.parse(continut);

    for (let eroare of obErori.info_erori)
    {
        eroare.imagine= "/" + obErori.cale_baza + "/" + eroare.imagine;
    }

    obGlobal.obErori = obErori;
}

initErori();

function afisEroare(res, identificator, titlu, text, imagine)
{
    let eroare = obGlobal.obErori.info_erori.find(function(elemErr)
    {
        return elemErr.identificator == identificator;
    });

    if(eroare)
    {
        let titlu1 = titlu || eroare.titlu;
        let text1 = text || eroare.text;
        let imagine1 = imagine || eroare.imagine;

        if (eroare.status)
            res.status(eroare.identificator).render("pagini/eroare", {titlu: titlu1, text: text1, imagine: imagine1});
        else
            res.render("pagini/eroare", {titlu: titlu1, text: text1, imagine: imagine1});
    }
    else
    {
        res.render("pagini/eroare", 
        {
            titlu: obGlobal.obErori.eroare_default.titlu, 
            text: obGlobal.obErori.eroare_default.text, 
            imagine: obGlobal.obErori.eroare_default.imagine
        });
    }
}

function initImagini()
{
    var continut = fs.readFileSync(__dirname + "/resurse/json/imagini.json").toString("utf-8");
    var obImagini = JSON.parse(continut);

    for (let imagine of obImagini.imagini)
    {
        imagine.cale_relativa = "/" + obImagini.cale_galerie + "/" + imagine.cale_relativa;
        console.log("loaded " + imagine.cale_relativa);
    }

    obGlobal.obImagini = obImagini;
}

function calcImagini(res)
{
    let ret = [];

    let a = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0];
    let i = 0;
    let j = 0;

    function inInterval(intervale) 
    {
        let ora = new Date().getHours();
        return intervale.some(interval => ora >= interval[0] && ora <= interval[1]);
    }

    let imagini = obGlobal.obImagini.imagini.filter(imagine => inInterval(imagine.intervale_ore));

    let len = imagini.length;

    if (len % 2 == 1)
        len--;

    while(j < len)
    {
        if (a[i % a.length])
            ret.push({cale_relativa: ""});
        else
        {
            ret.push(imagini[j]);
            j++;
        }

        i++;
    }

    return ret;
}

initImagini();

app.listen(8080);
console.log("Serverul a pornit");