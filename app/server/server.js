const backendPackages = {}
const express = require('express');
const app = express();
const port = 8080;

const csvHeader = "Type, Name, Page, Last updated\n"

backendPackages.fs = require('fs');
backendPackages.cors = require('cors');
backendPackages.helmet = require("helmet");
backendPackages.nodemailer = require('nodemailer');
backendPackages.path = require('path');
backendPackages.archiver = require('archiver');
backendPackages.electron = require('electron');

const corsOptions = {
	origin:'*',
	credentials:true,
	//access-control-allow-credentials:true
	optionSuccessStatus:200
}

app.use(backendPackages.cors(corsOptions));
app.use(
	/*backendPackages.helmet.contentSecurityPolicy({
		useDefaults: false,
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'"],
			styleSrc: ["'self'"],
			fontSrc: ["'self'"]
		}
	}),*/
	backendPackages.helmet.crossOriginOpenerPolicy(),
	backendPackages.helmet.crossOriginResourcePolicy(),
	backendPackages.helmet.dnsPrefetchControl(),
	backendPackages.helmet.hidePoweredBy(),
	backendPackages.helmet.hsts(),
	backendPackages.helmet.ieNoOpen(),
	backendPackages.helmet.noSniff(),
	backendPackages.helmet.originAgentCluster(),
	backendPackages.helmet.referrerPolicy(),
	backendPackages.helmet.xFrameOptions(false),
);
app.use(express.json());
app.use('/assets',express.static(__dirname+'/public/assets'));

const models = {};
models.helpers = require(__dirname+'/models/helpers')(app,backendPackages,models);
models.ftp = require(__dirname+'/models/ftp')(app,backendPackages,models);
models.helpers.rootDIR = __dirname;


// locate env file if you are running serve then need to change it to jump back 1 directory instead.
/*if(models.helpers.isElectron()){
	if(process.env.npm_lifecycle_event !== "electron-serve"){
		require('dotenv').config({path: backendPackages.path.join(__dirname,'..','..','.env')});
	} else {
		require('dotenv').config({path: backendPackages.path.join(__dirname,'..','.env')});
	}
} else {
	require('dotenv').config({path: backendPackages.path.join(__dirname,'..','.env')});
} */

app.get(['/'], (req, res) => {
	res.sendFile(process.cwd() + '/public/index.html');
});

//Load in all the registered controllers
backendPackages.fs.readdirSync(__dirname+"/controllers").forEach(function(file){
	if(!file.includes("README")){
		require(__dirname + "/controllers/" + file)(app, backendPackages, models);
	}
});

app.post("/save", (req, res) => {

	let analyticsLogFileName = req.body.date + "-saved-data.csv";

	let logRow = `${req.body.data}`;
	//let date = new Date();
	//const logDate = date.getFullYear()+'-'+(date.getMonth()+1).toString().padStart(2,"0")+'-'+date.getDate().toString().padStart(2,"0");
	//const logTime = date.getHours().toString().padStart(2,"0")+":"+date.getMinutes().toString().padStart(2,"0")+":"+date.getSeconds().toString().padStart(2,"0");
	//logRow += logDate + ' ' + logTime + '\n';

	// detect if the files exists if so append to the file rather than setting up with headers
	backendPackages.fs.readFile(analyticsLogFileName,(err,data) => {
		if(data !== undefined && data.length > 0){
			backendPackages.fs.appendFileSync(analyticsLogFileName, logRow, function (err) {
				if (err) throw err;

			});
		} else {
			// no data or file found so create the file and write the data to it.
			backendPackages.fs.writeFileSync(analyticsLogFileName, csvHeader + logRow, function (err) {
				if (err) throw err;

			});
		}
	});

	res.header('Content-Type', 'application/json');
	res.header('Access-Control-Allow-Origin', '*');

	res.sendStatus(200);

});

app.all('/*',function(req,res){
	res.sendFile(process.cwd() + '/public/index.html');
});

// open port on server
app.listen(port,function(){
	console.log("listening on port: "+port);
});
