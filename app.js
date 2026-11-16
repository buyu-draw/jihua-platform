    /* ---------------- 数据 ---------------- */
    /* ================= 主题：浅色 / 深色（选择保存在本地，刷新后保持） ================= */
    const THEME_KEY = "jihua-theme";
    const themeButtons = document.querySelectorAll("[data-theme-set]");

    function applyTheme(theme) {
      document.documentElement.dataset.theme = theme;
      themeButtons.forEach(b => b.classList.toggle("on", b.dataset.themeSet === theme));
    }

    const THEME_BG = { dark: "#131512", light: "#eef1f1" };
    const THEME_RGB = { dark: "19, 21, 18", light: "238, 241, 241" };
    /* 水面波形：按周期拼接，横向平移半幅后正好无缝衔接 */
    function wavePath(width, height, amp, period) {
      const mid = height / 2;
      let d = `M0,${mid}`;
      for (let x = 0; x < width; x += period) {
        d += ` Q${x + period * .25},${mid - amp} ${x + period * .5},${mid}`;
        d += ` Q${x + period * .75},${mid + amp} ${x + period},${mid}`;
      }
      return d + ` L${width},${height} L0,${height} Z`;
    }

    /* 注水过渡：液面自底部涨起，水柱随之缩短，铺满后换主题再淡出 */
    function playInkWipe(theme) {
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const old = document.querySelector(".ink-wipe");
      if (old) old.remove();
      const wipe = document.createElement("div");
      wipe.className = "ink-wipe";
      wipe.dataset.themeTarget = theme;
      wipe.style.setProperty("--wipe-bg", THEME_BG[theme]);
      wipe.style.setProperty("--wipe-rgb", THEME_RGB[theme]);
      wipe.style.setProperty("--wipe-hl", theme === "dark" ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.10)");
      const crest = (cls, amp, period) =>
        `<svg class="iw-crest ${cls}" viewBox="0 0 2400 160" preserveAspectRatio="none">` +
        `<path d="${wavePath(2400, 160, amp, period)}"></path></svg>`;
      wipe.innerHTML =
        `<div class="iw-liquid">` +
        crest("back", 34, 400) + crest("", 46, 300) +
        `<div class="iw-body"></div>` +
        `</div>` +
        `<div class="iw-stream" style="--sx:40%;--sw:9vw"></div>` +
        `<div class="iw-stream" style="--sx:61%;--sw:4vw;--sd:.05s;opacity:.85"></div>`;
      document.body.appendChild(wipe);
      setTimeout(() => applyTheme(theme), 1100);
      setTimeout(() => wipe.classList.add("fade"), 1160);
      setTimeout(() => wipe.remove(), 1680);
    }

    function setTheme(theme) {
      if (document.documentElement.dataset.theme === theme) return;
      playInkWipe(theme);
      try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* 隐私模式下忽略 */ }
    }

    (function initTheme() {
      let saved = "dark";
      try { saved = localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark"; } catch (e) { }
      applyTheme(saved);
    })();

    document.getElementById("themeSwitch").addEventListener("click", e => {
      const btn = e.target.closest("[data-theme-set]");
      if (btn) setTheme(btn.dataset.themeSet);
    });

    const IMG = (p, size) =>
      "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=" + p + "&image_size=" + size;

    const artworks = [
      {
        t: "花朝月夕", a: "砚青", s: "原创", likes: 1284,
        img: IMG("anime%20illustration%20of%20a%20girl%20in%20traditional%20chinese%20hanfu%20under%20cherry%20blossom%20tree%2C%20soft%20pastel%20colors%2C%20detailed%20digital%20painting", "portrait_4_3"),
        tags: ["古风", "原创角色"]
      },
      {
        t: "霓虹雨夜", a: "KANA", s: "插画",
        likes: 976,
        img: IMG("anime%20style%20night%20cityscape%20with%20neon%20lights%20and%20rain%2C%20cinematic%20illustration", "portrait_4_3"),
        tags: ["赛博", "场景"]
      },
      {
        t: "云端之城", a: "木野", s: "风景",
        likes: 742,
        img: IMG("watercolor%20fantasy%20landscape%20with%20floating%20castle%20and%20clouds%2C%20dreamy%20atmosphere", "portrait_4_3"),
        tags: ["水彩", "幻想"]
      },
      {
        t: "刀与黄昏", a: "白鸦", s: "同人",
        likes: 1533,
        img: IMG("anime%20boy%20with%20katana%20standing%20on%20rooftop%20at%20sunset%2C%20dramatic%20lighting%2C%20digital%20art", "portrait_4_3"),
        tags: ["热血", "同人"]
      }
    ];

    const artists = [
      {
        n: "砚青", role: "插画 / 古风", st: "open", stText: "可接单", price: 480,
        range: "￥480 - 2600", desc: "擅长古风与角色立绘，可商用，提供分层 PSD，平日 3-7 天交稿。"
      },
      {
        n: "KANA", role: "场景 / 赛博", st: "busy", stText: "档期紧张", price: 1200,
        range: "￥1200 - 5000", desc: "专注夜景与科幻场景，接受大尺寸印刷用途，需提前两周预约。"
      },
      {
        n: "木野", role: "水彩 / Q版", st: "open", stText: "可接单", price: 260,
        range: "￥260 - 900", desc: "治愈系水彩风格，Q 版头像与表情包定制，加急可议。"
      }
    ];

    const goods = [
      {
        t: "《花朝月夕》设定集", sub: "精装 · 128P · 全彩", p: 168, hot: "限定",
        img: IMG("art%20book%20and%20sketchbook%20with%20colorful%20illustrations%20on%20a%20wooden%20desk%2C%20product%20photography", "square_hd")
      },
      {
        t: "亚克力立牌 · 霓虹系列", sub: "15cm · 双面印刷", p: 68, hot: "热卖",
        img: IMG("acrylic%20stand%20and%20badge%20merchandise%20of%20cute%20anime%20characters%20on%20a%20desk%2C%20product%20photo%2C%20soft%20light", "square_hd")
      },
      {
        t: "帆布托特包 · 云端之城", sub: "加厚 · 大容量", p: 89, hot: "",
        img: IMG("canvas%20tote%20bag%20with%20cute%20hand%20drawn%20illustration%2C%20product%20photo%2C%20studio%20lighting", "square_hd")
      },
      {
        t: "亚克力钥匙扣套装", sub: "5 枚入 · 盲盒款", p: 45, hot: "新品",
        img: IMG("set%20of%20acrylic%20keychains%20with%20anime%20character%20art%2C%20close%20up%20product%20photo", "square_hd")
      }
    ];

    /* 登录入口：集思广益（交易大厅） / 集梦 / 个人主页 */
    const ENTRY_DEF = {
      hall: { name: "集思广益", panel: "hall", desc: "进入交易大厅，发起需求、承接委托" },
      dream: { name: "集梦", panel: "dream", desc: "把脑海里未成形的画面，一点点画出来" },
      profile: { name: "个人主页", panel: "profile", desc: "作品、需求、橱窗与工作台都在这里" }
    };

    /* ================= DOM 访问层（统一缓存，降低 DOM 查询频率） ================= */
    /* 按 id 查询并缓存元素引用；节点被整体重绘移除时（isConnected=false）自动重新查询 */
    const domCache = new Map();
    function $id(id) {
      let el = domCache.get(id);
      if (!el || !el.isConnected) {
        el = document.getElementById(id);
        if (el) domCache.set(id, el);
      }
      return el;
    }

    /* 静态元素集合只在启动时查询一次：这些节点在运行期只改属性，不会被整体替换 */
    const tabButtons = document.querySelectorAll(".tab");
    const panelEls = document.querySelectorAll(".panel");

    /* ---------------- 渲染 ---------------- */
    const artGrid = $id("artGrid");
    artGrid.innerHTML = artworks.map((w, i) => `
  <article class="card art">
    <div class="thumb">
      <img src="${w.img}" alt="${w.t}" loading="lazy" />
      <span class="badge">${w.s}</span>
    </div>
    <div class="body">
      <h3>${w.t}</h3>
      <div class="meta">
        <span>@${w.a}</span>
        <button class="like" data-like="${i}">♥ <i style="font-style:normal">${w.likes}</i></button>
      </div>
      <div class="tags">${w.tags.map(t => `<span class="tag-pill"># ${t}</span>`).join("")}</div>
    </div>
  </article>
`).join("");

    const commissionGrid = $id("commissionGrid");
    commissionGrid.innerHTML = artists.map(a => `
  <article class="card artist" data-visit="${a.n}" title="查看 ${a.n} 的个人主页">
    <div class="top">
      <div class="avatar">${a.n.slice(0, 1)}</div>
      <div>
        <h3 class="name">${a.n}</h3>
        <div class="role-line">${a.role}</div>
      </div>
      <span class="status ${a.st}">${a.stText}</span>
    </div>
    <div class="body">
      <p class="desc">${a.desc}</p>
      <div class="price-row">
        <span class="price">￥${a.price}</span>
        <span class="price-unit">起</span>
        <span class="range">${a.range}</span>
      </div>
      <button class="btn sm" data-invite="${a.n}">邀请约稿</button>
    </div>
  </article>
`).join("");

    const goodsGrid = $id("goodsGrid");
    goodsGrid.innerHTML = goods.map((g, i) => `
  <article class="card good">
    <div class="thumb">
      <img src="${g.img}" alt="${g.t}" loading="lazy" />
      ${g.hot ? `<span class="hot">${g.hot}</span>` : ""}
    </div>
    <div class="body">
      <h3>${g.t}</h3>
      <p class="sub">${g.sub}</p>
      <div class="buy">
        <span class="p">￥${g.p}<small></small></span>
        <button class="add" data-add="${i}">加入购物车</button>
      </div>
    </div>
  </article>
`).join("");

    /* 造梦：梦境片段 */
    const dreams = [
      {
        t: "会飞的鲸鱼", by: "砚青", tag: "奇幻",
        d: "城市上空游过一头鲸，尾鳍扫落成一场小雨。",
        img: IMG("surreal%20illustration%20of%20a%20giant%20whale%20flying%20above%20a%20city%20at%20dusk%2C%20dreamy%20soft%20light", "portrait_4_3")
      },
      {
        t: "凌晨四点的书房", by: "木野", tag: "日常",
        d: "台灯还亮着，纸上的线条自己长成了一片森林。",
        img: IMG("cozy%20study%20room%20at%204am%20with%20warm%20lamp%20and%20sketchbook%2C%20soft%20watercolor%20illustration", "portrait_4_3")
      },
      {
        t: "海的第二层", by: "KANA", tag: "幻想",
        d: "潜到海底，才发现云在下面慢慢飘。",
        img: IMG("underwater%20fantasy%20scene%20with%20clouds%20and%20floating%20islands%2C%20teal%20and%20blue%20tones%2C%20digital%20painting", "portrait_4_3")
      }
    ];

    $id("dreamGrid").innerHTML = dreams.map(d => `
  <article class="dream-card">
    <div class="thumb"><img src="${d.img}" alt="${d.t}" loading="lazy" /></div>
    <div class="body">
      <h3>${d.t}</h3>
      <p>${d.d}</p>
      <span class="dream-tag"># ${d.tag} · @${d.by}</span>
    </div>
  </article>
`).join("");

    /* ---------------- 交互 ---------------- */
    const toastEl = $id("toast");

    /* ================= 应用级状态 ================= */
    const appState = { entry: null, nick: "", avatar: "", cartCount: 0, toastTimer: 0 };

    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(appState.toastTimer);
      appState.toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2000);
    }

    /* 入口选择：三选一，登录后进入对应面板 */
    const entryButtons = document.querySelectorAll("[data-entry]");
    function selectEntry(btn) {
      appState.entry = btn.dataset.entry;
      entryButtons.forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      $id("loginBtn").textContent = "进入" + ENTRY_DEF[appState.entry].name + " →";
    }
    entryButtons.forEach(btn => btn.addEventListener("click", () => selectEntry(btn)));

    /* 登录 */
    $id("loginBtn").addEventListener("click", () => {
      if (!appState.entry) { toast("请先选择一个入口"); return; }
      const nick = $id("nickname").value.trim();
      if (!nick) { toast("请输入昵称"); return; }
      appState.nick = nick;
      appState.avatar = nick.slice(0, 1).toUpperCase();

      $id("meAv").textContent = appState.avatar;
      $id("meNick").textContent = nick;
      $id("pfAvatar").textContent = appState.avatar;
      $id("pfName").textContent = nick + "的主页";
      renderProfile();
      renderDemandPlaza();

      switchTab(ENTRY_DEF[appState.entry].panel);

      const auth = $id("auth");
      const app = $id("app");
      auth.classList.add("hide");
      setTimeout(() => { auth.style.display = "none"; app.classList.add("show"); window.scrollTo(0, 0); }, 380);
      toast("欢迎回来，" + nick);
    });

    /* 顶部「我」：随时回到个人主页（从访客视角回到自己） */
    $id("meChip").addEventListener("click", () => {
      pfState.visitor = null;
      pfState.tab = "works";
      renderProfile();
      switchTab("profile");
    });

    /* 退出 */
    $id("logoutBtn").addEventListener("click", () => {
      const auth = $id("auth");
      const app = $id("app");
      app.classList.remove("show");
      auth.style.display = "";
      requestAnimationFrame(() => auth.classList.remove("hide"));
      window.scrollTo(0, 0);
    });

    /* Tab 切换：activeTab 用于「个人主页 → 工作台」时仍高亮个人主页 */
    function switchTab(name, activeTab) {
      const mark = activeTab || name;
      tabButtons.forEach(t => t.classList.toggle("active", t.dataset.panel === mark));
      panelEls.forEach(p => p.classList.toggle("active", p.id === "panel-" + name));
    }

    /* 窄屏导航栏展开状态：tab 点击与空白处点击共用 */
    function setNavOpen(open) {
      $id("tabs").classList.toggle("open", open);
    }

    $id("tabs").addEventListener("click", e => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      if (tab.dataset.panel === "profile" && pfState.visitor) {
        pfState.visitor = null;
        pfState.tab = "works";
        renderProfile();
      }
      switchTab(tab.dataset.panel);
      setNavOpen(false);   /* 窄屏：点了 tab 自动收起下拉菜单 */
    });

    /* 汉堡菜单：点击展开/收起 */
    $id("navHam").addEventListener("click", () => {
      $id("tabs").classList.toggle("open");
    });
    /* 点击空白处收起汉堡菜单 */
    document.addEventListener("click", e => {
      if (!e.target.closest("header.nav")) setNavOpen(false);
    });

    /* 交易大厅：侧边栏分区切换（约稿 / 约文 / 约制品） */
    $id("hallSide").addEventListener("click", e => {
      const item = e.target.closest("[data-hall]");
      if (!item) return;
      document.querySelectorAll(".hall-item").forEach(b => b.classList.toggle("on", b === item));
      document.querySelectorAll(".hall-view").forEach(v => {
        v.classList.toggle("active", v.id === "hall-" + item.dataset.hall);
      });
    });

    /* 点赞 */
    artGrid.addEventListener("click", e => {
      const btn = e.target.closest(".like");
      if (!btn) return;
      const num = btn.querySelector("i");
      const on = btn.classList.toggle("on");
      num.textContent = Number(num.textContent) + (on ? 1 : -1);
    });

    /* 邀请约稿 */
    commissionGrid.addEventListener("click", e => {
      const btn = e.target.closest("[data-invite]");
      if (btn) toast("已向画师 " + btn.dataset.invite + " 发送约稿邀请");
    });

    /* 购物车 */
    const cartBadge = $id("cartBadge");
    goodsGrid.addEventListener("click", e => {
      const btn = e.target.closest("[data-add]");
      if (!btn) return;
      appState.cartCount++;
      cartBadge.textContent = appState.cartCount;
      toast("已加入购物车（共 " + appState.cartCount + " 件）");
    });
    $id("cartBtn").addEventListener("click", () => {
      toast(appState.cartCount ? "购物车共 " + appState.cartCount + " 件商品" : "购物车还是空的");
    });

    /* 提交约稿 */
    $id("submitCommission").addEventListener("click", () => {
      const desc = $id("cDesc").value.trim();
      if (!desc) { toast("请填写需求描述"); return; }
      toast("约稿需求已提交，等待画师回复");
      $id("cDesc").value = "";
    });

    /* 工作台模式：排单工作台（画师） / 订单工作台（商家），复用同一看板 */
    function openWorkbench(mode) {
      const isMerchant = mode === "merchant";
      $id("wbTitle").textContent = isMerchant ? "订单工作台" : "排单工作台";
      $id("wbDesc").textContent = isMerchant
        ? "承接来自创作者的订单，左侧两块分别管理「进行中的订单」与「待确认订单」，点击任意订单即可查看完整诉求并即时沟通"
        : "左侧两块分别管理「正在排单」与「正在预约」，点击任意买家即可查看完整诉求并即时对话";
      switchTab("workbench", "profile");
    }

    /* ================= 排单工作台（画师） ================= */
    const orders = {
      working: [
        {
          id: "w1", name: "星野凛", type: "立绘 · 半身", budget: 800, due: "11-05",
          date: "2026-10-12 下单", progress: 62, stage: "绘制中", pillClass: "warn",
          tags: ["商用授权", "分层 PSD", "加急"],
          demand: {
            chars: "原创角色「星见遥」，18 岁少女，银白色长发及腰，左眼下方有星形纹样。气质冷静，但希望表情带一点若有若无的笑意。",
            usage: "用于个人企划周边（吧唧 / 立牌）印刷，需商用授权，不用于游戏或广告投放。",
            deliver: "交付分层 PSD + 300dpi 成品图，尺寸 2000×3000，含线稿层、上色层、背景层。",
            extra: "上色偏冷调，希望保留笔触感，不要过度光滑。参考图见下方。"
          },
          refs: [IMG("anime%20girl%20character%20design%20sheet%20with%20silver%20long%20hair%20and%20star%20mark%20under%20eye", "square")],
          msgs: [
            { me: false, t: "老师，草稿我看过了～肩膀再窄一点点可以吗？", time: "昨天 21:04" },
            { me: true, t: "收到，我今天下午改好发你确认。", time: "昨天 21:20" },
            { me: false, t: "好，另外纹样稍微往眼角靠一些，谢谢老师！", time: "昨天 21:22" }
          ]
        },
        {
          id: "w2", name: "阿七", type: "Q 版头像 ×2", budget: 300, due: "11-02",
          date: "2026-10-15 下单", progress: 35, stage: "线稿确认", pillClass: "",
          tags: ["头像", "商用", "加急"],
          demand: {
            chars: "两张 Q 版头像，角色为我和朋友的原创设定：一位粉发双马尾、一位黑发狼耳。要求表情活泼、色系统一。",
            usage: "用于社交平台头像与个人企划封面，可商用。",
            deliver: "交付 PNG 透明底 + 白底两版，尺寸 1000×1000。",
            extra: "希望三天内出线稿，我可以先定稿一张。"
          },
          refs: [IMG("cute%20chibi%20girl%20avatar%20reference%20sheet%2C%20pastel%20colors%2C%20character%20design", "square")],
          msgs: [
            { me: true, t: "线稿已发你，看看发型还需要调整吗？", time: "今天 10:12" },
            { me: false, t: "看啦，第二张的耳朵再大一点点～", time: "今天 10:30" }
          ]
        },
        {
          id: "w3", name: "沈知白", type: "场景插画", budget: 2600, due: "11-12",
          date: "2026-10-08 下单", progress: 15, stage: "草稿阶段", pillClass: "",
          tags: ["大场景", "印刷用途", "需分层"],
          demand: {
            chars: "雨夜中的古镇长街，青石板反光，两侧灯笼与店招，画面中段有一位撑伞的背影人物。",
            usage: "用于同人画集内页与海报印刷，印量 500 份以内。",
            deliver: "交付 4000×2600 成品图 + 分层文件，需预留出血。",
            extra: "氛围要偏冷蓝紫，灯笼的暖光作为唯一暖色光源。"
          },
          refs: [IMG("moodboard%20of%20rainy%20ancient%20chinese%20town%20street%20at%20night%20reference%20photos", "square")],
          msgs: [
            { me: false, t: "构图我很喜欢，人物可以再往右下挪一点吗？", time: "10-16 20:41" },
            { me: true, t: "可以，明天出第二版草稿给你。", time: "10-16 21:05" }
          ]
        }
      ],
      booking: [
        {
          id: "b1", name: "洛洛", type: "服装三视图", budget: 900, due: "11-20",
          date: "2026-10-18 提交", progress: -1, stage: "待确认报价", pillClass: "warn",
          tags: ["原创服装", "可商用"],
          demand: {
            chars: "原创幻想风格女装一套：短披肩 + 束腰长裙，主题元素为「铃兰与月光」，需正 / 侧 / 背三视图。",
            usage: "用于角色设定集与人台打样，需要可商用授权。",
            deliver: "三视图 3000×2000，附正背彩稿与线稿各一份。",
            extra: "如果工期紧张，可以只先出正面与背面。"
          },
          refs: [IMG("fashion%20design%20reference%20sheet%20of%20fantasy%20outfit%20with%20silver%20flower%20theme%2C%20sketches", "square")],
          msgs: [
            { me: false, t: "老师您好，想问一下这套服装三视图大概多久可以出？", time: "10-18 15:02" },
            { me: false, t: "预算 900 左右，可以的话我今天就付定金～", time: "10-18 15:04" }
          ]
        },
        {
          id: "b2", name: "北溟", type: "双人立绘", budget: 1800, due: "12-01",
          date: "2026-10-19 提交", progress: -1, stage: "排队中", pillClass: "",
          tags: ["双人", "生日企划"],
          demand: {
            chars: "两位原创角色合影：一高一矮，坐在天台边缘看夜景，气氛温柔。参考图里有两人的设定稿。",
            usage: "用于生日企划展示与个人收藏，不商用。",
            deliver: "交付 3500×2000 成品图，可加水印版本。",
            extra: "截止日期是 12-01，希望能在那之前完成，愿意加急费用。"
          },
          refs: [IMG("two%20original%20characters%20couple%20reference%20sheet%20with%20fantasy%20costumes", "square")],
          msgs: [
            { me: false, t: "老师您好，看到您档期排到 11 月下旬，我这边 12-01 之前能排上吗？", time: "10-19 09:40" },
            { me: true, t: "可以的，我先看下需求，稍后给你准确档期。", time: "10-19 09:52" }
          ]
        },
        {
          id: "b3", name: "小野", type: "表情包 ×8", budget: 500, due: "11-15",
          date: "2026-10-19 提交", progress: -1, stage: "待回复", pillClass: "danger",
          tags: ["Q 版", "表情包"],
          demand: {
            chars: "8 张 Q 版表情包，角色为同一只猫系原创角色，情绪包含开心 / 生气 / 委屈 / 吃饱等。",
            usage: "用于社群表情包发布，可商用。",
            deliver: "PNG 透明底，512×512，附一套动图帧的可选报价。",
            extra: "如果可以做微信表情包上架规格就更好啦。"
          },
          refs: [IMG("sticker%20sheet%20of%20cute%20chibi%20cat%20character%20expressions%20reference", "square")],
          msgs: [
            { me: false, t: "老师，想问一下表情包 8 张 500 可以吗？", time: "10-19 22:11" }
          ]
        }
      ]
    };

    const wbWorking = $id("wbWorking");
    const wbBooking = $id("wbBooking");
    const wbDetail = $id("wbDetail");
    const chatReplyPool = [
      "好的老师～那就按这个方案来！",
      "收到！我这边随时可以确认，麻烦老师了。",
      "嗯嗯，谢谢老师，期待成品～",
      "没问题，那就这么定啦！"
    ];

    /* ================= 排单工作台状态 ================= */
    const wbState = { curOrder: null };

    function findOrder(id) {
      return orders.working.concat(orders.booking).find(o => o.id === id) || null;
    }
    function nowLabel() {
      const d = new Date();
      return "今天 " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    }
    const msgHtml = m => `<div class="msg ${m.me ? "me" : "them"}">${m.t}<span class="time">${m.time}</span></div>`;

    function orderCard(o) {
      return `
    <button class="order" data-id="${o.id}">
      <div class="row1">
        <span class="av">${o.name.slice(0, 1)}</span>
        <div>
          <div class="bname">${o.name}</div>
          <div class="btype">${o.type} · ${o.date}</div>
        </div>
        <span class="money">￥${o.budget}</span>
      </div>
      <div class="row2">
        <span class="mini-pill">交稿 ${o.due}</span>
        <span class="mini-pill ${o.pillClass}">${o.stage}</span>
      </div>
      <div class="row3">${o.tags.map(t => `<span class="mini-pill">${t}</span>`).join("")}</div>
      ${o.progress >= 0 ? `<div class="bar"><i class="${o.progress >= 100 ? "done" : ""}" style="width:${o.progress}%"></i></div>` : ""}
    </button>`;
    }

    function renderBoards() {
      wbWorking.innerHTML = orders.working.map(orderCard).join("") || `<div class="empty-note">暂无进行中的排单</div>`;
      wbBooking.innerHTML = orders.booking.map(orderCard).join("") || `<div class="empty-note">暂无预约申请</div>`;
      $id("wbCountWorking").textContent = orders.working.length + " 单";
      $id("wbCountBooking").textContent = orders.booking.length + " 单";
      document.querySelectorAll(".order").forEach(b => b.classList.toggle("active", !!wbState.curOrder && b.dataset.id === wbState.curOrder.id));
    }

    /* ---------- 订单详情（按区块拆成多个渲染片段，便于单独调整） ---------- */
    /* 顶部：买家头像 / 名称 / 日期 / 状态徽标 */
    function detailHeader(o, isBooking) {
      return `
    <div class="buyer-head">
      <div class="av">${o.name.slice(0, 1)}</div>
      <div>
        <h3>${o.name}</h3>
        <div class="sub">${o.date} · ${o.type}</div>
      </div>
      <span class="status ${isBooking ? "busy" : "open"}" style="margin-left:auto">${o.stage}</span>
    </div>

    <div class="buyer-facts">
      <div class="f">预算<b>￥${o.budget}</b></div>
      <div class="f">交稿日期<b>${o.due}</b></div>
      <div class="f">${isBooking ? "当前状态" : "当前进度"}<b>${isBooking ? "待排期" : o.progress + "%"}</b></div>
    </div>`;
    }

    /* 中部：买家诉求与参考图 */
    function detailDemand(o) {
      const d = o.demand;
      const refs = o.refs && o.refs.length
        ? `<div class="refs">${o.refs.map(r => `<img src="${r}" alt="参考图" loading="lazy" />`).join("")}</div>`
        : "";
      return `
    <div class="demand">
      <h4>买家诉求</h4>
      <p>${d.chars}</p>
      ${refs}
      <p><b>用途与授权：</b>${d.usage}</p>
      <p><b>交付要求：</b>${d.deliver}</p>
      <p><b>备注：</b>${d.extra}</p>
    </div>`;
    }

    /* 操作区：预约状态给出接单/报价/婉拒，进行中给出交付/更新进度 */
    function detailActions(isBooking) {
      return `
    <div class="wb-actions">
      ${isBooking
          ? `<button class="btn sm" data-act="accept">接单并排期</button>
           <button class="btn ghost sm" data-act="quote">发送报价</button>
           <button class="btn ghost sm" data-act="reject">婉拒</button>`
          : `<button class="btn sm" data-act="deliver">提交交付</button>
           <button class="btn ghost sm" data-act="progress">更新进度</button>`}
    </div>`;
    }

    /* 底部：即时对话区（画师可在对话中发出「开始交易」邀请） */
    function detailChat(o) {
      return `
    <div class="chat">
      <div class="chat-head">
        <h4>即时对话</h4>
        ${o.deal
          ? `<span class="deal-badge">交易中 · ${MODE_DEF[o.deal.mode]}</span>`
          : `<button class="btn ghost xs" data-act="invite">开始交易</button>`}
      </div>
      <div class="chat-log" id="chatLog">${o.msgs.map(msgHtml).join("")}</div>
      <div class="quick">
        <button data-quick="收到，我马上看～">收到，我马上看～</button>
        <button data-quick="草稿已发，麻烦确认一下">草稿已发，请确认</button>
        <button data-quick="预计 3 天内交付">预计 3 天内交付</button>
      </div>
      <div class="chat-send">
        <input id="chatInput" placeholder="输入消息，回车发送…" />
        <button class="btn sm" id="chatSend">发送</button>
      </div>
    </div>`;
    }

    /* 组装详情面板，并让消息列表滚到最新一条 */
    function renderDetail(o) {
      const isBooking = o.progress < 0;
      document.querySelector(".wb").classList.toggle("has-deal", !!o.deal);
      wbDetail.innerHTML =
        `<div class="deal-wrap ${o.deal ? "with-deal" : ""}">
          <div class="deal-main">
            ${detailHeader(o, isBooking) + detailDemand(o) + detailActions(isBooking) + detailChat(o)}
          </div>
          ${o.deal ? renderDealSide(o) : ""}
        </div>`;
      const log = $id("chatLog");
      log.scrollTop = log.scrollHeight;
    }

    function pushMsg(m) {
      wbState.curOrder.msgs.push(m);
      const log = $id("chatLog");
      if (!log) return;
      log.insertAdjacentHTML("beforeend", msgHtml(m));
      log.scrollTop = log.scrollHeight;
    }

    function sendMsg(text) {
      if (!wbState.curOrder) return;
      const input = $id("chatInput");
      const val = (text !== undefined ? text : input.value).trim();
      if (!val) return;
      pushMsg({ me: true, t: val, time: nowLabel() });
      if (input) input.value = "";

      const target = wbState.curOrder;
      setTimeout(() => {
        if (!wbState.curOrder || wbState.curOrder.id !== target.id) return;
        pushMsg({ me: false, t: chatReplyPool[Math.floor(Math.random() * chatReplyPool.length)], time: nowLabel() });
      }, 1100);
    }

    /* ---------- 订单动作表：一个动作一个独立处理函数，新增动作只需追加一项 ---------- */
    const orderActions = {
      /* 接单：从预约移入正在排单 */
      accept(o) {
        orders.booking = orders.booking.filter(x => x.id !== o.id);
        o.progress = 10;
        o.stage = "已接单";
        o.pillClass = "warn";
        orders.working.unshift(o);
        toast("已接单：" + o.name + "，已加入正在排单");
      },
      /* 报价：发送报价单消息 */
      quote(o) {
        sendMsg("报价单已发送：￥" + o.budget + "，含 " + o.demand.deliver.slice(0, 12) + "…");
        toast("已向 " + o.name + " 发送报价单");
      },
      /* 婉拒：移除预约并清空详情（清空 wbState.curOrder 后不再重新渲染详情） */
      reject(o) {
        orders.booking = orders.booking.filter(x => x.id !== o.id);
        wbState.curOrder = null;
        renderBoards();
        document.querySelector(".wb").classList.remove("has-deal");
        wbDetail.innerHTML = `<div class="empty">已婉拒该预约<br />点击左侧买家卡片查看其他诉求</div>`;
        toast("已婉拒 " + o.name + " 的预约");
      },
      /* 交付：进度置满并转入待验收 */
      deliver(o) {
        o.progress = 100;
        o.stage = "待验收";
        o.pillClass = "ok";
        toast("已向 " + o.name + " 提交交付");
      },
      /* 推进进度：每次 +15%，满 100% 自动转待验收 */
      progress(o) {
        o.progress = Math.min(100, o.progress + 15);
        if (o.progress >= 100) { o.stage = "待验收"; o.pillClass = "ok"; }
        toast("进度已更新为 " + o.progress + "%");
      },
      /* 开始交易：画师在对话中发出邀请，由金主确认模式与商品 */
      invite(o) {
        openTradeModal(o);
      }
    };

    function doAction(act) {
      if (!wbState.curOrder) return;
      const handler = orderActions[act];
      if (!handler) return;
      const o = wbState.curOrder;
      handler(o);
      if (o !== wbState.curOrder) return;   /* 婉拒后 wbState.curOrder 已清空，无需再渲染详情 */
      renderBoards();
      renderDetail(o);
    }

    document.querySelector(".wb").addEventListener("click", e => {
      const card = e.target.closest(".order");
      if (!card) return;
      wbState.curOrder = findOrder(card.dataset.id);
      if (!wbState.curOrder) return;
      renderBoards();
      renderDetail(wbState.curOrder);
    });

    wbDetail.addEventListener("click", e => {
      const q = e.target.closest("[data-quick]");
      if (q) { sendMsg(q.dataset.quick); return; }
      const act = e.target.closest("[data-act]");
      if (act) { doAction(act.dataset.act); return; }
      if (e.target.id === "chatSend") sendMsg();
    });

    wbDetail.addEventListener("keydown", e => {
      if (e.target.id === "chatInput" && e.key === "Enter") { e.preventDefault(); sendMsg(); }
    });

    renderBoards();

    /* ================= 交易流程：开始交易 + 动态交易进度条 ================= */
    const GOODS_DEF = {
      board: { name: "板绘等虚拟商品", short: "板绘" },
      physical: { name: "手绘 / 包本等实体商品", short: "手绘实体" },
      craft: { name: "周边定制", short: "周边定制" }
    };
    const MODE_DEF = { 1: "精细分阶段", 2: "极速免打扰" };
    const A = (k, label, style = "ghost") => ({ k, label, style });
    const has = (d, slot) => !!(d.files[slot] && d.files[slot].length);
    const artistNick = () => appState.nick || "画师";

    /* 每种「商品 × 模式」对应一条时间轴；节点内的 client / artist 返回该端看到的状态与按钮 */
    const FLOWS = {
      board: {
        1: [
          {
            t: "意向与定金托管", desc: "金主支付定金，由平台托管；画师确认到账后开始创作。",
            client: d => d.flags.paidDeposit
              ? { s: "定金已由平台托管", ok: true }
              : { s: "尚未支付定金", acts: [A("payDeposit", "支付定金 ￥300", "primary")] },
            artist: d => d.flags.paidDeposit
              ? { s: "金主已支付定金，平台托管中", ok: true }
              : { s: "等待金主支付定金" }
          },
          {
            t: "线稿确认", desc: "画师上传线稿（平台自动加水印），金主确认或要求修改。",
            up: [{ slot: "sketch", label: "上传线稿", accept: "image/*", by: "artist", wm: true }],
            client: d => has(d, "sketch")
              ? { s: "线稿已上传，请确认", acts: [A("confirm", "确认线稿", "primary"), A("revise", "要求修改")] }
              : { s: "等待画师上传线稿" },
            artist: d => has(d, "sketch") ? { s: "已上传，等待金主确认" } : { s: "请上传线稿" }
          },
          {
            t: "成图验收", desc: "画师上传成图（带水印），金主确认后平台下发无水印原图。",
            up: [{ slot: "final", label: "上传成图", accept: "image/*", by: "artist", wm: true }],
            client: d => has(d, "final")
              ? (d.flags.originalReleased
                ? { s: "已下发无水印原图", ok: true }
                : { s: "成图已上传，请确认", acts: [A("confirm", "确认成图", "primary"), A("revise", "要求修改")] })
              : { s: "等待画师上传成图" },
            artist: d => has(d, "final")
              ? (d.flags.originalReleased ? { s: "金主已确认，原图已下发", ok: true } : { s: "已上传，等待金主确认" })
              : { s: "请上传成图" }
          },
          {
            t: "结清尾款", desc: "金主支付尾款，平台打款给画师，双方互评。", review: true,
            client: d => d.flags.paidBalance
              ? { s: "尾款已支付，交易完成", ok: true }
              : { s: "待支付尾款", acts: [A("payBalance", "支付尾款 ￥700", "primary")] },
            artist: d => d.flags.paidBalance
              ? { s: "尾款已到账，交易完成", ok: true }
              : { s: "等待金主结清尾款" }
          }
        ],
        2: [
          {
            t: "全款托管", desc: "金主一次性支付全款，并勾选免责协议。",
            agree: "中途不修改，72 小时自动打款",
            client: d => d.flags.paidFull
              ? { s: "全款已托管", ok: true }
              : (d.flags.agreed
                ? { s: "协议已确认，请支付全款", acts: [A("payFull", "支付全款 ￥1000", "primary")] }
                : { s: "请先勾选下方免责协议" }),
            artist: d => d.flags.paidFull ? { s: "全款已托管，可开始创作", ok: true } : { s: "等待金主支付全款" }
          },
          {
            t: "画师直出", desc: "画师闭关创作，无需中途确认，直接上传成图；成图带半透明斜版水印。",
            up: [{ slot: "final", label: "上传成图", accept: "image/*", by: "artist", wm: true }],
            autoNext: true,
            artist: d => has(d, "final") ? { s: "已上传，等待金主确认" } : { s: "请上传成图" },
            client: d => has(d, "final") ? { s: "画师已交付成图", ok: true } : { s: "画师创作中，请耐心等待" }
          },
          {
            t: "自动结算", desc: "金主确认收稿，或 72 小时后系统自动打款；水印自动消失。", review: true, countdown: true,
            client: d => d.flags.settled
              ? { s: "已结算，交易完成", ok: true }
              : { s: "确认收稿后立即打款", acts: [A("confirm", "确认收稿", "primary"), A("autoSettle", "模拟 72 小时到期", "ghost")] },
            artist: d => d.flags.settled
              ? { s: "已收到全款，交易完成", ok: true }
              : { s: "等待金主确认或超时自动结算" }
          }
        ]
      },
      physical: {
        1: [
          {
            t: "意向确认与定金托管", desc: "金主支付定金，由平台托管；到账后画师开始起稿。",
            client: d => d.flags.paidDeposit
              ? { s: "定金已由平台托管", ok: true }
              : { s: "尚未支付定金", acts: [A("payDeposit", "支付定金 ￥300", "primary")] },
            artist: d => d.flags.paidDeposit
              ? { s: "金主已支付定金，平台托管中", ok: true }
              : { s: "等待金主支付定金" }
          },
          {
            t: "草稿确认阶段", desc: "画师上传草稿图片 / 视频，说明草图与排版思路；金主要求修改时会清空已上传内容。",
            up: [{ slot: "draft", label: "上传草稿图片 / 视频", accept: "image/*,video/*", by: "artist" }],
            client: d => has(d, "draft")
              ? { s: "草稿已上传，请确认", acts: [A("confirm", "确认草稿", "primary"), A("revise", "要求修改")] }
              : { s: "等待画师上传草稿" },
            artist: d => has(d, "draft") ? { s: "已上传，等待金主确认" } : { s: "请上传草稿图片 / 视频" }
          },
          {
            t: "成图与实体打包阶段", desc: "画师上传一镜到底的打包视频与成品细节图，金主确认后安排寄出。",
            up: [
              { slot: "packing", label: "上传一镜到底打包视频", accept: "video/*", by: "artist" },
              { slot: "details", label: "上传成品细节图", accept: "image/*", by: "artist" }
            ],
            client: d => (has(d, "packing") && has(d, "details"))
              ? { s: "打包视频与细节图已上传，请确认", acts: [A("confirm", "确认打包无误", "primary"), A("revise", "要求修改")] }
              : { s: "等待画师上传打包视频与细节图" },
            artist: d => (has(d, "packing") && has(d, "details"))
              ? { s: "已上传，等待金主确认" }
              : { s: "请同时上传打包视频与成品细节图" }
          },
          {
            t: "金主验收与尾款托管", desc: "请金主录制开箱视频，该视频将作为申诉的重要凭据。",
            up: [{ slot: "unbox", label: "上传开箱视频（申诉凭据）", accept: "video/*", by: "client" }],
            client: d => d.flags.paidBalance
              ? { s: "尾款已托管并打款给画师", ok: true }
              : {
                s: has(d, "unbox") ? "开箱视频已保存，可确认验收" : "请先录制并上传开箱视频",
                acts: [
                  A("confirm", "确认验收并支付尾款", "primary"),
                  A("arbitrate", "申请平台仲裁", "ghost")
                ]
              },
            artist: d => d.flags.paidBalance
              ? { s: "金主已验收，尾款已到账", ok: true }
              : { s: "等待金主验收" }
          },
          {
            t: "交易完成与评价", desc: "交易完成，双方互评（好评 / 差评及理由）。", review: true,
            client: () => ({ s: "交易已完成", ok: true }),
            artist: () => ({ s: "交易已完成", ok: true })
          }
        ],
        2: [
          {
            t: "全款托管", desc: "金主一次性支付全款，并勾选免责协议。",
            agree: "中途不修改，72 小时自动打款",
            client: d => d.flags.paidFull
              ? { s: "全款已托管", ok: true }
              : (d.flags.agreed
                ? { s: "协议已确认，请支付全款", acts: [A("payFull", "支付全款 ￥900", "primary")] }
                : { s: "请先勾选下方免责协议" }),
            artist: d => d.flags.paidFull ? { s: "全款已托管，可开始制作", ok: true } : { s: "等待金主支付全款" }
          },
          {
            t: "画师直出", desc: "画师直接闭关创作并寄出，无需中途确认；成图带半透明斜版水印。",
            up: [{ slot: "final", label: "上传成图 / 打包照片", accept: "image/*,video/*", by: "artist", wm: true }],
            autoNext: true,
            artist: d => has(d, "final") ? { s: "已上传，等待金主确认" } : { s: "请上传成图与打包照片" },
            client: d => has(d, "final") ? { s: "画师已交付，等待收件", ok: true } : { s: "画师制作中，请耐心等待" }
          },
          {
            t: "自动结算", desc: "金主确认收稿，或 72 小时后系统自动打款；水印自动消失。", review: true, countdown: true,
            client: d => d.flags.settled
              ? { s: "已结算，交易完成", ok: true }
              : { s: "确认收稿后立即打款", acts: [A("confirm", "确认收稿", "primary"), A("autoSettle", "模拟 72 小时到期", "ghost")] },
            artist: d => d.flags.settled
              ? { s: "已收到全款，交易完成", ok: true }
              : { s: "等待金主确认或超时自动结算" }
          }
        ]
      },
      craft: {
        1: [
          {
            t: "选择制品与全款 / 定金托管", desc: "金主选择定制商品类型并支付定制费，资金托管后工厂开始打样。",
            chips: { slot: "product", label: "选择定制商品", options: ["手机壳", "流沙麻将", "徽章"] },
            client: d => (d.flags.paidDeposit || d.flags.paidFull)
              ? { s: "资金已托管，工厂将开始打样", ok: true }
              : (d.product
                ? {
                  s: "已选：" + d.product + "，请支付定制费",
                  acts: [A("payFull", "支付全款 ￥880", "primary"), A("payDeposit", "支付定金 ￥300")]
                }
                : { s: "请先选择定制商品" }),
            artist: d => (d.flags.paidDeposit || d.flags.paidFull)
              ? { s: "金主已付款，可以开始打样", ok: true }
              : { s: "等待金主选择商品并付款" }
          },
          {
            t: "电子打样确认阶段", desc: "商家上传电子效果图 / 白模打样图，金主确认或要求微调。",
            up: [{ slot: "sample", label: "上传电子效果图 / 白模打样图", accept: "image/*", by: "artist" }],
            client: d => has(d, "sample")
              ? { s: "打样图已上传，请确认", acts: [A("confirm", "确认打样图", "primary"), A("revise", "要求微调")] }
              : { s: "等待商家上传打样图" },
            artist: d => has(d, "sample") ? { s: "已上传，等待金主确认" } : { s: "请上传打样图" }
          },
          {
            t: "大货生产与发货", desc: "商家上传大货实拍图 / 装箱视频并填写物流单号，金主可查看物流状态。",
            up: [
              { slot: "bulk", label: "上传大货实拍图", accept: "image/*", by: "artist" },
              { slot: "boxing", label: "上传装箱视频", accept: "video/*", by: "artist" }
            ],
            tracking: true,
            client: d => d.flags.tracking
              ? { s: "已发货，物流单号：" + d.flags.tracking, ok: true }
              : { s: "大货生产中，请耐心等待" },
            artist: d => d.flags.tracking
              ? { s: "已发货：" + d.flags.tracking, ok: true }
              : {
                s: has(d, "bulk") ? "请填写物流单号完成发货" : "大货生产中，完成后请上传实拍图",
                acts: [A("ship", "保存物流单号", "primary")]
              }
          },
          {
            t: "收货与售后验收", desc: "收到周边后请检查是否有瑕疵（如印花歪斜、划痕）。", review: true,
            up: [{ slot: "flaw", label: "上传瑕疵细节图（申请售后用）", accept: "image/*", by: "client" }],
            client: d => d.flags.paidBalance
              ? { s: "已确认收货，资金已打给商家", ok: true }
              : { s: "确认无误后点击收货", acts: [A("confirm", "确认收货", "primary"), A("arbitrate", "申请售后", "ghost")] },
            artist: d => d.flags.paidBalance ? { s: "买家已确认收货，款项已到账", ok: true } : { s: "等待买家验收" }
          }
        ],
        2: [
          {
            t: "全款托管与授权", desc: "金主一次性付全款并上传高清原图，确认跳过打样直接大货生产。",
            agree: "我已确认图案已按比例调整好，跳过打样环节，直接大货生产，72 小时自动收货",
            up: [{ slot: "source", label: "上传高清原图", accept: "image/*", by: "client" }],
            client: d => d.flags.paidFull
              ? { s: "全款已托管，工厂即将排单", ok: true }
              : (d.flags.agreed && has(d, "source")
                ? { s: "协议与原图已就绪，请支付全款", acts: [A("payFull", "支付全款 ￥880", "primary")] }
                : { s: "请勾选免责协议并上传高清原图" }),
            artist: d => d.flags.paidFull ? { s: "全款已托管，可以排单生产", ok: true } : { s: "等待金主上传原图并付款" }
          },
          {
            t: "工厂直出", desc: "工厂直接排单生产，发货后系统自动填入物流单号并通知金主。",
            artist: d => d.flags.shipped
              ? { s: "已发货，物流单号：" + d.flags.tracking, ok: true }
              : { s: "工厂排单生产中", acts: [A("autoShip", "模拟发货（自动填单号）", "primary")] },
            client: d => d.flags.shipped
              ? { s: "已发货，物流单号：" + d.flags.tracking, ok: true }
              : { s: "工厂生产中，发货后将自动通知" }
          },
          {
            t: "自动结算", desc: "确认无误点击收稿；或物流签收后 72 小时自动打款。", review: true, countdown: true,
            client: d => d.flags.settled
              ? { s: "已结算，交易完成", ok: true }
              : { s: "收到快递后确认无误即可收稿", acts: [A("confirm", "确认收稿", "primary"), A("autoSettle", "模拟 72 小时到期", "ghost")] },
            artist: d => d.flags.settled
              ? { s: "款项已到账，交易完成", ok: true }
              : { s: "等待买家确认或超时自动结算" }
          }
        ]
      }
    };

    const getFlow = d => FLOWS[d.goods][d.mode];
    const getNode = d => getFlow(d)[d.step];
    const wmHidden = d => d.flags.settled || d.flags.originalReleased;

    /* ---------- 进度条 + 节点小面板 ---------- */
    function dealUploads(d, node) {
      if (!node.up) return "";
      return node.up.map(cfg => {
        const files = d.files[cfg.slot] || [];
        const mine = cfg.by === d.view;
        const wm = cfg.wm && !wmHidden(d);
        const list = files.map(f => f.type.startsWith("video")
          ? `<div class="deal-file">🎬 ${f.name}</div>`
          : `<div class="deal-thumb"><img src="${f.url}" alt="${f.name}" />${wm ? `<span class="deal-wm">集画@${artistNick()}</span>` : ""}</div>`).join("");
        return `
      <div class="deal-up">
        <div class="deal-up-head">
          <span>${cfg.label}</span>
          ${mine ? `<label class="btn ghost xs">${files.length ? "重新上传" : "选择文件"}
            <input type="file" accept="${cfg.accept}" data-deal-upload="${cfg.slot}" hidden />
          </label>` : ""}
        </div>
        ${files.length ? `<div class="deal-files">${list}</div>` : `<p class="deal-up-hint">${mine ? "支持 " + cfg.accept.replace(/\*/g, "") : "对方尚未上传"}</p>`}
      </div>`;
      }).join("");
    }

    function dealReviews(d, node) {
      if (!node.review) return "";
      const box = side => {
        const r = d.reviews[side];
        const label = side === "artist" ? "画师评价金主" : "金主评价画师";
        if (r) return `<div class="deal-review done"><b>${label}</b><p>${r.good ? "👍 好评" : "👎 差评"} · ${r.text || "未填写理由"}</p></div>`;
        return `<div class="deal-review">
        <b>${label}</b>
        <div class="rv-opts">
          <label><input type="radio" name="rv-${side}" value="good" checked /> 好评</label>
          <label><input type="radio" name="rv-${side}" value="bad" /> 差评</label>
        </div>
        <textarea id="rvText-${side}" rows="2" placeholder="评价理由（选填）"></textarea>
        <button class="btn ghost xs" data-deal-act="review" data-side="${side}">提交评价</button>
      </div>`;
      };
      return `<div class="deal-reviews">${box("client")}${box("artist")}</div>`;
    }

    function renderDealSide(o) {
      const d = o.deal;
      const flow = getFlow(d);
      const open = Math.min(d.open == null ? d.step : d.open, flow.length - 1);
      const node = flow[open];
      const side = (node[d.view] || node.client)(d);
      const chips = node.chips;
      const timeline = flow.map((n, i) => {
        const done = d.done || i < d.step;
        const cur = !d.done && i === d.step;
        return `
      <li class="deal-node ${done ? "done" : ""} ${cur ? "current" : ""} ${i === open ? "open" : ""}">
        <button class="deal-node-btn" data-deal-node="${i}">
          <span class="dot">${done ? "✓" : i + 1}</span>
          <span class="txt"><b>${n.t}</b><em>${done ? "已完成" : cur ? side.s : "待开始"}</em></span>
        </button>
      </li>`;
      }).join("");

      return `
    <aside class="deal-side" id="dealSide">
      <div class="deal-side-head">
        <div>
          <h4>动态交易进度</h4>
          <p>${GOODS_DEF[d.goods].short} · ${MODE_DEF[d.mode]}</p>
        </div>
        <div class="deal-viewsw">
          <button data-deal-view="client" class="${d.view === "client" ? "on" : ""}">金主端</button>
          <button data-deal-view="artist" class="${d.view === "artist" ? "on" : ""}">画师端</button>
        </div>
      </div>
      <ol class="deal-timeline">${timeline}</ol>
      <div class="deal-panel">
        <div class="deal-panel-head"><span class="no">节点 ${open + 1}</span><h5>${node.t}</h5></div>
        <p class="deal-desc">${node.desc}</p>
        ${chips && d.view === "client" ? `<div class="deal-chips"><span class="deal-chips-label">${chips.label}</span>
          <div class="deal-chip-row">${chips.options.map(op => `<button class="deal-chip ${d[chips.slot] === op ? "on" : ""}" data-deal-pick="${op}" data-deal-pick-slot="${chips.slot}">${op}</button>`).join("")}</div></div>` : ""}
        ${node.agree ? `<label class="deal-agree"><input type="checkbox" data-deal-agree ${d.flags.agreed ? "checked" : ""} ${d.view === "client" ? "" : "disabled"} /> ${node.agree}</label>` : ""}
        ${dealUploads(d, node)}
        ${node.tracking ? `<div class="deal-track"><span>物流单号</span><input id="dealTrack" placeholder="请输入物流单号" value="${d.flags.tracking || ""}" ${d.view === "artist" ? "" : "disabled"} /></div>` : ""}
        <div class="deal-status ${side.ok ? "ok" : ""}">${side.s}</div>
        ${side.acts ? `<div class="deal-acts">${side.acts.map(a => `<button class="btn ${a.style === "primary" ? "sm" : "ghost sm"}" data-deal-act="${a.k}">${a.label}</button>`).join("")}</div>` : ""}
        ${node.countdown ? `<p class="deal-countdown">自动打款倒计时：<b>${d.flags.settled ? "已结算" : "72:00:00"}</b>（演示）</p>` : ""}
        ${dealReviews(d, node)}
      </div>
    </aside>`;
    }

    function refreshDealSide() {
      const side = $id("dealSide");
      const o = wbState.curOrder;
      if (!side || !o || !o.deal) return;
      side.outerHTML = renderDealSide(o);
    }

    /* ---------- 节点动作 ---------- */
    function advanceDeal(d) {
      const flow = getFlow(d);
      if (d.step >= flow.length - 1) {
        d.done = true;
        d.flags.settled = true;
        toast("交易完成，水印已移除");
        return;
      }
      d.step += 1;
      d.open = d.step;
    }

    function dealAct(k, el) {
      const o = wbState.curOrder;
      const d = o && o.deal;
      if (!d) return;
      switch (k) {
        case "payDeposit":
          d.flags.paidDeposit = true;
          toast("定金已由平台托管");
          advanceDeal(d);
          break;
        case "payFull":
          d.flags.paidFull = true;
          toast("全款已由平台托管");
          advanceDeal(d);
          break;
        case "payBalance":
          d.flags.paidBalance = true;
          toast("尾款已托管，平台已打款给画师");
          advanceDeal(d);
          break;
        case "confirm":
          /* 成图验收：确认后下发无水印原图；实体验收：确认即支付尾款 */
          if (d.goods === "board" && d.mode === 1 && d.step === 2) d.flags.originalReleased = true;
          if (d.goods === "physical" && d.mode === 1 && d.step === 3) d.flags.paidBalance = true;
          if (d.goods === "craft" && d.mode === 1 && d.step === 3) d.flags.paidBalance = true;
          if (d.step >= getFlow(d).length - 1) d.flags.settled = true;
          advanceDeal(d);
          break;
        case "revise": {
          const node = getNode(d);
          (node.up || []).forEach(cfg => { d.files[cfg.slot] = []; });
          d.flags.originalReleased = false;
          toast("已要求修改，请对方重新上传");
          break;
        }
        case "arbitrate":
          d.flags.arbitration = true;
          toast("已提交平台仲裁，客服将在 24 小时内介入");
          break;
        case "autoSettle":
          d.flags.settled = true;
          d.done = true;
          toast("72 小时到期，系统已自动打款");
          break;
        case "autoShip":
          d.flags.tracking = "SF" + Math.floor(100000000 + Math.random() * 800000000);
          d.flags.shipped = true;
          advanceDeal(d);
          toast("已发货，物流单号自动填入：" + d.flags.tracking);
          break;
        case "ship": {
          const input = $id("dealTrack");
          const val = input ? input.value.trim() : "";
          if (!val) { toast("请先填写物流单号"); return; }
          d.flags.tracking = val;
          d.flags.shipped = true;
          toast("物流单号已保存：" + val);
          if (d.goods === "craft" && d.mode === 1 && d.step === 2) advanceDeal(d);
          break;
        }
        case "review": {
          const side = el.dataset.side;
          const checked = document.querySelector(`input[name="rv-${side}"]:checked`);
          const text = $id("rvText-" + side);
          d.reviews[side] = { good: !checked || checked.value === "good", text: text ? text.value.trim() : "" };
          toast("评价已提交");
          break;
        }
        default:
          return;
      }
      refreshDealSide();
    }

    /* ---------- 开始交易弹框 ---------- */
    const tradeModal = $id("tradeModal");
    const tradeModalBody = $id("tradeModalBody");

    function openTradeModal(o) {
      wbState.tradeDraft = { mode: 0, goods: "" };
      renderTradeModal(o);
      tradeModal.style.display = "flex";
    }

    function renderTradeModal(o) {
      const t = wbState.tradeDraft;
      tradeModalBody.innerHTML = `
    <h3>开始交易</h3>
    <p class="tm-sub">画师已向 <b>${o.name}</b> 发出交易邀请，请金主选择交易模式与交易商品</p>
    <div class="tm-label">交易模式</div>
    <div class="tm-options">
      <button class="tm-opt ${t.mode === 1 ? "on" : ""}" data-tm-mode="1">
        <b>模式一 · 精细分阶段</b><span>普适选择，分节点确认，每步可修改</span>
      </button>
      <button class="tm-opt ${t.mode === 2 ? "on" : ""}" data-tm-mode="2">
        <b>模式二 · 极速免打扰</b><span>适合老客户 / 极其忙碌的金主 / 信任度极高的交易</span>
      </button>
    </div>
    <div class="tm-label">交易商品</div>
    <div class="tm-options">
      ${Object.entries(GOODS_DEF).map(([k, g]) => `<button class="tm-opt ${t.goods === k ? "on" : ""}" data-tm-goods="${k}"><b>${g.name}</b></button>`).join("")}
    </div>
    <div class="tm-foot">
      <button class="btn ghost sm" data-tm="cancel">取消</button>
      <button class="btn sm" data-tm="start" ${t.mode && t.goods ? "" : "disabled"}>确认开始交易</button>
    </div>`;
    }

    tradeModal.addEventListener("click", e => {
      const mode = e.target.closest("[data-tm-mode]");
      const goods = e.target.closest("[data-tm-goods]");
      const act = e.target.closest("[data-tm]");
      const o = wbState.curOrder;
      if (!o) return;
      if (mode) { wbState.tradeDraft.mode = +mode.dataset.tmMode; renderTradeModal(o); return; }
      if (goods) { wbState.tradeDraft.goods = goods.dataset.tmGoods; renderTradeModal(o); return; }
      if (!act) return;
      if (act.dataset.tm === "cancel") { tradeModal.style.display = "none"; return; }
      if (act.dataset.tm === "start") {
        const t = wbState.tradeDraft;
        if (!t.mode || !t.goods) return;
        o.deal = {
          mode: t.mode, goods: t.goods, step: 0, open: 0, done: false,
          view: "artist",
          flags: {}, files: {}, reviews: {}, product: ""
        };
        tradeModal.style.display = "none";
        pushMsg({ me: false, t: `系统：交易已开启（${MODE_DEF[t.mode]} · ${GOODS_DEF[t.goods].short}）`, time: nowLabel() });
        renderDetail(o);
        toast("交易已开启，右侧可查看进度");
      }
    });

    /* 进度条交互：点击节点展开、切换视角、节点内动作 */
    wbDetail.addEventListener("click", e => {
      const o = wbState.curOrder;
      const d = o && o.deal;
      const nodeBtn = e.target.closest("[data-deal-node]");
      if (nodeBtn && d) { d.open = +nodeBtn.dataset.dealNode; refreshDealSide(); return; }
      const viewBtn = e.target.closest("[data-deal-view]");
      if (viewBtn && d) { d.view = viewBtn.dataset.dealView; refreshDealSide(); return; }
      const pick = e.target.closest("[data-deal-pick]");
      if (pick && d) { d[pick.dataset.dealPickSlot || "product"] = pick.dataset.dealPick; refreshDealSide(); return; }
      const dealBtn = e.target.closest("[data-deal-act]");
      if (dealBtn) { dealAct(dealBtn.dataset.dealAct, dealBtn); return; }
    });

    /* 上传文件（图片 / 视频）与协议勾选 */
    wbDetail.addEventListener("change", e => {
      const d = wbState.curOrder && wbState.curOrder.deal;
      if (!d) return;
      if (e.target.matches("[data-deal-agree]")) {
        d.flags.agreed = e.target.checked;
        refreshDealSide();
        return;
      }
      const slot = e.target.dataset.dealUpload;
      if (!slot) return;
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        (d.files[slot] = d.files[slot] || []).push({ name: f.name, type: f.type, url: reader.result });
        const flow = getFlow(d);
        const oi = Math.min(d.open == null ? d.step : d.open, flow.length - 1);
        const node = flow[oi];
        /* 直出节点只负责交付：交付齐全后自动进入结算节点，金主可立即确认收稿 */
        if (node && node.autoNext && (node.up || []).every(c => has(d, c.slot))) {
          advanceDeal(d);
          toast("交付已上传，等待金主确认收稿");
        } else {
          toast("已上传：" + f.name);
        }
        refreshDealSide();
      };
      reader.readAsDataURL(f);
    });

    /* ================= 周边定制（画师） ================= */
    const crafts = {
      "亚克力立牌": { ratio: "3 / 4", radius: "10px", sheen: false, sizes: ["A6 · 10×15cm", "A5 · 15×21cm", "异形切割"] },
      "镭射票": { ratio: "1 / 2.7", radius: "8px", sheen: true, sizes: ["58×180mm", "70×200mm"] },
      "吧唧徽章": { ratio: "1 / 1", radius: "50%", sheen: false, sizes: ["58mm", "75mm"] },
      "色纸": { ratio: "3 / 4", radius: "6px", sheen: false, sizes: ["10×14cm", "12×17cm"] },
      "亚克力挂件": { ratio: "1 / 1", radius: "16px", sheen: true, sizes: ["5cm", "7cm"] }
    };

    const merchants = [
      {
        n: "星野工房", ico: "🏭", s: "亚克力制品 · 6 年", moq: 20, price: 6.5, days: 7, rate: 4.9, sample: 30,
        crafts: ["亚克力立牌", "亚克力挂件", "吧唧徽章"], note: "自有工厂，支持异形切割与夜光板材"
      },
      {
        n: "镭射周边社", ico: "✨", s: "镭射票 / 色纸", moq: 50, price: 2.8, days: 5, rate: 4.7, sample: 20,
        crafts: ["镭射票", "色纸"], note: "镭射膜 12 色可选，5 天快速出货"
      },
      {
        n: "光影制品", ico: "🌗", s: "立牌 / 挂件 / 冰箱贴", moq: 10, price: 8.2, days: 10, rate: 4.8, sample: 40,
        crafts: ["亚克力立牌", "亚克力挂件"], note: "小批量友好，10 件起订，打样免费寄回"
      },
      {
        n: "纸上工坊", ico: "📦", s: "纸制品 / 徽章", moq: 100, price: 1.9, days: 4, rate: 4.6, sample: 15,
        crafts: ["色纸", "镭射票", "吧唧徽章"], note: "大批量性价比最高，支持专色印刷"
      }
    ];

    const packOptions = { "简装（OPP 袋）": 0, "吸塑 + 背卡": 0.8, "精装礼盒": 2.5 };

    const shelf = [
      { id: "s1", art: 0, craft: "亚克力立牌", merchant: "星野工房", qty: 120, unit: 26.5, price: 68, sold: 87, status: "已上架" },
      { id: "s2", art: 1, craft: "镭射票", merchant: "镭射周边社", qty: 300, unit: 3.6, price: 15, sold: 212, status: "已上架" },
      { id: "s3", art: 2, craft: "色纸", merchant: "纸上工坊", qty: 100, unit: 2.4, price: 12, sold: 0, status: "生产中" }
    ];

    /* ================= 周边定制状态 ================= */
    const customState = {
      art: 0, craft: "亚克力立牌", merchant: 0,
      qty: merchants[0].moq, size: crafts["亚克力立牌"].sizes[0],
      pack: "简装（OPP 袋）", sample: true, price: 0, priceTouched: false
    };

    const panelCustom = $id("panel-custom");
    const artPick = $id("artPick");
    const craftPick = $id("craftPick");
    const merchList = $id("merchList");
    const merchHint = $id("merchHint");
    const paramGrid = $id("paramGrid");
    const wsPreview = $id("wsPreview");
    const shelfGridOpen = $id("shelfGridOpen");
    const shelfGridClosed = $id("shelfGridClosed");
    const spCountOpen = $id("spCountOpen");
    const spCountClosed = $id("spCountClosed");

    const money = n => "￥" + (Math.round(n * 100) / 100).toLocaleString("zh-CN");
    const craftMerchants = () => merchants.map((_, i) => i).filter(i => merchants[i].crafts.includes(customState.craft));

    function calc() {
      const m = merchants[customState.merchant];
      const qty = customState.qty || 0;
      const packFee = packOptions[customState.pack] || 0;
      const unit = m.price + packFee;
      const sampleFee = customState.sample ? m.sample : 0;
      const total = unit * qty + sampleFee;
      const revenue = customState.price * qty;
      return {
        m, qty, unit, packFee, sampleFee, total, revenue,
        profit: revenue - total, perItem: qty ? total / qty : 0,
        days: m.days + (customState.sample ? 3 : 0)
      };
    }

    function renderArtPick() {
      artPick.innerHTML = artworks.map((w, i) => `
    <button class="art-opt ${i === customState.art ? "on" : ""}" data-art="${i}">
      <img src="${w.img}" alt="${w.t}" loading="lazy" />
      <div class="nm">${w.t}</div>
    </button>`).join("");
    }

    function renderCraftPick() {
      craftPick.innerHTML = Object.keys(crafts).map(c =>
        `<button class="chip-opt ${c === customState.craft ? "on" : ""}" data-craft="${c}">${c}</button>`).join("");
    }

    function renderMerch() {
      const list = craftMerchants();
      merchHint.textContent =
        "当前工艺「" + customState.craft + "」共 " + list.length + " 家合作商家可承接，单价、起订量与工期各不相同";
      merchList.innerHTML = list.map(i => {
        const m = merchants[i];
        return `
    <button class="merch ${i === customState.merchant ? "on" : ""}" data-merch="${i}">
      <div class="mtop">
        <span class="mav">${m.ico}</span>
        <div>
          <div class="mn">${m.n}</div>
          <div class="ms">${m.s}</div>
        </div>
        <span class="star">★ ${m.rate}</span>
      </div>
      <div class="mfacts">
        <span>加工单价 <b>${money(m.price)} / 件</b></span>
        <span>起订量 <b>${m.moq} 件</b></span>
        <span>出货工期 <b>${m.days} 天</b></span>
        <span>打样费 <b>${money(m.sample)} / 版</b></span>
      </div>
      <div class="mnote">${m.note}</div>
    </button>`;
      }).join("");
    }

    function renderParams() {
      const c = calc();
      paramGrid.innerHTML = `
    <div>
      <label>定制数量（起订 ${c.m.moq} 件）</label>
      <input id="cQty" type="number" min="1" value="${customState.qty}" />
    </div>
    <div>
      <label>规格尺寸</label>
      <select id="cSize">${crafts[customState.craft].sizes
          .map(s => `<option ${s === customState.size ? "selected" : ""}>${s}</option>`).join("")}</select>
    </div>
    <div>
      <label>包装方式</label>
      <select id="cPack">${Object.keys(packOptions)
          .map(p => `<option ${p === customState.pack ? "selected" : ""}>${p}</option>`).join("")}</select>
    </div>
    <div>
      <label>橱窗售价（每件）</label>
      <input id="cPrice" type="number" min="0" value="${customState.price}" />
    </div>
    <div class="span2">
      <label>打样确认</label>
      <label class="switch">
        <input type="checkbox" id="cSample" ${customState.sample ? "checked" : ""} />
        先寄实物打样（+${money(c.m.sample)} / +3 天）
      </label>
    </div>`;
    }

    function renderPreview() {
      const c = calc();
      const art = artworks[customState.art];
      const cr = crafts[customState.craft];
      const okQty = c.qty >= c.m.moq;
      const okPrice = customState.price > c.perItem;
      wsPreview.innerHTML = `
    <h3>定制预览</h3>
    <p class="sub">${art.t} · ${customState.craft} · ${customState.size}</p>
    <div class="pv-stage">
      <div class="pv-item" style="aspect-ratio:${cr.ratio};border-radius:${cr.radius}">
        <img src="${art.img}" alt="${art.t}" />
        ${cr.sheen ? '<span class="sheen"></span>' : ""}
      </div>
    </div>
    <div class="pv-cap">${c.m.n} 出品 · ${customState.sample ? "含实物打样" : "不打样直接量产"}</div>
    <div class="cost">
      <div class="r"><span>加工单价</span><b>${money(c.unit)} × ${c.qty} 件</b></div>
      <div class="r"><span>包装 · ${customState.pack}</span><b>${money(c.packFee)} / 件</b></div>
      <div class="r"><span>打样费</span><b>${customState.sample ? money(c.m.sample) : "—"}</b></div>
      <div class="r"><span>预计工期</span><b>${c.days} 天</b></div>
      <div class="r"><span>橱窗售价</span><b>${money(customState.price)} × ${c.qty} 件</b></div>
      <div class="r"><span>预计毛利</span><b style="color:${c.profit >= 0 ? "#8fd9a8" : "#d97b7b"}">${money(c.profit)}</b></div>
      <div class="r total"><span>定制总成本</span><b>${money(c.total)}</b></div>
    </div>
    ${okQty ? "" : `<p class="warn-line">数量未达起订量，请调整到 ${c.m.moq} 件及以上</p>`}
    ${okPrice ? "" : `<p class="warn-line">售价低于单件成本 ${money(c.perItem)}，建议提价后再上架</p>`}
    <button class="btn block" id="submitCustom"${okQty ? "" : ' disabled style="opacity:.5;cursor:not-allowed"'}>提交定制并放入橱窗</button>`;
    }

    function shelfCardHTML(p) {
      const art = artworks[p.art];
      const st = { "已上架": "ok", "生产中": "warn", "已下架": "" }[p.status] || "";
      const label = p.status === "生产中" ? "确认完成并上架" : p.status === "已上架" ? "下架" : "上架售卖";
      return `
    <article class="card good shelf-item">
      <div class="thumb">
        <img src="${art.img}" alt="${art.t}" loading="lazy" />
        <span class="hot" style="background:rgba(14,13,16,.78);color:var(--gold);border:1px solid rgba(231,192,120,.35)">${p.craft}</span>
        <span class="mini-pill ${st}" style="position:absolute;top:12px;left:12px;background:rgba(14,13,16,.82)">${p.status}</span>
      </div>
      <div class="body">
        <h3>${art.t} · ${p.craft}</h3>
        <p class="sub">${p.merchant} · 库存 ${p.qty} 件 · 成本 ${money(p.unit)} / 件</p>
        <div class="buy">
          <span class="p">${money(p.price)}</span>
          <button class="add" data-shelf="${p.id}">${label}</button>
        </div>
        <p class="sub" style="margin:10px 0 0">${p.sold ? "已售 " + p.sold + " 件" : "尚未产生销量"}</p>
      </div>
    </article>`;
    }

    function renderShelf() {
      const openList = shelf.filter(p => p.status !== "已下架");
      const closedList = shelf.filter(p => p.status === "已下架");
      shelfGridOpen.innerHTML = openList.map(shelfCardHTML).join("")
        || `<div class="empty-note">当前没有开放商品，把橱窗里的「已下架」商品上架即可</div>`;
      shelfGridClosed.innerHTML = closedList.map(shelfCardHTML).join("")
        || `<div class="empty-note">所有商品都在开放橱窗，暂无下架商品</div>`;
      spCountOpen.textContent = openList.length;
      spCountClosed.textContent = closedList.length;
    }

    function renderAll() {
      renderArtPick();
      renderCraftPick();
      renderMerch();
      if (!customState.priceTouched) customState.price = Math.round(calc().perItem * 2.2);
      renderParams();
      renderPreview();
    }

    function setCraft(name) {
      if (name === customState.craft) return;
      customState.craft = name;
      customState.size = crafts[name].sizes[0];
      const list = craftMerchants();
      if (!list.includes(customState.merchant)) customState.merchant = list[0];
      customState.qty = merchants[customState.merchant].moq;
      customState.priceTouched = false;
      renderAll();
    }

    function submitCustom() {
      const c = calc();
      if (c.qty < c.m.moq) { toast("定制数量需达到起订量 " + c.m.moq + " 件"); return; }
      shelf.unshift({
        id: "s" + Date.now(), art: customState.art, craft: customState.craft, merchant: c.m.n,
        qty: c.qty, unit: Math.round(c.perItem * 10) / 10, price: customState.price,
        sold: 0, status: "生产中"
      });
      renderShelf();
      toast("已向 " + c.m.n + " 提交定制订单，预计 " + c.days + " 天出货，商品已放入橱窗");
      $id("panel-custom").scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function toggleShelf(id) {
      const p = shelf.find(x => x.id === id);
      if (!p) return;
      if (p.status === "生产中") { p.status = "已上架"; toast("「" + artworks[p.art].t + " · " + p.craft + "」已上架售卖"); }
      else if (p.status === "已上架") { p.status = "已下架"; toast("已下架，可随时重新上架"); }
      else { p.status = "已上架"; toast("已重新上架"); }
      renderShelf();
    }

    panelCustom.addEventListener("click", e => {
      const a = e.target.closest("[data-art]");
      if (a) { customState.art = +a.dataset.art; renderAll(); return; }
      const cr = e.target.closest("[data-craft]");
      if (cr) { setCraft(cr.dataset.craft); return; }
      const mr = e.target.closest("[data-merch]");
      if (mr) {
        const idx = +mr.dataset.merch;
        if (idx !== customState.merchant) {
          customState.merchant = idx;
          customState.qty = merchants[idx].moq;
          customState.priceTouched = false;
        }
        renderAll();
        return;
      }
      if (e.target.id === "submitCustom") { submitCustom(); return; }
      const sh = e.target.closest("[data-shelf]");
      if (sh) toggleShelf(sh.dataset.shelf);
    });

    panelCustom.addEventListener("input", e => {
      if (e.target.id === "cQty") { customState.qty = Math.max(0, Math.floor(+e.target.value || 0)); renderPreview(); }
      if (e.target.id === "cPrice") {
        customState.price = Math.max(0, +e.target.value || 0);
        customState.priceTouched = true;
        renderPreview();
      }
    });

    panelCustom.addEventListener("change", e => {
      if (e.target.id === "cSize") { customState.size = e.target.value; renderPreview(); }
      if (e.target.id === "cPack") { customState.pack = e.target.value; renderPreview(); }
      if (e.target.id === "cSample") { customState.sample = e.target.checked; renderPreview(); }
    });

    renderAll();
    renderShelf();

    /* ================= 绘画（所有用户可用） ================= */
    const panelDraw = $id("panel-draw");
    const drawCanvas = $id("drawCanvas");
    const dctx = drawCanvas.getContext("2d", { willReadFrequently: true });
    const drawOverlay = $id("drawOverlay");
    const octx = drawOverlay.getContext("2d");
    const CW = drawCanvas.width, CH = drawCanvas.height;
    const swatches = $id("swatches");
    const gapList = $id("gapList");
    const tipBrush = $id("tipBrush");
    const tipGap = $id("tipGap");
    const refChips = $id("refChips");

    const palette = ["#f2ece0", "#e7c078", "#e88fb1", "#7fa8e8", "#8fd9a8", "#d97b7b", "#8a8095"];
    const toolNames = { pen: "铅笔", marker: "马克笔", airbrush: "喷枪", eraser: "橡皮", wand: "魔棒填色", pick: "取色吸管", move: "移动图片" };

    /* ================= 绘画模块状态（统一收拢，避免散落全局） ================= */
    const drawState = {
      /* 笔刷与当前操作 */
      brush: { tool: "pen", size: 5, opacity: 100, color: "#f2ece0" },
      drawing: false, lastPt: null,
      /* 画布视图缩放：只改显示尺寸，坐标映射由 rect 自动换算 */
      viewZoom: 1,

      /* 缺口扫描结果与闭合记录 */
      gaps: [], activeGap: null, lastData: null,
      gapSk: null, gapW: 0, gapH: 0, gapScale: 2,   /* 最近一次扫描的骨架，供曲线闭合取切线方向 */
      closeActions: [],                             /* 闭合动作组：单缺口 / 一键全部，供总撤回 */
      repairLog: [],                                /* 缺口位置 → 已被自动修复次数（反复出现判定） */
      pendingGap: null,                             /* 顽固缺口弹框中待处理的缺口 */
      sensMinGap: 2,                                /* 灵敏度：忽略小于此像素的缺口 */
      scanMode: "outer",                            /* outer=外轮廓检测，partial=部分检测 */

      /* 部分检测范围与边界 */
      regionMask: null, regionEdge: null, regionBounds: null,  /* 部分检测范围与边界 */
      regionMaskRaw: null, regionCount: 0,          /* 未做边界微调的范围 / 范围像素数 */
      regionExpand: 2,                              /* 边界微调：正=向外扩，负=向内收 */
      regionArmed: false, regionOp: "base",         /* 圈选待命；op=base|add|sub */
      lassoPts: null,                               /* 自由圈选过程中的轨迹点 */
      regionSeq: 0, regionPhase: 0, regionAnimId: null,  /* 黑色流动虚线相位 */

      /* 范围蒙层与挖洞画布 */
      holeImg: null, grayReady: false,

      /* 魔棒 */
      fillColor: "#7fa8e8", wandTolerance: 32,
      wandSel: null,                                /* 魔棒选区 {mask:Uint8Array, w, h, bounds} */
      wandAnimId: null, wandPhase: 0,

      /* 撤销 / 重做 */
      undoStack: [], redoStack: [],

      /* 导入图片层：底图与笔迹分开存放，检测 / 取色 / 魔棒 / 导出统一读「底图 + 笔迹」合成分 */
      imgData: null, imgBox: null, imgReady: false, /* 原图对象 / 底图在画布坐标中的 {x,y,w,h} */
      imgUrl: "",                                   /* 底图的 object URL，换图 / 清空时释放 */
      imgInvalTimer: 0, imgDrag: null,              /* 拖动状态与缺口失效节流 */

      /* 扫描 Worker / 异步序号防过期 */
      scanWorker: null, workerDead: false, scanLibMain: null,
      scanSeq: 0, wandSeq: 0
    };

    const grayCanvas = document.createElement("canvas");    /* 半透明灰色蒙层（范围外覆盖） */
    grayCanvas.width = CW; grayCanvas.height = CH;
    const grayCtx = grayCanvas.getContext("2d");
    const holeCanvas = document.createElement("canvas");   /* 范围内挖洞用的临时画布 */
    holeCanvas.width = CW; holeCanvas.height = CH;
    const holeCtx = holeCanvas.getContext("2d");
    const HIST_MAX = 10;
    const underlayEl = $id("drawUnderlay");

    const compCanvas = document.createElement("canvas");
    compCanvas.width = CW; compCanvas.height = CH;
    const compCtx = compCanvas.getContext("2d", { willReadFrequently: true });

    function updateTip() {
      if (drawState.brush.tool === "wand") {
        tipBrush.textContent = "魔棒填色 · 容差 " + drawState.wandTolerance;
        drawCanvas.style.cursor = "crosshair";
      } else if (drawState.brush.tool === "pick") {
        tipBrush.textContent = "取色吸管 · 点击画布吸取颜色";
        drawCanvas.style.cursor = "crosshair";
      } else if (drawState.brush.tool === "move") {
        tipBrush.textContent = "移动图片 · 拖动移动 / 滚轮缩放";
        drawCanvas.style.cursor = "grab";
      } else {
        tipBrush.textContent = toolNames[drawState.brush.tool] + " " + drawState.brush.size + "px";
        drawCanvas.style.cursor = "";
      }
    }

    function renderSwatches() {
      swatches.innerHTML = palette.map(c =>
        `<button class="sw ${c === drawState.brush.color ? "on" : ""}" data-sw="${c}" style="background:${c}" title="${c}"></button>`).join("");
      $id("brushColor").value = drawState.brush.color;
    }

    function setColor(c) {
      drawState.brush.color = c;
      renderSwatches();
    }

    function setTool(t) {
      drawState.brush.tool = t;
      if (t === "move") { drawState.regionArmed = false; drawState.lassoPts = null; }   /* 切到移动工具时退出圈选待命，避免误圈 */
      panelDraw.querySelectorAll("[data-tool]").forEach(b => b.classList.toggle("on", b.dataset.tool === t));
      updateTip();
    }

    /* ---------- 导入图片层：适配 / 定位 / 合成分 ---------- */
    /* 图片不超出画框：比画框小的图整体留在框内；比画框大的图可以放大查看，但边缘不会露白 */
    function clampImgBox() {
      const minX = Math.min(0, CW - drawState.imgBox.w), maxX = Math.max(0, CW - drawState.imgBox.w);
      const minY = Math.min(0, CH - drawState.imgBox.h), maxY = Math.max(0, CH - drawState.imgBox.h);
      drawState.imgBox.x = Math.max(minX, Math.min(maxX, drawState.imgBox.x));
      drawState.imgBox.y = Math.max(minY, Math.min(maxY, drawState.imgBox.y));
    }

    /* 底图按百分比定位：画框随视图缩放改变尺寸，百分比与 1000×680 画布坐标严格线性对应，缩放后不会错位 */
    function applyImgView() {
      if (!drawState.imgReady || !drawState.imgBox) { underlayEl.style.display = "none"; return; }
      underlayEl.style.display = "block";
      underlayEl.style.left = (drawState.imgBox.x / CW * 100) + "%";
      underlayEl.style.top = (drawState.imgBox.y / CH * 100) + "%";
      underlayEl.style.width = (drawState.imgBox.w / CW * 100) + "%";
      underlayEl.style.height = (drawState.imgBox.h / CH * 100) + "%";
    }

    function clearImageLayer() {
      drawState.imgData = null; drawState.imgBox = null; drawState.imgReady = false; drawState.imgDrag = null;
      underlayEl.style.display = "none";
      underlayEl.removeAttribute("src");
      if (drawState.imgUrl) { URL.revokeObjectURL(drawState.imgUrl); drawState.imgUrl = ""; }
    }

    /* 合成分 = 底图（可选白底）+ 笔迹；所有按像素读画布的算法都走这里 */
    function drawComposite(ctx, whiteBg) {
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, CW, CH);
      if (whiteBg) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, CW, CH); }
      if (drawState.imgReady && drawState.imgData && drawState.imgBox) ctx.drawImage(drawState.imgData, drawState.imgBox.x, drawState.imgBox.y, drawState.imgBox.w, drawState.imgBox.h);
      ctx.drawImage(drawCanvas, 0, 0);
      ctx.restore();
    }

    function compositeCanvas(whiteBg) {
      drawComposite(compCtx, whiteBg);
      return compCanvas;
    }

    /* 图片被移动 / 缩放后旧的缺口标记作废；连续拖动时只提示一次，避免刷屏 */
    function markImgMoved() {
      if (drawState.imgInvalTimer) return;
      drawState.imgInvalTimer = setTimeout(() => { drawState.imgInvalTimer = 0; }, 600);
      invalidateGaps("图片已调整，点击「开始扫描」重新检测缺口。");
    }

    /* 以画布坐标 anchor 为锚点缩放底图：锚点下的像素保持不动，缩放不会让图片漂移 */
    function zoomImageAt(anchor, s) {
      if (!drawState.imgReady || !drawState.imgBox) return;
      const ratio = drawState.imgBox.w / drawState.imgBox.h;
      let nw = drawState.imgBox.w * s, nh = drawState.imgBox.h * s;
      if (nw < 60) { nw = 60; nh = nw / ratio; }
      if (nw > 4000) { nw = 4000; nh = nw / ratio; }
      const rx = (anchor.x - drawState.imgBox.x) / drawState.imgBox.w;   /* 锚点在图片内的相对位置 */
      const ry = (anchor.y - drawState.imgBox.y) / drawState.imgBox.h;
      drawState.imgBox.w = nw; drawState.imgBox.h = nh;
      drawState.imgBox.x = anchor.x - rx * nw;
      drawState.imgBox.y = anchor.y - ry * nh;
      clampImgBox();
      applyImgView();
      markImgMoved();
    }

    function setViewZoom(z) {
      drawState.viewZoom = Math.min(3, Math.max(0.5, z));
      $id("canvasWrap").style.width = (drawState.viewZoom * 100) + "%";
      toast("画布视图 " + Math.round(drawState.viewZoom * 100) + "%");
    }


    function setSidePane(name) {
      panelDraw.querySelectorAll(".side-tab").forEach(b => b.classList.toggle("active", b.dataset.pane === name));
      $id("pane-gaps").classList.toggle("active", name === "gaps");
      $id("pane-refs").classList.toggle("active", name === "refs");
    }

    /* ---------- 画布 / 笔刷 ---------- */
    function canvasPos(e) {
      const r = drawCanvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) * (CW / r.width),
        y: (e.clientY - r.top) * (CH / r.height)
      };
    }

    function snapshot() {
      if (drawState.undoStack.length >= HIST_MAX) drawState.undoStack.shift();
      drawState.undoStack.push(dctx.getImageData(0, 0, CW, CH));
      drawState.redoStack = [];
    }

    function restore(img) {
      dctx.save();
      dctx.globalCompositeOperation = "source-over";
      dctx.globalAlpha = 1;
      dctx.putImageData(img, 0, 0);
      dctx.restore();
    }

    function undo() {
      if (!drawState.undoStack.length) { toast("没有可撤销的操作了"); return; }
      drawState.redoStack.push(dctx.getImageData(0, 0, CW, CH));
      restore(drawState.undoStack.pop());
      invalidateGaps("已撤销上一步，点击「开始扫描」重新检测缺口。");
    }

    function redo() {
      if (!drawState.redoStack.length) { toast("没有可重做的操作了"); return; }
      drawState.undoStack.push(dctx.getImageData(0, 0, CW, CH));
      restore(drawState.redoStack.pop());
      invalidateGaps("已重做一步，点击「开始扫描」重新检测缺口。");
    }

    function applyBrush(ctx) {
      const op = drawState.brush.opacity / 100;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 0;
      if (drawState.brush.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.globalAlpha = op;
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = drawState.brush.tool === "marker" ? op * 0.5 : drawState.brush.tool === "airbrush" ? op * 0.12 : op;
        ctx.strokeStyle = drawState.brush.color;
        ctx.fillStyle = drawState.brush.color;
      }
      ctx.lineWidth = drawState.brush.size;
    }

    function dotAt(p) {
      dctx.save();
      applyBrush(dctx);
      dctx.beginPath();
      dctx.arc(p.x, p.y, Math.max(0.6, drawState.brush.size / 2), 0, Math.PI * 2);
      dctx.fill();
      dctx.restore();
    }

    function strokeTo(a, b) {
      dctx.save();
      applyBrush(dctx);
      if (drawState.brush.tool === "airbrush") {
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        const steps = Math.max(1, Math.round(dist / 3));
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = a.x + (b.x - a.x) * t;
          const y = a.y + (b.y - a.y) * t;
          for (let k = 0; k < 4; k++) {
            const ang = Math.random() * Math.PI * 2;
            const rad = Math.random() * drawState.brush.size * 0.8;
            dctx.beginPath();
            dctx.arc(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad, drawState.brush.size * 0.35, 0, Math.PI * 2);
            dctx.fill();
          }
        }
      } else {
        dctx.beginPath();
        dctx.moveTo(a.x, a.y);
        dctx.lineTo(b.x, b.y);
        dctx.stroke();
      }
      dctx.restore();
    }

    function invalidateGaps(msg) {
      drawState.gaps = [];
      drawState.activeGap = null;
      drawState.lastData = null;
      gapList.innerHTML = `<div class="empty-note">${msg || "画布已修改，点击「开始扫描」重新检测缺口。"}</div>`;
      tipGap.textContent = "缺口检测：尚未扫描";
      drawOverlayGaps();   /* 清空缺口标记，但保留部分检测的灰色蒙层与流动虚线范围 */
    }

    function clearCanvas() {
      snapshot();
      dctx.clearRect(0, 0, CW, CH);
      clearImageLayer();
      if (drawState.brush.tool === "move") setTool("pen");
      invalidateGaps("画布已清空。画几笔或载入示例线稿，再点击「开始扫描」。");
      toast("画布已清空");
    }

    function loadSample() {
      snapshot();
      dctx.clearRect(0, 0, CW, CH);
      clearImageLayer();
      if (drawState.brush.tool === "move") setTool("pen");
      dctx.save();
      dctx.globalCompositeOperation = "source-over";
      dctx.globalAlpha = 1;
      dctx.strokeStyle = "#f2ece0";
      dctx.lineWidth = 4;
      dctx.lineCap = "round";
      dctx.lineJoin = "round";

      /* 1. 缺口圆 */
      dctx.beginPath();
      dctx.arc(220, 200, 100, 0.4, Math.PI * 2 - 0.21);
      dctx.stroke();

      /* 2. 方框右侧缺一小段（同一条线，闭合回起点） */
      dctx.beginPath();
      dctx.moveTo(400, 110); dctx.lineTo(600, 110); dctx.lineTo(600, 280);
      dctx.moveTo(600, 300); dctx.lineTo(600, 330); dctx.lineTo(400, 330); dctx.lineTo(400, 110);
      dctx.stroke();

      /* 3. 完整闭合三角（不应被判定为缺口） */
      dctx.beginPath();
      dctx.moveTo(760, 130); dctx.lineTo(880, 330); dctx.lineTo(640, 330); dctx.closePath();
      dctx.stroke();

      /* 4. 同圆上的两段弧，端点接近但未连接 */
      dctx.beginPath(); dctx.arc(230, 470, 90, Math.PI * 0.16, Math.PI * 0.96); dctx.stroke();
      dctx.beginPath(); dctx.arc(230, 470, 90, Math.PI * 1.04, Math.PI * 1.86); dctx.stroke();

      /* 5. 直线上缺一小段 */
      dctx.beginPath();
      dctx.moveTo(440, 470); dctx.lineTo(575, 470);
      dctx.moveTo(590, 470); dctx.lineTo(720, 470);
      dctx.stroke();

      dctx.restore();
      invalidateGaps("已载入示例线稿，点击「开始扫描」体验缺口检测。");
      toast("已载入示例线稿（内含多处故意留下的未闭合缺口）");
    }

    drawCanvas.addEventListener("pointerdown", e => {
      const p = canvasPos(e);
      /* 取色吸管：只吸取画布颜色，不在画布上落笔 */
      if (drawState.brush.tool === "pick") { pickColor(p); return; }
      /* 部分检测处于圈选待命：自由圈出范围（优先于移动工具，避免误拖图片） */
      if (drawState.scanMode === "partial" && drawState.regionArmed) {
        drawCanvas.setPointerCapture(e.pointerId);
        drawState.lassoPts = [p];
        refreshGray();
        drawOverlayGaps();
        return;
      }
      /* 移动工具：拖动导入图片（不落笔，仅调整底图位置） */
      if (drawState.brush.tool === "move") {
        if (!drawState.imgReady || !drawState.imgBox) { toast("还没有导入图片，先点「导入图片」"); return; }
        drawState.imgDrag = { sx: p.x, sy: p.y, ox: drawState.imgBox.x, oy: drawState.imgBox.y };
        try { drawCanvas.setPointerCapture(e.pointerId); } catch (err) { }
        drawCanvas.style.cursor = "grabbing";
        markImgMoved();
        return;
      }
      if (drawState.brush.tool === "wand") { wandSelect(p); return; }
      const hit = hitGap(p);
      if (hit >= 0) { selectGap(hit); return; }
      drawCanvas.setPointerCapture(e.pointerId);
      drawState.drawing = true;
      drawState.lastPt = p;
      snapshot();
      invalidateGaps();
      dotAt(p);
    });

    drawCanvas.addEventListener("pointermove", e => {
      if (drawState.imgDrag) {
        const p = canvasPos(e);
        drawState.imgBox.x = drawState.imgDrag.ox + (p.x - drawState.imgDrag.sx);
        drawState.imgBox.y = drawState.imgDrag.oy + (p.y - drawState.imgDrag.sy);
        clampImgBox();
        applyImgView();
        return;
      }
      if (drawState.lassoPts) {
        const p = canvasPos(e);
        const last = drawState.lassoPts[drawState.lassoPts.length - 1];
        if (Math.hypot(p.x - last.x, p.y - last.y) >= 3) {
          drawState.lassoPts.push(p);
          refreshGray();       /* 圈内实时去掉灰色蒙层 */
          drawOverlayGaps();
        }
        return;
      }
      if (!drawState.drawing) return;
      const p = canvasPos(e);
      strokeTo(drawState.lastPt, p);
      drawState.lastPt = p;
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(ev =>
      drawCanvas.addEventListener(ev, () => {
        if (drawState.imgDrag) {
          drawState.imgDrag = null;
          applyImgView();
          drawCanvas.style.cursor = drawState.brush.tool === "move" ? "grab" : "";
          markImgMoved();
        }
        if (drawState.lassoPts) {
          const pts = drawState.lassoPts;
          drawState.lassoPts = null;
          finishLasso(pts);
        }
        drawState.drawing = false;
        drawState.lastPt = null;
      }));

    /* 移动工具下滚轮缩放底图（以光标为锚点）；其它工具滚轮保持画布视图的正常滚动 */
    drawCanvas.addEventListener("wheel", e => {
      if (drawState.brush.tool !== "move" || !drawState.imgReady) return;
      e.preventDefault();
      zoomImageAt(canvasPos(e), e.deltaY < 0 ? 1.12 : 1 / 1.12);
    }, { passive: false });

    /* ---------- 线稿缺口检测 ---------- */
    /* ---------- 缺口检测算法库（同一份源码注入 Web Worker 后台执行，Worker 不可用时主线程兜底） ---------- */
    const SCAN_LIB = `
const N8 = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];
function nbList(g,w,h,x,y){
  const out=[];
  for(let k=0;k<8;k++){
    const nx=x+N8[k][0], ny=y+N8[k][1];
    if(nx>=0&&ny>=0&&nx<w&&ny<h&&g[ny*w+nx]) out.push(ny*w+nx);
  }
  return out;
}
/* Otsu 自适应二值化：半透明像素先按白底合成亮度，再按直方图自动取阈值，
   适配白底 JPG/PNG、深底反色稿与透明底画布（旧版只看 alpha，白底图会全图误判为墨） */
function binarize(data,CW,CH,scale){
  const w=Math.floor(CW/scale), h=Math.floor(CH/scale);
  const lum=new Uint8Array(w*h);
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      let minL=255;   /* 块内取最暗值，保住细线 */
      for(let dy=0;dy<scale;dy++){
        const sy=y*scale+dy; if(sy>=CH) break;
        for(let dx=0;dx<scale;dx++){
          const sx=x*scale+dx; if(sx>=CW) break;
          const k=(sy*CW+sx)*4, a=data[k+3];
          const l=(data[k]*77+data[k+1]*150+data[k+2]*29)>>8;
          const lb=(l*a+255*(255-a))/255;
          if(lb<minL) minL=lb;
        }
      }
      lum[y*w+x]=minL;
    }
  }
  const hist=new Uint32Array(256);
  for(let i=0;i<w*h;i++) hist[lum[i]]++;
  const total=w*h;
  let sum=0; for(let t=0;t<256;t++) sum+=t*hist[t];
  let sumB=0,wB=0,maxV=0,thr=127;
  for(let t=0;t<256;t++){
    wB+=hist[t]; if(!wB) continue;
    const wF=total-wB; if(!wF) break;
    sumB+=t*hist[t];
    const mB=sumB/wB, mF=(sum-sumB)/wF;
    const v=wB*wF*(mB-mF)*(mB-mF);
    if(v>maxV){ maxV=v; thr=t; }
  }
  const grid=new Uint8Array(w*h);
  let ink=0;
  for(let i=0;i<w*h;i++) if(lum[i]<=thr){ grid[i]=1; ink++; }
  /* 墨水占比过高说明是深底反色稿，改取亮侧为墨 */
  if(ink>total*0.45){
    ink=0;
    for(let i=0;i<w*h;i++){ const v=lum[i]>thr?1:0; grid[i]=v; ink+=v; }
  }
  return {grid:grid,ink:ink,w:w,h:h};
}
/* 降噪：删除 8 邻域全空的孤立墨点，不伤连续细线 */
function denoise(g,w,h){
  const out=g.slice();
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const i=y*w+x;
      if(!g[i]) continue;
      let has=0;
      for(let k=0;k<8;k++){
        const nx=x+N8[k][0], ny=y+N8[k][1];
        if(nx>=0&&ny>=0&&nx<w&&ny<h&&g[ny*w+nx]){ has=1; break; }
      }
      if(!has) out[i]=0;
    }
  }
  return out;
}
/* Zhang-Suen 细化（迭代上限提高：较粗线条也能完整骨架化） */
function thin(src,w,h){
  const g=src.slice();
  let changed=true, iter=0;
  while(changed&&iter<30){
    changed=false;
    for(let step=0;step<2;step++){
      const del=[];
      for(let y=1;y<h-1;y++){
        for(let x=1;x<w-1;x++){
          const i=y*w+x;
          if(!g[i]) continue;
          const p2=g[i-w],p3=g[i-w+1],p4=g[i+1],p5=g[i+w+1],p6=g[i+w],p7=g[i+w-1],p8=g[i-1],p9=g[i-w-1];
          const B=p2+p3+p4+p5+p6+p7+p8+p9;
          if(B<2||B>6) continue;
          const A=(p2&&!p3?1:0)+(p3&&!p4?1:0)+(p4&&!p5?1:0)+(p5&&!p6?1:0)+(p6&&!p7?1:0)+(p7&&!p8?1:0)+(p8&&!p9?1:0)+(p9&&!p2?1:0);
          if(A!==1) continue;
          if(step===0){ if(p2*p4*p6||p4*p6*p8) continue; }
          else{ if(p2*p4*p8||p2*p6*p8) continue; }
          del.push(i);
        }
      }
      if(del.length){ for(let n=0;n<del.length;n++) g[del[n]]=0; changed=true; }
    }
    iter++;
  }
  return g;
}
function labelComps(g,w,h){
  const lab=new Int32Array(w*h);
  const size=[];
  let cur=0;
  for(let i=0;i<w*h;i++){
    if(!g[i]||lab[i]) continue;
    cur++;
    let cnt=0;
    const stack=[i];
    lab[i]=cur;
    while(stack.length){
      const p=stack.pop();
      cnt++;
      const x=p%w, y=(p-x)/w;
      const nbs=nbList(g,w,h,x,y);
      for(let n=0;n<nbs.length;n++){ const nb=nbs[n]; if(!lab[nb]){ lab[nb]=cur; stack.push(nb); } }
    }
    size[cur]=cnt;
  }
  return {lab:lab,size:size};
}
/* 沿骨架的测地距离（×10 存储，正交步 10 / 对角步 14） */
function geoDist(g,w,h,start,limit){
  const dist=new Int16Array(w*h).fill(32000);
  dist[start]=0;
  let front=[start];
  while(front.length){
    const next=[];
    for(let n=0;n<front.length;n++){
      const p=front[n];
      const d=dist[p];
      if(d+14>limit) continue;
      const x=p%w, y=(p-x)/w;
      const nbs=nbList(g,w,h,x,y);
      for(let m=0;m<nbs.length;m++){
        const nb=nbs[m];
        const nx=nb%w, ny=(nb-nx)/w;
        const step=(nx!==x&&ny!==y)?14:10;
        const nd=d+step;
        if(nd<dist[nb]){ dist[nb]=nd; next.push(nb); }
      }
    }
    front=next;
  }
  return dist;
}
/* 从端点沿骨架行走 steps 步，取位移方向作为端点切线（指向线外） */
function skelTangent(sk,w,h,startIdx,steps){
  let prev=-1, cur=startIdx;
  let farX=0, farY=0;
  const sx=startIdx%w, sy=(startIdx-sx)/w;
  for(let s=0;s<steps;s++){
    const cx=cur%w, cy=(cur-cx)/w;
    farX=cx; farY=cy;
    const nbs=nbList(sk,w,h,cx,cy);
    if(nbs.length===0) break;
    let next=nbs[0];
    if(nbs.length>1){
      let best=-1, bd=-Infinity;
      const dx=cx-(prev===-1?cx:(prev%w));
      const dy=cy-(prev===-1?cy:((prev-(prev%w))/w));
      for(let n=0;n<nbs.length;n++){
        const nb2=nbs[n];
        if(nb2===prev) continue;
        const nx=nb2%w, ny=(nb2-nx)/w;
        const dot=(nx-cx)*dx+(ny-cy)*dy;
        if(dot>bd){ bd=dot; best=nb2; }
      }
      next=best;
    }
    if(next===prev||next===cur) break;
    prev=cur; cur=next;
  }
  const vx=sx-farX, vy=sy-farY;
  const len=Math.hypot(vx,vy)||1;
  return {x:vx/len,y:vy/len};
}
/* 中位数：排序副本，样本量小，开销可接受 */
function median(arr){
  if(!arr.length) return 0;
  const a=arr.slice().sort(function(p,q){return p-q;});
  const m=a.length>>1;
  return a.length%2?a[m]:(a[m-1]+a[m])/2;
}
/* 局部线宽：端点附近行/列墨迹连续长度的中位数，取较小者近似笔画粗细（骨架尺度） */
function localWidthAt(grid,w,h,x,y){
  const rows=[], cols=[];
  for(let d=-2;d<=2;d++){
    const yy=y+d;
    if(yy>=0&&yy<h&&grid[yy*w+x]){
      let l=0,r=0;
      while(x-l-1>=0&&grid[yy*w+x-l-1]) l++;
      while(x+r+1<w&&grid[yy*w+x+r+1]) r++;
      rows.push(l+r+1);
    }
    const xx=x+d;
    if(xx>=0&&xx<w&&grid[y*w+xx]){
      let u=0,v=0;
      while(y-u-1>=0&&grid[(y-u-1)*w+xx]) u++;
      while(y+v+1<h&&grid[(y+v+1)*w+xx]) v++;
      cols.push(u+v+1);
    }
  }
  const mr=median(rows), mc=median(cols);
  return (mr&&mc)?Math.min(mr,mc):(mr||mc||0);
}
/* 线稿颜色：取缺口两端附近偏暗的墨迹像素中位数，输出 #rrggbb */
function inkColorHex(data,CW,CH,ax,ay,bx,by){
  const samples=[];
  const centers=[[ax,ay],[bx,by]];
  for(let c=0;c<2;c++){
    const cx=Math.round(centers[c][0]), cy=Math.round(centers[c][1]);
    for(let dy=-7;dy<=7;dy++){
      for(let dx=-7;dx<=7;dx++){
        if(dx*dx+dy*dy>49) continue;
        const px=cx+dx, py=cy+dy;
        if(px<0||py<0||px>=CW||py>=CH) continue;
        const k=(py*CW+px)*4;
        if(data[k+3]<50) continue;
        const lum=data[k]*0.299+data[k+1]*0.587+data[k+2]*0.114;
        samples.push({r:data[k],g:data[k+1],b:data[k+2],l:lum});
      }
    }
  }
  if(!samples.length) return null;
  samples.sort(function(p,q){return p.l-q.l;});
  const n=Math.max(3,Math.round(samples.length*0.4));
  const rr=[],gg=[],bb=[];
  for(let i=0;i<n;i++){ rr.push(samples[i].r); gg.push(samples[i].g); bb.push(samples[i].b); }
  const hx=function(v){ const s=Math.max(0,Math.min(255,Math.round(v))).toString(16); return s.length<2?"0"+s:s; };
  return "#"+hx(median(rr))+hx(median(gg))+hx(median(bb));
}
/* 外轮廓墨迹带：先把整幅墨迹向外膨胀 R 像素，让发丝、五官之间的窄白缝并进同一个「剪影」，
   再从画面四边泛洪出剪影之外的白区（真正的画面外部）；离这片外部白区不超过 R+10 的墨迹才算外轮廓。
   内部线条被剪影包住，离画面外部很远，不再参与缺口配对。 */
