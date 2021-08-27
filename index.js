// SETUP EXPRESS
const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = mongodb.MongoClient;
const dotenv = require('dotenv');
dotenv.config();

let app = express();
app.use(express.json());
app.use(cors());

// connect to the Mongo DB
async function connect() {
    const mongo_url = process.env.MONGO_URI;
    let client = await MongoClient.connect(mongo_url, {
        "useUnifiedTopology": true
    })
    let db = client.db("fake_recipes");
    console.log("database connected");
    return db;
}

// ROUTES

async function main() {
    let db = await connect();

    app.get('/recipes', async (req, res) => {
        let recipes = await db.collection('recipes').find().toArray();
        res.json(recipes)
    })

    app.get('/recipes/:recipeId', async (req, res) => {
        let r = await db.collection('recipes').findOne({
            _id: new ObjectId(req.params.recipeId)
        });
        res.json(r);
    })

    app.post('/recipes', async (req, res) => {
        let results = await db.collection('recipes').insertOne({
            title: req.body.title,
            ingredients: req.body.ingredients
        })
        res.json(results.ops);
    })

    app.patch('/recipes/:id', async (req, res) => {
        let results = await db.collection('recipes').updateOne({
            '_id': new ObjectId(req.params.id),
        }, {
            '$set': {
                'title': req.body.title,
                'ingredients': req.body.ingredients
            }
        })
        res.json({
            'status': true
        })
    })
}


main();

// START SERVER
// note: we set port to 8888 so it won't clash with React
app.listen(8888, () => {
    console.log("server has started")
})