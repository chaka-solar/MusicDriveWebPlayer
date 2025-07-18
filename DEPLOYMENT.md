# 部署指南 - MusicDrive WebPlayer

## 快速部署到 Render

### 1. 準備 Google Cloud Console

1. **建立 Google Cloud 專案**
   - 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - 建立新專案或選擇現有專案

2. **啟用 Google Drive API**
   - 導航至「API 和服務」>「程式庫」
   - 搜尋「Google Drive API」並啟用

3. **建立 OAuth 2.0 憑證**
   - 前往「API 和服務」>「憑證」
   - 點擊「建立憑證」>「OAuth 用戶端 ID」
   - 選擇「網路應用程式」
   - 在「已授權的 JavaScript 來源」中新增：
     - 開發環境：`http://localhost:3000`
     - 正式環境：`https://your-app-name.onrender.com`
   - 複製用戶端 ID

### 2. 部署到 Render

1. **推送程式碼到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/musicdrive-webplayer.git
   git push -u origin main
   ```

2. **在 Render 建立服務**
   - 前往 [Render Dashboard](https://dashboard.render.com/)
   - 點擊「New」>「Static Site」
   - 連接你的 GitHub 儲存庫
   - 設定：
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`
   - 點擊「Create Static Site」

3. **更新 Google OAuth 設定**
   - 取得 Render 提供的網址（例如：`https://your-app-name.onrender.com`）
   - 回到 Google Cloud Console
   - 在 OAuth 憑證中新增 Render 網址到「已授權的 JavaScript 來源」

4. **更新程式碼中的 Client ID**
   - 編輯 `src/contexts/AuthContext.js`
   - 將 `YOUR_GOOGLE_CLIENT_ID` 替換為實際的 Client ID
   - 提交並推送變更

### 3. 環境變數設定（可選）

如果你想使用環境變數來管理 Client ID：

1. **在 Render 中設定環境變數**
   - 在 Render 專案設定中新增環境變數
   - 名稱：`REACT_APP_GOOGLE_CLIENT_ID`
   - 值：你的 Google Client ID

2. **更新程式碼**
   ```javascript
   const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
   ```

### 4. 自訂網域（可選）

1. **在 Render 中設定自訂網域**
   - 前往專案設定
   - 在「Custom Domains」中新增你的網域

2. **更新 Google OAuth 設定**
   - 在 Google Cloud Console 中新增自訂網域到已授權來源

## 本地開發設定

1. **安裝相依套件**
   ```bash
   npm install
   ```

2. **設定 Google Client ID**
   - 編輯 `src/contexts/AuthContext.js`
   - 替換 `YOUR_GOOGLE_CLIENT_ID`

3. **啟動開發伺服器**
   ```bash
   npm start
   ```

## 故障排除

### 常見問題

1. **「登入失敗」錯誤**
   - 檢查 Google Client ID 是否正確
   - 確認網域已新增到已授權來源
   - 驗證 Google Drive API 已啟用

2. **找不到音樂檔案**
   - 確認 Google Drive 中有音樂檔案
   - 檢查檔案格式是否支援
   - 嘗試重新整理音樂庫

3. **播放問題**
   - 檢查網路連線
   - 確認瀏覽器支援音訊格式
   - 嘗試不同瀏覽器

### 支援的音訊格式

- MP3 (.mp3)
- WAV (.wav)
- OGG (.ogg)
- FLAC (.flac)
- M4A (.m4a)
- AAC (.aac)

### 瀏覽器相容性

- Chrome（推薦）
- Firefox
- Safari
- Edge

## 安全性注意事項

- 應用程式僅請求 Google Drive 的唯讀權限
- 存取權杖儲存在瀏覽器的 sessionStorage 中
- 不會收集或儲存任何使用者資料
- 所有資料都保留在使用者的 Google Drive 中

## 效能最佳化

1. **啟用 Gzip 壓縮**（Render 預設啟用）
2. **使用 CDN**（Render 預設提供）
3. **快取策略**（瀏覽器快取）

## 監控和分析

建議整合以下服務來監控應用程式效能：

- Google Analytics（網站分析）
- Sentry（錯誤追蹤）
- Render 內建監控

---

**注意**：此應用程式需要 Google 帳號和儲存在 Google Drive 中的音樂檔案。應用程式僅請求對 Drive 檔案的唯讀存取權限，不會修改或刪除任何內容。