# VitaFlow Health Assessment Funnel

## 项目简介

VitaFlow 是一个基于 Next.js、Supabase 和 PostgreSQL 构建的健康评估 Funnel 应用。

用户通过完成一系列关于睡眠、饮食、压力、活动水平以及身体目标的问题，系统会生成个性化健康分析结果。免费用户可查看基础分析，完成模拟支付后可解锁完整的 12 周健康规划与预测内容。

本项目重点关注：

* 分步保存与断点恢复
* 健康数据计算
* 权限控制与结果差异化
* 模拟支付闭环
* 自动化测试
* AI 辅助开发流程

---

# 在线演示

## Live Demo

部署地址：

https://vitaflow-alpha.vercel.app?_vercel_share=toGEPEAw0lagXacKvI2mIvSvmajfXSnZ

## GitHub Repository

仓库地址：

https://github.com/Psycho-QRodez/health-assessment-funnel.git

---

# 技术栈

## Frontend

* Next.js 16 (App Router)
* TypeScript
* CSS

## Backend

* Next.js API Routes
* TypeScript

## Database

* Supabase
* PostgreSQL

## Testing

* Vitest
* API E2E Testing

---

# 核心功能

## 用户问卷 Funnel

支持：

* 多步骤问卷
* 自动保存进度
* 页面刷新恢复
* Resume Assessment
* Start Over

---

## 健康分析

根据用户输入计算：

* BMI
* Health Score
* Recommended Calories
* Target Date
* 12 Week Forecast

---

## 结果权限控制

### 免费用户

可查看：

* BMI
* Health Score
* Recommended Calories

隐藏：

* Forecast Curve
* Recommendations
* Target Timeline

### 付费用户

解锁：

* Forecast Curve
* Recommendations
* Full Result
* Target Date

---

## 模拟支付

通过 `/api/pay` 接口模拟订阅激活。

支付成功后：

* 创建 Subscription
* 激活会员状态
* 解锁完整结果

---

# 项目结构

```text
src
│
├── app
│   ├── api
│   ├── funnel
│   ├── result
│   └── page.tsx
│
├── components
│   └── ui
│
├── lib
│   ├── health
│   ├── validation
│   ├── services
│   └── supabase
│
├── tests
│
└── e2e
```

---

# 本地启动

## 安装依赖

```bash
npm install
```

---

## 环境变量

创建：

```text
.env.local
```

填写：

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
```

---

## 启动项目

```bash
npm run dev
```

访问：

```text
http://localhost:3000
```

---

# API 文档

## 创建 Session

```http
POST /api/session/start
```

返回：

```json
{
  "success": true,
  "sessionId": "uuid"
}
```

---

## 保存进度

```http
POST /api/progress/save
```

```json
{
  "sessionId": "uuid",
  "questionKey": "gender",
  "answerValue": "female",
  "currentStep": 1
}
```

---

## 恢复进度

```http
GET /api/progress/recover?sessionId=xxx
```

---

## 生成结果

```http
POST /api/results/generate
```

```json
{
  "sessionId": "uuid"
}
```

---

## 获取结果

```http
GET /api/results?sessionId=xxx
```

---

## 模拟支付

```http
POST /api/pay
```

```json
{
  "sessionId": "uuid"
}
```

---

# 模拟支付示例

```bash
curl -X POST \
https://YOUR_DOMAIN/api/pay \
-H "Content-Type: application/json" \
-d '{
  "sessionId":"YOUR_SESSION_ID"
}'
```

---

# 自动化测试

## Unit & Integration Tests

运行：

```bash
npm test
```

覆盖：

* Calculator
* Validation
* Business Rules
* Assessment Flow
* Result Access

当前覆盖：

```text
21 / 21 Tests Passed
```

---

## API E2E Test

运行：

```bash
npm run test:e2e
```

覆盖：

* Start Session
* Save Progress
* Generate Result
* Premium Gate
* Payment
* Result Unlock

当前覆盖：

```text
1 / 1 E2E Flow Passed
```

---

# CI

项目接入 GitHub Actions。

每次 Push 或 Pull Request 时自动执行：

```bash
npm install
npm test
```

用于验证核心业务逻辑与测试用例。

---

# 数据库设计

数据库关系图见：

```text
docs/schema.png
```

核心实体：

* users
* assessment_sessions
* assessment_answers
* assessment_results
* subscriptions

---

# 已支付测试 Session

用于直接验证付费前后结果差异：

* 未付费用户之类看到个人的基础信息。
* 付费用户可以看到完整的计划、相关建议等等。

---

# 后续可扩展方向

* Stripe 支付集成
* AI Health Coach
* Personalized Meal Plan
* Workout Recommendation Engine
* Multi-language Support
* Mobile App

```
```
