const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

require('dotenv').config();


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zew5s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('beauty-and-care');
        const productsCollections = database.collection('products');
        const cartCollection = database.collection('carts');

        app.get('/products', async (req, res) => {
            const cursor = productsCollections.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        app.post('/cart', async (req, res) => {
            const order = req.body;
            const result = await cartCollection.insertOne(order);
            res.json(result);
        });
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find({});
            const carts = await cursor.toArray();
            res.send(carts);
        });
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(typeof (id));
            const query = { _id: id };
            const result = await cartCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running');
})
app.listen(port, () => {
    console.log('working...', port);
});