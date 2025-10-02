import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send({ data: 'Hello World!'});
});

app.listen(80, () => {
    console.log('App running on port 80');
});