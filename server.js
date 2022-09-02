const express = require('express')
const app = express()
const port = process.env.PORT || 4000;
require('dotenv').config()


const etherAuth = require('ethauth-server');

//CORS
const cors = require("cors");
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

// BodyParser middleware
const bodyParser = require("express");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/get/:address', (req, res) => {
    let address = req.params.address;
    let token = etherAuth.generate(address, process.env.ETHER_AUTH_SECRET);
    res.json(token);
})

app.post('/send', (req, res, next) => {
    let key = req.body.key;
    let signature = req.body.signature;

    etherAuth.validate(key, signature, process.env.ETHER_AUTH_SECRET).then((validation) => {
            console.log(validation);
            res.json(validation);
    }).catch((err) => {
        console.log(err, "error")
        res.status(401).send('Unauthorized: Invalid signature');
    });

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
