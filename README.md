# 员工管理系统

这是一个基于Node.js的简单员工管理系统，允许用户对员工信息进行增删改查等基本操作，同时支持从XML文件导入员工信息和将员工信息导出为XML文件。

## 技术栈

- **前端**: HTML, CSS, JavaScript, Bootstrap, Sweetalert2
- **后端**: Node.js, Express.js
- **数据库**: SQLite3
- **其他**: Fetch API, XML Parser

## 安装与运行

1. 确保您的系统已安装Node.js。
2. 克隆或下载此项目到本地。
3. 初始化nodejs项目

```bash
npm init -y
```
4. 在项目根目录下运行以下命令以安装依赖项：

```bash
npm install
```

5. 启动项目：

```bash
node server.js
```

6. 打开浏览器并访问 `http://localhost:2077`。

## 目录结构

```
employee-manager
├── 测试用例.xml
├── package.json
├── public
│   ├── CSS
│   │   ├── Bootstrap
│   │   ├── Sweetalert2
│   │   ├── HomePage.css
│   │   └── ManagePage.css
│   ├── imgs
│   ├── JS
│   │   ├── HomePage.js
│   │   └── ManagePage.js
│   └── Pages
│       ├── HomePage.html   
│       └── ManagePage.html
├── res
├── server.js
└── README.md
```

## API 接口

### 用户管理

- `POST /register`: 注册新用户
- `GET /accounts`: 获取所有用户账号

### 员工管理

- `GET /persons`: 获取所有员工信息（支持关键词搜索）
- `GET /persons/:id`: 根据ID获取员工信息
- `POST /persons`: 新增员工信息
- `PUT /persons/:id`: 修改员工信息
- `DELETE /persons/:id`: 删除员工信息

## 许可证

本项目采用WTFPL许可证。
```
        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
            Version 2, December 2004

Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
```