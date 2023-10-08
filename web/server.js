const express = require('express');
const app = express();

const port = 3000;
const base = `${__dirname}/public`;

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(`${base}/home.html`);
});

app.get('/floor', (req, res) => {
	res.sendFile(`${base}/floor.html`);
});


app.get('/light', (req, res) => {
	res.sendFile(`${base}/light.html`);
});

app.get('*', (req,res) => {
	res.sendFile(`${base}/404.html`);
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
