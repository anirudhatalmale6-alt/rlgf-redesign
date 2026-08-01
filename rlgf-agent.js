/* ============================================================
   Global Force Realty — AI Lead Agent  (self-contained widget)
   Built by PC Plus Computing.  Drop <script src="rlgf-agent.js">
   before </body> on any page — it injects its own styles + UI.
   No dependencies, no backend needed for the demo. In production
   it connects to a live AI model and pushes leads to WhatsApp/CRM.
   ============================================================ */
(function () {
  "use strict";
  if (window.__rlgfAgentLoaded) return;
  window.__rlgfAgentLoaded = true;

  var RED = "#e00034", REDD = "#b8002b", INK = "#1a1a1a";
  var WHATSAPP = "16047601662"; // PC Plus / brokerage line for demo

  /* ---------- styles ---------- */
  var css = `
  .gfa-btn{position:fixed;right:22px;bottom:22px;z-index:99998;width:62px;height:62px;border-radius:50%;
    background:${RED};box-shadow:0 8px 26px rgba(224,0,52,.42);cursor:pointer;display:flex;align-items:center;
    justify-content:center;border:none;transition:transform .18s ease,box-shadow .18s ease}
  .gfa-btn:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 12px 32px rgba(224,0,52,.5)}
  .gfa-btn svg{width:28px;height:28px;fill:#fff}
  .gfa-btn .gfa-ping{position:absolute;inset:0;border-radius:50%;border:2px solid ${RED};animation:gfaPing 2.2s ease-out infinite;opacity:.6}
  @keyframes gfaPing{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.55);opacity:0}}
  .gfa-nudge{position:fixed;right:96px;bottom:38px;z-index:99997;background:#fff;color:${INK};padding:11px 15px;
    border-radius:12px;box-shadow:0 8px 26px rgba(0,0,0,.16);font:600 13.5px/1.35 Lato,system-ui,sans-serif;
    max-width:210px;border:1px solid #eee;animation:gfaFade .4s ease}
  .gfa-nudge:after{content:"";position:absolute;right:-7px;bottom:16px;width:14px;height:14px;background:#fff;
    border-right:1px solid #eee;border-bottom:1px solid #eee;transform:rotate(-45deg)}
  @keyframes gfaFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

  .gfa-panel{position:fixed;right:22px;bottom:22px;z-index:99999;width:376px;max-width:calc(100vw - 24px);
    height:600px;max-height:calc(100vh - 40px);background:#fff;border-radius:18px;overflow:hidden;display:none;
    flex-direction:column;box-shadow:0 24px 70px rgba(0,0,0,.28);font-family:Lato,system-ui,sans-serif;
    animation:gfaUp .26s cubic-bezier(.2,.8,.25,1)}
  @keyframes gfaUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
  .gfa-panel.open{display:flex}
  .gfa-head{background:linear-gradient(135deg,${RED},${REDD});color:#fff;padding:17px 18px;display:flex;align-items:center;gap:12px}
  .gfa-ava{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;flex:0 0 auto}
  .gfa-ava svg{width:22px;height:22px;fill:#fff}
  .gfa-head h4{margin:0;font-size:15.5px;font-weight:900;letter-spacing:.01em}
  .gfa-head p{margin:2px 0 0;font-size:12px;opacity:.9;display:flex;align-items:center;gap:6px}
  .gfa-dot{width:8px;height:8px;border-radius:50%;background:#3fd07a;box-shadow:0 0 0 3px rgba(63,208,122,.28)}
  .gfa-x{margin-left:auto;background:none;border:none;color:#fff;font-size:22px;cursor:pointer;opacity:.85;line-height:1;padding:2px 4px}
  .gfa-x:hover{opacity:1}

  .gfa-body{flex:1;overflow-y:auto;padding:18px 16px 8px;background:#faf9f7}
  .gfa-row{display:flex;margin-bottom:12px;animation:gfaIn .25s ease}
  @keyframes gfaIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .gfa-row.me{justify-content:flex-end}
  .gfa-msg{max-width:80%;padding:11px 14px;border-radius:15px;font-size:14.2px;line-height:1.5;white-space:pre-wrap}
  .gfa-row.bot .gfa-msg{background:#fff;color:${INK};border:1px solid #ececec;border-bottom-left-radius:5px}
  .gfa-row.me .gfa-msg{background:${RED};color:#fff;border-bottom-right-radius:5px}
  .gfa-chips{display:flex;flex-wrap:wrap;gap:8px;margin:2px 2px 16px}
  .gfa-chip{border:1.5px solid ${RED};color:${RED};background:#fff;border-radius:22px;padding:8px 14px;font-size:13.2px;
    font-weight:700;cursor:pointer;transition:.15s;font-family:inherit}
  .gfa-chip:hover{background:${RED};color:#fff}
  .gfa-typing{display:inline-flex;gap:4px;padding:13px 15px;background:#fff;border:1px solid #ececec;border-radius:15px;border-bottom-left-radius:5px}
  .gfa-typing span{width:7px;height:7px;border-radius:50%;background:#bbb;animation:gfaBlink 1.2s infinite}
  .gfa-typing span:nth-child(2){animation-delay:.2s}.gfa-typing span:nth-child(3){animation-delay:.4s}
  @keyframes gfaBlink{0%,60%,100%{opacity:.25}30%{opacity:1}}

  .gfa-card{background:#fff;border:1px solid #ececec;border-left:4px solid ${RED};border-radius:12px;padding:14px 15px;margin:2px 0 14px}
  .gfa-card h5{margin:0 0 9px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${RED}}
  .gfa-card .kv{display:flex;font-size:13.5px;padding:3px 0;color:${INK}}
  .gfa-card .kv b{width:82px;flex:0 0 auto;color:#8a8a8a;font-weight:700;text-transform:capitalize}

  .gfa-foot{border-top:1px solid #eee;background:#fff;padding:10px 12px}
  .gfa-input{display:flex;gap:8px;align-items:center}
  .gfa-input input{flex:1;border:1px solid #e3e3e3;border-radius:22px;padding:11px 15px;font-size:14px;font-family:inherit;outline:none}
  .gfa-input input:focus{border-color:${RED}}
  .gfa-send{width:40px;height:40px;border-radius:50%;background:${RED};border:none;cursor:pointer;flex:0 0 auto;display:flex;align-items:center;justify-content:center}
  .gfa-send:hover{background:${REDD}}.gfa-send svg{width:18px;height:18px;fill:#fff}
  .gfa-brand{text-align:center;font-size:10.5px;color:#b3b3b3;letter-spacing:.04em;padding:7px 0 3px;font-weight:600}
  .gfa-brand b{color:#8a8a8a}
  .gfa-wa{display:inline-flex;align-items:center;gap:7px;background:#25d366;color:#fff;border:none;border-radius:22px;
    padding:9px 15px;font-size:13.2px;font-weight:700;cursor:pointer;font-family:inherit}
  .gfa-wa svg{width:16px;height:16px;fill:#fff}
  @media(max-width:440px){.gfa-panel{right:0;bottom:0;width:100vw;height:100vh;max-height:100vh;border-radius:0}.gfa-nudge{display:none}}
  `;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- icons ---------- */
  var ICON_CHAT = '<svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 5.9 2 10.6c0 2.6 1.4 5 3.6 6.6L4.8 21c-.1.5.4.9.8.6l3.9-2.2c.8.2 1.7.3 2.5.3 5.5 0 10-3.9 10-8.6S17.5 2 12 2z"/></svg>';
  var ICON_HOME = '<svg viewBox="0 0 24 24"><path d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3z"/></svg>';
  var ICON_SEND = '<svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>';
  var ICON_WA = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-1.9 1-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.3.1.7-.1 1.1z"/></svg>';

  /* ---------- conversation flows ---------- */
  var FLOWS = {
    buy: [
      {k:"area",q:"Which area are you searching in?",c:["Surrey","Langley","Delta","White Rock / South Surrey","Cloverdale","Other"]},
      {k:"budget",q:"What's your budget range?",c:["Under $700k","$700k – $1M","$1M – $1.5M","$1.5M+","Not sure yet"]},
      {k:"type",q:"What type of home are you after?",c:["Detached","Townhouse","Condo","Open to any"]},
      {k:"timeline",q:"When are you hoping to buy?",c:["ASAP","1–3 months","3–6 months","Just exploring"]},
      {k:"name",q:"Great — I'll have one of our agents line up matching listings for you. What's your name?",t:1,ph:"Your name"},
      {k:"contact",q:"And the best phone or email to reach you?",t:1,ph:"Phone or email"}
    ],
    sell: [
      {k:"area",q:"Where is your property located?",c:["Surrey","Langley","Delta","White Rock / South Surrey","Cloverdale","Other"]},
      {k:"type",q:"What type of property is it?",c:["Detached","Townhouse","Condo","Land / Other"]},
      {k:"timeline",q:"When are you looking to sell?",c:["ASAP","1–3 months","3–6 months","Just curious on value"]},
      {k:"name",q:"I can arrange a free, no-obligation home evaluation. What's your name?",t:1,ph:"Your name"},
      {k:"contact",q:"Best phone or email to send your evaluation to?",t:1,ph:"Phone or email"}
    ],
    rent: [
      {k:"area",q:"Which area do you want to rent in?",c:["Surrey","Langley","Delta","White Rock / South Surrey","Cloverdale","Other"]},
      {k:"budget",q:"What's your max monthly rent?",c:["Under $2,000","$2,000 – $2,800","$2,800 – $3,500","$3,500+"]},
      {k:"beds",q:"How many bedrooms do you need?",c:["Studio / 1","2","3","4+"]},
      {k:"movein",q:"When would you like to move in?",c:["ASAP","Within a month","1–2 months","Flexible"]},
      {k:"name",q:"Perfect — I'll send you available rentals that fit. Your name?",t:1,ph:"Your name"},
      {k:"contact",q:"Best phone or email to reach you?",t:1,ph:"Phone or email"}
    ]
  };
  var INTENT_LABEL = {buy:"Buying a home",sell:"Selling a property",rent:"Looking to rent"};

  /* light knowledge responder so typed questions feel handled */
  function answerQuestion(txt){
    var t=txt.toLowerCase();
    if(/\b(hi|hello|hey|good (morning|afternoon|evening))\b/.test(t)) return "Hi there! 👋 Happy to help you buy, sell or rent in Surrey & the Fraser Valley.";
    if(/commission|your fee|listing fee|how much do you charge/.test(t)) return "Our listing commissions are competitive and flexible — one of our agents will walk you through the exact structure for your situation.";
    if(/mortgage|pre-?approv|financ|down ?payment|lender/.test(t)) return "We work with trusted local mortgage brokers who can get you pre-approved quickly, often within a day.";
    if(/worth|value|evaluation|appraisal|how much is my/.test(t)) return "We offer a free, no-obligation home evaluation — I can set that up for you in a moment.";
    if(/school|neighbou?rhood|area|safe|family/.test(t)) return "Surrey, Cloverdale and South Surrey have excellent family neighbourhoods and schools — our agents know them street by street.";
    if(/first[- ]?time|first home/.test(t)) return "We love working with first-time buyers — there are great incentive programs, and we'll guide you through every step.";
    return null;
  }

  /* ---------- state + engine ---------- */
  var S = {intent:null, step:0, ans:{}, awaiting:null, done:false};
  var body, inputEl;

  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
  function esc(s){return String(s).replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c];});}
  function scroll(){body.scrollTop=body.scrollHeight;}

  function addUser(t){var r=el("div","gfa-row me");r.appendChild(el("div","gfa-msg",esc(t)));body.appendChild(r);scroll();}
  function typing(){var r=el("div","gfa-row bot");r.appendChild(el("div","gfa-typing","<span></span><span></span><span></span>"));body.appendChild(r);scroll();return r;}

  function botSay(text, cb){
    var t=typing();
    var d=Math.min(1100,420+text.length*11);
    setTimeout(function(){
      t.remove();
      var r=el("div","gfa-row bot");r.appendChild(el("div","gfa-msg",esc(text)));body.appendChild(r);scroll();
      if(cb)cb();
    },d);
  }

  function showChips(opts, fn){
    var box=el("div","gfa-chips");
    opts.forEach(function(o){
      var b=el("button","gfa-chip",esc(o));
      b.onclick=function(){box.remove();addUser(o);fn(o);};
      box.appendChild(b);
    });
    body.appendChild(box);scroll();
  }

  function start(){
    body.innerHTML="";S.intent=null;S.step=0;S.ans={};S.awaiting=null;S.done=false;
    botSay("Hi! 👋 I'm the Global Force Realty assistant. Are you looking to buy, sell, or rent in Surrey & the Fraser Valley?",function(){
      showChips(["Buy a home","Sell my property","Rent a place","Just browsing"],function(c){
        if(/buy/i.test(c))return begin("buy");
        if(/sell/i.test(c))return begin("sell");
        if(/rent/i.test(c))return begin("rent");
        botSay("No problem — take your look around! If you'd like personalised listings, market updates or a free home valuation, just tap a topic below.",function(){
          showChips(["Buy a home","Sell my property","Rent a place"],function(x){begin(/buy/i.test(x)?"buy":/sell/i.test(x)?"sell":"rent");});
        });
      });
    });
  }

  function begin(intent){S.intent=intent;S.step=0;ask();}

  function ask(){
    var flow=FLOWS[S.intent];
    if(S.step>=flow.length)return finish();
    var q=flow[S.step];
    botSay(q.q,function(){
      if(q.t){S.awaiting=q;inputEl.focus();}
      else showChips(q.c,function(v){answer(v);});
    });
  }

  function answer(v){
    var flow=FLOWS[S.intent];var q=flow[S.step];
    S.ans[q.k]=v;S.awaiting=null;S.step++;
    // small acknowledgements to feel human
    var ack=null;
    if(q.k==="area")ack=v==="Other"?null:v+" is a great choice — lots happening there right now.";
    if(q.k==="budget")ack="Got it.";
    setTimeout(function(){ if(ack) botSay(ack,ask); else ask(); },160);
  }

  function finish(){
    S.done=true;
    var a=S.ans;
    var rows="<h5>Lead captured</h5>";
    rows+='<div class="kv"><b>Interest</b><span>'+esc(INTENT_LABEL[S.intent])+'</span></div>';
    if(a.area)rows+='<div class="kv"><b>Area</b><span>'+esc(a.area)+'</span></div>';
    if(a.budget)rows+='<div class="kv"><b>Budget</b><span>'+esc(a.budget)+'</span></div>';
    if(a.type)rows+='<div class="kv"><b>Type</b><span>'+esc(a.type)+'</span></div>';
    if(a.beds)rows+='<div class="kv"><b>Beds</b><span>'+esc(a.beds)+'</span></div>';
    if(a.movein)rows+='<div class="kv"><b>Move-in</b><span>'+esc(a.movein)+'</span></div>';
    if(a.timeline)rows+='<div class="kv"><b>Timeline</b><span>'+esc(a.timeline)+'</span></div>';
    if(a.name)rows+='<div class="kv"><b>Name</b><span>'+esc(a.name)+'</span></div>';
    if(a.contact)rows+='<div class="kv"><b>Contact</b><span>'+esc(a.contact)+'</span></div>';
    var nm=a.name?a.name.split(" ")[0]:"there";
    botSay("Thanks "+nm+"! ✅ I've shared your details with the Global Force Realty team — an agent will reach out shortly.",function(){
      body.appendChild(el("div","gfa-card",rows));scroll();
      botSay("Prefer WhatsApp? Tap below and we'll continue there.",function(){
        var box=el("div","gfa-chips");
        var wa=el("button","gfa-wa",ICON_WA+"Continue on WhatsApp");
        wa.onclick=function(){
          var msg="Hi, I'm "+(a.name||"")+" — I was just on the Global Force Realty site ("+INTENT_LABEL[S.intent].toLowerCase()+").";
          window.open("https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(msg),"_blank");
        };
        box.appendChild(wa);
        var again=el("button","gfa-chip","Start over");
        again.onclick=function(){box.remove();start();};
        box.appendChild(again);
        body.appendChild(box);scroll();
      });
    });
  }

  function handleText(txt){
    txt=txt.trim();if(!txt)return;
    addUser(txt);
    // if we're waiting on a name/contact field, take it as the answer
    if(S.awaiting){
      var q=S.awaiting;
      if(q.k==="contact" && !/[0-9]|@/.test(txt)){
        S.awaiting=null;
        botSay("Just so an agent can reach you — could you share a phone number or email?",function(){S.awaiting=q;});
        return;
      }
      answer(txt);return;
    }
    if(S.done){
      var ans=answerQuestion(txt);
      botSay(ans||"Good question — an agent can give you the full details. Would you like to start a new enquiry?",function(){
        if(!ans)showChips(["Buy a home","Sell my property","Rent a place"],function(x){begin(/buy/i.test(x)?"buy":/sell/i.test(x)?"sell":"rent");});
      });
      return;
    }
    // free text before/without an intent -> answer if we can, then steer
    var reply=answerQuestion(txt);
    if(reply){botSay(reply,function(){ if(!S.intent) start2(); else ask(); });}
    else{ if(!S.intent) start2(); else ask(); }
  }
  function start2(){botSay("Would you like to buy, sell, or rent?",function(){showChips(["Buy a home","Sell my property","Rent a place"],function(x){begin(/buy/i.test(x)?"buy":/sell/i.test(x)?"sell":"rent");});});}

  /* ---------- build UI ---------- */
  var panel=el("div","gfa-panel");
  panel.innerHTML=
    '<div class="gfa-head"><div class="gfa-ava">'+ICON_HOME+'</div>'+
    '<div><h4>Global Force Realty</h4><p><span class="gfa-dot"></span>Assistant · replies instantly</p></div>'+
    '<button class="gfa-x" aria-label="Close">&times;</button></div>'+
    '<div class="gfa-body"></div>'+
    '<div class="gfa-foot"><div class="gfa-input">'+
    '<input type="text" placeholder="Type a message…" aria-label="Message">'+
    '<button class="gfa-send" aria-label="Send">'+ICON_SEND+'</button></div>'+
    '<div class="gfa-brand">⚡ Powered by <b>PC Plus Computing</b></div></div>';
  document.body.appendChild(panel);
  body=panel.querySelector(".gfa-body");
  inputEl=panel.querySelector(".gfa-input input");

  var btn=el("button","gfa-btn",'<span class="gfa-ping"></span>'+ICON_CHAT);
  btn.setAttribute("aria-label","Chat with us");
  document.body.appendChild(btn);

  var nudge=el("div","gfa-nudge","👋 Looking to buy, sell or rent? Ask me anything.");
  document.body.appendChild(nudge);
  var nudgeShown=true;
  setTimeout(function(){if(nudgeShown&&!panel.classList.contains("open"))nudge.style.display="block";},1400);
  nudge.style.display="none";

  var started=false;
  function open(){panel.classList.add("open");btn.style.display="none";nudge.style.display="none";nudgeShown=false;
    if(!started){started=true;setTimeout(start,250);}}
  function close(){panel.classList.remove("open");btn.style.display="flex";}
  btn.onclick=open;
  nudge.onclick=open;
  panel.querySelector(".gfa-x").onclick=close;
  panel.querySelector(".gfa-send").onclick=function(){handleText(inputEl.value);inputEl.value="";};
  inputEl.addEventListener("keydown",function(e){if(e.key==="Enter"){handleText(inputEl.value);inputEl.value="";}});
})();
