### 利用Cloudflare Worker部署一个API-KEY管理器

1. **打开Cloudflare，创建一个Worker**
   - 登录到您的Cloudflare账户。
   - 点击“Workers”选项卡，然后点击“Create a service”按钮。
   - 输入任意名称作为Worker的名称，例如`my-worker`，然后点击“Continue”。
   - 在编辑器中，删除默认生成的代码。

2. **复制index.js文件代码**
   - 将您的`index.js`文件内容复制粘贴到Worker编辑器中。

3. **创建一个KV空间**
   - 返回Cloudflare控制台主页。
   - 点击“Workers”选项卡，然后点击“KV”子菜单下的“Create namespace”按钮。
   - 输入命名空间名称，例如`apikey_kv`，然后点击“Create”。

4. **设置Worker变量**
   - 回到您的Worker服务页面。
   - 点击“Settings”选项卡，然后选择“Variables” -> “Environment variables”。
   - 添加以下环境变量：
     | 名称             | 值                      |
     |------------------|-------------------------|
     | ADMIN_PASSWORD   | 您的登录密码            |
     | ADMIN_USERNAME   | 您的登录用户名          |
     | JWT_SECRET       | 随便起                  |

5. **绑定KV空间**
   - 继续在Worker服务页面的“Settings”选项卡下。
   - 选择“Variables” -> “KV Namespaces”。
   - 点击“Add binding”，输入绑定名称为`API_KEYS`，并将之前创建的KV空间`apikey_kv`关联起来。

6. **访问Worker自动生成的域进行登录**
   - 返回到Worker服务页面顶部，找到并点击“Quick edit”旁边的URL链接。
   - 使用您设置的`ADMIN_USERNAME`和`ADMIN_PASSWORD`进行登录。
   - 登录成功后，您可以添加您的API-KEY了。
