const pptxgen = require("pptxgenjs");
const p = new pptxgen(); p.layout = "LAYOUT_16x9";
const NAVY="0C2340", GOLD="FDBB30", INK="1F2933", MUTE="5B6770", LIGHT="F3F5F7", RED="C8102E", GRN="1B7F4B";
const F = {fontFace:"Calibri"};
function slide(title, sub){
  const s = p.addSlide(); s.background = {color:"FFFFFF"};
  s.addShape(p.ShapeType.rect,{x:0,y:0,w:10,h:0.9,fill:{color:NAVY}});
  s.addShape(p.ShapeType.rect,{x:0,y:0.9,w:10,h:0.05,fill:{color:GOLD}});
  s.addText(title,{x:0.4,y:0.08,w:9.2,h:0.55,fontSize:22,bold:true,color:"FFFFFF",isTextBox:true,margin:0,...F});
  s.addText(sub,{x:0.4,y:0.55,w:9.2,h:0.3,fontSize:11.5,color:GOLD,isTextBox:true,margin:0,...F});
  return s;
}
const bl = (arr,opt={}) => arr.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<arr.length-1,paraSpaceAfter:5,...opt}}));
const H = (s,t,x,y,w,c=NAVY)=>s.addText(t,{x,y,w,h:0.3,fontSize:13,bold:true,color:c,isTextBox:true,margin:0,...F});
const foot = (s,t)=>s.addText(t,{x:0.4,y:5.25,w:9.2,h:0.25,fontSize:8.5,color:MUTE,isTextBox:true,margin:0,...F});

// 1 — Diagnosis
let s = slide("Strengths & weaknesses: elite shot-making, thin on the glass","Four Factors, 2024-25 Pacers (50-32) vs. league average — 82 games");
const hd = t=>({text:t,options:{bold:true,color:"FFFFFF",fill:{color:NAVY},align:"center"}});
const row = (a,b,c,d,good)=>[{text:a,options:{bold:true}},{text:b,options:{align:"center"}},{text:c,options:{align:"center"}},{text:d,options:{align:"center",bold:true,color:good?GRN:RED}}];
s.addTable([[hd("Factor"),hd("Pacers"),hd("League"),hd("Edge")],
  row("eFG%","56.2%","54.3%","+1.9 pts",1), row("TOV% (lower=better)","12.9%","14.3%","+1.4 pts",1),
  row("OREB%","25.2%","29.3%","-4.1 pts",0), row("FTM rate","19.2","18.9","+0.3",1),
  row("Opp. eFG%","54.8%","54.3%","-0.5 pts",0)],
  {x:0.4,y:1.15,w:4.6,colW:[1.9,0.9,0.9,0.9],fontSize:11,color:INK,border:{type:"solid",color:"D5DADF",pt:0.75},rowH:0.34,...F});
s.addText([{text:"Win/loss split (eFG%)",options:{bold:true,breakLine:true}},
  {text:"Wins: 58.2% for / 52.3% against",options:{breakLine:true}},{text:"Losses: 53.1% for / 58.6% against",options:{breakLine:true}},
  {text:"Won the eFG battle in 41 games: 37-4 (90%). Lost it: 13-28 (32%).",options:{}}],
  {x:0.4,y:3.4,w:4.6,h:1.3,fontSize:11.5,color:INK,fill:{color:LIGHT},isTextBox:true,margin:8,valign:"top",...F});
H(s,"Strengths",5.4,1.15,4.2,GRN);
s.addText(bl(["Shooting: +1.9 eFG% and the factor that decides games (r = 0.63 with win)","Ball security: 12.9% TOV rate, 1.4 pts better than league","Forces turnovers (opp. TOV 14.7%) to fuel the transition offense"]),{x:5.4,y:1.45,w:4.2,h:1.5,fontSize:11.5,color:INK,isTextBox:true,margin:0,valign:"top",...F});
H(s,"Weaknesses",5.4,3.0,4.2,RED);
s.addText(bl(["Offensive rebounding: 25.2% OREB, 4.1 pts below league, leaving few second chances","Perimeter/shot-quality defense: opp. eFG% above league, and losses came when it spiked to 58.6%","Depth without Haliburton: 19-63 in 2025-26 (2nd-worst record)"]),{x:5.4,y:3.3,w:4.2,h:1.9,fontSize:11.5,color:INK,isTextBox:true,margin:0,valign:"top",...F});
foot(s,"Source: provided pacers_games_four_factors.csv & league_avg_four_factors.csv (code: four_factors_plots.py); 2025-26 record per press reports.");

