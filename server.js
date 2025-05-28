import express from 'express';
import sqlite3Package from 'sqlite3';
import cors from 'cors';
import open from 'open';
import path from 'path';
import { performance } from 'perf_hooks';
import { fileURLToPath } from 'url';
import ip from 'ip';
import fs from 'fs';

const port = 2077;
const app = express();
const startTime = performance.now();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlite3 = sqlite3Package.verbose();

// 启动项
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Pages/HomePage.html'));
});
app.get('/manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Pages/ManagePage.html'));
});
app.get('/', (req, res) => {
    res.redirect('/home');
});

// 连接数据库
const db = new sqlite3.Database('./public/person.db', (err) => {
    if (err) return console.error(err.message);
    console.log('\x1b[42;30m DONE \x1b[40;32m SQLite 数据库已连接 \x1b[0m');
});

// 初始化人员表
db.run(`CREATE TABLE IF NOT EXISTS person (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  sex TEXT,
  age INTEGER,
  area TEXT,
  email TEXT,
  department TEXT,
  photo TEXT
)`);

// 初始化账号表
db.run(`CREATE TABLE IF NOT EXISTS account (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// 用户名和密码格式校验函数
function isValidUsername(username) {
    return /^[A-Za-z0-9]{1,8}$/.test(username);
}

function isValidPassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,10}$/.test(password);
}

// 注册账号接口
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!isValidUsername(username)) {
        return res.status(400).json({ error: '用户名只能包含8位以内的数字或字母' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ error: '密码必须为10位以内的字母和数字组合，且至少包含一个字母和一个数字' });
    }

    const sql = 'INSERT INTO account(username, password) VALUES (?, ?)';
    db.run(sql, [username, password], function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint')) {
                return res.status(409).json({ error: '用户名已存在' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '注册成功', id: this.lastID });
    });
});

// 查询所有人员（支持关键词搜索）
app.get('/persons', (req, res) => {
    const keyword = req.query.keyword;
    if (keyword) {
        const like = `%${keyword}%`;
        const sql = `
        SELECT * FROM person
        WHERE name LIKE ? OR email LIKE ? OR department LIKE ?`;
        db.all(sql, [like, like, like], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } else {
        db.all('SELECT * FROM person', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});

// 根据id查询人员
app.get('/persons/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM person WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// 新增人员
app.post('/persons', (req, res) => {
    const { name, sex, age, area, email, department, photo } = req.body;
    const sql = 'INSERT INTO person(name, sex, age, area, email, department, photo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [name, sex, age, area, email, department, photo], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// 修改人员
app.put('/persons/:id', (req, res) => {
    const id = req.params.id;
    const { name, sex, age, area, email, department, photo } = req.body;
    const sql = `UPDATE person SET name=?, sex=?, age=?, area=?, email=?, department=?, photo=? WHERE id=?`;
    db.run(sql, [name, sex, age, area, email, department, photo, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ changes: this.changes });
    });
});

// 删除人员
app.delete('/persons/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM person WHERE id=?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ changes: this.changes });
    });
});

// 获取所有账号（仅用于前端判断是否已有账号）
app.get('/accounts', (req, res) => {
    db.all('SELECT * FROM account', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 404页面处理
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public/Pages/404.html'));
});

// 启动服务
// 显式绑定本机局域网 IP
const host = ip.address(); 

app.listen(port, host, () => {
    console.log(`\x1b[2J\x1b[42;30m DONE \x1b[40;32m 服务运行于\x1b[40;33m http://${host}:${port} \x1b[0m`);
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`\x1b[42;30m DONE \x1b[40;32m 耗时 ${duration.toFixed(2)} 毫秒 \x1b[0m`);
    //自动打开浏览器
    open(`http://${host}:${port}`);
});

//导出host和port
const configContent = `export const host = "${host}";
export const port = ${port};`;
fs.writeFileSync('./public/config.js', configContent); 