# AttnWGAIN 智能物联网数据填补系统

## 项目简介

AttnWGAIN 是一个基于自注意力机制和生成对抗网络的智能物联网数据填补系统。该系统为物联网设备提供高精度的缺失数据恢复解决方案，支持多种数据格式和填补模型。

## 项目特点

- 🧠 **自注意力机制**: 利用Transformer架构捕捉数据中的长期依赖关系
- 🤖 **生成对抗网络**: 通过GAN技术生成高质量的数据
- 📊 **多模型支持**: 支持AttnWGAIN、Transformer、RNN等多种模型
- 📈 **可视化分析**: 提供详细的图表和评估指标
- 📱 **响应式设计**: 支持桌面、平板、手机等多种设备
- ⚡ **实时处理**: 提供实时进度显示和状态反馈

## 文件结构

```
网页/
├── index.html              # 首页
├── upload.html             # 数据上传页面
├── results.html            # 结果展示页面
├── guide.html              # 使用指南页面
├── contact.html            # 联系我们页面
├── styles/                 # 样式文件
│   ├── main.css           # 主要样式
│   ├── upload.css         # 上传页面样式
│   ├── results.css        # 结果页面样式
│   ├── guide.css          # 指南页面样式
│   └── contact.css        # 联系页面样式
├── scripts/               # JavaScript文件
│   ├── main.js           # 主要脚本
│   ├── upload.js         # 上传页面脚本
│   ├── results.js        # 结果页面脚本
│   ├── guide.js          # 指南页面脚本
│   └── contact.js        # 联系页面脚本
└── README.md             # 项目说明文档
```

## 页面功能

### 1. 首页 (index.html)
- 项目介绍和核心特性展示
- 技术创新亮点说明
- 统计数据展示
- 快速导航到其他页面

### 2. 数据上传页面 (upload.html)
- 支持拖拽上传CSV、Excel文件
- 模型选择和参数设置
- 实时进度显示
- 文件格式验证

### 3. 结果展示页面 (results.html)
- 填补前后数据对比表格
- 时间序列图表展示
- 误差分布分析
- 模型性能对比
- 数据导出功能

### 4. 使用指南页面 (guide.html)
- 步骤化操作说明
- 常见问题解答(FAQ)
- 技术文档链接
- 数据格式指南

### 5. 联系我们页面 (contact.html)
- 联系表单
- 联系信息展示
- 社交媒体链接
- 快速解答链接

## 技术栈

- **前端框架**: 原生HTML5 + CSS3 + JavaScript
- **图表库**: Chart.js
- **图标库**: Font Awesome
- **字体**: Google Fonts (Inter)
- **响应式设计**: CSS Grid + Flexbox

## 使用方法

### 1. 本地运行
```bash
# 克隆项目到本地
git clone [项目地址]

# 进入项目目录
cd 网页

# 使用本地服务器运行（推荐）
# 方法1: 使用Python
python -m http.server 8000

# 方法2: 使用Node.js
npx http-server

# 方法3: 使用Live Server (VS Code插件)
# 在VS Code中安装Live Server插件，右键index.html选择"Open with Live Server"
```

### 2. 访问网站
打开浏览器访问 `http://localhost:8000` 即可查看网站。

## 功能演示

### 数据上传流程
1. 点击"开始使用"按钮进入上传页面
2. 拖拽或选择CSV/Excel文件
3. 选择填补模型和参数
4. 点击"开始填补"按钮
5. 查看实时进度和结果

### 结果分析
1. 查看填补前后的数据对比
2. 分析图表和评估指标
3. 下载处理结果
4. 生成详细报告

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 开发说明

### 样式定制
- 主要颜色主题在 `styles/main.css` 中定义
- 各页面专用样式在对应的CSS文件中
- 支持深色主题切换（需要额外开发）

### 功能扩展
- 可以在 `scripts/` 目录下添加新的JavaScript文件
- 支持模块化开发
- 可以集成后端API接口

### 部署建议
- 建议使用HTTPS协议
- 配置适当的缓存策略
- 启用Gzip压缩
- 使用CDN加速静态资源

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 邮箱: support@attnwgain.com
- 电话: +86 400-123-4567
- 地址: 北京市海淀区中关村大街1号，清华大学科技园

## 更新日志

### v1.0.0 (2025-01-01)
- 初始版本发布
- 完整的五个页面功能
- 响应式设计支持
- 基础交互功能

---

**注意**: 这是一个演示项目，实际的数据处理功能需要后端API支持。当前版本主要用于展示前端界面和用户交互流程。 