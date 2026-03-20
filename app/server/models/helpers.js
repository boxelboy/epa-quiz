const helpers = () => {};

module.exports = function(app,packages,models){
	helpers.isElectron = () => {
		// Renderer process
		if (
			typeof window !== "undefined" &&
			typeof window.process === "object" &&
			window.process.type === "renderer"
		) {
			return true;
		}

		// Main process
		if (
			typeof process !== "undefined" &&
			typeof process.versions === "object" &&
			!!process.versions.electron
		) {
			return true;
		}

		// Detect the user agent when the `nodeIntegration` option is set to true
		if (
			typeof navigator === "object" &&
			typeof navigator.userAgent === "string" &&
			navigator.userAgent.indexOf("Electron") >= 0
		) {
			return true;
		}

		return false;
	}
	helpers.appRootDirectory = () => {
		// get the correct directory route depending on if running as electron and EXE
		let strDirectoryPath = "";
		if(helpers.isElectron && process.env.npm_lifecycle_event !== "electron-serve"){
			strDirectoryPath = packages.path.join(models.helpers.rootDIR, '..','..','..');
		} else {
			strDirectoryPath = packages.path.join(models.helpers.rootDIR, '..');
		}
		return strDirectoryPath;
	}
	helpers.createZIP = (strFolderName, strZipName) => {
		// create zip file and choose path where to put it
		var strZipPath = packages.path.join(helpers.appRootDirectory(),'/',strZipName+'.zip');
		var outputFile = packages.fs.createWriteStream(strZipPath);
		var archive = packages.archiver('zip');
		archive.pipe(outputFile);
		archive.directory(strFolderName, false);
		archive.finalize();
		return strZipPath;
	}
	return helpers;
}