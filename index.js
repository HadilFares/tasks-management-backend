const express =require('express');
const mongoose =require("mongoose")
const cors =require('cors');
const app=express();

const UserModel =require("./models/User");
app.use(express.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/crudApp',{ useNewUrlParser: true,useUnifiedTopology: true}
 );


    app.post("/create",async(req,res)=> {
        
        const matricule=req.body.matricule
        const name=req.body.name
        const lastname=req.body.lastname
        const dateDemarrage=req.body.dateDemarrage
        const newUser=new UserModel({matricule:matricule,name:name,lastname:lastname,dateDemarrage:dateDemarrage});
        try{
           
            await newUser.save();
            res.send("inserted data");
           
        }
        catch (error){
           console.error(error)
        }
    });
   
app.get("/read",async(req,res)=>{
    UserModel.find({},(error,result)=>{
        if (error){
            res.send(error);
        }
        res.send(result);
    });
});
app.delete("/delete/:id",async(req,res)=>
{
    const id =req.params.id;
   await UserModel.findByIdAndRemove(id).exec();
   res.send("deleted");
});

app.put('/update/:id',async(req,res)=>{
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,{...req.body},{new:true})
        res.send(updatedUser)
    } catch (error) {
        console.error(error)
        
    }
})

app.get('/user/:id',async(req,res)=>{
    try {
        const users = await UserModel.find()
        res.send(users)
    } catch (error) {
        console.error(error)
        
    }
})
//get single user 
app.get('/user/get/:id',async(req,res)=>{
    try {
        const users =await  UserModel.findById(req.params.id)
         
        res.send(users)
    } catch (error) {
        console.error(error)
        
    }
})



app.listen(3000,()=>
{
    console.log("Server running on port 3000 ... ");
});
