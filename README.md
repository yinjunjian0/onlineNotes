# online-article


## 启动前端项目
##### 框架：vue
```
yarn install
yarn run serve
```

### 部署前端项目
```
yarn run build
```

---
## 启动后端服务
##### 框架：egg
```
cd serve
npm install
npm run dev
```

##### mysql配置在 /serve/onlineArticle-api/config/config.default.js
##### sql结构文件在 /serve/onlineArticle-api/online_article.sql
```
 config.mysql = {
    client: {
      host: 'localhost',
      port: '3307',
      user: 'root',
      password: 'root',
      database: 'online_article',
    },
    app: true,
    agent: false,
  };
```
