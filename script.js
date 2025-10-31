// AI对话助手 - JavaScript功能实现
class AIChatApp {
    constructor() {
        this.currentChatId = this.generateChatId();
        this.chats = this.loadChatsFromStorage();
        this.isLoading = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.renderChatHistory();
        this.showWelcomeMessage();
    }
    
    // 初始化DOM元素
    initializeElements() {
        this.elements = {
            messageInput: document.getElementById('messageInput'),
            sendBtn: document.getElementById('sendBtn'),
            messagesContainer: document.getElementById('messagesContainer'),
            newChatBtn: document.getElementById('newChatBtn'),
            clearChatBtn: document.getElementById('clearChatBtn'),
            historyList: document.getElementById('historyList'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            charCount: document.querySelector('.char-count')
        };
    }
    
    // 绑定事件监听器
    attachEventListeners() {
        // 发送消息事件
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        this.elements.messageInput.addEventListener('keydown', (e) => this.handleInputKeydown(e));
        this.elements.messageInput.addEventListener('input', () => this.updateSendButtonState());
        
        // 新建对话事件
        this.elements.newChatBtn.addEventListener('click', () => this.createNewChat());
        
        // 清空对话事件
        this.elements.clearChatBtn.addEventListener('click', () => this.clearCurrentChat());
        
        // 快速问题点击事件
        document.querySelectorAll('.quick-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.elements.messageInput.value = question;
                this.updateSendButtonState();
                this.sendMessage();
            });
        });
    }
    
    // 处理输入框按键事件
    handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
        
        // 自动调整输入框高度
        if (e.key === 'Enter' && e.shiftKey) {
            setTimeout(() => this.autoResizeTextarea(), 0);
        }
    }
    
    // 自动调整文本区域高度
    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    // 更新发送按钮状态
    updateSendButtonState() {
        const message = this.elements.messageInput.value.trim();
        const isEnabled = message.length > 0 && !this.isLoading;
        
        this.elements.sendBtn.disabled = !isEnabled;
        
        // 更新字符计数
        this.elements.charCount.textContent = `${message.length}/2000`;
        
        // 自动调整高度
        this.autoResizeTextarea();
    }
    
    // 发送消息
    async sendMessage() {
        const message = this.elements.messageInput.value.trim();
        if (!message || this.isLoading) return;
        
        // 清空输入框
        this.elements.messageInput.value = '';
        this.updateSendButtonState();
        
        // 添加用户消息
        this.addMessage('user', message);
        
        // 显示加载状态
        this.showLoading(true);
        
        try {
            // 模拟AI回复（实际项目中这里应该调用AI API）
            const aiResponse = await this.getAIResponse(message);
            this.addMessage('assistant', aiResponse);
        } catch (error) {
            console.error('AI回复错误:', error);
            this.addMessage('assistant', '抱歉，我暂时无法处理您的请求。请稍后再试。');
        } finally {
            this.showLoading(false);
            this.saveChatToStorage();
        }
    }
    
    // 模拟AI回复（实际项目中应替换为真实的API调用）
    async getAIResponse(userMessage) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // 简单的回复逻辑
        const responses = {
            '你好': '您好！我是您的AI助手，很高兴为您服务。有什么我可以帮助您的吗？',
            '你是谁': '我是基于人工智能的对话助手，可以回答您的问题、提供建议和进行对话。',
            '今天天气': '我无法获取实时天气信息，建议您查看专业的天气预报应用或网站。',
            '推荐学习资源': '以下是一些优质的学习资源：\n• Coursera和edX的在线课程\n• GitHub上的开源项目\n• 专业的技术博客和文档\n• 相关的技术社区和论坛',
            'default': `感谢您的消息！您说："${userMessage}"\n\n作为AI助手，我可以帮助您：\n• 回答各种问题\n• 提供学习建议\n• 协助解决问题\n• 进行日常对话\n\n请告诉我您具体需要什么帮助？`
        };
        
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('你好') || lowerMessage.includes('您好')) {
            return responses['你好'];
        } else if (lowerMessage.includes('谁') && (lowerMessage.includes('你') || lowerMessage.includes('什么'))) {
            return responses['你是谁'];
        } else if (lowerMessage.includes('天气')) {
            return responses['今天天气'];
        } else if (lowerMessage.includes('学习') || lowerMessage.includes('资源')) {
            return responses['推荐学习资源'];
        } else {
            return responses['default'];
        }
    }
    
    // 添加消息到聊天界面
    addMessage(sender, content) {
        // 隐藏欢迎消息
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
        
        const messageElement = this.createMessageElement(sender, content);
        this.elements.messagesContainer.appendChild(messageElement);
        
        // 滚动到底部
        this.scrollToBottom();
        
        // 添加到当前聊天记录
        if (!this.chats[this.currentChatId]) {
            this.chats[this.currentChatId] = {
                id: this.currentChatId,
                title: this.generateChatTitle(content),
                messages: [],
                createdAt: new Date().toISOString()
            };
        }
        
        this.chats[this.currentChatId].messages.push({
            sender,
            content,
            timestamp: new Date().toISOString()
        });
        
        // 更新聊天标题（如果是第一条消息）
        if (this.chats[this.currentChatId].messages.length === 1) {
            this.chats[this.currentChatId].title = this.generateChatTitle(content);
            this.renderChatHistory();
        }
    }
    
    // 创建消息元素
    createMessageElement(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = sender === 'user' ? '👤' : '🤖';
        const time = new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-bubble">${this.formatMessageContent(content)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        return messageDiv;
    }
    
    // 格式化消息内容（支持换行）
    formatMessageContent(content) {
        return content.replace(/\n/g, '<br>');
    }
    
    // 滚动到底部
    scrollToBottom() {
        setTimeout(() => {
            this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
        }, 100);
    }
    
    // 显示/隐藏加载状态
    showLoading(show) {
        this.isLoading = show;
        this.elements.loadingOverlay.style.display = show ? 'flex' : 'none';
        this.updateSendButtonState();
    }
    
    // 创建新对话
    createNewChat() {
        this.currentChatId = this.generateChatId();
        this.showWelcomeMessage();
        this.renderChatHistory();
    }
    
    // 清空当前对话
    clearCurrentChat() {
        if (confirm('确定要清空当前对话吗？')) {
            delete this.chats[this.currentChatId];
            this.saveChatToStorage();
            this.showWelcomeMessage();
            this.renderChatHistory();
        }
    }
    
    // 显示欢迎消息
    showWelcomeMessage() {
        this.elements.messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">✨</div>
                <h2>欢迎使用AI对话助手</h2>
                <p>我是您的智能助手，可以帮您解答问题、提供建议和进行对话</p>
                <div class="quick-questions">
                    <button class="quick-question" data-question="你好，请介绍一下你自己">
                        自我介绍
                    </button>
                    <button class="quick-question" data-question="你能帮我做什么">
                        功能说明
                    </button>
                    <button class="quick-question" data-question="今天天气怎么样">
                        天气查询
                    </button>
                    <button class="quick-question" data-question="推荐一些学习资源">
                        学习资源
                    </button>
                </div>
            </div>
        `;
        
        // 重新绑定快速问题事件
        document.querySelectorAll('.quick-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.elements.messageInput.value = question;
                this.updateSendButtonState();
                this.sendMessage();
            });
        });
    }
    
    // 渲染聊天历史
    renderChatHistory() {
        const historyList = this.elements.historyList;
        historyList.innerHTML = '';
        
        const chatEntries = Object.values(this.chats)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10); // 只显示最近10个对话
        
        chatEntries.forEach(chat => {
            const historyItem = document.createElement('button');
            historyItem.className = 'history-item';
            if (chat.id === this.currentChatId) {
                historyItem.classList.add('active');
            }
            
            historyItem.innerHTML = `
                <span class="history-title-text">${chat.title}</span>
            `;
            
            historyItem.addEventListener('click', () => {
                this.switchToChat(chat.id);
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    // 切换到指定聊天
    switchToChat(chatId) {
        this.currentChatId = chatId;
        const chat = this.chats[chatId];
        
        if (chat && chat.messages.length > 0) {
            this.elements.messagesContainer.innerHTML = '';
            chat.messages.forEach(msg => {
                this.addMessage(msg.sender, msg.content);
            });
        } else {
            this.showWelcomeMessage();
        }
        
        this.renderChatHistory();
    }
    
    // 生成聊天ID
    generateChatId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // 生成聊天标题
    generateChatTitle(firstMessage) {
        const maxLength = 20;
        let title = firstMessage.trim();
        
        if (title.length > maxLength) {
            title = title.substring(0, maxLength) + '...';
        }
        
        return title || '新对话';
    }
    
    // 从本地存储加载聊天记录
    loadChatsFromStorage() {
        try {
            const saved = localStorage.getItem('ai_chat_app');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('加载聊天记录失败:', error);
            return {};
        }
    }
    
    // 保存聊天记录到本地存储
    saveChatToStorage() {
        try {
            localStorage.setItem('ai_chat_app', JSON.stringify(this.chats));
        } catch (error) {
            console.error('保存聊天记录失败:', error);
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new AIChatApp();
});

// 添加一些实用函数
window.utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};