// 2 — Outlook
s = slide("Expected 2026-27 outcome: contender on paper, hinges on Haliburton","Analyst scenario estimates (judgment, not a fitted model)");
const sc = (a,b,c,d)=>[{text:a,options:{bold:true}},{text:b,options:{align:"center"}},{text:c,options:{align:"center"}},{text:d}];
s.addTable([[hd("Scenario"),hd("Wins"),hd("East seed"),hd("What it looks like")],
  sc("Healthy Haliburton (All-NBA form)","48-52","3-4","2024-25 shooting/TOV profile + Zubac pick-and-roll and a deeper wing group"),
  sc("Base case: rusty / minutes managed","43-47","5-7","Offense holds up on Siakam/Nembhard; losses pile up on defense and the glass"),
  sc("Setback or limited Haliburton","32-38","Play-in/lottery","Repeat of the 2025-26 drop-off; trade-deadline sell becomes real")],
  {x:0.4,y:1.15,w:9.2,colW:[2.6,0.9,1.3,4.4],fontSize:11,color:INK,border:{type:"solid",color:"D5DADF",pt:0.75},rowH:0.42,...F});
H(s,"What changed",0.4,3.1,4.4);
s.addText(bl(["Out: Myles Turner, Bennedict Mathurin (traded for Ivica Zubac, 2026 & 2029 firsts)","In: Zubac (full season), Kelly Oubre Jr. (~$17M over 2 yrs), Larry Nance Jr., Braden Smith","Projected five: Haliburton, Nembhard, Nesmith, Siakam, Zubac"]),{x:0.4,y:3.4,w:4.5,h:1.7,fontSize:11.5,color:INK,isTextBox:true,margin:0,valign:"top",...F});
H(s,"Constraints that shape trades",5.2,3.1,4.4);
s.addText(bl(["Hard-capped at the first apron (~$2.2M of room) after using the MLE on Oubre","Reports expect a trim before the deadline to get under the ~$200.4M tax line","Little first-round capital left: 2026 and 2029 firsts already sent to the Clippers"]),{x:5.2,y:3.4,w:4.4,h:1.7,fontSize:11.5,color:INK,isTextBox:true,margin:0,valign:"top",...F});
foot(s,"Season opens Oct 21 vs. New Orleans. Sources: Roundtable/SI Pacers coverage, Spotrac-sourced cap notes, Bleacher Report roster & salary list.");

// 3 — Trade targets
s = slide("Preferred trade targets: fix the glass, add a second creator","Salary-matchable with Walker ($8.5M) / Sheppard ($5M); both fit the cap constraints");
function card(x,name,tag,stats,fit,risk){
  s.addShape(p.ShapeType.rect,{x,y:1.15,w:4.5,h:3.95,fill:{color:LIGHT},line:{color:"D5DADF",width:0.75}});
  s.addText(name,{x:x+0.2,y:1.22,w:4.1,h:0.4,fontSize:17,bold:true,color:NAVY,isTextBox:true,margin:0,...F});
  s.addText(tag,{x:x+0.2,y:1.6,w:4.1,h:0.3,fontSize:11,color:MUTE,isTextBox:true,margin:0,...F});
  s.addText(stats,{x:x+0.2,y:1.95,w:4.1,h:0.75,fontSize:11,bold:true,color:INK,isTextBox:true,margin:0,valign:"top",...F});
  s.addText([{text:"Why he fits: ",options:{bold:true,color:GRN}},{text:fit,options:{breakLine:true}},{text:" ",options:{breakLine:true,fontSize:5}},{text:"Cost / risk: ",options:{bold:true,color:RED}},{text:risk}],
    {x:x+0.2,y:2.75,w:4.1,h:2.3,fontSize:11,color:INK,isTextBox:true,margin:0,valign:"top",...F});
}
card(0.4,"Donovan Clingan, C (POR)","Age 22 | $7.52M in 2026-27 | stretch target",
 "2025-26: 12.4 pts, 11.8 reb (3rd in NBA), 136 blk, 56.5% eFG",
 "Targets our biggest Four-Factors gap. He grabbed 367 offensive boards in 2,229 min (~5.9 per 36); Huff gets ~1.5. Pairs with Zubac now and replaces him long-term.",
 "Portland made the playoffs and has no reason to sell; price would exceed Walker. Indiana has few firsts to send, so this is a deadline/summer 2027 idea.");
