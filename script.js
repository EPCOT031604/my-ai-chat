import { getSheetData } from "./googleSheets.js";

const sheetId = "スプレッドシートIDをここに入力";
const range = "シート1!A:D";

async function send() {
  const inputEl = document.getElementById("input");
  const userText = inputEl.value;
  inputEl.value = "";

  addMessage("あなた", userText, "user");

  // スプレッドシートからデータ取得
  const data = await getSheetData(sheetId, range);

  let reply = "";

  if(userText.includes("今月の支出")) {
    const today = new Date();
    const month = today.getMonth() + 1;
    let total = 0;
    data.forEach(row => {
      const date = new Date(row[0]);
      if(date.getMonth() + 1 === month){
        total += Number(row[2]);
      }
    });
    reply = `今月の支出は ${total} 円です。`;
  } else if(userText.includes("カテゴリ別")) {
    const categoryTotals = {};
    data.forEach(row => {
      const cat = row[1];
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(row[2]);
    });
    reply = "カテゴリ別支出:\n";
    for(const cat in categoryTotals){
      reply += `${cat}: ${categoryTotals[cat]} 円\n`;
    }
  } else {
    reply = "すみません、その質問にはまだ対応していません。";
  }

  addMessage("AI", reply, "bot");
}

function addMessage(name, text, type){
  const box = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerHTML = `<strong>${name}:</strong> ${text.replace(/\n/g,'<br>')}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

window.send = send;
