const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3bc4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);  

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('database connected successfully');
        const database = client.db('tododb');
        const todosCollection = database.collection('todos');

        //get api
        app.get('/todos', async (req, res) => {
            const cursor = todosCollection.find({});
            const todos = await cursor.toArray();
            res.send(todos);
        })

        //post api
        app.post('/todos', async (req, res)=>{
            const todo = req.body;
            console.log('hit the post api', todo);
            const result = await todosCollection.insertOne(todo);
            console.log(result);
            res.json(result);
        });

        //Delete api
        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todosCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('running to-do app server');
});

app.listen(port,()=>{
    console.log('running to do app on port', port);
});