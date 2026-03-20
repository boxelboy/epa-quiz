const {Client} = require("basic-ftp");
const ftp = {};
module.exports = function(app,packages,models){
	const { Client } = require("basic-ftp");
	ftp.setUpClient = () => {
		let client = new Client();
		client.ftp.verbose = false;
		return client;
	}
	ftp.accessClient = async() => {
		const client = ftp.setUpClient();
		await client.access({
			host: process.env.FTPHOST,
			user: process.env.FTPUSER,
			password: process.env.FTPPASSWORD,
			secure: true
		})
		return client;
	}
	ftp.uploadFiles = async(arrFiles) => {
		const client = ftp.setUpClient();
		await client.access({
			host: process.env.FTPHOST,
			user: process.env.FTPUSER,
			password: process.env.FTPPASSWORD,
			secure: true
		});
		await client.ensureDir(process.env.FTPDEPLOYPATH);
		await client.cd(process.env.FTPDEPLOYPATH);

		let strDirectoryPath = "";
		if(models.helpers.isElectron && process.env.npm_lifecycle_event !== "electron-serve"){
			strDirectoryPath = packages.path.join(models.helpers.rootDIR, '..','..','..');
		} else {
			strDirectoryPath = packages.path.join(models.helpers.rootDIR, '..');
		}

		for(const strFileName of arrFiles){
			await client.uploadFrom(strDirectoryPath+"/"+strFileName+"", strFileName);
		}
		return client;
	}
	ftp.closeClient = () => {
		const client = ftp.setUpClient();
		client.close();
	}
	return ftp;
}