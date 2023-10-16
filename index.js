//E-commerce Product Catalog

const mongoose=require("mongoose");
const express=require("express");

const app=express();
app.use(express.urlencoded({extended: false}));



mongoose
.connect("mongodb://127.0.0.1:27017/products")
.then(()=>console.log("MongoDB has connected!"))
.catch((err)=>console.log("Mongo error",err));

const userSchema=new mongoose.Schema({
PID: {
    type:Number,
    required:true,
    unique:true,
},
name: {
    type:String,
    required:true,
    unique:false,
},

description: {
    type:String,
    required:false,
    unique:false,
},
price: {
    type:Number,
    required:true,
    unique:false,
},
inventory: {
    type:Number,
    required:true,
    unique:false,
}});

const user=mongoose.model('product',userSchema);

//Making actual APIs
 
 //1.Retrieving records
 app.get("/products",async(req,res)=>{
    const allproducts=await user.find({});
    
    return res.json(allproducts);
 });

 
 //2.Creating new record
 app.post("/products",async(req,res)=>{
    const body=req.body;
    
    const result=await user.create({
        PID:body.PID,
        name:body.name,
        description:body.description,
        price:body.price,
        inventory:body.inventory,


    });
    
    return res.json("New row created!");
});
 //3.Deleting all records
 app.delete("/products",async(req,res)=>{
    const delete_all=await user.deleteMany({});
    return res.json("All records deleted successfully!");

});
 //4.Fetching particular record
 app.get("/product", async (req, res) => {
    try {
      const PID = req.query.PID;
  
      const fetch_product = await user.findOne({ PID: PID });
  
      if (fetch_product) {
        res.json(fetch_product);
      } else {
        throw new Error("Product not found!");
      }
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
  });
 

 //5.Replace an existing product
 app.put("/product", async (req, res) => {
    try {
      const PID = req.query.PID;
      const replace_product = req.body;
  
      const updated_product = await user.findOneAndReplace({ PID: PID }, replace_product);
  
      if (!updated_product) {
        throw new Error('Product not found!');
      }
  
      res.json(updated_product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

 //6.Patching a record
 app.patch("/product", async (req, res) => {
    try {
      const PID = req.query.PID;
      const update_product = req.body;
  
      const patched_product = await user.findOneAndUpdate({ PID: PID }, update_product, { new: true });
  
      if (!patched_product) {
        throw new Error('Product not found!');
      }
  
      res.json(patched_product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });
//7.Deleting particular record

 app.delete("/product", async (req, res) => {
    try {
      const PID = req.query.PID;
  
      const delete_product = await user.findOneAndDelete({ PID: PID });
  
      if (!delete_product) {
        throw new Error('Product not found!');
      }
  
      res.json({ message: 'Product deleted successfully!' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

 //8.Arranging p products by price
 app.get("/product/expensive",async(req,res)=>{
    const p=parseInt(req.query.p);
    const sort=req.query.sort;
           const exp_product=await user.find()
            .limit(p)
            .sort({price:sort==='desc'?1:-1});

            if(exp_product.length===0){
                return res.json({error:"No products found!"});
            }
            res.json(exp_product);}
 );

 //9.Getting record with zero inventory
 app.get("/product/not_avalaible",async(req,res)=>{
    const zero_inventory=await user.find({inventory:0});
    if(zero_inventory.length===0){
        return res.json({error:"No products with zero inventory!"});
    }
    res.json(zero_inventory);

 });

 //10.Decrementing inventory of record
 app.get("/product/buy",async(req,res)=>{
    const PID=req.query.PID;
    const dec_inven=await user.findOne({PID:PID});
    if(!dec_inven){
        return res.json({error:"Product not found!"});
    }
    dec_inven.inventory-=1;
    await dec_inven.save();
    return res.json(dec_inven);
 });
 

 


 



 




app.listen(8000,()=>console.log("Server Started!"));