function outerBand(grid,w,h){
  const n=w*h, R=12, LIM=R+10;
  const dist=new Int16Array(n); dist.fill(4095);
  const q=new Int32Array(n);
  let head=0, tail=0;
  for(let i=0;i<n;i++) if(grid[i]){ dist[i]=0; q[tail++]=i; }
  if(!tail) return new Uint8Array(n);
  while(head<tail){                                   /* 墨迹外扩 R 像素，窄缝被并拢 */
    const p=q[head++], d=dist[p];
    if(d>=R) continue;
    const x=p%w, y=(p-x)/w;
    for(let k=0;k<8;k++){
      const nx=x+N8[k][0], ny=y+N8[k][1];
      if(nx<0||ny<0||nx>=w||ny>=h) continue;
      const np=ny*w+nx;
      if(dist[np]<=d+1) continue;
      dist[np]=d+1; q[tail++]=np;
    }
  }
  const blob=new Uint8Array(n);
  for(let i=0;i<n;i++) if(dist[i]<=R) blob[i]=1;
  const ext=new Uint8Array(n);                        /* 剪影之外的白区 */
  const st=[];
  for(let x=0;x<w;x++){ if(!blob[x]) st.push(x); if(!blob[(h-1)*w+x]) st.push((h-1)*w+x); }
  for(let y=0;y<h;y++){ if(!blob[y*w]) st.push(y*w); if(!blob[y*w+w-1]) st.push(y*w+w-1); }
  let extCount=0;
  while(st.length){
    const p=st.pop();
    if(ext[p]||blob[p]) continue;
    ext[p]=1; extCount++;
    const x=p%w, y=(p-x)/w;
    if(x>0) st.push(p-1);
    if(x<w-1) st.push(p+1);
    if(y>0) st.push(p-w);
    if(y<h-1) st.push(p+w);
  }
  if(extCount<n*0.05) return grid.slice();            /* 画面几乎被墨迹占满，无从判断，退回全图 */
  const near=new Int16Array(n); near.fill(4095);
  head=0; tail=0;
  for(let i=0;i<n;i++) if(ext[i]){ near[i]=0; q[tail++]=i; }
  while(head<tail){                                   /* 外部白区向内延伸，覆盖外轮廓笔迹 */
    const p=q[head++], d=near[p];
    if(d>=LIM) continue;
    const x=p%w, y=(p-x)/w;
    for(let k=0;k<8;k++){
      const nx=x+N8[k][0], ny=y+N8[k][1];
      if(nx<0||ny<0||nx>=w||ny>=h) continue;
      const np=ny*w+nx;
      if(near[np]<=d+1) continue;
      near[np]=d+1; q[tail++]=np;
    }
  }
  const band=new Uint8Array(n);
  for(let i=0;i<n;i++) if(grid[i]&&near[i]<=LIM) band[i]=1;
  return band;
}
/* 部分检测：把自由圈选区域（base=1）用泛洪具体化 —— 从圈选区边界泛洪背景，
   未被泛洪的像素（线稿笔迹与被线条围住的内部）即为系统识别出的范围；
   再按 expand 做边界膨胀/腐蚀微调 */
