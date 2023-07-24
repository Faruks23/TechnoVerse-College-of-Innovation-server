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
    const ReviewCollections = client.db("All_collage").collection("Review");
    const AddmissionForm = client.db("All_collage").collection("Form");
    const UserCollection = client.db("All_collage").collection("Users");


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

    
    }
    )

    // get review 
    app.get('/reviews' ,async (req, res) => { 
      const results = await ReviewCollections.find().toArray();
      res.send(results)
    })

    // post Addmissions form
    app.post('/admissionsForm', async (req, res) => {
      const data = req.body;
      const results = await AddmissionForm.insertOne(data);
       res.send(results);

    })
    // app.get("/MyCollege/:email", async (req, res) => {
    //   const email = req.params.email;
    //   const query = { email: email };
    //     const user = await AddmissionForm.find(query).toArray( );
     
    //   const colleges = await collagesCollection.find().toArray();
      
   
      
   
     
    // });

   app.get("/MyCollege/:email", async (req, res) => {
     try {
       const email = req.params.email;
       console.log("Requested email:", email);

       const query = { email: email };
       const user = await AddmissionForm.find(query).toArray();

       if (!user) {
         console.log("User not found for email:", email);
         return res.status(404).json({ message: "User not found" });
       }

       console.log("Found user:", user);

       const colleges = await collagesCollection
         .find({ "user._id": new ObjectId(user._id) })
         .toArray();
       console.log("Matching colleges:", colleges);

       return res.json(colleges);
     } catch (error) {
       console.error("Error fetching data:", error);
       res.status(500).json({ message: "Internal server error" });
     }
   });


    // search  colleges  by name
app.get("/api/colleges/search", async (req, res) => {
  try {
    const searchQuery = req.query.q; // Get the search query from the query parameters
    console.log(searchQuery);
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query not provided" });
    }

  
    // Perform the search query using the find method and regular expression to make the search case-insensitive
    const colleges = await collagesCollection
      .find({collegeName: { $regex: new RegExp(searchQuery, "i") } })
      .toArray();

    res.json(colleges);
  } catch (error) {
    console.error("Error searching colleges:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


    // post user to database

    app.post("/users", async (req, res) => { 
      const user = req.body
           const query = { email: user.email }
      const existingUser = await UserCollection.findOne(query);
      if (existingUser) {
          return res.send({ message:"user already exists" });
      } else {
        const result = await UserCollection.insertOne(user);
        res.send(result);
      }
      

      

    });

    // UpdateUsers;

    app.put("/UpdateUsers/:email", async (req, res) => {
      const emails = req.params.email;
      console.log(emails);
      const user = req.body
      console.log(user);
      const query = { email: emails};
       
      const updateDoc = {
        $set: {
          name: user.name,
          email: user.email,
          university: user.university,
          address:user.address

          
        },
      };

      const result = await UserCollection.updateOne(query, updateDoc);
      res.send(result);
    });


    app.get("/users/:email", async (req, res) => { 
      const query={ email: req.body.email}
      const result = await UserCollection.findOne(query);
      res.send(result);

      

    });





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
