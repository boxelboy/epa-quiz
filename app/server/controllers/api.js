module.exports = function(app,packages,models){
	app.get('/api/', (req,res) => {
		res.header('Access-Control-Allow-Origin', '*');
		let message = models.helpers.isElectron();
		return res.status(200).json({
			statusCode: 200,
			message: "API connected:",
			electron: message
		});
	});
	app.get('/api/test', (req,res) => {
		res.status(200).json({
			statusCode: 200,
			message: "API connected"
		});
	});
}