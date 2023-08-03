const client = require("twilio")(process.env.VITE_TWILIO_ACCOUNT_ID, process.env.VITE_TWILIO_AUTH_TOKEN);

export default async (req, res) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	client.messages
		.create({
			from: process.env.VITE_TWILIO_TELEPHONE_NUMBER,
			to: req.body.to,
			body: req.body.body,
		})
		.then(() => {
			res.send(JSON.stringify({ success: true }));
		})
		.catch((err) => {
			console.log(err);
			res.send(JSON.stringify({ success: false }));
		});
};
