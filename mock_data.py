# file: backend/mock_data.py

"""
集中存放所有模擬資料 (MOCK DATA)，用於取代實際資料庫。
"""

# 模擬會員資料庫 (用於 Pro Tier 檢查)
MOCK_USERS = {
    "pro_user@example.com": {"id": 1, "tier": "Pro", "scans_this_month": 10},
    "free_user@example.com": {"id": 2, "tier": "Free", "scans_this_month": 0}
}

# 模擬資料外洩/詐騙資料庫 (用於 P1/T5 個資檢查)
MOCK_LEAKED_DATA = {
    "test@scam.com": True,
    "1234567890": True, # 模擬手機號碼
    "pro_user@example.com": False # Pro 用戶安全
}