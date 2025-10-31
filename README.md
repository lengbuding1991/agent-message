# AI对话助手网站

类似DeepSeek的AI对话网站前端实现，采用现代化扁平化设计，支持响应式布局。

## 功能特性

- 🎨 **现代化扁平设计** - 简洁美观的UI界面
- 💬 **实时对话** - 支持消息发送和接收
- 📱 **响应式布局** - 完美适配桌面端和移动端
- 💾 **本地存储** - 对话记录自动保存
- ⚡ **快速响应** - 优化的交互体验
- 🔄 **多对话管理** - 支持创建和管理多个对话

## 项目结构

```
agent-message/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # JavaScript功能
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 快速开始

### 方法一：使用Python内置服务器

1. 确保已安装Python
2. 在项目目录下运行：
   ```bash
   python -m http.server 8000
   ```
3. 打开浏览器访问：http://localhost:8000

### 方法二：使用Node.js

1. 确保已安装Node.js
2. 在项目目录下运行：
   ```bash
   npm start
   ```
3. 打开浏览器访问：http://localhost:8000

## 使用说明

### 基本操作

1. **发送消息**：在底部输入框输入消息，按Enter或点击发送按钮
2. **新建对话**：点击侧边栏的"新建对话"按钮
3. **切换对话**：在侧边栏点击历史对话记录
4. **清空对话**：点击聊天头部的清空按钮

### 快捷键

- `Enter` - 发送消息
- `Shift + Enter` - 换行
- 点击快速问题按钮 - 快速发送预设问题

## 技术特点

### 前端技术栈
- **HTML5** - 语义化标签结构
- **CSS3** - 现代化样式设计
- **JavaScript ES6+** - 模块化编程
- **LocalStorage** - 本地数据存储

### 设计特色
- **扁平化设计** - 简洁现代的视觉风格
- **渐变色彩** - 柔和的色彩过渡
- **圆角设计** - 友好的界面元素
- **动画效果** - 流畅的交互动画

### 响应式特性
- **桌面端优化** - 大屏幕完美显示
- **移动端适配** - 小屏幕友好体验
- **触摸优化** - 移动设备交互优化

## 自定义配置

### 修改主题色彩
在 `styles.css` 中修改CSS变量：

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #10b981;
}
```

### 添加AI接口
在 `script.js` 的 `getAIResponse` 方法中替换为真实的API调用：

```javascript
async getAIResponse(userMessage) {
    // 替换为真实的AI API调用
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });
    
    const data = await response.json();
    return data.response;
}
```

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发计划

- [ ] 添加文件上传功能
- [ ] 实现语音输入支持
- [ ] 添加主题切换
- [ ] 集成真实AI API
- [ ] 添加用户认证系统
- [ ] 实现消息搜索功能

## 贡献指南

欢迎提交Issue和Pull Request来改进项目。

## 许可证

MIT License