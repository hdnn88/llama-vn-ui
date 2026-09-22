"""llama-vn-ui — Web UI tiếng Việt cho Ollama."""

import time

import psutil
import requests
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder="static", static_url_path="")

OLLAMA_URL = "http://localhost:11434"


@app.route("/")
def index():
    return send_from_directory("static", "index.html")


@app.route("/api/system")
def api_system():
    ram = psutil.virtual_memory()
    cpu = psutil.cpu_percent(interval=0.3)
    return jsonify(
        {
            "ram_total_gb": round(ram.total / 1024**3, 1),
            "ram_used_gb": round(ram.used / 1024**3, 1),
            "ram_percent": ram.percent,
            "cpu_percent": cpu,
            "cpu_cores": psutil.cpu_count(logical=True),
        }
    )


@app.route("/api/ollama/status")
def ollama_status():
    try:
        r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=2)
        r.raise_for_status()
        models = [
            {
                "name": m.get("name", ""),
                "size_gb": round(m.get("size", 0) / 1024**3, 2),
            }
            for m in r.json().get("models", [])
        ]
        return jsonify({"ok": True, "models": models})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e), "models": []}), 200


@app.route("/api/chat", methods=["POST"])
def api_chat():
    data = request.get_json(force=True)
    model = data.get("model", "")
    messages = data.get("messages", [])
    if not model or not messages:
        return jsonify({"error": "Thiếu model hoặc messages"}), 400

    payload = {
        "model": model,
        "messages": messages,
        "stream": False,
        "options": {"temperature": data.get("temperature", 0.7)},
    }

    start = time.time()
    try:
        r = requests.post(f"{OLLAMA_URL}/api/chat", json=payload, timeout=600)
        r.raise_for_status()
        result = r.json()
    except Exception as e:
        return jsonify({"error": f"Không kết nối được Ollama: {e}"}), 502

    elapsed = time.time() - start
    content = result.get("message", {}).get("content", "")
    eval_count = result.get("eval_count", 0)
    tok_per_s = round(eval_count / elapsed, 1) if eval_count and elapsed > 0 else None

    return jsonify(
        {
            "content": content,
            "elapsed_s": round(elapsed, 2),
            "tokens": eval_count,
            "tok_per_s": tok_per_s,
            "done": result.get("done", False),
        }
    )


if __name__ == "__main__":
    print("🌐 llama-vn-ui: http://localhost:8000")
    app.run(host="127.0.0.1", port=8000, debug=True)
