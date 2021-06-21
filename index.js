const MongoClient = require('mongodb').MongoClient;
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');

const url = process.env.NODE_ENV;
const app = express();
const port = 3000;
const dbName = "movie-app";
const collectionName = "movies";
let client = "";
app.use(bodyParser.json());

app.get('/list/active', async (req, res) => {
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.find({ status: { "$eq": "active" } }).toArray();
    return res.send(JSON.stringify(response));
});

app.get('/list/inactive', async (req, res) => {
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.find({ status: { "$eq": "inactive" } }).toArray();
    return res.send(JSON.stringify(response));
})

app.get("/list",async(req,res)=>{
    console.log(url)
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.find().toArray()
    res.json({response});
});

app.post('/create', async (req, res) => {
    const { name, year } = req.body;
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.insertOne({ name: name, year: year });
    return res.json(response.result);
});

app.put('/update/deactivate/:movieName', async (req, res) => {
    const { movieName } = req.params;
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.updateOne(
        { name: movieName },
        {
            $set: {
                status: "inactive"
            }
        }
    );

    return res.json(response.result);
});

app.put('/update/activateAll', async (req, res) => {
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.updateMany(
        {},
        {
            $set: {
              status: "active"
            }
        }
    );
   return res.json(response.result);
});

app.put("/update/:name",async(req,res)=>{
    const { name:movieName } = req.params;
    const year = req.body.year;
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.updateOne(
        { name: movieName },
        {
            $set: {
                year : year
            }
        }
    );
    res.json(response.result);
});

app.delete('/delete/:movieName', async (req, res) => {
    const { movieName } = req.params;
    const collection = client.db(dbName).collection(collectionName);
    const response = await collection.deleteOne({ name: movieName });

    return res.json(response.result);
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});

const connectToDatabase = async () => {
    console.log("Connected to the database");
    client = await MongoClient.connect(url);
};

connectToDatabase();