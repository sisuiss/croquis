const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3001;  // ポートを3001に変更

// データベースのパス
const ownDbPath = path.join(__dirname, 'db', 'own_images.db');
const userDbPath = path.join(__dirname, 'db', 'user_images.db');

// データベースの初期化
const ownDb = new sqlite3.Database(ownDbPath, (err) => {
    if (err) {
        console.error('Error opening own_images.db:', err.message);
    } else {
        console.log('Connected to own_images.db');
    }
});

const userDb = new sqlite3.Database(userDbPath, (err) => {
    if (err) {
        console.error('Error opening user_images.db:', err.message);
    } else {
        console.log('Connected to user_images.db');
    }
});

// 静的ファイルを提供するためのミドルウェア
app.use(express.static(path.join(__dirname)));

// メインページへのルート
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main_page', 'main_page.html'));
});

// ユーザー画像ページへのルート
app.get('/userimage.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'user_page', 'userimage.html'));
});

// 自分の画像ページへのルート
app.get('/ownimage.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'own_page', 'ownimage.html'));
});

// エラーハンドリング
app.use((err, req, res, next) => {
    console.error(err.stack); // エラーの詳細をコンソールに出力
    res.status(500).send('Something broke!'); // クライアントにエラーメッセージを送信
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// 未処理の例外を処理する
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1); // 必須 (Node.jsのドキュメントに従う)
});
