const chat=document.querySelector("#chat"),form=document.querySelector("#form"),input=document.querySelector("#input");
const history=[];
function add(text,who){const d=document.createElement("div");d.className="bubble "+who;d.textContent=text;chat.appendChild(d);chat.scrollTop=chat.scrollHeight}
form.addEventListener("submit",async e=>{
 e.preventDefault();const msg=input.value.trim();if(!msg)return;
 add(msg,"user");history.push({role:"user",content:msg});input.value="";
 try{
  const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:msg,history})});
  const data=await r.json();const reply=data.reply||data.error||"Sorry, something went wrong.";
  add(reply,"astra");history.push({role:"assistant",content:reply});
 }catch{add("I couldn't connect right now. Please try again.","astra")}
});
document.querySelectorAll(".chips button").forEach(b=>b.onclick=()=>{input.value=b.textContent;input.focus()});
document.querySelector("#clear").onclick=()=>{chat.innerHTML="";history.length=0;add("Chat cleared. How can I help?","astra")};