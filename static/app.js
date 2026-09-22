const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const promptEl = document.getElementById("prompt");
const modelSelect = document.getElementById("model-select");
const sendBtn = document.getElementById("send-btn");
const lastMetrics = document.getElementById("last-metrics");

const history = [];

function addMsg(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

async function loadSystem() {
  try {
    const r = await fetch("/api/system");
    const d = await r.json();
    document.getElementById("ram-used").textContent = d.ram_used_gb + " GB";
    document.getElementById("ram-total").textContent = d.ram_total_gb + " GB";
    document.getElementById("cpu").textContent = d.cpu_percent + "% (" + d.cpu_cores + " luồng)";
    document.getElementById("ram-bar-fill").style.width = d.ram_percent + "%";
  } catch (e) {
    console.error(e);
  }
}

async function loadModels() {
  try {
    const r = await fetch("/api/ollama/status");
    const d = await r.json();
    const statusEl = document.getElementById("ollama-status");
    modelSelect.innerHTML = "";
    if (!d.ok) {
      statusEl.textContent = "⚠ Ollama chưa chạy — khởi động bằng: ollama serve";
      document.getElementById("model-count").textContent = "0";
      return;
    }
    statusEl.textContent = "✓ Đã kết nối Ollama";
    document.getElementById("model-count").textContent = d.models.length;
    d.models.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.name;
      opt.textContent = `${m.name} (${m.size_gb} GB)`;
      modelSelect.appendChild(opt);
    });
    if (d.models.length === 0) {
      statusEl.textContent = "⚠ Chưa có model — chạy: ollama pull qwen2.5:7b";
    }
  } catch (e) {
    console.error(e);
  }
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = promptEl.value.trim();
  const model = modelSelect.value;
  if (!text || !model) return;

  addMsg("user", text);
  history.push({ role: "user", content: text });
  promptEl.value = "";
  sendBtn.disabled = true;
  const thinking = addMsg("bot thinking", "Đang suy nghĩ…");

  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: history }),
    });
    const d = await r.json();
    thinking.classList.remove("thinking");
    if (d.error) {
      thinking.textContent = "❌ " + d.error;
    } else {
      thinking.textContent = d.content;
      history.push({ role: "assistant", content: d.content });
      const parts = [`⏱ ${d.elapsed_s}s`];
      if (d.tokens) parts.push(`${d.tokens} token`);
      if (d.tok_per_s) parts.push(`${d.tok_per_s} tok/s`);
      lastMetrics.textContent = "Lần trả lời trước: " + parts.join(" · ");
    }
  } catch (err) {
    thinking.classList.remove("thinking");
    thinking.textContent = "❌ Lỗi kết nối backend: " + err.message;
  } finally {
    sendBtn.disabled = false;
    promptEl.focus();
  }
});

promptEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

loadSystem();
loadModels();
setInterval(loadSystem, 3000);
setInterval(loadModels, 10000);
