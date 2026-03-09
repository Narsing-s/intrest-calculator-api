const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const SIMPLE_API = "https://intrest-calculator-api-jik9pb.5sc6y6-4.usa-e2.cloudhub.io/api/simple-interest";
const COMPOUND_API = "https://intrest-calculator-api-jik9pb.5sc6y6-4.usa-e2.cloudhub.io/api/compound-interest";

app.post("/simple-interest", async (req, res) => {

    try {

        const response = await fetch(SIMPLE_API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(req.body)
        });

        const data = await response.json();

        res.json(data);

    } catch(error){
        res.status(500).json({error:"API call failed"});
    }

});


app.post("/compound-interest", async (req, res) => {

    try {

        const response = await fetch(COMPOUND_API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(req.body)
        });

        const data = await response.json();

        res.json(data);

    } catch(error){
        res.status(500).json({error:"API call failed"});
    }

});

const PORT = 3000;

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
