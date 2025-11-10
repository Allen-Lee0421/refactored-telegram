// popup.js

document.addEventListener('DOMContentLoaded', () => {
    // 設置 API 終端點為正確的 Flask 路由
    const API_ENDPOINT = 'http://127.0.0.1:5000/api/check-url';

    const checkButton = document.getElementById('check-button');
    const resultDiv = document.getElementById('result');
    const languageToggle = document.getElementById('language-toggle');
    let currentLang = 'zh_TW'; // 預設語言

    // --- 輔助函數：i18n 國際化 (來自 messages.json) ---
    function updateText() {
        // 更新按鈕和標題文字
        checkButton.textContent = chrome.i18n.getMessage("checkButtonText", currentLang);
        document.getElementById('popup-title').textContent = chrome.i18n.getMessage("extensionName", currentLang);
        
        // 更新語言切換按鈕
        if (currentLang === 'zh_TW') {
            languageToggle.textContent = 'Switch to English';
        } else {
            languageToggle.textContent = '切換至繁中';
        }

        // 重置結果顯示
        // 注意：這裡的「」是中文字符，在 JS 字串中是有效的。
        resultDiv.innerHTML = `<p class="status-waiting">點擊「${chrome.i18n.getMessage("checkButtonText", currentLang)}」開始偵測當前頁面風險。</p>`;
    }

    // --- 事件監聽器：語言切換 ---
    languageToggle.addEventListener('click', () => {
        currentLang = (currentLang === 'zh_TW') ? 'en' : 'zh_TW';
        updateText();
    });

    // 初始載入時更新文字
    updateText();


    // --- 核心邏輯：點擊偵測按鈕 ---
    checkButton.addEventListener('click', () => {
        // 1. 取得當前頁面 URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentUrl = tabs[0].url;

            // 2. 顯示偵測中狀態
            resultDiv.innerHTML = `<p class="status-loading">${(currentLang === 'zh_TW' ? '偵測中...' : 'Scanning...')}</p>`;

            // 3. 發送 API 請求 (使用正確的路徑)
            fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ current_url: currentUrl }),
            })
            .then(response => response.json())
            .then(data => {
                // 4. 處理 API 回應
                let message;
                let statusClass;

                if (data.is_risky) {
                    // 風險網站
                    statusClass = 'status-risky';
                    message = currentLang === 'zh_TW' ? data.message_zh : data.message_en;
                } else if (data.success) {
                    // 安全網站
                    statusClass = 'status-safe';
                    message = currentLang === 'zh_TW' ? data.message_zh : data.message_en;
                } else {
                    // API 返回失敗 (如無效 URL 或其他後端錯誤)
                    statusClass = 'status-error';
                    message = currentLang === 'zh_TW' ? (data.message_zh || '偵測失敗：後端邏輯錯誤') : (data.message_en || 'Detection failed: Backend logic error');
                }
                
                resultDiv.innerHTML = `<p class="${statusClass}">${message}</p>`;
            })
            .catch(error => {
                // 5. 處理連線錯誤 (Flask 服務可能未運行)
                console.error('API 連線錯誤:', error);
                resultDiv.innerHTML = `<p class="status-error">${(currentLang === 'zh_TW' ? '連線錯誤：請確認後端服務已啟動 (5000 Port)。' : 'Connection Error: Ensure backend service is running (Port 5000).')}</p>`;
            });
        });
    });
});