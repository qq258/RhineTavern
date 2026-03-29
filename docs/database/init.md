# 莱茵酒馆 (Rhine Tavern) - 数据库表结构设计 (V1.1)

本项目数据库采用 **PostgreSQL**。所有表均已统一补充基础审计字段（`creator`, `createDate`, `updater`, `updateDate`），以便于数据追踪与维护。

---

## 1. 基础数据源 (Data Dictionary)

### 1.1 食物库表 (`foods`)
**说明:** 存储食物的基础营养信息，以 100g/100ml 为标准单位。

| 字段名 | 数据类型 | 约束 | 备注说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | PRIMARY KEY | 主键 |
| `name` | VARCHAR(100) | NOT NULL | 食物名称 (如：燕麦片、鸡胸肉) |
| `category` | VARCHAR(50) | | 分类 (如：主食、肉蛋奶、果蔬) |
| `kcal_per_100g` | NUMERIC(5,2)| NOT NULL | 每 100g 热量 (大卡) |
| `protein_per_100g` | NUMERIC(5,2)| NOT NULL | 每 100g 蛋白质 (g) |
| `carbs_per_100g` | NUMERIC(5,2)| NOT NULL | 每 100g 碳水化合物 (g) |
| `fat_per_100g` | NUMERIC(5,2)| NOT NULL | 每 100g 脂肪 (g) |
| `creator` | VARCHAR(50) | | 创建人 |
| `createDate` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 |
| `updater` | VARCHAR(50) | | 更新人 |
| `updateDate` | TIMESTAMPTZ | DEFAULT NOW() | 更新时间 |

### 1.2 动作库表 (`exercises`)
**说明:** 存储所有健身动作的基础信息。

| 字段名 | 数据类型 | 约束 | 备注说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | PRIMARY KEY | 主键 |
| `name` | VARCHAR(100) | NOT NULL | 动作名称 (如：杠铃卧推) |
| `target_muscle` | VARCHAR(50) | NOT NULL | 目标肌群 (如：胸部、背部、腿部) |
| `equipment` | VARCHAR(50) | | 器械要求 (如：杠铃、哑铃、固定器械、自重) |
| `notes` | TEXT | | 动作要领说明 |
| `creator` | VARCHAR(50) | | 创建人 |
| `createDate` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 |
| `updater` | VARCHAR(50) | | 更新人 |
| `updateDate` | TIMESTAMPTZ | DEFAULT NOW() | 更新时间 |

---

## 2. 身体指标追踪 (Body Metrics)

### 2.1 每日身体数据表 (`daily_metrics`)
**说明:** 记录每日的核心体征与围度。灵活指标使用 JSONB。

| 字段名 | 数据类型 | 约束 | 备注说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | PRIMARY KEY | 主键 |
| `record_date` | DATE | UNIQUE, NOT NULL| 记录日期 (精确到天) |
| `weight_kg` | NUMERIC(5,2)| | 每日晨重 (kg) |
| `body_fat_pct` | NUMERIC(5,2)| | 体脂率 (%) |
| `measurements` | JSONB | | 围度数据字典 `{"chest": 100, "arm": 38, "waist": 80}` |
| `status_log` | JSONB | | 状态记录 `{"sleep_quality": "good", "rhr": 60}` |
| `creator` | VARCHAR(50) | | 创建人 |
| `createDate` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 |
| `updater` | VARCHAR(50) | | 更新人 |
| `updateDate` | TIMESTAMPTZ | DEFAULT NOW() | 更新时间 |

---

## 3. 饮食与热量管理 (Diet & Nutrition)

### 3.1 饮食打卡记录表 (`diet_logs`)
**说明:** 记录每一餐吃下的具体食物。冗余营养素字段作为快照。

| 字段名 | 数据类型 | 约束 | 备注说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | PRIMARY KEY | 主键 |
| `record_date` | DATE | NOT NULL | 记录日期 |
| `meal_type` | VARCHAR(20) | NOT NULL | 餐次 (breakfast, lunch, dinner, snack) |
| `food_id` | UUID / INT | FOREIGN KEY | 关联 `foods` 表 |
| `weight_g` | NUMERIC(6,2)| NOT NULL | 摄入重量 (克) |
| `total_kcal` | NUMERIC(6,2)| NOT NULL | 计算后的总热量 (快照) |
| `total_protein` | NUMERIC(6,2)| NOT NULL | 计算后的总蛋白质 (快照) |
| `total_carbs` | NUMERIC(6,2)| NOT NULL | 计算后的总碳水 (快照) |
| `total_fat` | NUMERIC(6,2)| NOT NULL | 计算后的总脂肪 (快照) |
| `creator` | VARCHAR(50) | | 创建人 |
| `createDate` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 |
| `updater` | VARCHAR(50) | | 更新人 |
| `updateDate` | TIMESTAMPTZ | DEFAULT NOW() | 更新时间 |

---

## 4. 健身计划与训练日志 (Workout Logs)

### 4.1 训练记录主表 (`workout_logs`)
**说明:** 记录每日训练的大盘数据和总体感受。

| 字段名 | 数据类型 | 约束 | 备注说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | PRIMARY KEY | 主键 |
| `record_date` | DATE | NOT NULL | 训练日期 |
| `start_time` | TIMESTAMPTZ | | 开始训练时间 |
| `end_time` | TIMESTAMPTZ | | 结束训练时间 |
| `total_volume` | NUMERIC(8,2)| DEFAULT 0 | 本次训练总容量 (重量 x 次数的总和) |
| `notes` | TEXT | | 训练感受 (如：推胸破PR了) |
| `creator` | VARCHAR(50) | | 创建人 |
| `createDate` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 |
| `updater` | VARCHAR(50) | | 更新人 |
| `updateDate` | TIMESTAMPTZ | DEFAULT NOW() | 更新时间 |

### 4.2 训练动作组详情表 (`workout_sets`)
**说明:** 详细记录每一个动作的每一组数据。

| 字段名 | 数据类型 | 约束 | 备注说明 |
| :--- | :--- | :--- | :--- |
| `id` | UUID / SERIAL | PRIMARY KEY | 主键 |
| `workout_log_id`| UUID / INT | FOREIGN KEY | 关联 `workout_logs` 表 |
| `exercise_id` | UUID / INT | FOREIGN KEY | 关联 `exercises` 表 |
| `set_index` | INT | NOT NULL | 第几组 (1, 2, 3...) |
| `weight_kg` | NUMERIC(5,2)| NOT NULL | 本组重量 (kg) |
| `reps` | INT | NOT NULL | 本组完成次数 |
| `is_completed` | BOOLEAN | DEFAULT true | 是否完成目标 |
| `creator` | VARCHAR(50) | | 创建人 |
| `createDate` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 |
| `updater` | VARCHAR(50) | | 更新人 |
| `updateDate` | TIMESTAMPTZ | DEFAULT NOW() | 更新时间 |