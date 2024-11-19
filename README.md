### 利用Cloudflare Worker部署一个API-KEY管理器

1. **打开Cloudflare，创建一个Worker**
   - 登录到您的Cloudflare账户。
   - 点击“Workers 和 Pages”选项卡，然后点击创建按钮，创建一个worker
   - 输入任意名称作为Worker的名称，例如`my-worker`，然后点击“Continue”。
   - 点击编辑代码，在编辑器中，删除默认生成的代码。

2. **复制index.js文件代码**
   - 将上面的[index.js](https://github.com/fengshengbanxia/API-KEY/blob/main/index.js)文件内容复制粘贴到Worker编辑器中。

3. **创建一个KV空间**
   - 返回Cloudflare控制台主页。
   - 点击“Workers 和 Pages”选项卡，然后点击子菜单下的“KV”按钮创建一个KV空间。
   - 输入命名空间名称，例如`apikey_kv`，然后点击“Create”。

4. **设置Worker变量**
   - 回到您的Worker服务页面。
   - 点击设置选项卡，然后选择“变量和机密” -> 添加。
   - 添加以下环境变量：
     | 名称             | 值                      |
     |------------------|-------------------------|
     | ADMIN_PASSWORD（必须）   | 您的登录密码            |
     | ADMIN_USERNAME（必须）   | 您的登录用户名          |
     | JWT_SECRET（必须）       | 随便起任意                  |

5. **绑定KV空间**
   - 继续在Worker服务页面的设置选项卡下。
   - 选择绑定 -> 添加->`KV 命名空间`。
   - 输入变量名称为`API_KEYS`，并选择将之前创建的KV空间`apikey_kv`关联起来。

6. **访问Worker自动生成的域进行登录**
   - 返回到Worker服务页面顶部，在设置中域和路由，用workers.dev值也就是中国wokers的域进行访问。
   - 使用您设置的`ADMIN_USERNAME`和`ADMIN_PASSWORD`进行登录。
   - 登录成功后，您可以添加您的API-KEY了。

7. **创建新的 API Key**
   - 创建新的API Key后可能不会马上显示在列表中，等几秒，或者刷新一下就好了。

8. **界面展示**
   ![image.png](https://tgpicture.6666689.xyz/file/1732016997908_image.png)
   ![image.png](https://tgpicture.6666689.xyz/file/1732017092874_image.png)
   ![image](https://github.com/user-attachments/assets/3cabd859-6d43-4ed9-ba12-41b0c13d15b4)