function refineRegion(data,w,h,base,expand){
  let area=0;
  for(let i=0;i<w*h;i++) if(base[i]) area++;
  if(!area) return {mask:new Uint8Array(w*h),bounds:{minX:0,maxX:-1,minY:0,maxY:-1},count:0,leak:false};
  const seen=new Uint8Array(w*h);
  const stack=[];
  /* 圈选区边界像素作为背景泛洪的种子 */
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const p=y*w+x;
      if(!base[p]) continue;
      if(x===0||y===0||x===w-1||y===h-1||!base[p-1]||!base[p+1]||!base[p-w]||!base[p+w]) stack.push(p);
    }
  }
  let bgCount=0;
  while(stack.length){
    const p=stack.pop();
    if(seen[p]) continue;
    if(!base[p]) continue;
    seen[p]=1;
    const k=p*4;
    const a=data[k+3];
    const lum=a<50?255:(data[k]*0.299+data[k+1]*0.587+data[k+2]*0.114);
    if(lum<200){ seen[p]=2; continue; }   /* 墨迹不参与背景泛洪 */
    bgCount++;
    const x=p%w, y=(p-x)/w;
    if(x>0) stack.push(p-1);
    if(x<w-1) stack.push(p+1);
    if(y>0) stack.push(p-w);
    if(y<h-1) stack.push(p+w);
  }
  /* 泛洪几乎吃掉整块 → 圈选范围内线条有开口漏出，退回自由圈选形状 */
  const leak=bgCount>area*0.88;
  let mask=new Uint8Array(w*h);
  for(let i=0;i<w*h;i++){
    if(base[i]&&(leak||seen[i]!==1)) mask[i]=1;
  }
  /* 边界微调：正数向外膨胀，负数向内腐蚀 */
  const it=Math.min(16,Math.abs(Math.round(expand||0)));
  let cur=mask;
  for(let n=0;n<it;n++){
    const next=new Uint8Array(w*h);
    const grow=expand>0;
    for(let y=1;y<h-1;y++){
      const row=y*w;
      for(let x=1;x<w-1;x++){
        const p=row+x;
        if(grow){
          if(cur[p]) next[p]=1;
          else if(cur[p-1]||cur[p+1]||cur[p-w]||cur[p+w]) next[p]=1;
        }else if(cur[p]&&cur[p-1]&&cur[p+1]&&cur[p-w]&&cur[p+w]) next[p]=1;
      }
    }
    cur=next;
  }
  let minX=w,maxX=-1,minY=h,maxY=-1,count=0;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      if(!cur[y*w+x]) continue;
      count++;
      if(x<minX)minX=x; if(x>maxX)maxX=x;
      if(y<minY)minY=y; if(y>maxY)maxY=y;
    }
  }
  return {mask:cur,bounds:{minX:minX,maxX:maxX,minY:minY,maxY:maxY},count:count,leak:leak};
}
function detectGaps(buf,CW,CH,sens,mode,reg){
  const data=new Uint8ClampedArray(buf);
  const scale=2;
  const bz=binarize(data,CW,CH,scale);
  const w=bz.w, h=bz.h, ink=bz.ink;
  if(ink<20) return {gaps:[],sk:null,w:w,h:h,scale:scale,empty:1,tip:"缺口检测：未发现线条"};
  const grid=denoise(bz.grid,w,h);
  const sk=thin(grid,w,h);
  let skCount=0;
  for(let i=0;i<w*h;i++) if(sk[i]) skCount++;
  const lc=labelComps(sk,w,h), lab=lc.lab, size=lc.size;
  /* 端点：8 邻域内仅 1 个邻居的骨架点，并预算切线方向 */
  const eps=[];
  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const i=y*w+x;
      if(!sk[i]) continue;
      if(nbList(sk,w,h,x,y).length!==1) continue;
      if((size[lab[i]]||0)<3) continue;
      eps.push({i:i,x:x,y:y,comp:lab[i],t:skelTangent(sk,w,h,i,8)});
    }
  }
  /* 检测模式约束：外轮廓只保留贴近背景的外层墨迹端点；
     部分检测要求缺口两端都落在泛洪细化出的范围内 */
  const outer=mode==="outer"?outerBand(grid,w,h):null;
  const inRegion=function(x,y){
    if(!reg) return true;
    const px=Math.min(CW-1,Math.max(0,Math.round((x+0.5)*scale)));
    const py=Math.min(CH-1,Math.max(0,Math.round((y+0.5)*scale)));
    return reg[py*CW+px]===1;
  };
  /* 切线迎面预筛：真缺口两端的切线互相指向对方；
     发丝/线头等杂散端点方向随机，自动被过滤，密集发丝不再淹没真缺口。
     跨笔画（不同连通域）配对要求更强的迎面阈值；开口级额外要求互为最近端点。 */
  const tiers=[{d:16,kind:"断点",tan:0.35},{d:60,kind:"开口",tan:0.45,mutual:1}];
  const used=new Set();
  const gaps=[];
  const lineW=skCount?ink/(skCount*scale):3;
  for(let ti=0;ti<tiers.length;ti++){
    const tier=tiers[ti];
    const limit=tier.d*34;
    const maxD2=tier.d*tier.d;
    const distCache=new Map();   /* 测地距离懒计算：仅通过几何+切线预筛的端点才做 BFS，且每端点只算一次 */
    let nearest=null;
    if(tier.mutual){
      nearest=new Int32Array(eps.length).fill(-1);
      for(let a=0;a<eps.length;a++){
        if(used.has(a)) continue;
        const A=eps[a];
        let best=-1, bd=Infinity;
        for(let b=0;b<eps.length;b++){
          if(b===a||used.has(b)) continue;
          const dx=eps[b].x-A.x, dy=eps[b].y-A.y;
          const dd=dx*dx+dy*dy;
          if(dd>=bd) continue;
          const len=Math.sqrt(dd);
          if(A.t.x*dx/len+A.t.y*dy/len<0.3) continue;   /* 端点得朝着对方，同一笔画的另一头/背后端点不算候选 */
          bd=dd; best=b;
        }
        nearest[a]=best;
      }
    }
    const pairs=[];
    for(let a=0;a<eps.length;a++){
      if(used.has(a)) continue;
      const A=eps[a];
      for(let b=a+1;b<eps.length;b++){
        if(used.has(b)) continue;
        if(nearest&&(nearest[a]!==b||nearest[b]!==a)) continue;
        const B=eps[b];
        const dx=B.x-A.x, dy=B.y-A.y;
        const d2=dx*dx+dy*dy;
        if(d2>maxD2||d2<1) continue;
        const eu=Math.sqrt(d2);
        const ux=dx/eu, uy=dy/eu;
        const need=A.comp!==B.comp?Math.min(0.8,tier.tan+0.2):tier.tan;
        if(A.t.x*ux+A.t.y*uy<need) continue;
        if(-(B.t.x*ux+B.t.y*uy)<need) continue;
        if(A.t.x*B.t.x+A.t.y*B.t.y>-0.25) continue;   /* 真缺口两端切线近似反向平行 */
        if(outer&&(!outer[A.i]||!outer[B.i])) continue;   /* 外轮廓检测：两端都须在外层墨迹带 */
        if(!inRegion(A.x,A.y)||!inRegion(B.x,B.y)) continue;   /* 部分检测：两端都须在圈定范围内 */
        let dist=distCache.get(a);
        if(!dist){ dist=geoDist(sk,w,h,A.i,limit); distCache.set(a,dist); }
        const gd=dist[B.i];
        if(!(gd>=32000||gd>eu*10*3.2)) continue;   /* 沿骨架本来就相连 → 不算缺口 */
        pairs.push({a:a,b:b,eu:eu*10});
      }
    }
    pairs.sort(function(p,q){return p.eu-q.eu;});
    for(let n=0;n<pairs.length;n++){
      const p=pairs[n];
      if(used.has(p.a)||used.has(p.b)) continue;
      used.add(p.a); used.add(p.b);
      const A=eps[p.a], B=eps[p.b];
      const gsize=(p.eu/10)*scale;
      /* 按线稿本身的局部粗细与颜色推导补线笔刷，避免一处缺口用错笔触 */
      const lw=localWidthAt(grid,w,h,A.x,A.y);
      const gwidth=Math.max(2,Math.round((lw||lineW)*scale));
      const gcolor=inkColorHex(data,CW,CH,(A.x+0.5)*scale,(A.y+0.5)*scale,(B.x+0.5)*scale,(B.y+0.5)*scale);
      gaps.push({
        ax:(A.x+0.5)*scale, ay:(A.y+0.5)*scale,
        bx:(B.x+0.5)*scale, by:(B.y+0.5)*scale,
        ax2:A.x, ay2:A.y, bx2:B.x, by2:B.y, ai:A.i, bi:B.i,
        size:Math.round(gsize),
        width:gwidth,
        color:gcolor,
        sev:gsize<=10?1:gsize<=22?2:3,
        kind:tier.kind,
        comp:A.comp
      });
    }
  }
  /* 端点 → 线条侧面：线稿里常见「短线悬空、没接到另一条线的侧面」的缺口，
     两端点配对逻辑覆盖不到这类情况；沿端点切线方向找最近的另一条线并连上。 */
  const SIDE_D=26;                 /* 最长补线距离（画布像素） */
  const sideMax=Math.round(SIDE_D/scale);
  for(let a=0;a<eps.length;a++){
    if(used.has(a)) continue;
    const A=eps[a];
    if(outer&&!outer[A.i]) continue;
    if(!inRegion(A.x,A.y)) continue;
    const ownW=localWidthAt(grid,w,h,A.x,A.y)||lineW;
    const startS=Math.max(3,Math.round(ownW/2)+2);   /* 跳过自身笔画的墨迹 */
    let hit=-1, hitS=0;
    for(let s=startS;s<=sideMax;s++){
      const x=Math.round(A.x+A.t.x*s), y=Math.round(A.y+A.t.y*s);
      if(x<1||y<1||x>=w-1||y>=h-1) break;
      if(grid[y*w+x]){ hit=y*w+x; hitS=s; break; }
    }
    if(hit<0) continue;
    /* 命中点附近取骨架点作为落点：只认别的笔画，命中自身笔画的侧面不算缺口 */
    const hx0=hit%w, hy0=(hit-hx0)/w;
    let best=-1, bestD=Infinity;
    for(let dy=-8;dy<=8;dy++){
      for(let dx=-8;dx<=8;dx++){
        const nx=hx0+dx, ny=hy0+dy;
        if(nx<1||ny<1||nx>=w-1||ny>=h-1) continue;
        const q=ny*w+nx;
        if(!sk[q]||lab[q]===A.comp) continue;
        const dd=dx*dx+dy*dy;
        if(dd<bestD){ bestD=dd; best=q; }
      }
    }
    if(best<0) continue;                    /* 附近没有别的笔画，不做补线 */
    const bx0=best%w, by0=(best-bx0)/w;
    if(outer&&!outer[best]) continue;
    if(!inRegion(bx0,by0)) continue;
    const ax=(A.x+0.5)*scale, ay=(A.y+0.5)*scale;
    const bx=(bx0+0.5)*scale, by=(by0+0.5)*scale;
    /* 已有缺口覆盖同一落点时不重复记录 */
    let dup=false;
    for(let n=0;n<gaps.length&&!dup;n++){
      if(Math.hypot(gaps[n].ax-ax,gaps[n].ay-ay)<10) dup=true;
      else if(Math.hypot(gaps[n].bx-ax,gaps[n].by-ay)<10) dup=true;
      else if(Math.hypot(gaps[n].bx-bx,gaps[n].by-by)<10) dup=true;
    }
    if(dup) continue;
    used.add(a);
    const gsize=Math.hypot(bx-ax,by-ay);
    const lw=localWidthAt(grid,w,h,A.x,A.y);
    gaps.push({
      ax:ax, ay:ay, bx:bx, by:by,
      ax2:A.x, ay2:A.y, bx2:bx0, by2:by0, ai:A.i, bi:best,
      size:Math.round(gsize||hitS*scale),
      width:Math.max(2,Math.round((lw||lineW)*scale)),
      color:inkColorHex(data,CW,CH,ax,ay,bx,by),
      sev:gsize<=10?1:gsize<=22?2:3,
      kind:"接触",
      straight:1,            /* 落点在另一条线的侧面，闭合时走直线更贴合 */
      comp:A.comp
    });
  }
  gaps.sort(function(x,y){return x.ay-y.ay||x.ax-y.ax;});
  const before=gaps.length;
  const filtered=gaps.filter(function(g){return g.size>=sens;});
  let tip;
  if(filtered.length){
    tip="缺口检测：发现 "+filtered.length+" 处未闭合缺口，点击下方列表项在画布上红色标明"+(before!==filtered.length?"（已忽略 "+(before-filtered.length)+" 处细小缺口）":"");
  }else{
    tip=before?"缺口检测：仅发现 "+before+" 处低于灵敏度阈值的细小缺口":"缺口检测：未发现未闭合的断点";
  }
  return {gaps:filtered,sk:sk.buffer,w:w,h:h,scale:scale,empty:0,tip:tip};
}
function colorDistAt(data,k,sr,sg,sb,sa){
  const dr=data[k]-sr, dg=data[k+1]-sg, db=data[k+2]-sb, da=data[k+3]-sa;
  return Math.sqrt(dr*dr+dg*dg+db*db+da*da);
}
function floodFillMask(data,w,h,sx,sy,tol){
  const mask=new Uint8Array(w*h);
  const seedIdx=(sy*w+sx)*4;
  const sr=data[seedIdx], sg=data[seedIdx+1], sb=data[seedIdx+2], sa=data[seedIdx+3];
  const stack=[[sx,sy]];
  let minX=sx,maxX=sx,minY=sy,maxY=sy;
  let visited=0, aborted=false;
  const PIXEL_CAP=262144;   /* 最多约 512×512 像素，防止爆炸 */
  while(stack.length){
    const pt=stack.pop();
    const x=pt[0], y=pt[1];
    if(x<0||y<0||x>=w||y>=h) continue;
    const idx=y*w+x;
    if(mask[idx]) continue;
    const k=idx*4;
    if(colorDistAt(data,k,sr,sg,sb,sa)>tol) continue;
    mask[idx]=1;
    visited++;
    if(visited>PIXEL_CAP){ aborted=true; break; }
    if(x<minX)minX=x; if(x>maxX)maxX=x;
    if(y<minY)minY=y; if(y>maxY)maxY=y;
    stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
  }
  return {mask:mask,bounds:{minX:minX,maxX:maxX,minY:minY,maxY:maxY},count:visited,aborted:aborted};
}
`;

    /* 内联 Web Worker：复杂图像处理在后台线程执行，主界面不掉帧 */
    const SCAN_WORKER_SRC = SCAN_LIB + `
