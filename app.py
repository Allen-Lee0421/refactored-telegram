# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 數據模擬區塊 (模擬風險偵測邏輯) ---
MOCK_RISKY_SITES = [
    "http://fakebanking.com",
    "http://malware-source.net",
    "https://scam-invest.org"
]

def check_url_risk(url):
    """模擬檢查 URL 風險的邏輯"""
    if any(risky in url for risky in MOCK_RISKY_SITES):
        return {
            "success": True,
            "is_risky": True,
            "message_zh": "⚠️ 高風險網站：偵測到此網站可能涉及釣魚或詐騙行為。請勿輸入個人資料！",
            "message_en": "⚠️ High Risk: This website is detected to be potentially phishing or scamming. Do not enter personal data!"
        }
    return {
        "success": True,
        "is_risky": False,
        "message_zh": "✅ 網站安全：未偵測到已知威脅。",
        "message_en": "✅ Website Safe: No known threats detected."
    }

# --- Flask 服務設置 ---
app = Flask(__name__)
CORS(app) # 允許跨域請求

@app.route('/api/check-url', methods=['POST'])
def check_url():
    """處理來自瀏覽器擴充功能的 POST 請求"""
    try:
        data = request.get_json()
        current_url = data.get('current_url')
        
        if not current_url:
            return jsonify({
                "success": False, 
                "message_zh": "無效請求：缺少 URL 參數。",
                "message_en": "Invalid request: URL parameter missing."
            }), 400

        # 調用模擬的風險檢查函數
        result = check_url_risk(current_url)
        return jsonify(result), 200

    except Exception as e:
        print(f"處理 API 請求時發生錯誤: {e}")
        return jsonify({
            "success": False,
            "message_zh": "伺服器內部錯誤。",
            "message_en": "Internal server error."
        }), 500

if __name__ == '__main__':
    app.run(debug=True)