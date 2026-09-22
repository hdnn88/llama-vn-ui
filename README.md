# 🦙 llama-vn-ui

> Web UI **tiếng Việt** cho [Ollama](https://ollama.com) — chat local, xem RAM real-time, đo tốc độ tok/s. Riêng tư, chạy hoàn toàn trên máy bạn.

![Python](https://img.shields.io/badge/Python-3.8%2B-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Ollama](https://img.shields.io/badge/backend-Ollama-ff9101)

## ✨ Tính năng

- 💬 **Chat tiếng Việt** với model Ollama local
- 📊 **Giám sát RAM/CPU real-time** — biết ngay model nào đang tốn bộ nhớ
- ⚡ **Đo tốc độ**: thời gian trả lời, số token, **tok/s**
- 🌑 Giao diện tối, responsive (dùng được trên điện thoại)
- 🔒 **100% local** — không dữ liệu nào rời khỏi máy

## 📋 Yêu cầu

- Python 3.8+
- [Ollama](https://ollama.com/download) đã cài và chạy (`ollama serve`)
- Ít nhất 1 model: `ollama pull qwen2.5:7b`

## 🚀 Cài đặt

```bash
git clone https://github.com/TEN-BAN/llama-vn-ui.git
cd llama-vn-ui
pip install -r requirements.txt
python app.py
```

Mở **http://localhost:8000** 🎉

## 🖥️ Cách dùng

1. Khởi động Ollama: `ollama serve` (hoặc app Ollama đang chạy)
2. Chọn model ở dropdown
3. Nhập câu hỏi tiếng Việt → **Gửi** (Enter)
4. Xem tok/s và RAM ở bảng trên

## 🗺️ Lộ trình (Roadmap)

- [ ] Hỗ trợ llama.cpp `llama-server` (OpenAI API)
- [ ] Stream token từng ký tự (thay vì đợi xong)
- [ ] So sánh A/B 2 model song song
- [ ] Lưu lịch sử chat
- [ ] Dark/light mode

## 🤝 Đóng góp

Xem [CONTRIBUTING.md](CONTRIBUTING.md). Mọi đóng góp welcome — kể cả báo lỗi!

## 📄 License

[MIT](LICENSE)