card(5.1,"Kevin Porter Jr., G (MIL)","Age 26 | $5.39M player option exercised | realistic",
 "2025-26: 17.4 pts, 7.4 ast, 5.2 reb, 2.2 stl; ~57% TS, 87.8% FT (38 GP)",
 "Second shot-creator when Haliburton is rusty or resting, so McConnell is not the only one. His 4.1 FTA/game adds to FT rate; 2.2 stl feeds the turnover-fueled offense.",
 "Right knee surgery in April; only 38 games; 32.2% from three. Milwaukee's backcourt is crowded (Herro, Rollins), so Sheppard or Walker for him is plausible.");
foot(s,"Sources: ESPN, RealGM, TeamRankings (Clingan); Bleacher Report, RotoWire, Brew Hoop (Porter). TS% computed from per-game shooting.");

// 4 — Undervalued
s = slide("Undervalued by analytics: Jay Huff, C (IND, $2.7M)","Efficiency and rim protection that box-score scoring does not capture");
const big=(x,v,l)=>{s.addText(v,{x,y:1.2,w:2.1,h:0.6,fontSize:28,bold:true,color:NAVY,align:"center",isTextBox:true,margin:0,...F});
  s.addText(l,{x,y:1.8,w:2.1,h:0.5,fontSize:10.5,color:MUTE,align:"center",isTextBox:true,margin:0,...F});};
big(0.4,"59.8%","True shooting (57.4% eFG)"); big(2.7,"1.9 blk","3rd in NBA in blocks per game (7.6% BLK%)");
big(5.0,"16.4 pts","per 36 min (9.5 in 21.0 mpg)"); big(7.3,"114.4","Offensive rating");
H(s,"Why the market undervalues him",0.4,2.55,4.4);
s.addText(bl(["Signed for ~$2.7M; produced starter-level efficiency across all 82 games","Per 36: 16.4 pts, 6.8 reb, 3.2 blk on 82.8% FT and 47.6% FG","Capped to ~21 mpg behind a starter, so per-game stats hide the impact","Floor-spacing big who turns up a 7'1\" rim deterrent in the secondary unit"]),{x:0.4,y:2.85,w:4.5,h:2.3,fontSize:11.5,color:INK,isTextBox:true,margin:0,valign:"top",...F});
H(s,"Caveats and recommendation",5.2,2.55,4.4);
s.addText(bl(["Only 31.9% from three on 4.5 attempts per game, and a 4.5% OREB rate","Not the rebounding fix, so he complements a Clingan-type target rather than replacing one","Keep him. He is a cheap depth piece and a candidate for more minutes if Zubac sits"]),{x:5.2,y:2.85,w:4.4,h:2.3,fontSize:11.5,color:INK,isTextBox:true,margin:0,valign:"top",...F});
foot(s,"Sources: RealGM and TeamRankings 2025-26 stats; Wikipedia (league block rank); Bleacher Report (2026-27 salary). Per-36 computed from season totals.");

// 5 — Method
s = slide("Method, sources and code","Everything is reproducible from the files delivered with this deck");
s.addText(bl(["four_factors_plots.py: four scatter plots (eFG%, OREB%, TOV%, FTM rate vs. opponent, colored by result, league-average cross-hairs) plus a logistic regression on standardized differentials","Finding: eFG% mattered most (r = 0.63 with winning; standardized logit coefficient 13.2 vs. 6.2 TOV, 5.3 OREB, 2.5 FTM)","pacers_sql_queries.sql: four mock-SQL queries (inner/left joins only), tested on the sample workbook in SQLite","Current-season facts and player stats were gathered from public web sources (ESPN, RealGM, TeamRankings, Spotrac-sourced reports, Bleacher Report, Roundtable/SI); verify figures before trade-day use","Scenario win ranges on slide 2 are my judgment, anchored on 2024-25 (50-32) and the 2025-26 absence, not a statistical projection"]),
 {x:0.4,y:1.2,w:9.2,h:3.9,fontSize:12.5,color:INK,isTextBox:true,margin:0,valign:"top",...F});
p.writeFile({fileName:"Pacers_Analytics_Deck.pptx"}).then(()=>console.log("ok"));
