const express=require("express");
const path=require("path");
const app=express();
const PORT=process.env.PORT||3000;

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.get("/health",(_req,res)=>res.json({status:"ok",app:"Astra AI Assistant"}));

app.post("/api/chat",(req,res)=>{
  const message=String(req.body?.message||"").trim();
  if(!message) return res.status(400).json({error:"Message is required"});
  const lower=message.toLowerCase();
  let reply="I'm Astra. I’m ready to help you with plans, ideas, writing, learning, and everyday tasks.";
  if(lower.includes("hello")||lower.includes("hi")) reply="Hello! I’m Astra. What would you like to do?";
  else if(lower.includes("name")) reply="I’m Astra, your personal AI assistant.";
  else if(lower.includes("help")) reply="Absolutely. Tell me what you need, and I’ll help you step by step.";
  return res.json({reply});
});

app.get("*",(_req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`Astra running on port ${PORT}`));