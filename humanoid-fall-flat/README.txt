Humanoid: Fall Flat 登录和预览内编辑更新

安装
将本包以下 5 个文件放入 UAAD-new/humanoid-fall-flat/：
index.html、admin.html、gallery.js、styles.css、auth.js。
前四个替换同名文件，auth.js 是新文件。
不要替换 works.json、media/、scripts/ 或 .github/。

在 UAAD-new 根目录提交：
git add humanoid-fall-flat/index.html humanoid-fall-flat/admin.html humanoid-fall-flat/gallery.js humanoid-fall-flat/styles.css humanoid-fall-flat/auth.js
git commit -m "Add persistent sign-in and artwork editing"
git push origin main

等 GitHub 部署完成，再按 Command + Shift + R 强制刷新。

使用
1. 点击 Manage archive 旁边的 Sign in，输入原密码 happyfailing。
2. 登录后 Sign in 会变成 Log out。刷新、返回 Gallery、进入管理端都不必重复输入密码，直到主动退出。清理浏览器数据或换浏览器需重新登录。
3. 打开任何作品，在预览中点击 Edit work，修改标题、Description 和 Tags。多个标签用英文逗号分隔，也会提示已有标签。
4. Save changes 会立即更新当前作品信息，不重新加载正在播放的视频。
5. 退出时关闭作品预览，点击 Manage archive 旁的 Log out。管理页面的 Return to gallery 旁也有 Log out。

保存和发布
编辑内容保存在当前浏览器，按作品 ID 关联，刷新和退出登录不会清除。
这不是跨设备在线保存。自动扫描 media/ 的流程仍照常运行，但不会读取浏览器里的编辑。
若要让所有访客看到你的修改：先 Save changes，再点编辑区的 Download works.json，把下载文件替换到 humanoid-fall-flat/works.json，并提交推送。无需手动改 JSON。
已有本地上传文件仍须使用管理端 Export archive 导出；单独 Download works.json 不包含浏览器上传的媒体文件。

本次只增加现有静态站的简易前端密码入口和本地登录状态，不是服务端身份验证或 GitHub 登录。密码输入已遮蔽，不把密码本身写进登录状态存储。

基于你定稿的 gallery(1).js、index(4).html、styles.css 和 admin.html 修改。作品布局、卡片渲染和原 CSS 保留，新增样式仅作用于登录和编辑控件。

验证
JavaScript 语法检查通过。7 项逻辑测试通过：错误密码、密码遮蔽、登录保持、退出、直接访问管理端、编辑保留媒体和 ID、新作品不被旧草稿覆盖、布局渲染不变等。
当前环境未能运行真实浏览器的端到端检查，安装后请先用一件作品试改并刷新确认。
