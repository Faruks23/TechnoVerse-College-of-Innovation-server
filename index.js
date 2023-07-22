const express = require("express");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

const cors = require("cors");


app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Hello World!   are you sure");
});




// MongoDB server  configuration
// MongoDB server  configuration
// MongoDB server  configuration

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mafpasm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    // get all colleges data from the server
    const collagesCollection = client.db("All_collage").collection("colleges");
        


    // get all data from the server
    app.get('/colleges', async (req, res) => { 
      const result = await collagesCollection.find().toArray();
      res.send(result);
    })
//  get colleges details by id
    app.get('/Details/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id) }
      const results = await collagesCollection.findOne(query)
      res.send(results)

      console.log(id);
    }
    )






    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
















app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
