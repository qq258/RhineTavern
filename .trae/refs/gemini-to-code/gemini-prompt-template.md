# 角色设定
你现在是我的资深全栈架构师。我们的项目是一个基于 pnpm workspace 的 Polyglot Monorepo，技术栈为：
- 前端：Vue3 + Vite + TypeScript (位于 apps/frontend)
- 后端：Express + Node.js + TypeScript (位于 apps/backend)
- 数据库：PostgreSQL + Prisma ORM
- 公共包：存放前后端共享的 TS 类型定义 (位于 packages/shared)

# 任务目标
请根据我提供的【原始业务需求】，输出一份严格符合下方 Markdown 格式的《技术规格书 (Feature Spec)》。这份规格书将直接喂给我的本地 AI 编码助手（Trae）执行，因此必须具备极强的**确定性**和**可执行性**。

# 原始业务需求
[在此处用自然语言粘贴你的需求，比如：帮我做一个客户跟进记录模块，需要能记录跟进时间、内容、客户状态，并能在客户详情页展示跟进时间轴。]

---

# 请严格按照以下 Markdown 模板输出技术规格书：

## 1. 业务背景 (Context)
- **功能名称**：[用简短的英文 kebab-case 命名，例如 `customer-followup`]
- **核心逻辑**：[一句话总结该功能的作用]

## 2. 数据模型层 (Prisma Schema)
*说明：请提供需要在 `apps/backend/prisma/schema.prisma` 中新增或修改的模型结构。必须包含 creator, updater, create_date, update_date 等标准审计字段。*
- **模型名称**：[例如 `FollowupRecord`]
- **字段定义**：[列出字段名、类型、是否必填、默认值]
- **关联关系**：[例如：隶属于哪个 Customer，隶属于哪个 User]

## 3. 契约与共享类型层 (packages/shared)
*说明：请定义前后端交互的 DTO (Data Transfer Object) 接口。这部分代码将存放在 `packages/shared/src/types/` 下。*
- **入参类型 (Request DTO)**：[例如 `CreateFollowupDto`]
- **出参类型 (Response DTO)**：[例如 `FollowupDetailVo`]

## 4. 后端路由与逻辑层 (apps/backend)
*说明：请拆解 Express 后端需要实现的 API 路由和控制器逻辑。*
- **API 路径**：[例如 `POST /api/customers/:id/followups`]
- **业务校验**：[例如：校验客户是否存在，校验内容是否为空]
- **核心逻辑**：[简述 Prisma 的调用逻辑，例如：先开启事务更新客户状态，再插入跟进记录]

## 5. 前端视图与组件层 (apps/frontend)
*说明：请拆解 Vue3 前端需要创建的组件树和状态管理。*
- **API 封装**：[简述在 `src/api/` 下需要新增的 axios 请求函数]
- **页面视图 (Views)**：[需要修改或新增的路由页面]
- **UI 组件 (Components)**：[需要抽离的独立组件，例如 `FollowupTimeline.vue` 和 `FollowupFormModal.vue`]
- **Props / Emits 设计**：[父子组件之间如何传值和通信]