onmessage=function(e){
  const m=e.data;
  if(m.type==="scan"){
    const reg=m.reg?new Uint8Array(m.reg):null;
    const r=detectGaps(m.buf,m.CW,m.CH,m.sens,m.mode,reg);
    const out={type:"scan",seq:m.seq,gaps:r.gaps,sk:r.sk,w:r.w,h:r.h,scale:r.scale,empty:r.empty,tip:r.tip};
    if(r.sk) postMessage(out,[r.sk]); else postMessage(out);
  }else if(m.type==="wand"){
    const r=floodFillMask(new Uint8ClampedArray(m.buf),m.w,m.h,m.x,m.y,m.tol);
    postMessage({type:"wand",seq:m.seq,mask:r.mask.buffer,bounds:r.bounds,count:r.count,aborted:r.aborted,seedX:m.x,seedY:m.y},[r.mask.buffer]);
  }else if(m.type==="region"){
    const r=refineRegion(new Uint8ClampedArray(m.buf),m.w,m.h,new Uint8Array(m.base),0);
    postMessage({type:"region",seq:m.seq,op:m.op,mask:r.mask.buffer,bounds:r.bounds,count:r.count,leak:r.leak},[r.mask.buffer]);
  }
};`;

    try {
      drawState.scanWorker = new Worker(URL.createObjectURL(new Blob([SCAN_WORKER_SRC], { type: "text/javascript" })));
      drawState.scanWorker.onerror = () => { drawState.workerDead = true; };
      drawState.scanWorker.onmessage = onScanMessage;
    } catch (err) { drawState.scanWorker = null; drawState.workerDead = true; }

    function scanLib() {   /* Worker 不可用时的主线程兜底 */
      if (!drawState.scanLibMain) drawState.scanLibMain = new Function(SCAN_LIB + ";return {detectGaps:detectGaps,floodFillMask:floodFillMask,skelTangent:skelTangent,refineRegion:refineRegion};")();
      return drawState.scanLibMain;
    }

    function onScanMessage(e) {
      const m = e.data;
      if (m.type === "scan") {
        if (m.seq !== drawState.scanSeq) return;   /* 过期结果丢弃 */
        drawState.gaps = m.gaps;
        drawState.activeGap = null;
        drawState.gapSk = m.sk ? new Uint8Array(m.sk) : null;   /* 骨架供曲线闭合取切线方向 */
        drawState.gapW = m.w; drawState.gapH = m.h; drawState.gapScale = m.scale;
        annotateRepairs();   /* 标注反复出现（已修复 ≥3 次）的顽固缺口 */
        const stuck = drawState.gaps.find(g => (g.repairs || 0) >= 3);
        if (stuck) notifyStuckGap(stuck);   /* 重复 3 次仍出现：弹框提示改为手动修复 */
        octx.clearRect(0, 0, CW, CH);
        if (m.empty) {
          gapList.innerHTML = `<div class="empty-note">画布几乎是空的，先画几笔或载入示例线稿再扫描。</div>`;
        } else {
          renderGapList();
        }
        drawOverlayGaps();
        tipGap.textContent = m.tip;
      } else if (m.type === "wand") {
        if (m.seq !== drawState.wandSeq) return;
        handleWandMask(new Uint8Array(m.mask), m.bounds, m.count, m.aborted, m.seedX, m.seedY);
      } else if (m.type === "region") {
        if (m.seq !== drawState.regionSeq) return;
        handleRegionMask(new Uint8Array(m.mask), m.bounds, m.count, m.leak, m.op);
      }
    }

    function scanGaps() {
      if (drawState.scanMode === "partial" && !drawState.regionMask) {
        toast("部分检测：请先在画布上圈出要检测的范围");
        tipGap.textContent = "部分检测：尚未圈定范围";
        return;
      }
      let img;
      try { compositeCanvas(false); img = compCtx.getImageData(0, 0, CW, CH); }
      catch (err) { toast("画布像素读取失败，无法进行缺口检测"); return; }
      drawState.lastData = img.data;

      const seq = ++drawState.scanSeq;
      tipGap.textContent = "缺口检测：后台扫描中…";
      const buf = img.data.buffer.slice(0);   /* 拷贝一份供 transfer，drawState.lastData 保持可用 */
      /* 部分检测：把泛洪范围再拷一份随消息传入，主线程保留原 mask 用于虚线框绘制 */
      const regCopy = (drawState.scanMode === "partial" && drawState.regionMask) ? drawState.regionMask.slice() : null;
      if (drawState.scanWorker && !drawState.workerDead) {
        const msg = { type: "scan", seq, buf, CW, CH, sens: drawState.sensMinGap, mode: drawState.scanMode };
        const transfer = [buf];
        if (regCopy) { msg.reg = regCopy.buffer; transfer.push(regCopy.buffer); }
        drawState.scanWorker.postMessage(msg, transfer);
      } else {
        const r = scanLib().detectGaps(buf, CW, CH, drawState.sensMinGap, drawState.scanMode, regCopy);
        onScanMessage({ data: { type: "scan", seq, gaps: r.gaps, sk: r.sk, w: r.w, h: r.h, scale: r.scale, empty: r.empty, tip: r.tip } });
      }
    }

    /* ---------- 部分检测：灰色蒙层 → 自由圈选 → 泛洪细化 → 黑色流动虚线 → 加/减范围 → 手动检测 ---------- */
    /* 切换检测模式：外轮廓只保留最外层墨迹上的缺口；部分检测只在圈定范围内检测 */
    function setScanMode(mode) {
      drawState.scanMode = mode;
      panelDraw.querySelectorAll("[data-scan-mode]").forEach(b =>
        b.classList.toggle("on", b.dataset.scanMode === mode));
      $id("regionBox").style.display = mode === "partial" ? "block" : "none";
      if (mode === "outer") {
        drawState.regionArmed = false;
        drawState.lassoPts = null;
        stopRegionAnim();
        invalidateGaps("已切换到外轮廓检测，点击「开始扫描」检测最外层轮廓的缺口。");
      } else {
        drawState.regionArmed = !drawState.regionMask;
        drawState.regionOp = "base";
        refreshGray();
        updateRegionUI();
        if (drawState.regionEdge) startRegionAnim(); else stopRegionAnim();
        invalidateGaps(drawState.regionMask
          ? "部分检测：范围已圈定，点击「检测缺口」检测线稿缺口。"
          : "部分检测：画布已覆上灰色蒙层，按住鼠标自由圈出要检测的范围。");
      }
      drawOverlayGaps();
    }

    /* 范围面板状态同步 */
    function updateRegionUI() {
      const has = !!drawState.regionMask;
      $id("regionApply").style.display = has ? "inline-flex" : "none";
      $id("regionAdd").style.display = has ? "inline-flex" : "none";
      $id("regionSub").style.display = has ? "inline-flex" : "none";
      $id("regionClear").style.display = has ? "inline-flex" : "none";
      $id("regionExpandWrap").style.display = has ? "flex" : "none";
      $id("regionPick").textContent = has ? "重新圈选" : "圈选范围";
      let hint;
      if (!has) {
        hint = "画布已覆上一层半透明灰色。按住鼠标自由圈出要检测的范围，圈内灰色会随即去除，系统再自动识别具体范围并用黑色流动虚线标出。";
      } else {
        hint = "黑色流动虚线是系统识别出的检测范围，未圈选处保持灰色。「加范围」「减范围」可继续圈选并入或剔除，确认后点击「检测缺口」。";
        if (drawState.regionBounds) {
          const w = drawState.regionBounds.maxX - drawState.regionBounds.minX + 1;
          const h = drawState.regionBounds.maxY - drawState.regionBounds.minY + 1;
          hint += " 当前范围约 " + w + "×" + h + "px。";
        }
      }
      $id("regionHint").textContent = hint;
    }

    /* 进入圈选待命：op=base 重新圈定 / add 并入 / sub 剔除 */
    function armRegionPick(op) {
      if (drawState.scanMode !== "partial") return;
      drawState.regionOp = op || "base";
      drawState.regionArmed = true;
      drawState.lassoPts = null;
      const word = drawState.regionOp === "add" ? "加范围：在画布上圈出要并入检测的区域"
        : drawState.regionOp === "sub" ? "减范围：在画布上圈出要剔除的区域"
          : "在画布上按住拖拽，自由圈出要检测的范围";
      tipGap.textContent = "部分检测：" + word;
      drawOverlayGaps();
    }

    /* 自由圈选结束：先把轨迹栅格化成掩码，再交给 Worker 做泛洪细化 */
    function finishLasso(pts) {
      let minX = CW, maxX = -1, minY = CH, maxY = -1;
      pts.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
      refreshGray();
      if (pts.length < 4 || maxX - minX < 8 || maxY - minY < 8) {
        drawOverlayGaps();
        toast("圈选范围太小，请重新圈出更大的范围");
        return;
      }
      requestRegion(rasterizePolygon(pts), drawState.regionOp);
    }

    /* 把自由圈选的轨迹按奇偶规则栅格化成画布尺寸的掩码 */
    function rasterizePolygon(pts) {
      const mask = new Uint8Array(CW * CH);
      const n = pts.length;
      const xs = [];
      for (let y = 0; y < CH; y++) {
        xs.length = 0;
        const sy = y + 0.5;
        for (let i = 0; i < n; i++) {
          const a = pts[i], b = pts[(i + 1) % n];
          if ((a.y <= sy && b.y > sy) || (b.y <= sy && a.y > sy)) {
            xs.push(a.x + (sy - a.y) / (b.y - a.y) * (b.x - a.x));
          }
        }
        if (!xs.length) continue;
        xs.sort((p, q) => p - q);
        for (let k = 0; k + 1 < xs.length; k += 2) {
          const x0 = Math.max(0, Math.ceil(xs[k] - 0.5));
          const x1 = Math.min(CW - 1, Math.floor(xs[k + 1] - 0.5));
          for (let x = x0; x <= x1; x++) mask[y * CW + x] = 1;
        }
      }
      return mask;
    }

    /* 把圈选掩码交给 Worker（或主线程兜底）做泛洪细化 */
    function requestRegion(base, op) {
      let img;
      try { compositeCanvas(false); img = compCtx.getImageData(0, 0, CW, CH); }
      catch (err) { toast("画布像素读取失败，无法识别圈选范围"); return; }
      const buf = img.data.buffer.slice(0);
      const seq = ++drawState.regionSeq;
      tipGap.textContent = "部分检测：正在识别圈选范围…";
      if (drawState.scanWorker && !drawState.workerDead) {
        const baseCopy = base.slice();
        drawState.scanWorker.postMessage({ type: "region", seq, buf, w: CW, h: CH, base: baseCopy.buffer, op },
          [buf, baseCopy.buffer]);
      } else {
        const r = scanLib().refineRegion(new Uint8ClampedArray(buf), CW, CH, base, 0);
        handleRegionMask(r.mask, r.bounds, r.count, r.leak, op);
      }
    }

    /* 范围细化完成：按 op 并入/剔除，重算边界与灰层，等待用户手动点「检测缺口」 */
    function handleRegionMask(mask, bounds, count, leak, op) {
      op = op || "base";
      if (op === "base") {
        drawState.regionMaskRaw = mask;
      } else {
        if (!drawState.regionMaskRaw) drawState.regionMaskRaw = new Uint8Array(CW * CH);
        for (let i = 0, n = CW * CH; i < n; i++) {
          if (op === "add") { if (mask[i]) drawState.regionMaskRaw[i] = 1; }
          else if (mask[i]) drawState.regionMaskRaw[i] = 0;
        }
      }
      drawState.regionArmed = false;
      drawState.lassoPts = null;
      applyRegionRaw();
      if (leak) toast("圈选区域内线条有开口，已按圈选形状识别范围");
      if (!drawState.regionMask) {
        tipGap.textContent = "部分检测：范围内没有可检测内容，请重新圈选";
      } else {
        tipGap.textContent = "部分检测：范围已" + (op === "add" ? "扩大" : op === "sub" ? "缩小" : "确定") +
          "（" + drawState.regionCount + " 像素），确认后点击「检测缺口」。";
      }
    }

    /* 依据未微调的掩码重算最终范围：边界微调 → 边界点 → 灰层 → 流动虚线动画 */
    function applyRegionRaw() {
      if (!drawState.regionMaskRaw) {
        drawState.regionMask = null; drawState.regionEdge = null; drawState.regionBounds = null; drawState.regionCount = 0;
      } else {
        drawState.regionMask = adjustMask(drawState.regionMaskRaw, drawState.regionExpand);
        drawState.regionCount = 0;
        let minX = CW, maxX = -1, minY = CH, maxY = -1;
        for (let y = 0; y < CH; y++) {
          for (let x = 0; x < CW; x++) {
            if (!drawState.regionMask[y * CW + x]) continue;
            drawState.regionCount++;
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
        if (!drawState.regionCount) {
          drawState.regionMask = null; drawState.regionEdge = null; drawState.regionBounds = null;
        } else {
          drawState.regionBounds = { minX, maxX, minY, maxY };
          drawState.regionEdge = buildRegionEdge(drawState.regionMask);
        }
      }
      refreshGray();
      updateRegionUI();
      if (drawState.regionEdge) startRegionAnim(); else stopRegionAnim();
      drawOverlayGaps();
    }

    /* 边界微调：正数向外膨胀，负数向内腐蚀 */
    function adjustMask(mask, expand) {
      const it = Math.min(16, Math.abs(Math.round(expand || 0)));
      let cur = mask.slice();
      for (let n = 0; n < it; n++) {
        const next = new Uint8Array(CW * CH);
        const grow = expand > 0;
        for (let y = 1; y < CH - 1; y++) {
          const row = y * CW;
          for (let x = 1; x < CW - 1; x++) {
            const p = row + x;
            if (grow) {
              if (cur[p]) next[p] = 1;
              else if (cur[p - 1] || cur[p + 1] || cur[p - CW] || cur[p + CW]) next[p] = 1;
            } else if (cur[p] && cur[p - 1] && cur[p + 1] && cur[p - CW] && cur[p + CW]) next[p] = 1;
          }
        }
        cur = next;
      }
      return cur;
    }

    /* 半透明灰色蒙层：未圈选处覆盖，检测范围与正在圈选的轨迹内透出画布 */
    function refreshGray() {
      grayCtx.globalCompositeOperation = "source-over";
      grayCtx.clearRect(0, 0, CW, CH);
      grayCtx.fillStyle = "rgba(128,128,134,.55)";
      grayCtx.fillRect(0, 0, CW, CH);
      grayCtx.globalCompositeOperation = "destination-out";
      if (drawState.regionMask) {
        if (!drawState.holeImg) drawState.holeImg = holeCtx.createImageData(CW, CH);
        const d = drawState.holeImg.data;
        for (let i = 0, n = CW * CH; i < n; i++) d[i * 4 + 3] = drawState.regionMask[i] ? 255 : 0;
        holeCtx.putImageData(drawState.holeImg, 0, 0);
        grayCtx.drawImage(holeCanvas, 0, 0);
      }
      if (drawState.lassoPts && drawState.lassoPts.length > 1) {
        grayCtx.beginPath();
        grayCtx.moveTo(drawState.lassoPts[0].x, drawState.lassoPts[0].y);
        for (let i = 1; i < drawState.lassoPts.length; i++) grayCtx.lineTo(drawState.lassoPts[i].x, drawState.lassoPts[i].y);
        grayCtx.closePath();
        grayCtx.fill();
      }
      grayCtx.globalCompositeOperation = "source-over";
      if (drawState.lassoPts && drawState.lassoPts.length > 1) {   /* 圈选轨迹本身描一条细线，便于看清圈到哪 */
        grayCtx.strokeStyle = "rgba(0,0,0,.55)";
        grayCtx.lineWidth = 2;
        grayCtx.beginPath();
        grayCtx.moveTo(drawState.lassoPts[0].x, drawState.lassoPts[0].y);
        for (let i = 1; i < drawState.lassoPts.length; i++) grayCtx.lineTo(drawState.lassoPts[i].x, drawState.lassoPts[i].y);
        grayCtx.stroke();
      }
      drawState.grayReady = true;
    }

    /* 黑色流动虚线：按屏幕坐标推进相位形成流动效果 */
    function startRegionAnim() {
      if (drawState.regionAnimId) return;
      let last = 0;
      const loop = t => {
        if (drawState.scanMode !== "partial" || !drawState.regionEdge) { drawState.regionAnimId = null; return; }
        if (t - last > 90) {
          drawState.regionPhase = (drawState.regionPhase + 1) % 12;
          drawOverlayGaps();
          last = t;
        }
        drawState.regionAnimId = requestAnimationFrame(loop);
      };
      drawState.regionAnimId = requestAnimationFrame(loop);
    }

    function stopRegionAnim() {
      if (drawState.regionAnimId) cancelAnimationFrame(drawState.regionAnimId);
      drawState.regionAnimId = null;
    }

    /* 提取范围边界像素，供黑色流动虚线绘制 */
    function buildRegionEdge(mask) {
      const edge = [];
      for (let y = 1; y < CH - 1; y++) {
        const base = y * CW;
        for (let x = 1; x < CW - 1; x++) {
          const p = base + x;
          if (!mask[p]) continue;
          if (!mask[p - 1] || !mask[p + 1] || !mask[p - CW] || !mask[p + CW]) edge.push(p);
        }
      }
      return edge;
    }

    function clearRegion() {
      drawState.regionMask = null;
      drawState.regionMaskRaw = null;
      drawState.regionEdge = null;
      drawState.regionBounds = null;
      drawState.regionCount = 0;
      drawState.regionArmed = drawState.scanMode === "partial";
      drawState.regionOp = "base";
      drawState.lassoPts = null;
      stopRegionAnim();
      refreshGray();
      updateRegionUI();
      invalidateGaps("已清除检测范围。重新圈选后再检测缺口。");
      drawOverlayGaps();
    }

    const SEV = { 1: ["轻微", "s1"], 2: ["中等", "s2"], 3: ["明显", "s3"] };

    /* ---------- 顽固缺口统计：同一位置被自动修复 ≥3 次即提示手动补线 ---------- */
    function repairEntry(g) {
      const mx = (g.ax + g.bx) / 2, my = (g.ay + g.by) / 2;
      for (let i = 0; i < drawState.repairLog.length; i++) {
        const r = drawState.repairLog[i];
        if (Math.hypot(r.x - mx, r.y - my) < 18 && Math.abs(r.size - g.size) < 14) return r;
      }
      return null;
    }

    /* 扫描完成后回填计数，供列表项展示与关闭拦截 */
    function annotateRepairs() {
      drawState.gaps.forEach(g => {
        const r = repairEntry(g);
        g.repairs = r ? r.count : 0;
      });
    }

    function registerRepair(g) {
      const mx = (g.ax + g.bx) / 2, my = (g.ay + g.by) / 2;
      const r = repairEntry(g);
      if (r) { r.count++; r.size = g.size; r.x = mx; r.y = my; }
      else drawState.repairLog.push({ x: mx, y: my, size: g.size, count: 1 });
    }

    /* 撤回闭合时同步回退计数，避免误判顽固 */
    function cancelRepair(g) {
      const r = repairEntry(g);
      if (!r) return;
      r.count--;
      if (r.count <= 0) drawState.repairLog.splice(drawState.repairLog.indexOf(r), 1);
    }

    function renderGapList() {
      if (!drawState.gaps.length) {
        gapList.innerHTML = `<div class="empty-note">扫描完成，未发现未闭合的线稿断点。线条看起来是完整闭合的。</div>`;
        return;
      }
      const modeNote = drawState.scanMode === "partial" ? "部分检测（已圈定范围）" : "外轮廓检测";
      gapList.innerHTML = `<div class="empty-note" style="margin-bottom:10px">${modeNote}：共 ${drawState.gaps.length} 处缺口，画面复杂默认不标明，点击任一项在画布上红色标明。</div>` + drawState.gaps.map((g, i) => {
        const [txt, cls] = SEV[g.sev];
        const stuck = g.repairs >= 3;
        const gcolor = g.color || sampleColor(g.ax, g.ay);
        const stuckNote = stuck
          ? `<div class="gd" style="color:#e0a0a0">该缺口已自动修复 ${g.repairs} 次仍反复出现，建议点「在画布上定位」后改用下方匹配笔刷手动补线。</div>`
          : "";
        return `
    <div class="gap-item ${i === drawState.activeGap ? "on" : ""} ${stuck ? "stuck" : ""}" data-gap="${i}">
      <div class="gt">
        <span class="sev ${cls}">${txt}</span>
        <span>${g.kind} #${i + 1}</span>
        <span class="gm">间距 ${g.size}px</span>
      </div>
      <div class="gd">
        ${g.kind === "接触"
          ? `短线端点 (${Math.round(g.ax)}, ${Math.round(g.ay)}) 与另一条线的侧面 (${Math.round(g.bx)}, ${Math.round(g.by)}) 之间未接上。`
          : `位置 (${Math.round(g.ax)}, ${Math.round(g.ay)}) → (${Math.round(g.bx)}, ${Math.round(g.by)})，两端点接近但线条未连上。`}
      </div>
      <div class="gd">
        匹配笔刷：<span class="sw-dot" style="background:${gcolor}"></span>${gcolor} · ${g.width}px
      </div>
      ${stuckNote}
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn sm" data-close-gap="${i}">${stuck ? "尝试再次闭合" : "闭合此处"}</button>
        <button class="btn ghost sm" data-locate-gap="${i}">在画布上定位</button>
      </div>
    </div>`;
      }).join("");
    }

    /* ---------- 缺口叠加层绘制（拆成：连线 / 端点圆 / 标签 三个小函数） ---------- */
    /* 红色虚线连接缺口两端 */
    function drawGapLine(g) {
      octx.strokeStyle = "rgba(224,82,82,.95)";
      octx.lineWidth = 3;
      octx.setLineDash([7, 6]);
      octx.beginPath();
      octx.moveTo(g.ax, g.ay);
      octx.lineTo(g.bx, g.by);
      octx.stroke();
      octx.setLineDash([]);
    }

    /* 缺口两端的圆环标记 */
    function drawGapEndpoints(g) {
      [[g.ax, g.ay], [g.bx, g.by]].forEach(([x, y]) => {
        octx.beginPath();
        octx.arc(x, y, 14, 0, Math.PI * 2);
        octx.strokeStyle = "#e05252";
        octx.lineWidth = 2;
        octx.stroke();
        octx.beginPath();
        octx.arc(x, y, 3, 0, Math.PI * 2);
        octx.fillStyle = "#e05252";
        octx.fill();
      });
    }

    /* 缺口编号与间距标签 */
    function drawGapLabel(g, index) {
      const mx = (g.ax + g.bx) / 2, my = (g.ay + g.by) / 2;
      const label = "缺口 #" + (index + 1) + " · " + g.size + "px";
      octx.font = "600 13px system-ui, -apple-system, sans-serif";
      const tw = octx.measureText(label).width;
      octx.fillStyle = "rgba(14,13,16,.86)";
      octx.strokeStyle = "rgba(224,82,82,.65)";
      octx.lineWidth = 1;
      const bx = mx - tw / 2 - 9, by = my - 12;
      octx.beginPath();
      octx.rect(bx, by, tw + 18, 24);
      octx.fill();
      octx.stroke();
      octx.fillStyle = "#ff8a8a";
      octx.textAlign = "left";
      octx.textBaseline = "middle";
      octx.fillText(label, bx + 9, by + 12);
    }

    /* 部分检测：半透明灰色蒙层（圈选范围内透出画布） + 黑色流动虚线范围 */
    function drawRegionOverlay() {
      if (drawState.scanMode !== "partial") return;
      if (drawState.grayReady) octx.drawImage(grayCanvas, 0, 0);
      if (!drawState.regionEdge || !drawState.regionEdge.length) return;
      octx.save();
      octx.fillStyle = "#0b0b0e";
      const ph = drawState.regionPhase;
      for (let i = 0; i < drawState.regionEdge.length; i++) {
        const p = drawState.regionEdge[i];
        const x = p % CW, y = (p - x) / CW;
        if ((x + y + ph) % 12 < 6) octx.fillRect(x, y, 1, 1);
      }
      octx.restore();
    }

    function drawOverlayGaps() {
      octx.clearRect(0, 0, CW, CH);
      drawRegionOverlay();   /* 部分检测的灰色蒙层与流动虚线常驻显示 */
      /* 复杂画面默认不标明任何缺口，仅点击列表项后才用红色高亮所选缺口 */
      if (drawState.activeGap === null || !drawState.gaps[drawState.activeGap]) return;
      const g = drawState.gaps[drawState.activeGap];
      octx.save();
      drawGapLine(g);
      drawGapEndpoints(g);
      drawGapLabel(g, drawState.activeGap);
      octx.restore();
    }

    function hitGap(p) {
      const R = 26;
      for (let i = 0; i < drawState.gaps.length; i++) {
        const g = drawState.gaps[i];
        const d1 = Math.hypot(p.x - g.ax, p.y - g.ay);
        const d2 = Math.hypot(p.x - g.bx, p.y - g.by);
        const dm = Math.hypot(p.x - (g.ax + g.bx) / 2, p.y - (g.ay + g.by) / 2);
        if (d1 < R || d2 < R || dm < R) return i;
      }
      return -1;
    }

    /* 在画布上定位缺口，同时套用识别出的线稿笔刷，方便直接手动补线 */
    function selectGap(i) {
      if (i < 0 || i >= drawState.gaps.length) return;
      drawState.activeGap = i;
      renderGapList();
      drawOverlayGaps();
      const g = drawState.gaps[i];
      const b = applyGapBrush(g);
      let msg = "已用红色标明 " + g.kind + " #" + (i + 1) + "：两端相距 " + g.size + "px，已套用匹配笔刷 " + b.col + " / " + b.size + "px";
      if (g.repairs >= 3) msg += "。该缺口已反复出现 " + g.repairs + " 次，建议手动补线";
      tipGap.textContent = msg;
    }

    /* 把缺口处的线稿颜色与粗细直接套到画笔上（定位 / 顽固缺口共用） */
    function applyGapBrush(g) {
      const col = g.color || sampleColor(g.ax, g.ay);
      drawState.brush.color = col;
      drawState.brush.size = Math.max(2, Math.round(g.width || 4));
      drawState.brush.opacity = 100;
      $id("brushColor").value = col;
      $id("brushSize").value = drawState.brush.size;
      renderSwatches();
      setTool("pen");
      updateTip();
      return { col: col, size: drawState.brush.size };
    }

    function sampleColor(x, y) {
      if (!drawState.lastData) return drawState.brush.color;
      const hx = v => ("0" + Math.round(v).toString(16)).slice(-2);
      for (let rad = 0; rad <= 10; rad += 2) {
        for (let dy = -rad; dy <= rad; dy++) {
          for (let dx = -rad; dx <= rad; dx++) {
            const px = Math.round(x + dx), py = Math.round(y + dy);
            if (px < 0 || py < 0 || px >= CW || py >= CH) continue;
            const k = (py * CW + px) * 4;
            if (drawState.lastData[k + 3] > 60) return "#" + hx(drawState.lastData[k]) + hx(drawState.lastData[k + 1]) + hx(drawState.lastData[k + 2]);
          }
        }
      }
      return drawState.brush.color;
    }

    /* 取色吸管：读取点击处合成分的像素颜色并设为当前画笔色，可纠正系统匹配的颜色 */
    function pickColor(p) {
      const px = Math.max(0, Math.min(CW - 1, Math.round(p.x)));
      const py = Math.max(0, Math.min(CH - 1, Math.round(p.y)));
      let d = null;
      try { compositeCanvas(false); d = compCtx.getImageData(px, py, 1, 1).data; }
      catch (err) { toast("画布像素读取失败，无法取色"); return; }
      if (!d || d[3] < 8) { toast("该处是透明区域，没有可吸取的颜色"); return; }
      const hx = v => ("0" + v.toString(16)).slice(-2);
      const hex = "#" + hx(d[0]) + hx(d[1]) + hx(d[2]);
      setColor(hex);
      tipGap.textContent = "取色吸管：已吸取 " + hex + "，画笔颜色已更新";
      toast("已吸取颜色 " + hex);
    }

    /* 计算闭合曲线的两个控制点：沿两端骨架切线外推，长度取缺口尺寸的 0.45 倍。
       骨架缺失、缺口过小或控制点偏移过大（会产生 S 形过冲）时返回 null，调用方回退为直线。
       说明：切线计算复用 SCAN_LIB 中的实现，避免主线程再维护一份重复算法。 */
    function buildCloseCurve(g) {
      if (!drawState.gapSk || g.size < 4) return null;
      if (g.straight || g.ai == null || g.bi == null || g.ai < 0 || g.bi < 0) return null;
      const lib = scanLib();
      const ta = lib.skelTangent(drawState.gapSk, drawState.gapW, drawState.gapH, g.ai, 8);
      const tb = lib.skelTangent(drawState.gapSk, drawState.gapW, drawState.gapH, g.bi, 8);
      const k = g.size * 0.45;
      const c1x = g.ax + ta.x * k, c1y = g.ay + ta.y * k;
      const c2x = g.bx + tb.x * k, c2y = g.by + tb.y * k;
      const mx = (g.ax + g.bx) / 2, my = (g.ay + g.by) / 2;
      if (Math.hypot(c1x - mx, c1y - my) >= g.size * 1.2) return null;
      if (Math.hypot(c2x - mx, c2y - my) >= g.size * 1.2) return null;
      return { c1x, c1y, c2x, c2y };
    }

    /* 闭合单处缺口：线条颜色与粗细取自线稿本身的局部统计；能算曲线就走贝塞尔 */
    function drawClose(g) {
      dctx.save();
      dctx.globalCompositeOperation = "source-over";
      dctx.globalAlpha = 1;
      dctx.strokeStyle = g.color || sampleColor(g.ax, g.ay);
      dctx.lineWidth = Math.max(2, g.width || 4);
      dctx.lineCap = "round";
      dctx.lineJoin = "round";

      const curve = buildCloseCurve(g);
      dctx.beginPath();
      dctx.moveTo(g.ax, g.ay);
      if (curve) dctx.bezierCurveTo(curve.c1x, curve.c1y, curve.c2x, curve.c2y, g.bx, g.by);
      else dctx.lineTo(g.bx, g.by);
      dctx.stroke();
      dctx.restore();
      return !!curve;
    }

    /* 顽固缺口弹框：同一缺口被自动修复 ≥3 次仍反复出现，提示改用匹配笔刷手动补线 */
    function showBigGapModal(g) {
      drawState.pendingGap = g;
      const col = g.color || sampleColor(g.ax, g.ay);
      $id("bigGapSwatch").style.background = col;
      $id("bigGapColor").textContent = col;
      $id("bigGapWidth").textContent = Math.max(2, g.width || 4);
      $id("bigGapDesc").textContent = "该缺口已被自动修复 " + (g.repairs || 0) +
        " 次仍反复出现，说明自动补线无法贴合此处线稿。请采用下方匹配笔刷（颜色与粗细），在画布上沿参考线手动补线。";
      $id("bigGapModal").style.display = "flex";
    }

    function hideBigGapModal() {
      $id("bigGapModal").style.display = "none";
      drawState.pendingGap = null;
    }

    /* 反复出现 ≥3 次：每次跨过新的修复次数时自动弹框一次，避免每次扫描都打扰 */
    function notifyStuckGap(g) {
      const r = repairEntry(g);
      if (!r || (r.notified || 0) >= r.count) return;
      r.notified = r.count;
      showBigGapModal(g);
      tipGap.textContent = "检测到反复出现 " + g.repairs + " 次的缺口，已弹框提示改为手动修复";
    }

    const MAX_CLOSE_ACTIONS = 10;    /* 闭合动作最多保留 10 组（每组含整张画布快照） */

    /* 记录一次闭合动作：single=单缺口，all=一键全部；snapshot 是动作发生前的整张画布 */
    function pushCloseAction(kind, items, before) {
      drawState.closeActions.push({
        kind: kind,
        items: items,
        snapshot: before,
        when: nowLabel()
      });
      if (drawState.closeActions.length > MAX_CLOSE_ACTIONS) drawState.closeActions.shift();
      renderClosedHistory();
    }

    /* 闭合历史：固定高度框内滚动，逐条标明缺口所在位置 */
    function renderClosedHistory() {
      const box = $id("closedHistory");
      if (!drawState.closeActions.length) {
        box.innerHTML = `<div class="empty-note">暂无闭合记录</div>`;
        return;
      }
      const rows = [];
      drawState.closeActions.forEach((a, ai) => {
        a.items.forEach((it, ii) => {
          const cx = Math.round((it.gap.ax + it.gap.bx) / 2);
          const cy = Math.round((it.gap.ay + it.gap.by) / 2);
          const tag = a.kind === "all" ? "一键全部 · " + a.items.length + " 处" : "单次闭合";
          rows.push(`
    <div class="closed-item">
      <div>
        <div>${it.gap.kind} · ${it.gap.size}px · ${it.curved ? "曲线" : "直线"}</div>
        <div class="cmeta">位置 (${cx}, ${cy}) · ${tag} · ${a.when}</div>
      </div>
      <button class="btn ghost sm" data-undo-close="${ai}:${ii}">撤回</button>
    </div>`);
        });
      });
      box.innerHTML = rows.join("");
    }

    /* 单条撤回：恢复该动作之前的快照，并连带回滚它之后的动作（快照是累积的） */
    function undoClose(key) {
      const ai = +String(key).split(":")[0];
      if (!drawState.closeActions[ai]) return;
      const removed = drawState.closeActions.splice(ai);
      restore(removed[0].snapshot);
      removed.forEach(a => a.items.forEach(it => cancelRepair(it.gap)));
      renderClosedHistory();
      toast("已撤回该次闭合及其之后的记录");
      scanGaps();
    }

    /* 一键撤回：撤回上次闭合；若上次是一键全部，则整批撤回 */
    function undoLastClose() {
      const a = drawState.closeActions.pop();
      if (!a) { toast("没有可撤回的闭合记录"); return; }
      restore(a.snapshot);
      a.items.forEach(it => cancelRepair(it.gap));
      renderClosedHistory();
      toast(a.kind === "all"
        ? "已撤回上次一键闭合的全部 " + a.items.length + " 处缺口"
        : "已撤回上次闭合的缺口");
      scanGaps();
    }

    function closeGap(g) {
      if (!g) return;
      /* 已自动修复 ≥3 次仍反复出现：弹框建议手动绘制，并给出匹配笔刷 */
      if ((g.repairs || 0) >= 3) {
        showBigGapModal(g);
        return;
      }
      snapshot();
      const before = drawState.undoStack[drawState.undoStack.length - 1];
      const curved = drawClose(g);
      registerRepair(g);
      pushCloseAction("single", [{ gap: { ...g }, curved }], before);
      toast("已用" + (curved ? "曲线" : "直线") + "闭合缺口");
      scanGaps();
    }

    /* 一键闭合：跳过已反复出现 ≥3 次的顽固缺口（这些交给用户手动补线），关闭的部分整批可撤回 */
    function closeAllGaps() {
      if (!drawState.gaps.length) { toast("当前没有待闭合的缺口，先点击「开始扫描」"); return; }
      const list = drawState.gaps.filter(g => (g.repairs || 0) < 3);
      const skipped = drawState.gaps.length - list.length;
      if (!list.length) {
        toast("所有缺口都已反复出现 3 次以上，建议逐个「在画布上定位」后手动补线");
        return;
      }
      snapshot();
      const before = drawState.undoStack[drawState.undoStack.length - 1];
      const items = [];
      let curvedCount = 0;
      list.forEach(g => {
        const curved = drawClose(g);
        if (curved) curvedCount++;
        registerRepair(g);
        items.push({ gap: { ...g }, curved });
      });
      pushCloseAction("all", items, before);
      toast("已一键闭合 " + items.length + " 处缺口（其中 " + curvedCount + " 处用曲线）" +
        (skipped ? "；另有 " + skipped + " 处已反复出现 3 次以上，已跳过并建议手动绘制" : ""));
      scanGaps();
    }

    /* ---------- 动作参考搜索 ---------- */
    const poseRefs = [
      {
        id: "p1", t: "立姿持剑", cat: "持剑", tags: ["站姿", "持剑", "武器"],
        notes: "三点支撑：前脚跟、后脚掌与剑尖落点构成稳定三角。持剑手肘微曲，剑身中线与视线平行；另一手虚扶剑柄以平衡重心。起稿先定骨盆与胸腔两块朝向，再补四肢。",
        img: IMG("reference%20photo%20of%20a%20standing%20figure%20holding%20a%20sword%2C%20full%20body%20pose%20reference%20for%20artists%2C%20plain%20background", "portrait_4_3")
      },
      {
        id: "p2", t: "坐姿抱膝", cat: "坐姿", tags: ["坐姿", "情绪"],
        notes: "重心压在坐骨，脊柱呈自然 C 形。膝盖高于髋部时显得放松与脆弱；手臂环抱小腿，脚掌外翻，注意大腿与小腿的透视压缩关系。",
        img: IMG("reference%20photo%20of%20a%20person%20sitting%20and%20hugging%20knees%2C%20full%20body%20pose%20reference%20for%20artists", "portrait_4_3")
      },
      {
        id: "p3", t: "跳跃腾空", cat: "跳跃", tags: ["跳跃", "动态", "腾空"],
        notes: "先画抛物线的重心轨迹，再补四肢。膝与肘向身体中线收拢形成动态 C 形，头发与衣摆顺重力反方向拉伸，画面张力最强的一帧通常在最高点之前。",
        img: IMG("reference%20photo%20of%20a%20person%20jumping%20in%20mid%20air%2C%20dynamic%20full%20body%20pose%20reference", "portrait_4_3")
      },
      {
        id: "p4", t: "奔跑冲刺", cat: "奔跑", tags: ["奔跑", "动态", "运动"],
        notes: "交叉对侧协调：右腿前伸时左臂前摆。躯干前倾 15–20°，支撑腿蹬地时小腿近乎垂直地面，肩线与髋线反向扭转是力量感的来源。",
        img: IMG("reference%20photo%20of%20a%20person%20sprinting%20running%2C%20dynamic%20full%20body%20pose%20reference", "portrait_4_3")
      },
      {
        id: "p5", t: "回眸侧身", cat: "回眸", tags: ["回眸", "站姿", "情绪"],
        notes: "头颈先转、躯干后转，形成颈部扭转线。耳朵与下颌的连线可校验透视；回眸时一侧锁骨抬高，肩线呈斜向，注意不要把头画成正脸。",
        img: IMG("reference%20photo%20of%20a%20person%20turning%20head%20looking%20back%20over%20shoulder%2C%20pose%20reference", "portrait_4_3")
      },
      {
        id: "p6", t: "倚墙而立", cat: "倚靠", tags: ["倚靠", "站姿", "场景"],
        notes: "接触点通常只有肩背与髋侧。髋部外顶、双腿一屈一直，身体呈柔和的 S 线；手臂可插兜或撑墙形成支点，重心落在支撑腿。",
        img: IMG("reference%20photo%20of%20a%20person%20leaning%20against%20a%20wall%2C%20full%20body%20pose%20reference", "portrait_4_3")
      },
      {
        id: "p7", t: "撑伞伫立", cat: "站姿", tags: ["站姿", "道具", "氛围"],
        notes: "举伞手肩部上提形成斜方肌轮廓；伞面倾斜约 20° 可增强叙事感。另一手自然垂放或提物，注意伞骨的透视线与手腕的受力方向一致。",
        img: IMG("reference%20photo%20of%20a%20person%20standing%20holding%20an%20umbrella%2C%20full%20body%20pose%20reference", "portrait_4_3")
      },
      {
        id: "p8", t: "握剑对峙", cat: "持剑", tags: ["站姿", "持剑", "双人", "武器"],
        notes: "双方间距约两人宽，剑尖交于一点形成视觉焦点。双肩下沉、重心后压；两人的透视线必须一致，避免一边俯视一边平视。",
        img: IMG("reference%20photo%20of%20two%20people%20holding%20swords%20facing%20each%20other%2C%20dynamic%20pose%20reference", "portrait_4_3")
      }
    ];

    /* ================= 动作参考搜索状态 ================= */
    const refState = { chip: "全部", query: "", open: null, fav: new Set() };

    function renderRefChips() {
      const cats = ["全部", ...new Set(poseRefs.map(r => r.cat))];
      refChips.innerHTML = cats.map(c =>
        `<button data-refchip="${c}" class="${c === refState.chip ? "on" : ""}">${c}</button>`).join("");
    }

    function refList() {
      const q = refState.query.trim().toLowerCase();
      return poseRefs.filter(r => {
        if (refState.chip !== "全部" && r.cat !== refState.chip) return false;
        if (!q) return true;
        return (r.t + " " + r.cat + " " + r.tags.join(" ") + " " + r.notes).toLowerCase().includes(q);
      });
    }

    function renderRefBody() {
      const box = $id("refBody");
      const r = refState.open ? poseRefs.find(x => x.id === refState.open) : null;
      if (r) {
        box.innerHTML = `
      <div class="ref-detail">
        <img src="${r.img}" alt="${r.t}" />
        <h4>${r.t}</h4>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin:0 0 12px">
          ${r.tags.map(t => `<span class="tag-pill"># ${t}</span>`).join("")}
        </div>
        <div class="notes">${r.notes}</div>
        <div class="meta">分类：${r.cat} · 关键词：${r.tags.join(" / ")}</div>
        <div style="display:flex;gap:9px;margin-top:14px">
          <button class="btn ghost sm" id="refBack">← 返回结果</button>
          <button class="btn ghost sm" data-fav="${r.id}">${refState.fav.has(r.id) ? "★ 已收藏" : "☆ 收藏参考"}</button>
        </div>
      </div>`;
        return;
      }
      const list = refList();
      if (!list.length) {
        box.innerHTML = `<div class="empty-note">没有匹配的动作参考，换个关键词或点「全部」试试</div>`;
        return;
      }
      box.innerHTML = `<div class="ref-grid">` + list.map(x => `
    <button class="ref-card" data-ref="${x.id}">
      <img src="${x.img}" alt="${x.t}" loading="lazy" />
      <div class="rt">${x.t}
        <div class="rtags">${x.tags.map(t => `<span class="tag-pill"># ${t}</span>`).join("")}</div>
      </div>
    </button>`).join("") + `</div>`;
    }

    function doRefSearch() {
      refState.query = $id("refInput").value;
      refState.open = null;
      renderRefBody();
      const n = refList().length;
      toast(n ? "找到 " + n + " 条动作参考" : "没有匹配的动作参考");
    }

    function openRef(id) {
      refState.open = id;
      renderRefBody();
    }

    function toggleFav(id) {
      if (refState.fav.has(id)) { refState.fav.delete(id); toast("已取消收藏"); }
      else { refState.fav.add(id); toast("已收藏该动作参考"); }
      renderRefBody();
    }

    /* ---------- 绘画面板事件 ---------- */
    panelDraw.addEventListener("click", e => {
      const sw = e.target.closest("[data-sw]");
      if (sw) { setColor(sw.dataset.sw); return; }
      const tl = e.target.closest("[data-tool]");
      if (tl) { setTool(tl.dataset.tool); return; }
      const st = e.target.closest(".side-tab");
      if (st) { setSidePane(st.dataset.pane); return; }
      const cg = e.target.closest("[data-close-gap]");
      if (cg) { closeGap(drawState.gaps[+cg.dataset.closeGap]); return; }
      const lg = e.target.closest("[data-locate-gap]");
      if (lg) { selectGap(+lg.dataset.locateGap); return; }
      const gi = e.target.closest("[data-gap]");
      if (gi) { selectGap(+gi.dataset.gap); return; }
      const sm = e.target.closest("[data-scan-mode]");
      if (sm) { setScanMode(sm.dataset.scanMode); return; }
      const uc = e.target.closest("[data-undo-close]");
      if (uc) { undoClose(uc.dataset.undoClose); return; }
      const sr = e.target.closest("[data-send-ref]");
      if (sr) { setCanvasRef(sr.dataset.sendRef, sr.dataset.label); return; }
      if (e.target.id === "importImgBtn") { $id("importImgInput").click(); return; }
      if (e.target.id === "exportImgBtn") { exportImage(); return; }
      if (e.target.id === "wandFillSel") { wandFill(); return; }
      if (e.target.id === "wandClearSel") { wandClearSelection(); return; }
      const ch = e.target.closest("[data-refchip]");
      if (ch) { refState.chip = ch.dataset.refchip; renderRefChips(); renderRefBody(); return; }
      const rc = e.target.closest("[data-ref]");
      if (rc) { openRef(rc.dataset.ref); return; }
      if (e.target.id === "refBack") { refState.open = null; renderRefBody(); return; }
      const fv = e.target.closest("[data-fav]");
      if (fv) { toggleFav(fv.dataset.fav); return; }
      if (e.target.id === "scanGaps") { scanGaps(); return; }
      if (e.target.id === "closeAllGaps") { closeAllGaps(); return; }
      if (e.target.id === "undoLastClose") { undoLastClose(); return; }
      if (e.target.id === "regionPick") { armRegionPick("base"); return; }
      if (e.target.id === "regionAdd") { armRegionPick("add"); return; }
      if (e.target.id === "regionSub") { armRegionPick("sub"); return; }
      if (e.target.id === "regionApply") { scanGaps(); return; }
      if (e.target.id === "regionClear") { clearRegion(); return; }
      if (e.target.id === "loadSample") { loadSample(); return; }
      if (e.target.id === "clearCanvas") { clearCanvas(); return; }
      if (e.target.id === "undoBtn") { undo(); return; }
      if (e.target.id === "redoBtn") { redo(); return; }
      if (e.target.id === "refSearchBtn") { doRefSearch(); return; }
      if (e.target.id === "aiSend") { aiSend(); return; }
    });

    panelDraw.addEventListener("input", e => {
      if (e.target.id === "brushSize") { drawState.brush.size = +e.target.value; updateTip(); }
      else if (e.target.id === "brushOpacity") { drawState.brush.opacity = +e.target.value; updateTip(); }
      else if (e.target.id === "brushColor") setColor(e.target.value);
      else if (e.target.id === "fillColor") { drawState.fillColor = e.target.value; }
      else if (e.target.id === "sensRange") {
        drawState.sensMinGap = +e.target.value;
        $id("sensVal").textContent = "忽略 ≤ " + drawState.sensMinGap + "px";
      }
      else if (e.target.id === "regionExpand") {
        drawState.regionExpand = +e.target.value;
        $id("regionExpandVal").textContent = (drawState.regionExpand > 0 ? "+" : "") + drawState.regionExpand + "px";
        if (drawState.regionMaskRaw) applyRegionRaw();   /* 直接在主线程重算边界，无需重跑泛洪 */
      }
      else if (e.target.id === "wandTol") {
        drawState.wandTolerance = +e.target.value;
        if (drawState.wandSel) wandSelect(drawState.wandSel.seed);   /* 用新容差重算选区 */
      }
    });

    panelDraw.addEventListener("keydown", e => {
      if (e.target.id === "refInput" && e.key === "Enter") { e.preventDefault(); doRefSearch(); }
      if (e.target.id === "aiInput" && e.key === "Enter") { e.preventDefault(); aiSend(); }
    });

    /* ---------- 快捷键：撤回 / 重做 / 画布放大缩小（输入框、下拉框内不拦截） ---------- */
    document.addEventListener("keydown", e => {
      if (!panelDraw.classList.contains("active")) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      if (!(e.metaKey || e.ctrlKey) || e.altKey) return;
      const k = (e.key || "").toLowerCase();
      if (k === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      } else if (k === "y") {
        e.preventDefault();
        redo();
      } else if (k === "=" || k === "+") {
        e.preventDefault();
        setViewZoom(drawState.viewZoom * 1.15);
      } else if (k === "-" || k === "_") {
        e.preventDefault();
        setViewZoom(drawState.viewZoom / 1.15);
      } else if (k === "0") {
        e.preventDefault();
        setViewZoom(1);
      }
    });

    /* ---------- 顽固缺口弹框操作 ---------- */
    function bigGapUseBrush() {
      if (!drawState.pendingGap) return;
      const b = applyGapBrush(drawState.pendingGap);
      hideBigGapModal();
      toast("已采用线稿匹配画笔（" + b.col + " / " + b.size + "px），可沿参考线手动绘制");
    }

    /* 弹框位于绘画面板之外，面板上的点击委托捕获不到，这里直接绑定按钮 */
    $id("bigGapUseBrush").addEventListener("click", bigGapUseBrush);
    $id("bigGapCancel").addEventListener("click", hideBigGapModal);

    /* ---------- 导入外部图片 · 等比适配到画框 ---------- */
    /* 适配规则：大图等比缩小到画框内完整可见（不裁切），小图保持原尺寸居中（不放大避免发糊） */
    $id("importImgInput").addEventListener("change", e => {
      const file = e.target.files[0];
      e.target.value = "";
      if (!file) return;
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const nw = img.naturalWidth || img.width, nh = img.naturalHeight || img.height;
        if (!nw || !nh) { toast("图片尺寸异常，请换一张"); URL.revokeObjectURL(url); return; }
        snapshot();                              /* 清掉旧笔迹可撤回 */
        dctx.clearRect(0, 0, CW, CH);
        clearImageLayer();

        const fit = Math.min(1, CW / nw, CH / nh);
        const w = nw * fit, h = nh * fit;
        drawState.imgData = img;
        drawState.imgBox = { x: (CW - w) / 2, y: (CH - h) / 2, w, h };
        drawState.imgReady = true;
        drawState.imgUrl = url;
        underlayEl.src = url;
        applyImgView();
        setTool("move");                         /* 导入后直接可拖动 / 滚轮缩放底图 */

        invalidateGaps();
        tipGap.textContent = "已导入 " + nw + "×" + nh + (fit < 1
          ? " · 等比缩小到 " + Math.round(w) + "×" + Math.round(h)
          : " · 原尺寸居中（未放大）");
        toast(fit < 1 ? "已导入图片：等比缩小到画框内完整显示" : "已导入图片：原尺寸居中显示（未放大）");
        /* 放到下一帧执行，避免主线程同步阻塞造成假死感 */
        requestAnimationFrame(() => scanGaps());
      };
      img.onerror = () => { toast("图片加载失败，请换一张"); URL.revokeObjectURL(url); };
      img.src = url;
    });

    /* ---------- 导出图片：PNG 透明底 / JPG 白底（底图 + 笔迹合成为一张） ---------- */
    function exportImage() {
      const png = $id("exportFmt").value !== "jpg";
      const cv = document.createElement("canvas");
      cv.width = CW; cv.height = CH;
      drawComposite(cv.getContext("2d"), !png);
      const d = new Date();
      const p2 = n => (n < 10 ? "0" : "") + n;
      const name = "集画线稿-" + d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + "-" +
        p2(d.getHours()) + p2(d.getMinutes()) + (png ? ".png" : ".jpg");
      cv.toBlob(blob => {
        if (!blob) { toast("导出失败，请重试"); return; }
        const href = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = href;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 1500);
        toast("已导出 " + name + "（" + (png ? "透明底" : "白底") + "）");
      }, png ? "image/png" : "image/jpeg", 0.92);
    }

    /* ---------- 魔棒填色（泛洪算法已迁入 SCAN_LIB，Web Worker 后台执行） ---------- */
    function handleWandMask(mask, bounds, count, aborted, seedX, seedY) {
      if (aborted) toast("选区过大，已截断（请调小容差）");
      if (count < 2) { toast("选区过小或容差不足，请调整容差后重试"); tipGap.textContent = "魔棒填色：选区无效"; return; }
      drawState.wandSel = { mask, w: CW, h: CH, bounds, seed: { x: seedX, y: seedY } };
      tipGap.textContent = "魔棒选区：" + count + " 像素（点击「填充选区」或调整容差）";
      showWandControls();
      startWandAnim();
    }

    function wandSelect(p) {
      const x = Math.max(0, Math.min(CW - 1, Math.round(p.x)));
      const y = Math.max(0, Math.min(CH - 1, Math.round(p.y)));
      let img;
      try { compositeCanvas(false); img = compCtx.getImageData(0, 0, CW, CH); }
      catch (err) { toast("画布像素读取失败，无法进行魔棒填色"); return; }
      const seq = ++drawState.wandSeq;
      tipGap.textContent = "魔棒填色：后台计算选区…";
      const buf = img.data.buffer.slice(0);   /* 拷贝供 transfer */
      if (drawState.scanWorker && !drawState.workerDead) {
        drawState.scanWorker.postMessage({ type: "wand", seq, buf, w: CW, h: CH, x, y, tol: drawState.wandTolerance }, [buf]);
      } else {
        const r = scanLib().floodFillMask(new Uint8ClampedArray(buf), CW, CH, x, y, drawState.wandTolerance);
        handleWandMask(r.mask, r.bounds, r.count, r.aborted, x, y);
      }
    }

    function renderSelection(ctx, sel, phase) {
      const { mask, w, h, bounds } = sel;
      ctx.save();
      const img = ctx.createImageData(w, h);
      for (let i = 0; i < w * h; i++) {
        if (mask[i]) {
          const k = i * 4;
          img.data[k] = 231; img.data[k + 1] = 192; img.data[k + 2] = 120; img.data[k + 3] = 45;
        }
      }
      ctx.putImageData(img, 0, 0);

      const boundary = [];
      for (let y = bounds.minY; y <= bounds.maxY; y++) {
        for (let x = bounds.minX; x <= bounds.maxX; x++) {
          const i = y * w + x;
          if (!mask[i]) continue;
          if ((x > 0 && !mask[i - 1]) || (x < w - 1 && !mask[i + 1]) ||
            (y > 0 && !mask[i - w]) || (y < h - 1 && !mask[i + w])) boundary.push(i);
        }
      }
      if (boundary.length > 8000) { ctx.restore(); return; }
      ctx.fillStyle = "rgba(231,192,120,.95)";
      for (const i of boundary) {
        const x = i % w, y = (i - x) / w;
        if ((x + y + phase) % 8 < 4) ctx.fillRect(x, y, 1, 1);
      }
      ctx.restore();
    }

    function showWandControls() {
      let bar = $id("wandCtrlBar");
      if (!bar) {
        bar = document.createElement("div");
        bar.id = "wandCtrlBar";
        bar.style.cssText = "position:absolute;top:10px;left:10px;background:rgba(14,13,16,.88);border:1px solid rgba(231,192,120,.5);border-radius:10px;padding:8px 10px;display:flex;gap:8px;align-items:center;font-size:12px;backdrop-filter:blur(4px)";
        bar.innerHTML = `
      <span style="color:var(--gold)">已选区域</span>
      <input type="color" id="wandFillColor" value="${drawState.fillColor}" style="width:30px;height:26px;padding:1px;border-radius:6px;border:1px solid var(--line)" />
      <button class="btn sm" id="wandFillSel">填充选区</button>
      <button class="btn ghost sm" id="wandClearSel">清除选区</button>`;
        document.querySelector(".canvas-wrap").appendChild(bar);
        bar.addEventListener("input", e => {
          if (e.target.id === "wandFillColor") { drawState.fillColor = e.target.value; $id("fillColor").value = drawState.fillColor; }
        });
      }
      bar.style.display = "flex";
      $id("wandFillColor").value = drawState.fillColor;
    }

    function startWandAnim() {
      if (drawState.wandAnimId) cancelAnimationFrame(drawState.wandAnimId);
      let last = 0;
      const loop = t => {
        if (!drawState.wandSel) { drawState.wandAnimId = null; return; }
        if (t - last > 110) {
          drawState.wandPhase = (drawState.wandPhase + 1) % 8;
          octx.clearRect(0, 0, CW, CH);
          drawOverlayGaps();
          renderSelection(octx, drawState.wandSel, drawState.wandPhase);
          last = t;
        }
        drawState.wandAnimId = requestAnimationFrame(loop);
      };
      drawState.wandAnimId = requestAnimationFrame(loop);
    }

    function wandClearSelection() {
      drawState.wandSel = null;
      if (drawState.wandAnimId) cancelAnimationFrame(drawState.wandAnimId);
      drawState.wandAnimId = null;
      octx.clearRect(0, 0, CW, CH);
      drawOverlayGaps();
      const bar = $id("wandCtrlBar");
      if (bar) bar.style.display = "none";
      tipGap.textContent = "已清除魔棒选区";
    }

    function wandFill() {
      if (!drawState.wandSel) return;
      snapshot();
      const { mask, w, h } = drawState.wandSel;
      const img = dctx.getImageData(0, 0, w, h);
      const d = img.data;
      const hex = drawState.fillColor.replace("#", "");
      const fr = parseInt(hex.substr(0, 2), 16);
      const fg = parseInt(hex.substr(2, 2), 16);
      const fb = parseInt(hex.substr(4, 2), 16);
      for (let i = 0; i < w * h; i++) {
        if (mask[i]) {
          const k = i * 4;
          d[k] = fr; d[k + 1] = fg; d[k + 2] = fb; d[k + 3] = 255;
        }
      }
      dctx.putImageData(img, 0, 0);
      toast("已填充选区");
      wandClearSelection();
      tipGap.textContent = "已填充，可继续扫描缺口或填色";
    }

    function initWandDemo() {
      const c = $id("wandDemo");
      if (!c) return;
      const x = c.getContext("2d");
      function redraw() {
        x.clearRect(0, 0, c.width, c.height);
        x.fillStyle = "#1c1b22"; x.fillRect(0, 0, c.width, c.height);
        x.strokeStyle = "#e7c078"; x.lineWidth = 3;
        x.beginPath(); x.arc(80, 80, 44, 0, Math.PI * 2); x.stroke();
        x.beginPath(); x.rect(140, 40, 70, 70); x.stroke();
        x.beginPath(); x.moveTo(200, 130); x.lineTo(230, 50); x.lineTo(170, 50); x.closePath(); x.stroke();
        x.fillStyle = "rgba(127,168,232,.4)"; x.fillRect(140, 40, 70, 70);
      }
      redraw();
      c.addEventListener("click", e => {
        const r = c.getBoundingClientRect();
        const px = Math.round((e.clientX - r.left) * (c.width / r.width));
        const py = Math.round((e.clientY - r.top) * (c.height / r.height));
        const img = x.getImageData(0, 0, c.width, c.height);
        const { mask } = scanLib().floodFillMask(img.data, c.width, c.height, px, py, 32);   /* 演示小画面尺寸小，主线程直接算 */
        const hex = drawState.fillColor.replace("#", "");
        const fr = parseInt(hex.substr(0, 2), 16), fg = parseInt(hex.substr(2, 2), 16), fb = parseInt(hex.substr(4, 2), 16);
        for (let i = 0; i < c.width * c.height; i++) {
          if (mask[i]) { const k = i * 4; img.data[k] = fr; img.data[k + 1] = fg; img.data[k + 2] = fb; img.data[k + 3] = 220; }
        }
        x.putImageData(img, 0, 0);
        setTimeout(redraw, 1600);
      });
    }

    /* ---------- 浮动参考图 ---------- */
    function setCanvasRef(url, label) {
      const box = $id("refPreview");
      $id("refPreviewImg").src = url;
      $id("refPreviewLabel").textContent = label || "参考图";
      box.style.display = "block";
      setSidePane("gaps");
      toast("已发送到绘画面板参考（右上角）");
    }
    $id("refPreviewClose").addEventListener("click", () => {
      $id("refPreview").style.display = "none";
    });

    /* ---------- AI 动作顾问 ---------- */
    function stanceAnim() {
      const A = {
        head: [100, 40], neck: [100, 58], chest: [100, 78], pelvis: [100, 118],
        lS: [84, 78], lE: [74, 98], lH: [70, 118], rS: [116, 78], rE: [126, 98], rH: [130, 118],
        lHi: [90, 118], lK: [88, 160], lA: [90, 200], rHi: [110, 118], rK: [112, 160], rA: [110, 200]
      };
      const B = {
        head: [100, 38], neck: [100, 56], chest: [100, 76], pelvis: [100, 116],
        lS: [83, 76], lE: [72, 96], lH: [68, 116], rS: [117, 76], rE: [128, 96], rH: [132, 116],
        lHi: [91, 116], lK: [89, 158], lA: [91, 200], rHi: [109, 116], rK: [111, 158], rA: [109, 200]
      };
      return [A, B];
    }
    function sitAnim() {
      const A = {
        head: [100, 30], neck: [100, 48], chest: [96, 70], pelvis: [100, 100],
        lS: [80, 70], lE: [60, 82], lH: [54, 100], rS: [112, 70], rE: [130, 82], rH: [136, 100],
        lHi: [88, 100], lK: [60, 108], lA: [58, 130], rHi: [112, 100], rK: [140, 108], rA: [142, 130]
      };
      const B = {
        head: [100, 28], neck: [100, 46], chest: [97, 68], pelvis: [100, 98],
        lS: [81, 68], lE: [61, 80], lH: [55, 98], rS: [111, 68], rE: [129, 80], rH: [135, 98],
        lHi: [89, 98], lK: [61, 106], lA: [59, 130], rHi: [111, 98], rK: [139, 106], rA: [141, 130]
      };
      return [A, B];
    }
    function jumpAnim() {
      const A = {
        head: [100, 40], neck: [100, 56], chest: [100, 74], pelvis: [100, 100],
        lS: [82, 74], lE: [66, 60], lH: [60, 46], rS: [118, 74], rE: [134, 60], rH: [140, 46],
        lHi: [88, 100], lK: [78, 120], lA: [74, 138], rHi: [112, 100], rK: [122, 120], rA: [126, 138]
      };
      const B = {
        head: [100, 36], neck: [100, 52], chest: [100, 70], pelvis: [100, 96],
        lS: [84, 70], lE: [70, 56], lH: [64, 42], rS: [116, 70], rE: [130, 56], rH: [136, 42],
        lHi: [90, 96], lK: [80, 114], lA: [76, 130], rHi: [110, 96], rK: [120, 114], rA: [124, 130]
      };
      return [A, B];
    }
    function runAnim() {
      const A = {
        head: [100, 40], neck: [100, 56], chest: [100, 74], pelvis: [100, 100],
        lS: [80, 74], lE: [60, 64], lH: [44, 60], rS: [120, 74], rE: [136, 84], rH: [148, 96],
        lHi: [88, 100], lK: [64, 108], lA: [40, 112], rHi: [112, 100], rK: [138, 96], rA: [156, 92]
      };
      const B = {
        head: [100, 38], neck: [100, 54], chest: [100, 72], pelvis: [100, 98],
        lS: [80, 72], lE: [62, 62], lH: [46, 58], rS: [120, 72], rE: [138, 82], rH: [150, 94],
        lHi: [88, 98], lK: [62, 106], lA: [38, 110], rHi: [112, 98], rK: [140, 94], rA: [158, 90]
      };
      return [A, B];
    }
    function swordAnim() {
      const A = {
        head: [100, 40], neck: [100, 56], chest: [100, 74], pelvis: [100, 100],
        lS: [82, 74], lE: [62, 82], lH: [52, 92], rS: [118, 74], rE: [138, 70], rH: [156, 60],
        lHi: [90, 100], lK: [88, 140], lA: [90, 180], rHi: [110, 100], rK: [112, 140], rA: [110, 180]
      };
      const B = {
        head: [100, 40], neck: [100, 56], chest: [100, 74], pelvis: [100, 100],
        lS: [82, 74], lE: [64, 84], lH: [56, 96], rS: [118, 74], rE: [142, 66], rH: [162, 54],
        lHi: [90, 100], lK: [88, 140], lA: [90, 180], rHi: [110, 100], rK: [112, 140], rA: [110, 180]
      };
      return [A, B];
    }
    function lookbackAnim() {
      const A = {
        head: [88, 40], neck: [96, 56], chest: [100, 74], pelvis: [100, 100],
        lS: [82, 74], lE: [66, 88], lH: [60, 104], rS: [118, 74], rE: [132, 88], rH: [138, 104],
        lHi: [90, 100], lK: [88, 140], lA: [90, 180], rHi: [110, 100], rK: [112, 140], rA: [110, 180]
      };
      const B = {
        head: [84, 40], neck: [94, 56], chest: [100, 74], pelvis: [100, 100],
        lS: [82, 74], lE: [68, 88], lH: [62, 104], rS: [118, 74], rE: [130, 88], rH: [136, 104],
        lHi: [90, 100], lK: [88, 140], lA: [90, 180], rHi: [110, 100], rK: [112, 140], rA: [110, 180]
      };
      return [A, B];
    }
    function leanAnim() {
      const A = {
        head: [110, 36], neck: [108, 54], chest: [104, 74], pelvis: [96, 104],
        lS: [86, 74], lE: [72, 92], lH: [66, 108], rS: [122, 74], rE: [132, 84], rH: [136, 92],
        lHi: [84, 104], lK: [74, 140], lA: [70, 180], rHi: [108, 104], rK: [124, 140], rA: [130, 180]
      };
      const B = {
        head: [112, 36], neck: [110, 54], chest: [106, 74], pelvis: [98, 104],
        lS: [88, 74], lE: [74, 92], lH: [68, 108], rS: [124, 74], rE: [134, 84], rH: [138, 92],
        lHi: [86, 104], lK: [76, 140], lA: [72, 180], rHi: [110, 104], rK: [126, 140], rA: [132, 180]
      };
      return [A, B];
    }
    function crouchAnim() {
      const A = {
        head: [100, 46], neck: [100, 62], chest: [100, 80], pelvis: [100, 110],
        lS: [82, 80], lE: [64, 90], lH: [58, 100], rS: [118, 80], rE: [136, 90], rH: [142, 100],
        lHi: [86, 110], lK: [70, 128], lA: [72, 150], rHi: [114, 110], rK: [130, 128], rA: [128, 150]
      };
      const B = {
        head: [100, 44], neck: [100, 60], chest: [100, 78], pelvis: [100, 108],
        lS: [83, 78], lE: [65, 88], lH: [59, 98], rS: [117, 78], rE: [135, 88], rH: [141, 98],
        lHi: [87, 108], lK: [71, 126], lA: [73, 150], rHi: [113, 108], rK: [129, 126], rA: [127, 150]
      };
      return [A, B];
    }

    function lerpPose(a, b, t) {
      const o = {};
      for (const k in a) { o[k] = [a[k][0] + (b[k][0] - a[k][0]) * t, a[k][1] + (b[k][1] - a[k][1]) * t]; }
      return o;
    }

    function drawStickFigure(ctx, p, w, h) {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "#e7c078";
      ctx.fillStyle = "#e7c078";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      const line = (a, b) => { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
      line(p.head, p.neck); line(p.neck, p.chest); line(p.chest, p.pelvis);
      line(p.chest, p.lS); line(p.lS, p.lE); line(p.lE, p.lH);
      line(p.chest, p.rS); line(p.rS, p.rE); line(p.rE, p.rH);
      line(p.pelvis, p.lHi); line(p.lHi, p.lK); line(p.lK, p.lA);
      line(p.pelvis, p.rHi); line(p.rHi, p.rK); line(p.rK, p.rA);
      ctx.beginPath(); ctx.arc(p.head[0], p.head[1] - 8, 9, 0, Math.PI * 2); ctx.stroke();
    }

    function startStickAnim(canvas, frames) {
      const ctx = canvas.getContext("2d");
      let raf, start = performance.now();
      const dur = 900;
      const tick = now => {
        const t = ((now - start) % dur) / dur;
        const phase = t < 0.5 ? t * 2 : 2 - t * 2;
        drawStickFigure(ctx, lerpPose(frames[0], frames[1], phase), canvas.width, canvas.height);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      canvas._raf = raf;
    }

    const aiKB = [
      {
        keys: ["站立", "站姿", "立正", "立"], name: "自然站姿",
        analysis: { 重心: "垂直落在支撑脚足弓稍前，骨盆微前倾。", 骨盆: "与地面水平或轻微侧倾，承重腿一侧髋略高。", 胸腔: "略向后收，锁骨水平，肩颈放松。", 四肢: "双臂自然下垂，手肘微曲；双腿一前一后或并立。", 动态线: "轻微 S 形，避免僵硬的直线。" },
        imgs: ["full%20body%20standing%20pose%20reference%20neutral%20stance%20for%20artists", "anatomy%20standing%20figure%20contrapposto%20reference"],
        anim: stanceAnim()
      },
      {
        keys: ["坐姿", "坐"], name: "坐姿",
        analysis: { 重心: "落在坐骨结节，脊柱呈自然 C 形。", 骨盆: "后倾，骶骨贴近支撑面。", 胸腔: "随脊柱弯曲，肋骨略下压。", 四肢: "大腿与小腿形成 90° 左右，脚掌平放或交叉。", 动态线: "柔和的 C 形，头部略前倾。" },
        imgs: ["person%20sitting%20full%20body%20pose%20reference", "sitting%20pose%20anatomy%20reference%20for%20artists"],
        anim: sitAnim()
      },
      {
        keys: ["跳跃", "腾空", "跳"], name: "跳跃腾空",
        analysis: { 重心: "沿抛物线运动，最高点时重心瞬时静止。", 骨盆: "前倾，双腿向腹部收拢。", 胸腔: "上提，呼吸扩张。", 四肢: "膝肘向身体中线收拢形成 C 形，手臂上扬或张开。", 动态线: "强烈的 C 形弧线，头发与衣摆反向拉伸。" },
        imgs: ["person%20jumping%20in%20mid%20air%20dynamic%20pose%20reference", "jump%20pose%20action%20reference%20for%20artists"],
        anim: jumpAnim()
      },
      {
        keys: ["奔跑", "跑", "冲刺"], name: "奔跑冲刺",
        analysis: { 重心: "前倾 15–20°，向前推进。", 骨盆: "随步幅左右旋转，与肩线反向。", 胸腔: "小幅起伏，配合呼吸。", 四肢: "交叉对侧协调——右腿前伸时左臂前摆。", 动态线: "前倾的斜线，腿部形成大跨度三角形。" },
        imgs: ["person%20sprinting%20running%20dynamic%20full%20body%20pose%20reference", "running%20pose%20anatomy%20reference%20for%20artists"],
        anim: runAnim()
      },
      {
        keys: ["持剑", "拔剑", "剑", "武器"], name: "拔剑 / 持剑",
        analysis: { 重心: "略后压，前脚虚点。", 骨盆: "微转，前脚侧对目标。", 胸腔: "微转，持剑手肩下沉。", 四肢: "前臂随拔出方向伸展，另一手虚扶鞘口。", 动态线: "从持剑手到后脚的斜线，剑身延长线为视觉焦点。" },
        imgs: ["person%20drawing%20a%20sword%20from%20scabbard%20pose%20reference", "standing%20figure%20holding%20sword%20full%20body%20reference"],
        anim: swordAnim()
      },
      {
        keys: ["回眸", "回头", "转身"], name: "回眸侧身",
        analysis: { 重心: "落在后脚，前脚放松。", 骨盆: "保持正面或微侧。", 胸腔: "随头部扭转，肩线一高一低。", 四肢: "一手可扶腰或自然下垂，体现扭转张力。", 动态线: "颈部扭转是关键，头先转、身后随。" },
        imgs: ["person%20looking%20back%20over%20shoulder%20pose%20reference", "glancing%20back%20dynamic%20pose%20reference"],
        anim: lookbackAnim()
      },
      {
        keys: ["倚靠", "靠墙", "靠"], name: "倚墙而立",
        analysis: { 重心: "偏向支撑腿，接触点在肩背与髋。", 骨盆: "外顶，形成 S 线。", 胸腔: "微展，肩放松。", 四肢: "一腿屈一腿直，手臂插兜或撑墙。", 动态线: "柔和的 S 形，靠墙面与身体留出发丝/布料空间。" },
        imgs: ["person%20leaning%20against%20wall%20full%20body%20pose%20reference", "leaning%20pose%20casual%20reference%20for%20artists"],
        anim: leanAnim()
      },
      {
        keys: ["蹲", "下蹲", "深蹲"], name: "蹲姿",
        analysis: { 重心: "落在双脚之间，略偏后。", 骨盆: "后倾下沉。", 胸腔: "前倾贴近大腿。", 四肢: "膝踝深屈，脚跟可离地。", 动态线: "紧凑的团状 C 形。" },
        imgs: ["person%20crouching%20squatting%20full%20body%20pose%20reference", "squatting%20pose%20anatomy%20reference"],
        anim: crouchAnim()
      }
    ];

    /* ================= AI 动作顾问状态 ================= */
    const aiState = { msgs: [] };
    function renderAiMsgs() {
      const box = $id("aiMsgs");
      box.innerHTML = aiState.msgs.map(m => {
        if (m.role === "u") return `<div class="ai-msg u">${m.text}</div>`;
        const items = m.analysis ? Object.entries(m.analysis).map(([k, v]) => `<li><b>${k}</b>：${v}</li>`).join("") : "";
        const imgs = m.imgs ? `<div class="ai-imgs">${m.imgs.map(src =>
          `<img src="${src}" data-send-ref="${src}" data-label="${m.name}" title="点击放到绘画面板参考" loading="lazy" />`).join("")}</div>` : "";
        const anim = m.anim ? `<canvas class="ai-anim" width="200" height="210" data-anim="${m.name}"></canvas>` : "";
        const firstImg = m.imgs ? m.imgs[0] : "";
        return `<div class="ai-msg a">
      <div class="ai-head">AI 动作顾问 · ${m.name}</div>
      <div>${m.intro || ""}</div>
      ${items ? "<ul>" + items + "</ul>" : ""}
      ${imgs}
      ${anim}
      ${firstImg ? `<button class="send-ref" data-send-ref="${firstImg}" data-label="${m.name}">把第一张参考图放到绘画面板 →</button>` : ""}
    </div>`;
      }).join("");
      box.querySelectorAll("canvas[data-anim]").forEach(c => {
        const kb = aiKB.find(k => k.name === c.dataset.anim);
        if (kb) startStickAnim(c, kb.anim);
      });
      box.scrollTop = box.scrollHeight;
    }

    function aiSend() {
      const input = $id("aiInput");
      const q = input.value.trim();
      if (!q) return;
      aiState.msgs.push({ role: "u", text: q });
      input.value = "";
      renderAiMsgs();

      let best = null, bestScore = 0;
      for (const kb of aiKB) {
        let score = 0;
        for (const k of kb.keys) if (q.includes(k)) score += k.length;
        if (score > bestScore) { bestScore = score; best = kb; }
      }
      if (!best) best = aiKB[0];
      const intro = bestScore > 0
        ? `关于「${q}」，我匹配到「${best.name}」的动作分析：`
        : `暂未精确匹配「${q}」，给你一个通用参考「${best.name}」，你也可以换个关键词再试。`;
      aiState.msgs.push({
        role: "a", name: best.name, intro, analysis: best.analysis,
        imgs: best.imgs.map(p => IMG(p, "portrait_4_3")), anim: true
      });
      renderAiMsgs();
    }

    /* ================= 个人主页 ================= */
    /* 我的作品：照片 / 视频 / 手书 / 教程 */
    const pfWorks = [
      { id: "pw1", t: "花朝月夕", type: "绘画作品", tag: "古风", img: artworks[0].img, likes: 1284, by: "砚青" },
      { id: "pw2", t: "霓虹雨夜", type: "绘画作品", tag: "场景", img: artworks[1].img, likes: 976, by: "KANA" },
      { id: "pw3", t: "水彩肤色上色 · 教程", type: "教程视频", tag: "教程", img: IMG("watercolor%20painting%20tutorial%20close%20up%20of%20skin%20tones%20palette%2C%20soft%20light", "portrait_4_3"), likes: 316, by: "木野", dur: "12:40" },
      { id: "pw4", t: "《长夜》手书", type: "手书", tag: "手书", img: IMG("anime%20style%20short%20animation%20storyboard%20frames%20with%20night%20sky%2C%20sketch%20style", "portrait_4_3"), likes: 528, by: "砚青", dur: "01:26" }
    ];

    /* 已帮助的需求：接的别人的需求单 */
    const helpedDemands = {
      doing: [
        { id: "hd1", name: "星野凛", t: "立绘 · 半身", due: "11-05", stage: "绘制中", progress: 62 },
        { id: "hd2", name: "阿七", t: "Q 版头像 ×2", due: "11-02", stage: "线稿确认", progress: 35 }
      ],
      done: [
        { id: "hd3", name: "白露", t: "头像", due: "09-28 已交付", stage: "已帮助", progress: 100 },
        { id: "hd4", name: "青禾", t: "场景插画", due: "09-12 已交付", stage: "已帮助", progress: 100 }
      ]
    };

    /* 我发布的需求单 */
    const myDemands = [
      { id: "md1", t: "求一张古风立绘", budget: "￥800-1200", due: "11-30", status: "招募中", type: "约稿", desc: "原创角色，冷色调，需要分层 PSD 与商用授权。" },
      { id: "md2", t: "招长期合作的手书剪辑", budget: "￥500/条", due: "长期", status: "招募中", type: "约稿", desc: "每月 2 条，素材与分镜由我提供。" },
      { id: "md3", t: "周边打样：流沙麻将 50 份", budget: "￥2600", due: "已结束", status: "已完成", type: "约制品", desc: "已找到合作工厂，等待大货。" }
    ];

    /* 需求广场：公开需求单 */
    const plazaDemands = [
      { id: "pd1", by: "星野凛", t: "雨夜古镇场景插画", budget: "￥2600", due: "11-20", status: "招募中", type: "约稿", desc: "4000×2600，需分层文件，印量 500 份以内。" },
      { id: "pd2", by: "洛洛", t: "服装三视图 · 铃兰与月光", budget: "￥900", due: "11-25", status: "招募中", type: "约稿", desc: "正 / 侧 / 背三视图，需要可商用授权。" },
      { id: "pd3", by: "KANA", t: "赛博场景 · 霓虹街道", budget: "￥1800", due: "12-05", status: "招募中", type: "约稿", desc: "大尺寸印刷用，需要预留出血。" },
      { id: "pd4", by: "木野", t: "Q 版表情包 12 枚", budget: "￥600", due: "11-18", status: "已关闭", type: "约稿", desc: "治愈系水彩风，表情包商用。" }
    ];

    /* 小卖部橱窗：可拍 / 已下架 / 无档期 */
    const shopItems = [
      { t: "《花朝月夕》设定集", p: 168, state: "open", img: goods[0].img },
      { t: "亚克力立牌 · 霓虹系列", p: 68, state: "open", img: goods[1].img },
      { t: "帆布托特包 · 云端之城", p: 89, state: "off", img: goods[2].img },
      { t: "亚克力钥匙扣套装", p: 45, state: "pause", img: goods[3].img }
    ];
    const SHOP_STATE = { open: "可拍", off: "已下架", pause: "无档期" };

    const pfState = { tab: "works", helped: "doing", visitor: null };

    function worksFor(name) {
      if (!pfState.visitor) return pfWorks;
      const own = pfWorks.filter(w => w.by === name);
      return own.length ? own : pfWorks.slice(0, 2).map(w => Object.assign({}, w, { by: name, likes: 128 }));
    }

    function demandsFor(name) {
      if (!pfState.visitor) return myDemands;
      const own = plazaDemands.filter(d => d.by === name);
      return own.length ? own : plazaDemands.slice(0, 2).map(d => Object.assign({}, d, { by: name }));
    }

    function demandCard(d, showBy) {
      const closed = d.status === "已关闭" || d.status === "已完成";
      return `
      <article class="dm-card ${closed ? "closed" : ""}">
        <div class="dm-top">
          <span class="dm-type">${d.type}</span>
          <span class="dm-status ${closed ? "off" : ""}">${d.status}</span>
        </div>
        <h4>${d.t}</h4>
        <p>${d.desc}</p>
        <div class="dm-meta">
          <span class="dm-price">${d.budget}</span>
          <span>截稿 ${d.due}</span>
          ${showBy && d.by ? `<span>@${d.by}</span>` : ""}
        </div>
        <button class="btn ghost sm dm-take" data-take="${d.id}" ${closed ? "disabled" : ""}
          title="${closed ? "该需求已结束" : "接单后会出现在个人集 · 已帮助的需求"}">${closed ? "已结束" : "接单"}</button>
      </article>`;
    }

    function helpedCards() {
      return helpedDemands[pfState.helped].map(h => `
      <article class="helped-card">
        <span class="hc-av">${h.name.slice(0, 1)}</span>
        <div class="hc-main">
          <div class="hc-row"><b>${h.name}</b><span>${h.t}</span></div>
          <div class="hc-sub">交稿 ${h.due} · ${h.stage}</div>
          <div class="hc-bar"><i style="width:${h.progress}%"></i></div>
        </div>
      </article>`).join("");
    }

    function pfWorksHTML() {
      const visitor = !!pfState.visitor;
      const list = worksFor(pfState.visitor);
      const cards = list.map(w => `
      <article class="pf-work" title="${w.t}">
        <div class="pw-thumb">
          <img src="${w.img}" alt="${w.t}" loading="lazy" />
          <span class="pw-type">${w.type}</span>
          ${w.dur ? `<span class="pw-dur">${w.dur}</span>` : ""}
        </div>
        <div class="pw-body">
          <h4>${w.t}</h4>
          <div class="pw-meta"><span>♥ ${w.likes || 0}</span><span># ${w.tag || w.type}</span></div>
        </div>
      </article>`).join("");

      return `
      <div class="pf-section-head">
        <div><h3>个人集</h3><p>${visitor ? "TA 的作品与创作记录" : "照片、视频、手书与绘画作品都收录在这里"}</p></div>
        <span class="pf-count">${list.length} 件作品</span>
      </div>
      <div class="pf-grid">${cards}</div>
      ${visitor ? "" : `<button class="pf-fab" data-open-publish="work" title="发布作品">＋</button>`}
      ${visitor ? "" : `
      <div class="pf-block">
        <div class="pf-block-head">
          <h3>已帮助的需求</h3>
          <div class="pf-mini-tabs">
            <button class="${pfState.helped === "doing" ? "on" : ""}" data-helped="doing">进行中</button>
            <button class="${pfState.helped === "done" ? "on" : ""}" data-helped="done">已帮助</button>
          </div>
        </div>
        <div class="helped-list">${helpedCards()}</div>
      </div>`}`;
    }

    function pfHelpHTML() {
      const visitor = !!pfState.visitor;
      const list = demandsFor(pfState.visitor);
      return `
      <div class="pf-section-head">
        <div><h3>帮帮忙</h3><p>${visitor ? "TA 发布的需求单" : "我发布的需求单，等待大家一起帮忙"}</p></div>
        <span class="pf-count">${list.length} 条需求</span>
      </div>
      <div class="demand-grid">${list.map(d => demandCard(d, visitor)).join("")}</div>
      ${visitor ? "" : `<button class="pf-fab pf-fab-arrow" data-goto-plaza title="前往需求广场">→</button>`}`;
    }

    function pfShopHTML() {
      const visitor = !!pfState.visitor;
      const list = visitor ? shopItems.slice(0, 3) : shopItems;
      const cards = list.map(s => `
      <article class="shop-card ${s.state}">
        <div class="sc-thumb">
          <img src="${s.img}" alt="${s.t}" loading="lazy" />
          <span class="sc-state">${SHOP_STATE[s.state]}</span>
        </div>
        <div class="sc-body">
          <h4>${s.t}</h4>
          <div class="sc-row"><span class="sc-price">￥${s.p}</span><span class="sc-note">${s.state === "open" ? "现货可拍" : s.state === "off" ? "已下架" : "暂无档期"}</span></div>
        </div>
      </article>`).join("");
      return `
      <div class="pf-section-head">
        <div><h3>小卖部</h3><p>${visitor ? "TA 的橱窗与在售周边" : "我的橱窗：可拍 / 已下架 / 无档期"}</p></div>
        <span class="pf-count">${list.length} 件周边</span>
      </div>
      <div class="shop-grid">${cards}</div>`;
    }

    function renderProfile() {
      const visitor = !!pfState.visitor;
      const name = pfState.visitor || appState.nick || "我";
      $id("pfTop").classList.toggle("visitor", visitor);
      $id("pfAvatar").textContent = name.slice(0, 1);
      $id("pfName").textContent = name + "的主页";
      $id("pfTag").textContent = visitor ? "TA 的个人集、需求与橱窗" : "作品、需求与橱窗，都收进同一个主页";
      document.querySelectorAll("[data-pf-tab]").forEach(b =>
        b.classList.toggle("on", b.dataset.pfTab === pfState.tab));
      $id("pfBody").innerHTML =
        pfState.tab === "help" ? pfHelpHTML()
          : pfState.tab === "shop" ? pfShopHTML()
            : pfWorksHTML();
    }

    function renderDemandPlaza() {
      const grid = $id("demandGrid");
      if (!grid) return;
      const mine = myDemands.map(d => Object.assign({}, d, { by: appState.nick || "我" }));
      grid.innerHTML = mine.concat(plazaDemands).map(d => demandCard(d, true)).join("");
    }

    function setHallView(name) {
      document.querySelectorAll(".hall-item").forEach(b => b.classList.toggle("on", b.dataset.hall === name));
      document.querySelectorAll(".hall-view").forEach(v => v.classList.toggle("active", v.id === "hall-" + name));
    }

    function goDemandPlaza() {
      switchTab("hall");
      setHallView("demands");
      window.scrollTo(0, 0);
    }

    /* 发布作品 / 需求单 */
    function openPublish(type) {
      const isDemand = type === "demand";
      $id("publishBody").innerHTML = `
      <div class="pub-head">
        <h3>${isDemand ? "发布需求单" : "发布作品"}</h3>
        <button class="pub-close" data-pub="close" title="关闭">×</button>
      </div>
      <p class="hint">${isDemand ? "发布后会同步到「帮帮忙」与交易大厅的需求广场" : "支持绘画作品、教程视频、手书等，具体字段待补充"}</p>
      <div class="pub-form">
        <label>发布类型</label>
        <select id="pubType">
          <option ${isDemand ? "" : "selected"}>绘画作品</option>
          <option>教程视频</option>
          <option>手书</option>
          <option ${isDemand ? "selected" : ""}>需求单</option>
        </select>
        <label>标题</label>
        <input id="pubTitle" placeholder="${isDemand ? "例如：求一张古风立绘" : "给作品起个名字"}" />
        <label>说明</label>
        <textarea id="pubDesc" rows="3" placeholder="${isDemand ? "需求内容、预算、截止时间…" : "创作说明、使用素材、授权范围…（待补充）"}"></textarea>
        <label>上传文件（图片 / 视频，可多选）</label>
        <input id="pubFile" type="file" accept="image/*,video/*" multiple />
        <p class="pub-note">待补充：标签、定价、授权范围、合集归类等字段</p>
      </div>
      <div class="pub-acts">
        <button class="btn ghost sm" data-pub="close">取消</button>
        <button class="btn sm" data-pub="submit">发布</button>
      </div>`;
      $id("publishModal").style.display = "flex";
    }

    function closePublish() { $id("publishModal").style.display = "none"; }

    function submitPublish() {
      const type = $id("pubType").value;
      const title = $id("pubTitle").value.trim();
      const desc = $id("pubDesc").value.trim();
      if (!title) { toast("请填写标题"); return; }
      const file = ($id("pubFile").files || [])[0];
      const finish = img => {
        if (type === "需求单") {
          myDemands.unshift({
            id: "md" + Date.now(), t: title, budget: "面议", due: "待定",
            status: "招募中", type: "约稿", desc: desc || "需求细节待补充。"
          });
          renderDemandPlaza();
          if (pfState.tab !== "help") { pfState.tab = "help"; }
        } else {
          pfWorks.unshift({
            id: "pw" + Date.now(), t: title, type: type, tag: type,
            img: img || artworks[1].img, likes: 0, by: appState.nick
          });
        }
        closePublish();
        renderProfile();
        toast(type === "需求单" ? "需求单已发布，可在「帮帮忙」查看" : "作品已发布");
      };
      if (file && /^image\//.test(file.type)) {
        const reader = new FileReader();
        reader.onload = () => finish(reader.result);
        reader.readAsDataURL(file);
      } else {
        finish("");
      }
    }

    /* 个人主页交互 */
    $id("panel-profile").addEventListener("click", e => {
      const tab = e.target.closest("[data-pf-tab]");
      if (tab) { pfState.tab = tab.dataset.pfTab; renderProfile(); return; }
      const wb = e.target.closest("[data-wb-open]");
      if (wb) { openWorkbench(wb.dataset.wbOpen); return; }
      const helped = e.target.closest("[data-helped]");
      if (helped) { pfState.helped = helped.dataset.helped; renderProfile(); return; }
      if (e.target.closest("[data-goto-plaza]")) { goDemandPlaza(); return; }
      if (e.target.closest("#pfBack")) {
        pfState.visitor = null;
        pfState.tab = "works";
        renderProfile();
        return;
      }
    });

    /* 发布弹框：关闭 / 提交 */
    $id("publishModal").addEventListener("click", e => {
      if (e.target.id === "publishModal") { closePublish(); return; }
      const btn = e.target.closest("[data-pub]");
      if (!btn) return;
      if (btn.dataset.pub === "close") closePublish();
      else submitPublish();
    });

    /* 需求广场：接单 */
    $id("demandGrid").addEventListener("click", e => {
      const btn = e.target.closest("[data-take]");
      if (!btn) return;
      const id = btn.dataset.take;
      const d = myDemands.concat(plazaDemands).find(x => x.id === id);
      if (!d) return;
      helpedDemands.doing.unshift({
        id: "hd" + Date.now(), name: d.by || "匿名金主", t: d.t,
        due: d.due, stage: "已接单", progress: 5
      });
      btn.textContent = "已接单";
      btn.disabled = true;
      toast("已接单，可在个人集 · 已帮助的需求查看");
    });

    /* 发布入口：个人主页的＋ 与交易大厅的「发布需求」共用 */
    document.addEventListener("click", e => {
      const pub = e.target.closest("[data-open-publish]");
      if (pub) openPublish(pub.dataset.openPublish);
    });

    /* 从交易大厅进入他人主页 */
    $id("commissionGrid").addEventListener("click", e => {
      const card = e.target.closest("[data-visit]");
      if (!card || e.target.closest("[data-invite]")) return;
      openVisitorProfile(card.dataset.visit);
    });

    function openVisitorProfile(name) {
      pfState.visitor = name;
      pfState.tab = "works";
      pfState.helped = "doing";
      renderProfile();
      switchTab("profile");
      window.scrollTo(0, 0);
    }

    /* 工作台返回个人主页 */
    $id("wbBack").addEventListener("click", () => {
      switchTab("profile");
      window.scrollTo(0, 0);
    });

    /* ================= 集梦：三种模式切换 ================= */
    const dreamState = { mode: "assist" };

    function setDreamMode(mode) {
      dreamState.mode = mode;
      document.querySelectorAll("[data-dream-mode]").forEach(b => {
        const on = b.dataset.dreamMode === mode;
        b.classList.toggle("on", on);
        b.setAttribute("aria-selected", String(on));
      });
      [["assist", "dm-assist"], ["hand", "dm-hand"], ["live", "dm-live"]].forEach(([k, id]) => {
        $id(id).classList.toggle("active", k === mode);
      });
      if (mode === "hand") renderHandTimeline();
    }

    $id("dreamModes").addEventListener("click", e => {
      const btn = e.target.closest("[data-dream-mode]");
      if (btn) setDreamMode(btn.dataset.dreamMode);
    });

    /* 绘画并入集梦：把原绘画面板移到「辅助绘画」视图内，不再单独设导航入口 */
    const assistDrawPanel = $id("panel-draw");
    if (assistDrawPanel) {
      assistDrawPanel.classList.remove("panel", "active");
      assistDrawPanel.classList.add("assist-draw");
      const assistView = $id("dm-assist");
      const dreamSecHead = assistView.querySelector(".sec-head");
      assistView.insertBefore(assistDrawPanel, dreamSecHead);
    }

    $id("toAssistDraw").addEventListener("click", () => {
      const dp = $id("panel-draw");
      if (dp) dp.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    /* ================= live模式：Live2D 拆件引导（演示） ================= */
    // DEMO: 本模块不加载任何模型、不做图像分割，进度与分层结果全部为前端预设
    const LIVE_CONFIG = {
      presets: [
        {
          id: "p1", name: "内置立绘 A · 少女",
          img: IMG("anime%20girl%20full%20body%20character%20design%2C%20front%20view%2C%20plain%20light%20background%2C%20soft%20colors%2C%20digital%20illustration", "portrait_16_9")
        },
        {
          id: "p2", name: "内置立绘 B · 少年",
          img: IMG("anime%20boy%20full%20body%20character%20design%2C%20front%20view%2C%20plain%20light%20background%2C%20soft%20colors%2C%20digital%20illustration", "portrait_16_9")
        },
        {
          id: "p3", name: "内置立绘 C · 半身",
          img: IMG("anime%20character%20bust%20portrait%2C%20front%20view%2C%20plain%20background%2C%20soft%20lighting%2C%20digital%20painting", "portrait_4_3")
        }
      ],
      layers: [
        { id: "hair", name: "头发", desc: "前后发 · 2 图层", color: "#c08b84", tint: "rgba(192,139,132,.26)", box: { left: 21, top: 5, width: 58, height: 40 } },
        { id: "eyes", name: "眼睛", desc: "瞳孔 / 高光 · 4 图层", color: "#8fa6a1", tint: "rgba(143,166,161,.26)", box: { left: 31, top: 31, width: 38, height: 13 } },
        { id: "body", name: "身体", desc: "躯干 / 手臂 · 3 图层", color: "#8fa6e8", tint: "rgba(143,166,232,.24)", box: { left: 23, top: 47, width: 54, height: 49 } },
        { id: "acc", name: "配饰", desc: "发饰 / 挂件 · 1 图层", color: "#d6cfba", tint: "rgba(214,207,186,.26)", box: { left: 63, top: 41, width: 24, height: 22 } }
      ],
      analysis: [
        { text: "读取立绘尺寸与透明通道…", log: "识别画布 1024 × 1536，检测到透明底" },
        { text: "识别人体轮廓与头部位置…", log: "找到头部区域，估计肩线与重心" },
        { text: "分离头发图层（前后发）…", log: "头发 → 2 个候选图层" },
        { text: "分离眼部与口鼻部件…", log: "眼睛 → 4 个候选图层；嘴 → 1 个" },
        { text: "分离身体、手臂与配饰…", log: "身体 → 3 个候选图层；配饰 → 1 个" },
        { text: "汇总图层结构，生成拆件建议…", log: "共 4 组 11 个候选图层（演示）" }
      ],
      note: "本页为拆件流程演示，不执行真实分割，绑定需在 Cubism 完成",
      exportToast: "演示版：不会生成 PSD 文件。真实分层请在 Live2D Cubism 中完成",
      cubismUrl: "https://www.live2d.com/cubism/"
    };

    const liveState = { step: 1, presetId: "", img: "", hidden: new Set(), timers: [] };

    function renderLivePresets() {
      $id("livePresets").innerHTML = LIVE_CONFIG.presets.map(p => `
  <button class="live-preset ${p.id === liveState.presetId ? "on" : ""}" data-live-preset="${p.id}">
    <img src="${p.img}" alt="${p.name}" loading="lazy" />
    <span>${p.name}</span>
  </button>`).join("");
    }

    function setLiveImage(img, presetId, label) {
      liveState.img = img;
      liveState.presetId = presetId;
      $id("liveImg").src = img;
      $id("livePickNote").textContent = label;
      renderLivePresets();
    }

    function setLiveStep(n) {
      liveState.step = n;
      document.querySelectorAll("[data-live-step]").forEach(b => {
        const v = Number(b.dataset.liveStep);
        b.classList.toggle("on", v === n);
        b.classList.toggle("done", v < n);
      });
      $id("liveStep1").classList.toggle("active", n === 1);
      $id("liveStep2").classList.toggle("active", n === 2);
      $id("liveStep3").classList.toggle("active", n === 3);
      if (n === 3) renderLiveLayers();
    }

    function clearLiveTimers() {
      liveState.timers.forEach(t => clearTimeout(t));
      liveState.timers = [];
    }

    function startLiveAnalysis() {
      if (!liveState.img) { toast("请先选择一张立绘"); return; }
      clearLiveTimers();
      setLiveStep(2);
      $id("liveBarFill").style.width = "0%";
      $id("liveLog").innerHTML = "";
      $id("liveProgressText").textContent = "准备分析…";
      const steps = LIVE_CONFIG.analysis;
      steps.forEach((s, i) => {
        liveState.timers.push(setTimeout(() => {
          $id("liveBarFill").style.width = Math.round(((i + 1) / steps.length) * 100) + "%";
          $id("liveProgressText").textContent = s.text;
          const li = document.createElement("li");
          li.textContent = s.log;
          $id("liveLog").appendChild(li);
          if (i === steps.length - 1) {
            liveState.timers.push(setTimeout(() => {
              setLiveStep(3);
              toast("拆件分析完成（演示）");
            }, 520));
          }
        }, 520 * (i + 1)));
      });
    }

    function renderLiveLayers() {
      $id("liveLayerList").innerHTML = LIVE_CONFIG.layers.map(l => `
  <label class="live-layer" data-layer-row="${l.id}">
    <span class="ll-dot" style="background:${l.color}"></span>
    <span class="ll-name">${l.name}<em>${l.desc}</em></span>
    <input type="checkbox" data-live-layer="${l.id}" ${liveState.hidden.has(l.id) ? "" : "checked"} />
    <span class="ll-switch"></span>
  </label>`).join("");
      $id("liveMasks").innerHTML = LIVE_CONFIG.layers.map(l => `
  <div class="live-mask ${liveState.hidden.has(l.id) ? "off" : ""}" data-mask="${l.id}"
       style="left:${l.box.left}%;top:${l.box.top}%;width:${l.box.width}%;height:${l.box.height}%;--mc:${l.color};--mc-tint:${l.tint}">
    <span>${l.name}</span>
  </div>`).join("");
    }

    $id("livePresets").addEventListener("click", e => {
      const btn = e.target.closest("[data-live-preset]");
      if (!btn) return;
      const p = LIVE_CONFIG.presets.find(x => x.id === btn.dataset.livePreset);
      if (p) setLiveImage(p.img, p.id, "已选择：" + p.name);
    });

    $id("livePick").addEventListener("click", () => $id("liveFile").click());
    $id("liveDrop").addEventListener("click", e => {
      if (!e.target.closest("button")) $id("liveFile").click();
    });
    $id("liveFile").addEventListener("change", e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setLiveImage(reader.result, "", "已选择本地图片：" + file.name + "（演示）");
      reader.readAsDataURL(file);
    });
    ["dragover", "dragenter"].forEach(t => $id("liveDrop").addEventListener(t, e => {
      e.preventDefault();
      $id("liveDrop").classList.add("drag");
    }));
    ["dragleave", "drop"].forEach(t => $id("liveDrop").addEventListener(t, e => {
      e.preventDefault();
      $id("liveDrop").classList.remove("drag");
    }));
    $id("liveDrop").addEventListener("drop", e => {
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) { toast("请拖入图片文件"); return; }
      const reader = new FileReader();
      reader.onload = () => setLiveImage(reader.result, "", "已选择本地图片：" + file.name + "（演示）");
      reader.readAsDataURL(file);
    });

    $id("liveNext1").addEventListener("click", startLiveAnalysis);
    $id("liveSkip").addEventListener("click", () => {
      clearLiveTimers();
      $id("liveBarFill").style.width = "100%";
      $id("liveProgressText").textContent = "已跳过动画（演示）";
      setLiveStep(3);
    });
    $id("liveAgain").addEventListener("click", startLiveAnalysis);
    $id("liveExport").addEventListener("click", () => toast(LIVE_CONFIG.exportToast));
    $id("liveCubism").addEventListener("click", () => {
      window.open(LIVE_CONFIG.cubismUrl, "_blank", "noopener");
      toast("将打开 Live2D Cubism 官网（演示入口）");
    });

    $id("liveSteps").addEventListener("click", e => {
      const btn = e.target.closest("[data-live-step]");
      if (!btn) return;
      const n = Number(btn.dataset.liveStep);
      if (n === 2) { startLiveAnalysis(); return; }
      if (n === 3 && !liveState.img) { toast("请先选择一张立绘"); return; }
      setLiveStep(n);
    });

    $id("liveLayerList").addEventListener("change", e => {
      const cb = e.target.closest("[data-live-layer]");
      if (!cb) return;
      const id = cb.dataset.liveLayer;
      if (cb.checked) liveState.hidden.delete(id);
      else liveState.hidden.add(id);
      const mask = document.querySelector(`.live-mask[data-mask="${id}"]`);
      if (mask) mask.classList.toggle("off", !cb.checked);
    });
    $id("liveLayerList").addEventListener("mouseover", e => {
      const row = e.target.closest("[data-layer-row]");
      if (!row) return;
      const mask = document.querySelector(`.live-mask[data-mask="${row.dataset.layerRow}"]`);
      if (mask) mask.classList.add("hover");
    });
    $id("liveLayerList").addEventListener("mouseout", e => {
      const row = e.target.closest("[data-layer-row]");
      if (!row) return;
      const mask = document.querySelector(`.live-mask[data-mask="${row.dataset.layerRow}"]`);
      if (mask) mask.classList.remove("hover");
    });

    /* ================= 简单辑：手书工作流（演示） ================= */
    // DEMO: 脚本由关键词匹配本地模板，教程为预设数据，视频为 Canvas 模拟渲染
    const HAND_CONFIG = {
      duration: 24,
      prompts: ["猫在午后窗台伸懒腰", "雨夜路口，一个人等末班车", "毕业那天，教室里的最后一束光"],
      scripts: [
        {
          id: "cat",
          keys: ["猫", "窗", "午后", "懒", "日常", "治愈"],
          title: "《午后窗台》日常手书",
          advice: "可行性高：单场景 + 单角色，24 秒、5 个镜头即可完成，适合 2-3 天制作；建议先定光影再做尾巴的小动效。",
          scenes: [
            { name: "窗台空镜", cam: "缓慢推近", dur: 5, img: IMG("sunlit%20windowsill%20with%20plant%20and%20dust%20in%20the%20air%2C%20soft%20afternoon%20light%2C%20anime%20background%20illustration", "portrait_4_3") },
            { name: "猫的侧脸", cam: "轻微摇镜", dur: 5, img: IMG("cute%20cat%20side%20profile%20sitting%20on%20a%20windowsill%2C%20anime%20style%20illustration%2C%20warm%20light", "portrait_4_3") },
            { name: "尾巴摆动", cam: "缓慢推近", dur: 5, img: IMG("close%20up%20of%20a%20cat%20tail%20swinging%2C%20sunlight%2C%20anime%20style%20illustration", "portrait_4_3") },
            { name: "伸懒腰", cam: "缓慢拉远", dur: 5, img: IMG("cat%20stretching%20on%20a%20windowsill%2C%20afternoon%20sunlight%2C%20anime%20illustration", "portrait_4_3") },
            { name: "趴在书上", cam: "缓慢推近", dur: 4, img: IMG("cat%20sleeping%20on%20an%20open%20book%2C%20warm%20lamp%20light%2C%20anime%20illustration", "portrait_4_3") }
          ],
          subtitle: ["午后的光刚好落在窗台", "它眯起眼睛，像在思考什么", "尾巴扫过桌上的书页", "伸了一个很长的懒腰", "就这样，又睡了一下午"],
          effects: ["缓慢推近", "光影闪烁", "轻微摇镜", "白闪转场"],
          keywords: "手书 分镜 光影"
        },
        {
          id: "rain",
          keys: ["雨", "夜", "末班车", "城市", "孤独", "霓虹"],
          title: "《末班车》雨夜手书",
          advice: "可行：雨夜氛围靠色调与反光即可成立，24 秒 5 个镜头；注意车窗雨滴动效别盖过人物情绪。",
          scenes: [
            { name: "雨夜路口", cam: "轻微摇镜", dur: 5, img: IMG("rainy%20city%20crossing%20at%20night%2C%20neon%20reflections%2C%20anime%20background%2C%20cinematic", "portrait_4_3") },
            { name: "末班车进站", cam: "快速推近", dur: 5, img: IMG("last%20bus%20arriving%20at%20a%20rainy%20night%20bus%20stop%2C%20neon%20lights%2C%20anime%20background", "portrait_4_3") },
            { name: "车窗上的雨", cam: "缓慢推近", dur: 5, img: IMG("rain%20drops%20on%20a%20bus%20window%20at%20night%2C%20blurred%20city%20lights%2C%20anime%20style", "portrait_4_3") },
            { name: "空座位", cam: "缓慢拉远", dur: 5, img: IMG("empty%20bus%20seat%20at%20night%2C%20warm%20interior%20light%2C%20anime%20background", "portrait_4_3") },
            { name: "到站", cam: "轻微摇镜", dur: 4, img: IMG("bus%20door%20opening%20at%20night%2C%20rain%2C%20anime%20background", "portrait_4_3") }
          ],
          subtitle: ["雨把整条街擦得很亮", "末班车比平时晚了两分钟", "车窗上，城市在慢慢化开", "车厢里只剩下空座位", "到站了，雨还在下"],
          effects: ["快速推近", "白闪转场", "轻微摇镜", "冷色滤镜"],
          keywords: "雨夜 手书 冷色调"
        },
        {
          id: "grad",
          keys: ["毕业", "教室", "校园", "夏天", "离别", "青春"],
          title: "《最后一束光》毕业手书",
          advice: "可行：固定场景内做光的变化，情绪更集中；24 秒 5 个镜头，结尾留 2 秒黑场更有余味。",
          scenes: [
            { name: "教室空镜", cam: "缓慢推近", dur: 5, img: IMG("empty%20classroom%20in%20late%20afternoon%2C%20golden%20light%20through%20windows%2C%20anime%20background", "portrait_4_3") },
            { name: "黑板留言", cam: "轻微摇镜", dur: 5, img: IMG("chalk%20writing%20on%20a%20blackboard%20in%20a%20classroom%2C%20warm%20light%2C%20anime%20style", "portrait_4_3") },
            { name: "课桌上的光", cam: "缓慢推近", dur: 5, img: IMG("desk%20with%20books%20and%20sunlight%2C%20empty%20classroom%2C%20anime%20background", "portrait_4_3") },
            { name: "走廊背影", cam: "缓慢拉远", dur: 5, img: IMG("student%20walking%20down%20a%20school%20corridor%2C%20back%20view%2C%20evening%20light%2C%20anime%20illustration", "portrait_4_3") },
            { name: "毕业证书", cam: "缓慢推近", dur: 4, img: IMG("graduation%20certificate%20on%20a%20desk%20with%20petals%2C%20soft%20light%2C%20anime%20style", "portrait_4_3") }
          ],
          subtitle: ["最后一节课的下课铃", "黑板上的字，谁也没舍得擦", "光落在课桌的划痕上", "走廊很长，我们走得很慢", "夏天结束在这里"],
          effects: ["缓慢推近", "光影闪烁", "白闪转场", "轻微摇镜"],
          keywords: "毕业 手书 光影 分镜"
        }
      ],
      tutorials: [
        {
          title: "手书分镜与镜头节奏基础", source: "B站 · 预设教程", keyword: "手书 分镜 教程",
          tags: ["分镜", "缓慢推近", "节奏"],
          thumb: IMG("storyboard%20sketches%20on%20paper%20with%20camera%20arrows%2C%20artist%20desk%2C%20top%20view%20photo", "landscape_4_3")
        },
        {
          title: "光影闪烁与白闪转场怎么做", source: "B站 · 预设教程", keyword: "手书 光影 转场",
          tags: ["光影闪烁", "白闪转场", "动效"],
          thumb: IMG("dramatic%20light%20rays%20through%20window%20with%20dust%2C%20cinematic%20anime%20style%20illustration", "landscape_4_3")
        },
        {
          title: "轻微摇镜与推拉运镜入门", source: "YouTube · 预设教程", keyword: "动效 运镜 tutorial",
          tags: ["轻微摇镜", "缓慢推近", "缓慢拉远", "运镜"],
          thumb: IMG("camera%20gimbal%20on%20a%20desk%20with%20monitor%20showing%20animation%20timeline%2C%20soft%20light%20photo", "landscape_4_3")
        },
        {
          title: "冷色调与雨夜氛围调色", source: "B站 · 预设教程", keyword: "雨夜 冷色调 调色",
          tags: ["冷色滤镜", "雨夜", "快速推近"],
          thumb: IMG("rainy%20night%20city%20with%20teal%20and%20blue%20neon%20tones%2C%20cinematic%20photo", "landscape_4_3")
        },
        {
          title: "手书字幕节奏与排版", source: "B站 · 预设教程", keyword: "手书 字幕 排版",
          tags: ["字幕", "节奏", "白闪转场"],
          thumb: IMG("elegant%20chinese%20calligraphy%20subtitle%20layout%20on%20a%20dark%20video%20frame%2C%20minimal%20design", "landscape_4_3")
        },
        {
          title: "一图流手书完整制作流程", source: "YouTube · 预设教程", keyword: "一图流 手书 教程",
          tags: ["分镜", "动效", "节奏", "光影闪烁"],
          thumb: IMG("artist%20workstation%20with%20drawing%20tablet%20and%20video%20editing%20timeline%2C%20warm%20light%2C%20photo", "landscape_4_3")
        }
      ]
    };

    const HAND_PPS = 44;
    const HAND_LABEL_W = 84;

    const handState = {
      step: 1,
      msgs: [],
      script: null,
      clips: [],
      selected: null,
      t: 0,
      duration: HAND_CONFIG.duration,
      playing: false,
      raf: 0,
      last: 0,
      finalized: false
    };

    function heEsc(s) {
      return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    function fmtHandTime(t) {
      const m = Math.floor(t / 60);
      const s = t - m * 60;
      return String(m).padStart(2, "0") + ":" + s.toFixed(1).padStart(4, "0");
    }

    function setHandStep(n) {
      handState.step = n;
      document.querySelectorAll("[data-hand-step]").forEach(b => {
        const v = Number(b.dataset.handStep);
        b.classList.toggle("on", v === n);
        b.classList.toggle("done", v < n);
      });
      $id("handStep1").classList.toggle("active", n === 1);
      $id("handStep2").classList.toggle("active", n === 2);
      $id("handStep3").classList.toggle("active", n === 3);
      if (n === 2) renderHandTutorials();
      if (n === 3) renderHandTimeline();
    }

    function matchHandScript(text) {
      let best = null, score = 0;
      HAND_CONFIG.scripts.forEach(sc => {
        const s = sc.keys.reduce((n, k) => n + (text.includes(k) ? 1 : 0), 0);
        if (s > score) { score = s; best = sc; }
      });
      return { script: best || HAND_CONFIG.scripts[0], score };
    }

    function handScriptHtml(sc) {
      return `<div class="msg-block"><b>可行性建议</b><p>${heEsc(sc.advice)}</p></div>` +
        `<div class="msg-block"><b>分镜脚本</b><ul>` +
        sc.scenes.map((s, i) => `<li><i>${i + 1}</i>${heEsc(s.name)} · ${s.dur}s · ${heEsc(s.cam)}</li>`).join("") +
        `</ul></div>` +
        `<div class="msg-block"><b>画面清单</b><div class="msg-chips">` +
        sc.scenes.map(s => `<span>${heEsc(s.name)}</span>`).join("") + `</div></div>` +
        `<div class="msg-block"><b>动效关键词</b><div class="msg-chips gold">` +
        sc.effects.map(x => `<span>${heEsc(x)}</span>`).join("") + `</div></div>`;
    }

    function pushHandMsg(who, content, asHtml) {
      handState.msgs.push({ who, content, asHtml: !!asHtml });
      const log = $id("handChat");
      const div = document.createElement("div");
      div.className = "chat-msg " + who;
      if (asHtml) div.innerHTML = content;
      else div.textContent = content;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }

    function renderHandScript(sc) {
      $id("handScript").innerHTML =
        `<p class="pane-head">结构化脚本</p>` +
        `<h3 class="sc-title">${heEsc(sc.title)}</h3>` +
        `<p class="sc-advice">${heEsc(sc.advice)}</p>` +
        `<div class="sc-block"><b>分镜脚本</b><ol>` +
        sc.scenes.map(s => `<li><span>${heEsc(s.name)}</span><em>${s.dur}s · ${heEsc(s.cam)}</em></li>`).join("") +
        `</ol></div>` +
        `<div class="sc-block"><b>画面清单</b><div class="msg-chips">` +
        sc.scenes.map(s => `<span>${heEsc(s.name)}</span>`).join("") + `</div></div>` +
        `<div class="sc-block"><b>动效关键词</b><div class="msg-chips gold">` +
        sc.effects.map(x => `<span>${heEsc(x)}</span>`).join("") + `</div></div>` +
        `<p class="demo-note">剧本为预设模板，可以继续在左侧追问时长、镜头或配色</p>`;
    }

    function sendHandMsg() {
      const input = $id("handInput");
      const text = (input.value || "").trim();
      if (!text) { toast("先说说你想做的手书"); return; }
      input.value = "";
      pushHandMsg("user", text);
      const { script, score } = matchHandScript(text);
      handState.script = script;
      setTimeout(() => {
        const prefix = score > 0
          ? "根据你的描述，我匹配到一版「" + script.title + "」的预设剧本（演示）。"
          : "没有完全匹配的预设剧本，先给你一版通用模板（演示），可以继续补充关键词。";
        pushHandMsg("ai", `<p class="msg-lead">${heEsc(prefix)}</p>` + handScriptHtml(script), true);
        renderHandScript(script);
        toast("已生成结构化脚本（演示）");
      }, 420);
    }

    $id("handSend").addEventListener("click", sendHandMsg);
    $id("handInput").addEventListener("keydown", e => {
      if (e.key === "Enter") sendHandMsg();
    });

    $id("handPrompts").addEventListener("click", e => {
      const chip = e.target.closest("[data-hand-prompt]");
      if (!chip) return;
      $id("handInput").value = chip.dataset.handPrompt;
      sendHandMsg();
    });

    function currentHandTutorials() {
      const sc = handState.script;
      const tags = sc ? sc.effects : [];
      const hit = HAND_CONFIG.tutorials.filter(t => t.tags.some(x => tags.includes(x)));
      if (!tags.length) return HAND_CONFIG.tutorials;
      const rest = HAND_CONFIG.tutorials.filter(t => hit.indexOf(t) < 0);
      return hit.concat(rest).slice(0, Math.max(3, hit.length));
    }

    function renderHandTutorials() {
      const sc = handState.script;
      const list = currentHandTutorials();
      $id("tutDesc").textContent = sc
        ? "按「" + sc.title + "」的动效关键词匹配到 " + list.length + " 个预设教程，点击卡片打开小窗播放器（占位）。"
        : "还没有脚本，先展示全部预设教程；点击卡片打开小窗播放器（占位）。";
      $id("tutList").innerHTML = list.map((t, i) => `
  <button class="tut-card" data-tut="${HAND_CONFIG.tutorials.indexOf(t)}">
    <div class="tut-thumb">
      <img src="${t.thumb}" alt="${t.title}" loading="lazy" />
      <span class="tut-play">▶</span>
    </div>
    <div class="tut-body">
      <h3>${heEsc(t.title)}</h3>
      <p>${heEsc(t.source)}</p>
      <div class="tut-tags">${t.tags.slice(0, 3).map(x => `<span>${heEsc(x)}</span>`).join("")}</div>
    </div>
  </button>`).join("");
    }

    function copyHandKeywords(extra) {
      const sc = handState.script;
      const kw = sc ? (sc.keywords + " " + sc.effects.join(" ")) : (extra || "手书 教程");
      const done = () => toast("已复制关键词，可去 B站 / YouTube 搜索（演示）：" + kw);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(kw).then(done).catch(() => toast("复制失败，请手动记录：" + kw));
      } else {
        toast("当前环境不支持自动复制，请手动记录：" + kw);
      }
    }

    $id("copyKeywords").addEventListener("click", () => copyHandKeywords());

    function openTutPlayer(index) {
      const t = HAND_CONFIG.tutorials[index];
      if (!t) return;
      const old = document.querySelector(".tut-player");
      if (old) old.remove();
      const el = document.createElement("div");
      el.className = "tut-player";
      el.style.left = Math.max(16, Math.round(window.innerWidth / 2 - 190)) + "px";
      el.style.top = Math.max(90, Math.round(window.innerHeight / 2 - 170)) + "px";
      el.innerHTML =
        `<div class="tp-bar"><span>动效教程 · 演示播放器</span><button class="tp-close" data-tp-close title="关闭">✕</button></div>` +
        `<div class="tp-screen"><div class="tp-eq"><i></i><i></i><i></i><i></i></div><span>占位播放器 · 不加载真实视频</span></div>` +
        `<div class="tp-foot"><div><b>${heEsc(t.title)}</b><em>${heEsc(t.source)}</em></div>` +
        `<button class="btn ghost sm" data-tp-copy>复制关键词</button></div>`;
      document.body.appendChild(el);

      const bar = el.querySelector(".tp-bar");
      let drag = false, pid = 0, sx = 0, sy = 0, ox = 0, oy = 0;
      bar.addEventListener("pointerdown", ev => {
        if (ev.target.closest("button")) return;
        drag = true;
        pid = ev.pointerId;
        sx = ev.clientX; sy = ev.clientY;
        ox = el.offsetLeft; oy = el.offsetTop;
        bar.setPointerCapture(pid);
        el.classList.add("dragging");
      });
      bar.addEventListener("pointermove", ev => {
        if (!drag) return;
        el.style.left = Math.max(0, Math.min(window.innerWidth - 140, ox + ev.clientX - sx)) + "px";
        el.style.top = Math.max(0, Math.min(window.innerHeight - 80, oy + ev.clientY - sy)) + "px";
      });
      bar.addEventListener("pointerup", () => {
        drag = false;
        try { bar.releasePointerCapture(pid); } catch (err) { /* 忽略 */ }
        el.classList.remove("dragging");
      });
      el.addEventListener("click", ev => {
        if (ev.target.closest("[data-tp-close]")) { el.remove(); return; }
        if (ev.target.closest("[data-tp-copy]")) copyHandKeywords(t.keyword);
      });
    }

    $id("tutList").addEventListener("click", e => {
      const card = e.target.closest("[data-tut]");
      if (card) openTutPlayer(Number(card.dataset.tut));
    });

    $id("handToTut").addEventListener("click", () => {
      if (!handState.script) { toast("先和 AI 助手聊两句，生成脚本再看教程"); return; }
      setHandStep(2);
      renderHandTutorials();
    });
    $id("handBack1").addEventListener("click", () => setHandStep(1));
    $id("handToEdit").addEventListener("click", () => {
      if (!handState.script) { toast("还没有脚本，先去第 1 步生成脚本"); return; }
      setHandStep(3);
      if (!handState.clips.length) generateHandDraft(true);
    });
    $id("handBack2").addEventListener("click", () => setHandStep(2));
    $id("handStepTop").addEventListener("click", () => setHandStep(1));
    $id("handSteps").addEventListener("click", e => {
      const btn = e.target.closest("[data-hand-step]");
      if (btn) setHandStep(Number(btn.dataset.handStep));
    });

    /* ---- 视频编辑器：Canvas 模拟渲染 + 三轨时间轴 ---- */
    const handImgCache = new Map();
    function getHandImg(src) {
      if (!src) return null;
      if (!handImgCache.has(src)) {
        const im = new Image();
        im.src = src;
        handImgCache.set(src, im);
      }
      return handImgCache.get(src);
    }

    function handClipLabel(c) {
      if (c.kind === "pic") return c.name;
      if (c.kind === "sub") return c.text;
      return c.text;
    }

    function updateHandBadge() {
      const el = $id("handState");
      if (!el) return;
      el.textContent = handState.finalized ? "已定案" : "草稿";
      el.classList.toggle("final", handState.finalized);
    }

    function updateHandSelection() {
      const info = $id("heSelection");
      if (!info) return;
      const c = handState.clips.find(x => x.id === handState.selected);
      if (!c) {
        info.textContent = "未选中片段。拖动片段可移动时间，拖右侧边缘可调时长。";
        return;
      }
      if (c.kind === "pic") {
        info.textContent = "已选中画面《" + c.name + "》· " + c.start.toFixed(1) + "s - " +
          (c.start + c.dur).toFixed(1) + "s · 运镜：" + c.cam + " · 滤镜：" + filterName(c.filter);
      } else if (c.kind === "sub") {
        info.textContent = "已选中字幕「" + c.text + "」· " + c.start.toFixed(1) + "s - " +
          (c.start + c.dur).toFixed(1) + "s";
      } else {
        info.textContent = "已选中音频「" + c.text + "」· 音量 " + c.vol + "%";
      }
    }

    function filterName(f) {
      return ({ none: "原色", warm: "暖调", cool: "冷调", mono: "黑白" })[f] || "原色";
    }

    function updateHandPlayhead() {
      const ph = $id("hePlayhead");
      if (ph) ph.style.left = (HAND_LABEL_W + handState.t * HAND_PPS) + "px";
      const label = $id("handTime");
      if (label) label.textContent = fmtHandTime(handState.t) + " / " + fmtHandTime(handState.duration);
    }

    function drawHandFrame() {
      const cv = $id("handCanvas");
      if (!cv) return;
      const ctx = cv.getContext("2d");
      const W = cv.width, H = cv.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#101210";
      ctx.fillRect(0, 0, W, H);

      const pic = handState.clips
        .filter(c => c.kind === "pic")
        .find(c => handState.t >= c.start && handState.t < c.start + c.dur);

      if (pic) {
        const p = Math.min(1, Math.max(0, (handState.t - pic.start) / pic.dur));
        const img = getHandImg(pic.img);
        const filters = {
          none: "none",
          warm: "saturate(1.12) sepia(.16)",
          cool: "saturate(1.08) hue-rotate(-16deg)",
          mono: "grayscale(1) contrast(1.06)"
        };
        ctx.save();
        ctx.filter = filters[pic.filter] || "none";
        if (img && img.complete && img.naturalWidth) {
          let zoom = 1.02, dx = 0;
          if (pic.cam === "缓慢推近") zoom = 1.02 + p * 0.12;
          else if (pic.cam === "快速推近") zoom = 1.04 + p * 0.26;
          else if (pic.cam === "缓慢拉远") zoom = 1.16 - p * 0.12;
          else if (pic.cam === "轻微摇镜") dx = (p - 0.5) * 46;
          const s = Math.max(W / img.naturalWidth, H / img.naturalHeight) * zoom;
          const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
          ctx.drawImage(img, (W - dw) / 2 + dx, (H - dh) / 2, dw, dh);
        } else {
          ctx.fillStyle = "#1c1e19";
          ctx.fillRect(0, 0, W, H);
          ctx.fillStyle = "rgba(214,207,186,.7)";
          ctx.font = "16px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("画面加载中…", W / 2, H / 2);
        }
        ctx.restore();
        if (pic.trans && handState.t - pic.start < 0.35) {
          ctx.fillStyle = "rgba(255,255,255," + ((1 - (handState.t - pic.start) / 0.35) * 0.72).toFixed(3) + ")";
          ctx.fillRect(0, 0, W, H);
        }
      } else {
        ctx.fillStyle = "#8b8d82";
        ctx.font = "15px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("画面轨在此时间点没有片段", W / 2, H / 2);
      }

      const sub = handState.clips
        .filter(c => c.kind === "sub")
        .find(c => handState.t >= c.start && handState.t < c.start + c.dur);
      if (sub) {
        ctx.font = "600 22px 'PingFang SC', 'Noto Sans SC', sans-serif";
        ctx.textAlign = "center";
        const tw = ctx.measureText(sub.text).width;
        ctx.fillStyle = "rgba(0,0,0,.55)";
        ctx.fillRect(W / 2 - tw / 2 - 14, H - 66, tw + 28, 40);
        ctx.fillStyle = "#f2efe4";
        ctx.fillText(sub.text, W / 2, H - 39);
      }

      ctx.textAlign = "left";
      ctx.font = "11px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.fillText("演示渲染 · 非真实视频", 12, 20);
    }

    function renderHandTimeline() {
      const wrap = $id("handTracksInner");
      if (!wrap) return;
      const DUR = handState.duration;
      $id("heRuler").style.width = DUR * HAND_PPS + "px";
      $id("heRuler").innerHTML = Array.from({ length: DUR + 1 }, (_, i) =>
        `<span class="he-tick" style="left:${i * HAND_PPS}px"><i>${i}s</i></span>`).join("");
      ["pic", "sub", "audio"].forEach(kind => {
        const track = document.querySelector('.he-track[data-kind="' + kind + '"]');
        if (!track) return;
        track.style.width = DUR * HAND_PPS + "px";
        track.innerHTML = handState.clips.filter(c => c.kind === kind).map(c => `
  <div class="he-clip ${kind}${handState.selected === c.id ? " sel" : ""}" data-clip="${c.id}"
       style="left:${c.start * HAND_PPS}px;width:${Math.max(18, c.dur * HAND_PPS)}px">
    <span class="he-clip-txt">${heEsc(handClipLabel(c))}</span>
    <span class="he-handle"></span>
  </div>`).join("");
      });
      updateHandPlayhead();
      updateHandSelection();
      drawHandFrame();
    }

    function handBindDrag() {
      $id("handTracks").addEventListener("pointerdown", e => {
        const track = e.target.closest(".he-track");
        if (!track) return;
        const clipEl = e.target.closest("[data-clip]");
        if (!clipEl) {
          const rect = track.getBoundingClientRect();
          handState.t = Math.max(0, Math.min(handState.duration, (e.clientX - rect.left) / HAND_PPS));
          updateHandPlayhead();
          drawHandFrame();
          return;
        }
        const clip = handState.clips.find(c => c.id === clipEl.dataset.clip);
        if (!clip) return;
        const isHandle = !!e.target.closest(".he-handle");
        handState.selected = clip.id;
        document.querySelectorAll(".he-clip").forEach(el => el.classList.toggle("sel", el === clipEl));
        updateHandSelection();
        const startX = e.clientX;
        const baseStart = clip.start, baseDur = clip.dur;
        clipEl.setPointerCapture(e.pointerId);
        const move = ev => {
          const dx = (ev.clientX - startX) / HAND_PPS;
          if (isHandle) {
            clip.dur = Math.max(1, Math.min(handState.duration - clip.start, Math.round((baseDur + dx) * 4) / 4));
            clipEl.style.width = Math.max(18, clip.dur * HAND_PPS) + "px";
          } else {
            clip.start = Math.max(0, Math.min(handState.duration - clip.dur, Math.round((baseStart + dx) * 4) / 4));
            clipEl.style.left = clip.start * HAND_PPS + "px";
          }
          updateHandSelection();
        };
        const up = ev => {
          clipEl.removeEventListener("pointermove", move);
          clipEl.removeEventListener("pointerup", up);
          try { clipEl.releasePointerCapture(ev.pointerId); } catch (err) { /* 忽略 */ }
          renderHandTimeline();
        };
        clipEl.addEventListener("pointermove", move);
        clipEl.addEventListener("pointerup", up);
      });
    }

    let handUid = 0;
    function handClipId(prefix) {
      handUid += 1;
      return prefix + Date.now() + "_" + handUid;
    }

    function generateHandDraft(silent) {
      const sc = handState.script;
      if (!sc) { toast("先在第 1 步生成脚本，再一键生成草稿"); return; }
      const clips = [];
      let t = 0;
      sc.scenes.forEach((s, i) => {
        const dur = s.dur || 4;
        clips.push({
          id: handClipId("p"), kind: "pic", start: t, dur, name: s.name, img: s.img,
          cam: s.cam || "缓慢推近", filter: ["warm", "cool", "none", "warm", "mono"][i % 5], trans: true
        });
        if (sc.subtitle && sc.subtitle[i]) {
          clips.push({
            id: handClipId("s"), kind: "sub", start: t + 0.4,
            dur: Math.max(1, dur - 0.8), text: sc.subtitle[i]
          });
        }
        t += dur;
      });
      clips.push({
        id: handClipId("a"), kind: "audio", start: 0, dur: Math.min(t, handState.duration),
        text: "BGM · 演示音轨", vol: 80
      });
      handState.clips = clips;
      handState.selected = null;
      handState.t = 0;
      handState.finalized = false;
      stopHandPlay();
      updateHandBadge();
      renderHandTimeline();
      if (!silent) toast("草稿已按脚本顺序排好（规则生成，演示）");
    }

    $id("handDraft").addEventListener("click", () => generateHandDraft(false));

    $id("handFinalize").addEventListener("click", () => {
      if (!handState.clips.length) { toast("还没有片段，先生成草稿或添加素材"); return; }
      if (handState.finalized) { toast("当前草稿已定案"); return; }
      handState.finalized = true;
      updateHandBadge();
      toast("已定案：当前时间轴标记为定稿状态（演示）");
    });

    function stopHandPlay() {
      handState.playing = false;
      if (handState.raf) cancelAnimationFrame(handState.raf);
      handState.raf = 0;
      const btn = $id("handPlay");
      if (btn) btn.textContent = "▶";
    }

    function handTick(now) {
      if (!handState.playing) return;
      const dt = (now - handState.last) / 1000;
      handState.last = now;
      handState.t += dt;
      if (handState.t >= handState.duration) {
        handState.t = handState.duration;
        updateHandPlayhead();
        drawHandFrame();
        stopHandPlay();
        return;
      }
      updateHandPlayhead();
      drawHandFrame();
      handState.raf = requestAnimationFrame(handTick);
    }

    $id("handPlay").addEventListener("click", () => {
      if (handState.playing) { stopHandPlay(); return; }
      if (handState.t >= handState.duration) handState.t = 0;
      handState.playing = true;
      handState.last = performance.now();
      $id("handPlay").textContent = "⏸";
      handState.raf = requestAnimationFrame(handTick);
    });

    $id("heRuler").addEventListener("pointerdown", e => {
      const rect = $id("heRuler").getBoundingClientRect();
      handState.t = Math.max(0, Math.min(handState.duration, (e.clientX - rect.left) / HAND_PPS));
      updateHandPlayhead();
      drawHandFrame();
    });

    function nextHandAsset() {
      const sc = handState.script || HAND_CONFIG.scripts[0];
      const used = handState.clips.filter(c => c.kind === "pic").length;
      return sc.scenes[used % sc.scenes.length];
    }

    $id("panel-dream").addEventListener("click", e => {
      const tool = e.target.closest("[data-he-tool]");
      if (!tool) return;
      const kind = tool.dataset.heTool;
      const clip = handState.clips.find(c => c.id === handState.selected);
      if (kind === "split") {
        if (!clip || clip.kind !== "pic") { toast("先选中一个画面片段"); return; }
        const rel = handState.t - clip.start;
        if (rel < 0.6 || rel > clip.dur - 0.6) { toast("把播放头移到片段中间再分割"); return; }
        const a = Object.assign({}, clip, { dur: rel });
        const b = Object.assign({}, clip, { id: handClipId("p"), start: clip.start + rel, dur: clip.dur - rel, trans: false });
        handState.clips.splice(handState.clips.indexOf(clip), 1, a, b);
        handState.selected = b.id;
        renderHandTimeline();
        toast("已在播放头处分割（演示）");
        return;
      }
      if (kind === "text") {
        if (clip && clip.kind === "sub") {
          const next = window.prompt("修改字幕文字", clip.text);
          if (next !== null && next.trim()) clip.text = next.trim();
        } else {
          const start = Math.min(handState.t, handState.duration - 1);
          handState.clips.push({
            id: handClipId("s"), kind: "sub", start,
            dur: Math.max(1, Math.min(3, handState.duration - start)), text: "手写字幕（可修改）"
          });
          toast("已在播放头添加字幕（演示）");
        }
        renderHandTimeline();
        return;
      }
      if (kind === "volume") {
        const audio = clip && clip.kind === "audio" ? clip : handState.clips.find(c => c.kind === "audio");
        if (!audio) { toast("音频轨还没有片段"); return; }
        audio.vol = audio.vol > 40 ? audio.vol - 20 : 100;
        handState.selected = audio.id;
        renderHandTimeline();
        toast("音频音量已调为 " + audio.vol + "%（演示）");
        return;
      }
      if (kind === "asset") {
        const asset = nextHandAsset();
        const start = handState.clips.filter(c => c.kind === "pic")
          .reduce((m, c) => Math.max(m, c.start + c.dur), 0);
        if (start >= handState.duration) { toast("画面轨已排满 24 秒，先缩短片段再添加"); return; }
        handState.clips.push({
          id: handClipId("p"), kind: "pic", start,
          dur: Math.min(3, handState.duration - start), name: asset.name, img: asset.img,
          cam: asset.cam || "缓慢推近", filter: "warm", trans: true
        });
        renderHandTimeline();
        toast("已添加素材《" + asset.name + "》（演示）");
        return;
      }
      if (!clip || clip.kind !== "pic") { toast("先选中一个画面片段"); return; }
      if (kind === "filter") {
        const order = ["none", "warm", "cool", "mono"];
        clip.filter = order[(order.indexOf(clip.filter) + 1) % order.length];
        renderHandTimeline();
        toast("画面滤镜：" + filterName(clip.filter) + "（演示）");
      } else if (kind === "camera") {
        const order = ["缓慢推近", "缓慢拉远", "轻微摇镜", "快速推近"];
        clip.cam = order[(order.indexOf(clip.cam) + 1) % order.length];
        renderHandTimeline();
        toast("运镜方式：" + clip.cam + "（演示）");
      }
    });

    /* ---------- 集梦模块初始化 ---------- */
    (function initDream() {
      $id("handPrompts").innerHTML = HAND_CONFIG.prompts.map(p =>
        `<button class="chip-opt" data-hand-prompt="${heEsc(p)}">${heEsc(p)}</button>`).join("");
      pushHandMsg("ai", "你好，我是集梦的 AI 助手（演示）。先说说你想做一支什么样的手书：主题、角色、情绪或时长都可以。下面的示例点一下就能开始。");
      handBindDrag();
      updateHandBadge();
      renderHandTimeline();
      setLiveImage(LIVE_CONFIG.presets[0].img, LIVE_CONFIG.presets[0].id, "已选择：" + LIVE_CONFIG.presets[0].name);
      renderLiveLayers();
    })();

    /* ================= 周边定制：移动端小程序式演示 ================= */
    // DEMO: 商品、订单、购物车与结算均为前端模拟，不上传图片、不生成真实印刷文件
    const MP_TEMPLATES = {
      standee: { name: "亚克力立牌", ratio: "3 / 4", note: "15cm · 双面印刷" },
      badge: { name: "吧唧徽章", ratio: "1 / 1", note: "58mm · 亮膜" },
      card: { name: "色纸", ratio: "4 / 5", note: "14×18cm · 珠光" },
      tote: { name: "帆布包", ratio: "1 / 1.1", note: "加厚 · 大容量" }
    };

    const MP_PRESETS = [
      { id: "a1", name: "花朝月夕", img: artworks[0].img },
      { id: "a2", name: "霓虹雨夜", img: artworks[1].img },
      { id: "a3", name: "云端之城", img: artworks[2].img }
    ];

    const MP_GOODS = [
      {
        id: "g1", t: "亚克力立牌", sub: "15cm · 双面印刷", p: 68, hot: "热卖", template: "standee",
        img: goods[1].img
      },
      {
        id: "g2", t: "吧唧徽章", sub: "58mm · 亮膜", p: 25, hot: "新品", template: "badge",
        img: IMG("round%20button%20badge%20pin%20with%20cute%20anime%20character%20art%2C%20product%20close%20up%20photo", "square_hd")
      },
      {
        id: "g3", t: "色纸", sub: "14×18cm · 珠光", p: 35, hot: "", template: "card",
        img: IMG("shikishi%20art%20card%20with%20anime%20illustration%20displayed%20on%20a%20wooden%20stand%2C%20product%20photo", "square_hd")
      },
      {
        id: "g4", t: "帆布包", sub: "加厚 · 大容量", p: 89, hot: "", template: "tote",
        img: goods[2].img
      },
      {
        id: "g5", t: "亚克力钥匙扣", sub: "5 枚入 · 盲盒款", p: 45, hot: "", template: "badge",
        img: goods[3].img
      },
      {
        id: "g6", t: "明信片套装", sub: "6 张入 · 特种纸", p: 12, hot: "限定", template: "card",
        img: IMG("set%20of%20art%20postcards%20with%20anime%20illustrations%2C%20fanned%20on%20a%20desk%2C%20product%20photo", "square_hd")
      }
    ];

    const mpState = {
      product: null, template: "standee", img: "", zoom: 1, x: 0, y: 0,
      cart: [], tab: "discover"
    };

    function renderMpGoods() {
      $id("mpGoods").innerHTML = MP_GOODS.map(g => `
  <button class="mp-good" data-mp-good="${g.id}">
    <div class="mp-good-img">
      <img src="${g.img}" alt="${g.t}" loading="lazy" />
      ${g.hot ? `<span class="mp-good-tag">${g.hot}</span>` : ""}
    </div>
    <div class="mp-good-body">
      <b>${g.t}</b>
      <em>${g.sub}</em>
      <span class="mp-price">￥${g.p}<i>起</i></span>
    </div>
  </button>`).join("");
    }

    function applyMpArt() {
      const el = $id("mpsArt");
      if (!el) return;
      el.style.backgroundImage = `url("${mpState.img}")`;
      el.style.transform = `translate(${mpState.x}px, ${mpState.y}px) scale(${mpState.zoom})`;
    }

    function renderMpSheet() {
      const g = mpState.product;
      if (!g) return;
      const tpl = MP_TEMPLATES[mpState.template];
      $id("mpSheet").innerHTML = `
  <div class="mps-head"><span class="mps-grab"></span><b>${g.t}</b><button class="mps-close" data-mp-close title="关闭">✕</button></div>
  <p class="mps-sub">${g.sub} · ￥${g.p} 起</p>
  <div class="mps-preview" id="mpsPreview">
    <div class="mps-template tpl-${mpState.template}" style="aspect-ratio:${tpl.ratio}">
      <div class="mps-art" id="mpsArt"></div>
      <span class="mps-badge">${tpl.name} · 实时预览</span>
    </div>
    <span class="demo-tag mps-demo">演示</span>
  </div>
  <div class="mps-tpls">
    ${Object.entries(MP_TEMPLATES).map(([k, v]) =>
      `<button class="mps-chip ${k === mpState.template ? "on" : ""}" data-mp-tpl="${k}">${v.name}</button>`).join("")}
  </div>
  <div class="mps-block">
    <span class="mps-label">选择图片</span>
    <div class="mps-art-list">
      ${MP_PRESETS.map(a => `
      <button class="mps-art-opt ${mpState.img === a.img ? "on" : ""}" data-mp-art="${a.id}">
        <img src="${a.img}" alt="${a.name}" /><i>${a.name}</i>
      </button>`).join("")}
      <label class="mps-upload">＋<span>上传</span><input type="file" id="mpFile" accept="image/*" hidden /></label>
    </div>
  </div>
  <div class="mps-zoom">
    <span class="mps-label">缩放</span>
    <input id="mpZoom" type="range" min="100" max="260" value="${Math.round(mpState.zoom * 100)}" />
  </div>
  <p class="mps-note">拖动预览图可调整构图 · 演示版不生成真实印刷文件</p>
  <div class="mps-actions">
    <button class="mp-btn ghost" data-mp-close>再看看</button>
    <button class="mp-btn" data-mp-add>加入购物车</button>
  </div>`;
      applyMpArt();
    }

    function openMpSheet(id) {
      const g = MP_GOODS.find(x => x.id === id);
      if (!g) return;
      mpState.product = g;
      mpState.template = g.template;
      mpState.zoom = 1;
      mpState.x = 0;
      mpState.y = 0;
      if (!mpState.img) mpState.img = MP_PRESETS[0].img;
      renderMpSheet();
      $id("mpMask").classList.add("on");
      $id("mpSheet").classList.add("on");
    }

    function closeMpSheet() {
      $id("mpMask").classList.remove("on");
      $id("mpSheet").classList.remove("on");
    }

    function renderMpCart() {
      const box = $id("mpCartBox");
      if (!mpState.cart.length) {
        box.innerHTML = `<div class="mp-empty">还没有定制商品<em>去「发现」里选一个模板吧</em></div>`;
        return;
      }
      box.innerHTML = mpState.cart.map((c, i) => `
    <div class="mp-cart-item">
      <div class="mp-cart-thumb" style="background-image:url('${c.img}')"></div>
      <div class="mp-cart-info">
        <b>${c.good.t}</b>
        <em>${MP_TEMPLATES[c.tpl].name} · ${c.good.sub}</em>
        <span>￥${c.good.p}</span>
      </div>
      <button class="mp-cart-del" data-mp-del="${i}" title="移除">✕</button>
    </div>`).join("") +
        `<button class="mp-btn block" data-mp-checkout>去结算（演示）</button>`;
    }

    function setMpTab(tab) {
      mpState.tab = tab;
      document.querySelectorAll("[data-mp-tab]").forEach(b => b.classList.toggle("on", b.dataset.mpTab === tab));
      $id("mpPageDiscover").classList.toggle("active", tab === "discover");
      $id("mpPageCart").classList.toggle("active", tab === "cart");
      $id("mpPageMine").classList.toggle("active", tab === "mine");
      $id("mpScreen").scrollTop = 0;
      $id("mpTitle").textContent = tab === "discover" ? "周边定制" : tab === "cart" ? "我的定制" : "我的";
      if (tab === "cart") renderMpCart();
    }

    function addMpCart() {
      const g = mpState.product;
      if (!g) return;
      mpState.cart.unshift({ good: g, tpl: mpState.template, img: mpState.img });
      appState.cartCount++;
      cartBadge.textContent = appState.cartCount;
      $id("mpCartDot").textContent = mpState.cart.length;
      closeMpSheet();
      renderMpCart();
      toast("已加入购物车（演示）：" + g.t);
    }

    $id("hall-custom").addEventListener("click", e => {
      const good = e.target.closest("[data-mp-good]");
      if (good) { openMpSheet(good.dataset.mpGood); return; }
      const tab = e.target.closest("[data-mp-tab]");
      if (tab) { setMpTab(tab.dataset.mpTab); return; }
      if (e.target.closest("[data-mp-close]")) { closeMpSheet(); return; }
      const tpl = e.target.closest("[data-mp-tpl]");
      if (tpl) {
        mpState.template = tpl.dataset.mpTpl;
        renderMpSheet();
        return;
      }
      const artOpt = e.target.closest("[data-mp-art]");
      if (artOpt) {
        const a = MP_PRESETS.find(x => x.id === artOpt.dataset.mpArt);
        if (a) {
          mpState.img = a.img;
          mpState.x = 0;
          mpState.y = 0;
          document.querySelectorAll(".mps-art-opt").forEach(el => el.classList.toggle("on", el === artOpt));
          applyMpArt();
        }
        return;
      }
      if (e.target.closest("[data-mp-add]")) { addMpCart(); return; }
      if (e.target.closest("[data-mp-checkout]")) { toast("演示：未接入支付接口"); return; }
      const del = e.target.closest("[data-mp-del]");
      if (del) {
        mpState.cart.splice(Number(del.dataset.mpDel), 1);
        $id("mpCartDot").textContent = mpState.cart.length;
        renderMpCart();
        toast("已从定制清单移除（演示）");
      }
    });

    $id("mpMask").addEventListener("click", closeMpSheet);

    $id("mpSheet").addEventListener("input", e => {
      if (e.target.id === "mpZoom") {
        mpState.zoom = Number(e.target.value) / 100;
        applyMpArt();
      }
    });

    $id("mpSheet").addEventListener("change", e => {
      if (e.target.id !== "mpFile") return;
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        mpState.img = reader.result;
        mpState.x = 0;
        mpState.y = 0;
        document.querySelectorAll(".mps-art-opt").forEach(el => el.classList.remove("on"));
        applyMpArt();
        toast("已套用本地图片（演示）");
      };
      reader.readAsDataURL(file);
    });

    /* 拖动预览图调整构图 */
    (function bindMpDrag() {
      const sheet = $id("mpSheet");
      let drag = false, pid = 0, sx = 0, sy = 0, ox = 0, oy = 0;
      sheet.addEventListener("pointerdown", e => {
        if (!e.target.closest("#mpsPreview")) return;
        drag = true;
        pid = e.pointerId;
        sx = e.clientX; sy = e.clientY;
        ox = mpState.x; oy = mpState.y;
        e.target.closest("#mpsPreview").setPointerCapture(pid);
      });
      sheet.addEventListener("pointermove", e => {
        if (!drag) return;
        mpState.x = Math.max(-90, Math.min(90, ox + e.clientX - sx));
        mpState.y = Math.max(-90, Math.min(90, oy + e.clientY - sy));
        applyMpArt();
      });
      sheet.addEventListener("pointerup", () => { drag = false; });
    })();

    (function initMp() {
      renderMpGoods();
      renderMpCart();
    })();

    initWandDemo();
    renderSwatches();
    updateTip();
    renderRefChips();
    renderRefBody();
