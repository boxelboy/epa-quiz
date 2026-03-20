module.exports = function(app,packages,models){
	const { Client } = require("basic-ftp");
	app.get('/deploy/', (req,res) => {
		res.header('Access-Control-Allow-Origin', '*');
		return res.status(200).json({
			statusCode: 200,
			message: "Deploy connected:",
		});
	});
	app.get('/deploy/connection', async(req, res) => {
		res.header('Access-Control-Allow-Origin', '*');
		try{
			await models.ftp.accessClient();
			models.ftp.closeClient();
			return res.status(200).json({
				statusCode: 200,
				message: "Connection successful"
			});
		} catch(e){
			models.ftp.closeClient();
			return res.status(500).json({
				statusCode: 500,
				message: "Connection failed, please check your internet connection"
			});
		}
	});
	app.get('/deploy/upload', async(req, res) => {
		res.header('Access-Control-Allow-Origin', '*');
		try{
			let arrFiles = [];
			let strDirectoryPath = "";

			// get the correct directory route depending on if running as electron and EXE
			strDirectoryPath = models.helpers.appRootDirectory();

			// loop through all files in the directory if there is any csv files append to a new array ready for upload
			packages.fs.readdirSync(strDirectoryPath).forEach(function(file){
				if(!file.includes("README") && file.includes('.csv')){
					arrFiles.push(file);
				}
			});

			// pass the files to the upload files helper and then close FTP connection
			await models.ftp.uploadFiles(arrFiles);
			models.ftp.closeClient();
			return res.status(200).json({
				statusCode: 200,
				message: "Files uploaded successfully",
				files: arrFiles
			})
		} catch(e){
			console.log(e);
			models.ftp.closeClient();
			return res.status(500).json({
				statusCode: 500,
				message: "Upload failed, please check your internet connection",
				error: JSON.stringify(e)
			});
		}
	});
	app.get('/deploy/zip', async(req,res) => {
		res.header('Access-Control-Allow-Origin', '*');
		let strDirectoryPath = "";
		try{
			strDirectoryPath = models.helpers.appRootDirectory();
			// create a new directory to move the files to. To prepare for zipping
			let strCSVDirectory = packages.path.join(strDirectoryPath,'/','csv-files');
			if(!packages.fs.existsSync(strCSVDirectory)){
				packages.fs.mkdirSync(strCSVDirectory);
			}

			// move all csv files to the new folder.
			packages.fs.readdirSync(strDirectoryPath).forEach(function(file){
				if(!file.includes("README") && file.includes('.csv')){
					packages.fs.copyFileSync(packages.path.join(strDirectoryPath,'/',file),packages.path.join(strCSVDirectory,'/',file));
				}
			});

			// now that all files are moved need to zip the folder up
			let date = new Date();
			let strToday =
				String(date.getUTCDate()).padStart(2, "0") +
				"-" +
				String(date.getUTCMonth() + 1).padStart(2, "0") +
				"-" +
				date.getUTCFullYear();

			// create zip file
			models.helpers.createZIP(packages.path.join(strCSVDirectory,'/'),'csv-files-'+strToday);

			return res.status(200).json({
				statusCode: 200,
				message: "Zip built successfully",
				folder: packages.path.join(strDirectoryPath,'/','csv-files-'+strToday)+'.zip'
			});
		} catch(e){
			console.log(e);
			return res.status(500).json({
				statusCode: 500,
				message: "Failed to zip",
				folder: JSON.stringify(e)
			});
		}

	});
}