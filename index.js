const express = require('express')
const cors = require('cors')
require("dotenv").config()
const MongoClient=require("mongodb").MongoClient
const ObjectId=require("mongodb").ObjectId

const app = express()
const port = process.env.PORT||5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tropq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("Team88");
       const productsCollection = database.collection("products");

        // get products
        app.get('/products', async(req,res)=>{
          const cursor= productsCollection.find({})
          const products=await cursor.toArray()
          res.send(products)
        })
        // post products
        app.post('/products',(req,res)=>{
          // console.log(req.body)
          productsCollection.insertOne(req.body).then(result=>{
            res.send(result.insertedId);
          })
        })
  
         // delete product
         app.delete("/deleteProduct/:id", async (req, res) => {
          console.log(req.params.id);
          const result=await productsCollection
          .deleteOne({ _id: ObjectId(req.params.id) })
          res.send(result)
        })
  
 
          //  make admin
          app.put("/makeAdmin", async (req, res) => {
            const filter = { email: req.body.email };
            const result = await userCollection.find(filter).toArray();
            if (result) {
              const documents = await userCollection.updateOne(filter, {
                $set: { role: "admin" },
              });
              console.log(documents);
          }});
  
          // check admin or not
            app.get("/checkAdmin/:email", async (req, res) => {
              const result = await userCollection
                .find({ email: req.params.email })
                .toArray();
              console.log(result);
              res.send(result);
            });
  
  
    }
    finally{}
  }
  run().catch(console.dir)

  app.get('/', (req, res) => {
    res.send('Hello World!gugugugugugug')
  })
 
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })