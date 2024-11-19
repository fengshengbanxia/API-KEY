const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Key 管理器</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .api-key-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .api-key-table th, .api-key-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        .api-key-table th {
            background-color: #f5f5f5;
        }
        .api-key-table tr:hover {
            background-color: #f9f9f9;
        }
        .button-group {
            display: flex;
            gap: 10px;
        }
        .button.edit {
            background-color: #2196F3;
        }
        .api-key-list {
            margin-top: 20px;
        }
        .api-key-item {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        .button {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .button.delete {
            background-color: #f44336;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background-color: white;
            margin: 15% auto;
            padding: 20px;
            border-radius: 5px;
            width: 80%;
            max-width: 500px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
        }
        .form-group input, .form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .modal-buttons {
            text-align: right;
            margin-top: 20px;
        }
        .modal-buttons button {
            margin-left: 10px;
        }
        .login-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .error-message {
            color: red;
            margin-top: 10px;
        }
        .main-content {
            display: none;
        }
        .search-container {
            margin: 20px 0;
            position: relative;
        }
        .search-type-select {
            padding: 8px;
            margin-right: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .search-input {
            width: 300px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            width: 300px;
            max-height: 200px;
            overflow-y: auto;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: none;
            z-index: 1000;
        }
        .suggestion-item {
            padding: 8px;
            cursor: pointer;
        }
        .suggestion-item:hover {
            background-color: #f5f5f5;
        }
        .index-column {
            width: 50px;
            text-align: center;
        }
        .api-key-cell {
            max-width: 200px;
            position: relative;
        }

        .api-key-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            padding-right: 30px;
        }

        .api-key-text.hidden {
            -webkit-text-security: disc;
        }

        .copy-button {
            padding: 2px 5px;
            font-size: 12px;
            margin-left: 5px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }

        .toggle-visibility {
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            padding: 2px;
        }

        .filter-buttons {
            margin: 20px 0;
            display: flex;
            gap: 10px;
        }

        .filter-container {
            margin: 10px 0;
            display: none;
        }

        .filter-options {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }

        .filter-option {
            padding: 8px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            text-align: center;
        }

        .filter-option:hover {
            background: #e0e0e0;
        }

        .copy-tooltip {
            position: fixed;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
        }
    </style>
</head>
<body>
    <div id="loginForm" class="login-container">
        <h2>登录</h2>
        <div class="form-group">
            <label for="username">用户名</label>
            <input type="text" id="username" placeholder="输入用户名">
        </div>
        <div class="form-group">
            <label for="password">密码</label>
            <input type="password" id="password" placeholder="输入密码">
        </div>
        <div class="modal-buttons">
            <button onclick="login()" class="button">登录</button>
        </div>
        <div id="loginError" class="error-message"></div>
    </div>

    <div id="mainContent" class="main-content">
        <h1>API Key 管理器</h1>
        <div>
            <button onclick="showCreateModal()" class="button">创建新 API Key</button>
            <button onclick="logout()" class="button delete" style="float: right;">退出登录</button>
        </div>

        <div class="filter-buttons">
            <button onclick="showFilter('provider')" class="button">按模型服务商筛选</button>
            <button onclick="showFilter('model')" class="button">按模型名称筛选</button>
            <button onclick="clearFilter()" class="button">清除筛选</button>
        </div>
        <div id="providerFilter" class="filter-container">
            <h3>选择模型服务商</h3>
            <div id="providerOptions" class="filter-options"></div>
        </div>
        <div id="modelFilter" class="filter-container">
            <h3>选择模型名称</h3>
            <div id="modelOptions" class="filter-options"></div>
        </div>

        <table class="api-key-table">
            <thead>
                <tr>
                    <th class="index-column">序号</th>
                    <th>模型服务商</th>
                    <th>接口地址</th>
                    <th>API Key</th>
                    <th>模型名称</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody id="apiKeyList">
                <!-- API keys will be listed here -->
            </tbody>
        </table>

        <div id="apiKeyModal" class="modal">
            <div class="modal-content" id="draggableModal">
                <div class="modal-header" id="modalHeader">
                    <h2 id="modalTitle">创建新的 API Key</h2>
                </div>
                <div class="form-group">
                    <label for="provider">模型服务商</label>
                    <select id="provider">
                        <option value="OpenAI">OpenAI</option>
                        <option value="Azure">Azure</option>
                        <option value="Google">Google</option>
                        <option value="Anthropic">Anthropic</option>
                        <option value="Baidu">Baidu</option>
                        <option value="ByteDance">ByteDance</option>
                        <option value="Alibaba">Alibaba</option>
                        <option value="TencentMoonshot">TencentMoonshot</option>
                        <option value="Stability">Stability</option>
                        <option value="IflyTek">IflyTek</option>
                        <option value="XAI">XAI</option>
                        <option value="ChatGLM">ChatGLM</option>
                        <option value="custom">自定义</option>
                    </select>
                </div>
                <div class="form-group" id="customProviderGroup" style="display: none;">
                    <label for="customProvider">自定义服务商名称</label>
                    <input type="text" id="customProvider" placeholder="输入服务商名称">
                </div>
                <div class="form-group">
                    <label for="apiEndpoint">接口地址</label>
                    <input type="text" id="apiEndpoint" placeholder="https://api.example.com">
                </div>
                <div class="form-group">
                    <label for="apiKey">API Key</label>
                    <input type="text" id="apiKey" placeholder="输入 API Key">
                </div>
                <div class="form-group">
                    <label for="modelName">模型名称</label>
                    <select id="modelName">
                        <option value="custom">自定义</option>
                        <optgroup label="OpenAI">
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-4-turbo">GPT-4 Turbo</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </optgroup>
                        <optgroup label="XAI">
                            <option value="grok-beta">grok-beta</option>
                            <option value="grok-vision-beta">grok-vision-beta</option>
                        </optgroup>
                        <optgroup label="Anthropic">
                            <option value="claude-3-opus">Claude 3 Opus</option>
                            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                            <option value="claude-2">Claude 2</option>
                        </optgroup>
                        <optgroup label="Google">
                            <option value="gemini-pro">Gemini Pro</option>
                        </optgroup>
                    </select>
                </div>
                <div class="form-group" id="customModelGroup" style="display: none;">
                    <label for="customModel">自定义模型名称</label>
                    <input type="text" id="customModel" placeholder="输入模型名称">
                </div>
                <input type="hidden" id="editId">
                <div class="modal-buttons">
                    <button onclick="closeModal()" class="button delete">取消</button>
                    <button onclick="saveApiKey()" class="button">保存</button>
                </div>
            </div>
        </div>
    </div>

    <div id="copyTooltip" class="copy-tooltip" style="display: none;"></div>

    <script>
        const API_BASE = window.location.origin;
        let authToken = localStorage.getItem('authToken');

        // 检查登录状态
        function checkAuth() {
            const mainContent = document.getElementById('mainContent');
            const loginForm = document.getElementById('loginForm');
            
            if (authToken) {
                mainContent.style.display = 'block';
                loginForm.style.display = 'none';
                loadApiKeys();
            } else {
                mainContent.style.display = 'none';
                loginForm.style.display = 'block';
            }
        }

        // 登录函数
        async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(\`\${API_BASE}/api/login\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    throw new Error('登录失败');
                }

                const data = await response.json();
                authToken = data.token;
                localStorage.setItem('authToken', authToken);
                checkAuth();
            } catch (error) {
                document.getElementById('loginError').textContent = error.message;
            }
        }

        // 退出登录
        function logout() {
            localStorage.removeItem('authToken');
            authToken = null;
            checkAuth();
        }

        // 添加拖动功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const modal = document.getElementById("draggableModal");
        const modalHeader = document.getElementById("modalHeader");

        modalHeader.addEventListener("mousedown", dragStart);
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === modalHeader) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, modal);
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = \`translate(\${xPos}px, \${yPos}px)\`;
        }

        // 搜索功能
        function handleSearchInput() {
            const searchType = document.getElementById('searchType').value;
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const suggestionsDiv = document.getElementById('searchSuggestions');
            
            if (!searchTerm) {
                suggestionsDiv.style.display = 'none';
                displayKeys(allKeys);
                return;
            }

            // 获取唯一的建议列表
            const suggestions = new Set();
            allKeys.forEach(key => {
                if (searchType === 'provider') {
                    const provider = key.provider === 'custom' ? key.customProvider : key.provider;
                    if (provider.toLowerCase().includes(searchTerm)) {
                        suggestions.add(provider);
                    }
                } else {
                    const modelName = key.modelName === 'custom' ? key.customModel : key.modelName;
                    if (modelName.toLowerCase().includes(searchTerm)) {
                        suggestions.add(modelName);
                    }
                }
            });

            // 显示建议
            if (suggestions.size > 0) {
                suggestionsDiv.innerHTML = '';
                suggestions.forEach(suggestion => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.textContent = suggestion;
                    div.onclick = () => selectSuggestion(suggestion, searchType);
                    suggestionsDiv.appendChild(div);
                });
                suggestionsDiv.style.display = 'block';
            } else {
                suggestionsDiv.style.display = 'none';
            }
        }

        function selectSuggestion(value, searchType) {
            document.getElementById('searchInput').value = value;
            document.getElementById('searchSuggestions').style.display = 'none';

            // 过滤并显示结果
            const filteredKeys = allKeys.filter(key => {
                if (searchType === 'provider') {
                    const provider = key.provider === 'custom' ? key.customProvider : key.provider;
                    return provider === value;
                } else {
                    const modelName = key.modelName === 'custom' ? key.customModel : key.modelName;
                    return modelName === value;
                }
            });

            displayKeys(filteredKeys);
        }

        // 点击外部关闭建议框
        document.addEventListener('click', function(e) {
            const suggestionsDiv = document.getElementById('searchSuggestions');
            const searchInput = document.getElementById('searchInput');
            if (e.target !== searchInput && e.target !== suggestionsDiv) {
                suggestionsDiv.style.display = 'none';
            }
        });

        let allKeys = []; // 存储所有的 API Keys

        async function loadApiKeys() {
            try {
                const response = await fetch(\`\${API_BASE}/api/keys\`, {
                    headers: { 'Authorization': \`Bearer \${authToken}\` }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        logout();
                        return;
                    }
                    throw new Error('加载失败');
                }

                const keys = await response.json();
                allKeys = keys;
                displayKeys(keys);
                updateFilterOptions();
            } catch (error) {
                console.error('Error:', error);
            }
        }

        function displayKeys(keys) {
            const listElement = document.getElementById('apiKeyList');
            listElement.innerHTML = '';

            keys.forEach((key, index) => {
                const row = document.createElement('tr');
                row.innerHTML = \`
                    <td class="index-column">\${index + 1}</td>
                    <td>\${key.provider === 'custom' ? key.customProvider : key.provider}</td>
                    <td>\${key.apiEndpoint}</td>
                    <td class="api-key-cell">
                        <div class="api-key-text hidden" onclick="copyToClipboard(this, '\${key.apiKey}')">\${key.apiKey}</div>
                        <span class="toggle-visibility" onclick="toggleVisibility(this)">👁️</span>
                    </td>
                    <td>\${key.modelName === 'custom' ? key.customModel : key.modelName}</td>
                    <td>\${new Date(key.created).toLocaleString()}</td>
                    <td class="button-group">
                        <button onclick="editApiKey('\${key.id}')" class="button edit">修改</button>
                        <button onclick="deleteApiKey('\${key.id}')" class="button delete">删除</button>
                    </td>
                \`;
                listElement.appendChild(row);
            });
        }

        function toggleVisibility(element) {
            const apiKeyText = element.previousElementSibling;
            apiKeyText.classList.toggle('hidden');
            element.textContent = apiKeyText.classList.contains('hidden') ? '👁️' : '🔒';
        }

        async function copyToClipboard(element, text) {
            try {
                await navigator.clipboard.writeText(text);
                showTooltip(element, '已复制！');
            } catch (err) {
                showTooltip(element, '复制失败');
            }
        }

        function showTooltip(element, message) {
            const tooltip = document.getElementById('copyTooltip');
            const rect = element.getBoundingClientRect();
            
            tooltip.textContent = message;
            tooltip.style.display = 'block';
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - 30) + 'px';

            setTimeout(() => {
                tooltip.style.display = 'none';
            }, 1500);
        }

        function showFilter(type) {
            document.getElementById('providerFilter').style.display = 'none';
            document.getElementById('modelFilter').style.display = 'none';
            document.getElementById(type + 'Filter').style.display = 'block';
        }

        function clearFilter() {
            document.getElementById('providerFilter').style.display = 'none';
            document.getElementById('modelFilter').style.display = 'none';
            displayKeys(allKeys);
        }

        function updateFilterOptions() {
            // 获取唯一的服务商和模型名称
            const providers = new Set();
            const models = new Set();

            allKeys.forEach(key => {
                providers.add(key.provider === 'custom' ? key.customProvider : key.provider);
                models.add(key.modelName === 'custom' ? key.customModel : key.modelName);
            });

            // 更新服务商选项
            const providerOptions = document.getElementById('providerOptions');
            providerOptions.innerHTML = '';
            providers.forEach(provider => {
                const div = document.createElement('div');
                div.className = 'filter-option';
                div.textContent = provider;
                div.onclick = () => filterByProvider(provider);
                providerOptions.appendChild(div);
            });

            // 更新模型选项
            const modelOptions = document.getElementById('modelOptions');
            modelOptions.innerHTML = '';
            models.forEach(model => {
                const div = document.createElement('div');
                div.className = 'filter-option';
                div.textContent = model;
                div.onclick = () => filterByModel(model);
                modelOptions.appendChild(div);
            });
        }

        function filterByProvider(provider) {
            const filtered = allKeys.filter(key => 
                (key.provider === 'custom' ? key.customProvider : key.provider) === provider
            );
            displayKeys(filtered);
        }

        function filterByModel(model) {
            const filtered = allKeys.filter(key => 
                (key.modelName === 'custom' ? key.customModel : key.modelName) === model
            );
            displayKeys(filtered);
        }

        async function deleteApiKey(id) {
            if (!confirm('确定要删除这个 API Key 吗？')) return;

            try {
                const response = await fetch(\`\${API_BASE}/api/keys/\${id}\`, {
                    method: 'DELETE',
                    headers: { 'Authorization': \`Bearer \${authToken}\` }
                });

                if (!response.ok) {
                    throw new Error('删除失败');
                }

                loadApiKeys();
            } catch (error) {
                alert(error.message);
            }
        }

        function showCreateModal() {
            const modal = document.getElementById('draggableModal');
            modal.style.transform = 'translate(0, 0)';
            xOffset = 0;
            yOffset = 0;
            
            document.getElementById('modalTitle').textContent = '创建新的 API Key';
            document.getElementById('editId').value = '';
            document.getElementById('apiKeyModal').style.display = 'block';
            clearModalForm();
        }

        function clearModalForm() {
            document.getElementById('provider').value = 'OpenAI';
            document.getElementById('customProvider').value = '';
            document.getElementById('apiEndpoint').value = '';
            document.getElementById('apiKey').value = '';
            document.getElementById('modelName').value = 'gpt-3.5-turbo';
            document.getElementById('customModel').value = '';
            document.getElementById('customProviderGroup').style.display = 'none';
            document.getElementById('customModelGroup').style.display = 'none';
        }

        async function editApiKey(id) {
            const response = await fetch(\`\${API_BASE}/api/keys/\${id}\`, {
                headers: { 'Authorization': \`Bearer \${authToken}\` }
            });
            const key = await response.json();
            
            document.getElementById('modalTitle').textContent = '修改 API Key';
            document.getElementById('editId').value = id;
            document.getElementById('provider').value = key.provider;
            document.getElementById('apiEndpoint').value = key.apiEndpoint;
            document.getElementById('apiKey').value = key.apiKey;
            document.getElementById('modelName').value = key.modelName;
            
            if (key.provider === 'Custom') {
                document.getElementById('customProviderGroup').style.display = 'block';
                document.getElementById('customProvider').value = key.customProvider;
            }
            
            document.getElementById('apiKeyModal').style.display = 'block';
        }

        async function saveApiKey() {
            const id = document.getElementById('editId').value;
            const provider = document.getElementById('provider').value;
            const customProvider = document.getElementById('customProvider').value;
            const apiEndpoint = document.getElementById('apiEndpoint').value;
            const apiKey = document.getElementById('apiKey').value;
            const modelName = document.getElementById('modelName').value;
            const customModel = document.getElementById('customModel').value;

            if (!apiEndpoint || !apiKey) {
                alert('请填写必要信息');
                return;
            }

            const data = {
                provider,
                customProvider: provider === 'custom' ? customProvider : '',
                apiEndpoint,
                apiKey,
                modelName,
                customModel: modelName === 'custom' ? customModel : ''
            };

            try {
                const url = id ? \`\${API_BASE}/api/keys/\${id}\` : \`\${API_BASE}/api/keys\`;
                const method = id ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${authToken}\`
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    throw new Error('保存失败');
                }

                closeModal();
                await loadApiKeys(); // 确保等待加载完成
            } catch (error) {
                alert(error.message);
            }
        }

        function closeModal() {
            document.getElementById('apiKeyModal').style.display = 'none';
            clearModalForm();
        }

        // 监听服务商选择变化
        document.getElementById('provider').addEventListener('change', function() {
            const customGroup = document.getElementById('customProviderGroup');
            customGroup.style.display = this.value === 'custom' ? 'block' : 'none';
        });

        // 监听模型选择变化
        document.getElementById('modelName').addEventListener('change', function() {
            const customGroup = document.getElementById('customModelGroup');
            customGroup.style.display = this.value === 'custom' ? 'block' : 'none';
        });

        // 初始检查登录状态
        checkAuth();
    </script>
</body>
</html>`;

// 添加用于生成 JWT 的函数
async function generateToken(username, env) {
    const encoder = new TextEncoder();
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
        username,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24小时过期
    };

    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));

    // 创建签名密钥
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(env.JWT_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    // 生成签名
    const signature = await crypto.subtle.sign(
        { name: 'HMAC', hash: 'SHA-256' },
        key,
        encoder.encode(headerBase64 + '.' + payloadBase64)
    );

    // 将签名转换为 base64
    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return `${headerBase64}.${payloadBase64}.${signatureBase64}`;
}

// 添加验证 JWT 的函数
async function verifyToken(token, env) {
    try {
        const [headerBase64, payloadBase64, signatureBase64] = token.split('.');
        const encoder = new TextEncoder();

        // 创建验证密钥
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(env.JWT_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );

        // 验证签名
        const isValid = await crypto.subtle.verify(
            { name: 'HMAC', hash: 'SHA-256' },
            key,
            Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0)),
            encoder.encode(headerBase64 + '.' + payloadBase64)
        );

        if (!isValid) return false;

        // 检查是否过期
        const payload = JSON.parse(atob(payloadBase64));
        return payload.exp > Math.floor(Date.now() / 1000);
    } catch (e) {
        console.error('Token verification error:', e);
        return false;
    }
}

// 添加验证请求的中间件
async function authenticateRequest(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }

    const token = authHeader.split(' ')[1];
    return await verifyToken(token, env);
}

export default {
    async fetch(request, env) {
        try {
            const url = new URL(request.url);
            const path = url.pathname;

            // 处理 OPTIONS 请求
            if (request.method === 'OPTIONS') {
                return new Response(null, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    }
                });
            }

            // 处理登录请求
            if (path === '/api/login' && request.method === 'POST') {
                const { username, password } = await request.json();
                if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
                    const token = await generateToken(username, env);
                    return new Response(JSON.stringify({ token }), {
                        headers: { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        }
                    });
                }
                return new Response(JSON.stringify({ error: 'Invalid credentials' }), { 
                    status: 401,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }

            // 处理首页请求
            if (path === '/' || path === '') {
                return new Response(HTML_CONTENT, {
                    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
                });
            }

            // 验证其他 API 请求
            if (path.startsWith('/api/')) {
                const isAuthenticated = await authenticateRequest(request, env);
                if (!isAuthenticated) {
                    return new Response('Unauthorized', { status: 401 });
                }
            }

            // API 路由处理
            if (path === '/api/keys') {
                switch (request.method) {
                    case 'GET':
                        return await listApiKeys(env);
                    case 'POST':
                        return await createApiKey(request, env);
                    default:
                        return new Response('Method not allowed', { status: 405 });
                }
            } else if (path.startsWith('/api/keys/')) {
                const keyId = path.split('/').pop();
                switch (request.method) {
                    case 'GET':
                        return await getApiKey(keyId, env);
                    case 'PUT':
                        return await updateApiKey(keyId, request, env);
                    case 'DELETE':
                        return await deleteApiKey(keyId, env);
                    default:
                        return new Response('Method not allowed', { status: 405 });
                }
            }

            return new Response('Not found', { status: 404 });
        } catch (error) {
            console.error('Error:', error);
            return new Response(JSON.stringify({ error: error.message }), { 
                status: 500,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    }
};

// API 实现函数
async function listApiKeys(env) {
  try {
    const keys = await env.API_KEYS.list();
    const result = [];
    
    // 获取每个 key 的完整数据
    for (const key of keys.keys) {
      const value = await env.API_KEYS.get(key.name);
      if (value) {
        try {
          const parsedValue = JSON.parse(value);
          result.push(parsedValue);
        } catch (e) {
          console.error('Failed to parse key:', key.name, e);
        }
      }
    }
    
    console.log('Retrieved keys:', result); // 添加日志以便调试
    
    return new Response(JSON.stringify(result), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error in listApiKeys:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

async function createApiKey(request, env) {
  const data = await request.json();
  const id = crypto.randomUUID();
  const apiKey = {
    id,
    provider: data.provider,
    customProvider: data.customProvider,
    apiEndpoint: data.apiEndpoint,
    apiKey: data.apiKey,
    modelName: data.modelName,
    customModel: data.customModel,
    created: new Date().toISOString(),
    lastUsed: null
  };
  
  await env.API_KEYS.put(id, JSON.stringify(apiKey));
  return new Response(JSON.stringify(apiKey), {
    status: 201,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function getApiKey(id, env) {
  const apiKey = await env.API_KEYS.get(id);
  if (!apiKey) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(apiKey, {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function updateApiKey(id, request, env) {
  const exists = await env.API_KEYS.get(id);
  if (!exists) {
    return new Response('Not found', { status: 404 });
  }

  const data = await request.json();
  const apiKey = JSON.parse(exists);
  
  // 更新字段
  apiKey.provider = data.provider;
  apiKey.customProvider = data.customProvider;
  apiKey.apiEndpoint = data.apiEndpoint;
  apiKey.apiKey = data.apiKey;
  apiKey.modelName = data.modelName;
  apiKey.customModel = data.customModel;
  
  await env.API_KEYS.put(id, JSON.stringify(apiKey));
  return new Response(JSON.stringify(apiKey), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function deleteApiKey(id, env) {
  try {
    await env.API_KEYS.delete(id);
    return new Response(null, { 
      status: 204,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE',
        'Access-Control-Allow-Headers': 'Authorization'
      }
    });
  } catch (error) {
    console.error('Error in deleteApiKey:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 辅助函数
function generateApiKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
} 