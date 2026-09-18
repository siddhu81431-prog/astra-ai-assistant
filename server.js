const express=require("express");
const path=require("path");
const OpenAI=require("openai");

const app=express();
const PORT=process.env.PORT||3000;
const client=process.env.OPENAI_API_KEY?new OpenAI({apiKey:process.env.OPENAI_API_KEY}):null;

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.get("/health",(_req,res)=>res.json({status:"ok",app:"Astra AI Assistant",ai:!!client}));

app.post("/api/chat",async(req,res)=>{
  const message=String(req.body?.message||"").trim();
  const history=Array.isArray(req.body?.history)?req.body.history.slice(-12):[];
  if(!message)return res.status(400).json({error:"Message is required"});

  if(!client){
    return res.json({reply:"Astra is ready, but the AI connection is not configured yet. Add OPENAI_API_KEY in Railway Variables to enable real AI chat."});
  }

  try{
    const input=[
      {role:"system",content:"You are Astra, a helpful, warm, concise personal AI assistant. Give practical answers and ask a brief clarifying question when necessary."},
      ...history.filter(x=>x&&["user","assistant"].includes(x.role)&&typeof x.content==="string").map(x=>({role:x.role,content:x.content})),
      {role:"user",content:message}
    ];
    const response=await client.responses.create({
      model:process.env.OPENAI_MODEL||"gpt-5.6-luna",
      input
    });
    res.json({reply:response.output_text||"I couldn't generate a response."});
  }catch(err){
    console.error("AI error:",err);
    res.status(500).json({error:"Astra could not reach the AI service right now."});
  }
});

app.get("*",(_req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`Astra running on port ${PORT}`));