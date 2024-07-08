const express = require("express")
const fs = require("fs")
const path = require("path");
const sass = require("sass");
const {Client} = require("pg");

var client = new Client(
{
    database: "cti_2024",
    user: "fabian",
    password: "123456",
    host: "localhost",
    port: 5432
});

client.connect();

client.query("select * from public.produse", function(err, rez)
{
	if(err)
		console.log(err);
	else
		console.log(rez.rows);
});

app = express();

obGlobal = 
{
    obErori: null,
    obImagini: null,
    folderScss: path.join(__dirname, "resurse/scss"),
	folderCss: path.join(__dirname, "resurse/css"),
	folderBackup: path.join(__dirname, "backup")
}

vecFoldere = ["temp", "temp1", "backup"];

for (let folder of vecFoldere)
{
	let cale = path.join(__dirname, folder);

	if (!fs.existsSync(cale))
		fs.mkdirSync(cale);
} 

function compScss(caleScss, caleCss)
{
	if(!caleCss)
    {
		let numeFisExt = path.basename(caleScss);
		let numeFis = numeFisExt.split(".")[0];
		caleCss = numeFis + ".css"
	}

	if(!path.isAbsolute(caleScss))
		caleScss = path.join(obGlobal.folderScss, caleScss);

	if(!path.isAbsolute(caleCss))
		caleCss = path.join(obGlobal.folderCss, caleCss);

	let caleBackup = path.join(obGlobal.folderBackup, "resurse/css")	

	if(!fs.existsSync(caleBackup))
		fs.mkdirSync(caleBackup, { recursive: true })

	let numeFisCss = path.basename(caleCss);

	if(fs.existsSync(caleCss))
		fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCss));
    
	let rez = sass.compile(caleScss, { "sourceMap": true });

	fs.writeFileSync(caleCss, rez.css);

	console.log("compiled ", rez);
}

fisiere = fs.readdirSync(obGlobal.folderScss);

for(let fis of fisiere)
{
	if(path.extname(fis) == ".scss")
		compScss(fis);
}

fs.watch(obGlobal.folderScss, function(event, fis)
{
	if(event == "change" || event == "rename")
	{
		let cale = path.join(obGlobal.folderScss, fis);

		if(fs.existsSync(cale))
			compScss(cale);
	}
});

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

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

function calcImagini()
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