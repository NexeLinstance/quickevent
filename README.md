# 📘 مستندات کامل QuickEvent

## مقدمه

**کوییک ایونت (QuickEvent)** یک فریم‌ورک مدرن جاوااسکریپت است که برای کار با DOM و ایونت‌ها و تغییرات روی المنت‌ها توسط **nexelpy** و برای استفاده در پایتون نوشته شده است. هرچند که این فریم‌ورک اتریبیوت‌محور است و به زبان خاصی برای استفاده وابسته نیست، اما استفاده از آن با پایتون در nexelpy بسیار خوش‌خط‌تر و خوش‌دست‌تر است.

---

## سینتکس

کوییک ایونت توابع زیادی برای کار با DOM ایجاد کرده است. همان‌طور که در زبان‌های برنامه‌نویسی برای استفاده از یک تابع، نام آن را می‌نویسیم و در پرانتزهای بعد آن ورودی‌ها را پاس می‌دهیم:

```python
setText(selector, text)
```

در کوییک ایونت هم همین رویکرد را برای صدا کردن تابع داریم که به آن‌ها **command** می‌گوییم و برای صدا کردنشان از این روش استفاده می‌کنیم:

```python
["setText", "#selector", "text"]
```

```python
["setText", "#my-div", "this is new text"]
["addClass", "#btn", "bg-red"]
["addStyle", "#my-span", "color:red;margin:8px;"]
```

هر command در کوییک ایونت یک **لیست (آرایه)** است که ایندکس صفر آن نام کامند و ایندکس‌های بعدی ورودی‌های آن هستند.

---

## ایونت‌ها

کوییک ایونت از ایونت‌های زیر پشتیبانی می‌کند:

| ایونت | توضیح |
|---|---|
| `click` | کلیک |
| `dblclick` | دابل‌کلیک |
| `keyup` | رها شدن کلید |
| `keydown` | فشرده شدن کلید |
| `change` | تغییر مقدار |
| `submit` | ارسال فرم |
| `focusin` | ورود فوکوس |
| `mouseenter` | ورود موس |
| `mouseleave` | خروج موس |
| `tick` | تایمر هر ثانیه |
| `loadDom` | آماده شدن DOM |

برای استفاده و فعال کردن هر کدام، یک اتریبیوت به نام همان ایونت ایجاد کنید.

**مثال HTML:**

```html
<button click='["setText", "#my-paragraph", "this is new text"]'>click me</button>
```

**مثال nexelpy:**

```python
x.button("click me", click=["setText", "#my-paragraph", "this is new text"])
```

در این مثال‌ها که هر دو یکی هستند، با کلیک روی دکمه کامند setText، المنتی با آی‌دی `my-paragraph` را سلکت کرده و متن آن را به `this is new text` تغییر می‌دهد.

💡 **نکته:** برای اجرای چند کامند در یک ایونت از لیست تو در تو استفاده می‌کنیم:

```python
x.button("click me", click=[
   ["setText", "#my-paragraph", "this is new content"],
   ["setText", "#my-title", "this is new title"],
])
```

💡 **نکته:** همهٔ کامندهای درون یک ایونت به‌صورت async زمان‌بندی می‌شوند و لزوماً منتظر اتمام یکدیگر نمی‌مانند؛ برای اجرای ترتیبی از `wait`، `then` یا `delay` استفاده کنید.

🔘 **loadDom:** این ایونت معادل رویداد استاندارد `DOMContentLoaded` در مرورگر است. تمام کامندهای تعریف‌شده در اتریبیوت `loadDom` بلافاصله پس از آماده‌سازی و پارس کامل ساختار DOM (حتی قبل از لود کامل تصاویر و استایل‌ها) به‌صورت خودکار اجرا می‌شوند.

```python
x.div(id="app", loadDom=["setText", "#welcome", "DOM is ready!"])
```

---

## Text Commands

```python
["setText", "#selector", "text", "delay"]
["appendText", "#selector", "text", "delay"]
["prependText", "#selector", "text", "delay"]
```

🧾 **مثال:**

```python
click=["setText", "#el1", "this is new text", 1000]
click=["appendText", "#el1", "this is new text", 1000]
click=["prependText", "#el1", "this is new text", 1000]
```

➕ **ایندکس 0:** نام کامند
➕ **ایندکس 1:** سلکتور که می‌تواند هر سلکتور استاندارد CSS و JS و از کلمهٔ `this` به معنی همین المنت باشد. اگر سلکتور چند المنت برگرداند، setText روی همهٔ آن‌ها اعمال می‌شود. (این رفتار برای همهٔ کامندها صادق است.)
➕ **ایندکس 2:** می‌تواند متن خام باشد یا با کامندهای get مقداردهی شود.
➕ **ایندکس 3:** تأخیر در اجرای این کامند که به میلی‌ثانیه است. (مقدار پیش‌فرض در صورت وارد نکردن، 0 است)

🔘 `setText`: متن جدید را جایگزین محتوای درون المنت یا المنتهای سلکت‌شده می‌کند.
🔘 `appendText`: متن جدید را به انتهای محتوای المنت(های) سلکت‌شده اضافه می‌کند.
🔘 `prependText`: متن جدید را به ابتدای محتوای المنت(های) سلکت‌شده اضافه می‌کند.

💡 **نکته:** کامند setText، متن ورودی را در قالب رشته به المنت اضافه می‌کند؛ یعنی حتی اگر یک تگ HTML در ورودی بنویسید، در نتیجهٔ نهایی متن تگ را می‌بینید و تگ نوشته‌شده به المنت و به DOM اضافه نمی‌شود.

```python
click=["setText", "#el1", "<span>this is new text</span>"]
```

💻 **نتیجه در مرورگر:** `<span>this is new text</span>`

### getText — الگوی یکپارچهٔ Getter

```python
["getText", "#selector"]
["getText", "#selector", "alias"]
["getText", "#selector", "alias", "expression"]
```

➕ **ایندکس 0:** نام کامند
➕ **ایندکس 1:** سلکتور المنتی که می‌خواهید متن آن را دریافت کنید.
➕ **ایندکس 2:** (اختیاری) مقدار برگشتی را در یک متغیر با نامی که پاس می‌دهید ذخیره می‌کند. این نام تا پایان اجرای ایونت و کامندهای درونش در دسترس است و بعد از آن از بین می‌رود.
➕ **ایندکس 3:** (اختیاری) expression برای پردازش مقدار.

🧾 **مثال:** جایگذاری مستقیم مقدار برگشتی:

```python
click=["setText", "#el2", ["getText", "#el3"]]
```

کد بالا متن المنت با آی‌دی el3 را جایگزین محتوای المنت با آی‌دی el2 می‌کند.

💡 **نکته:** می‌توانید به‌جای نوشتن متن خام و مستقیم، با کامند getText متن یک المنت را بگیرید و مقداردهی کنید. مدل پایتونی این دستور می‌شود (یک تابع در ورودی تابع دیگر):

```python
setText("#my-paragraph", getText("#content-div"))
```

🧾 **مثال:** استفاده از alias در چند کامند:

```python
click=[
   ["getText", "#el1", "my_p"],
   ["setText", "#el2", "{my_p}"],
   ["setText", "#el3", "{my_p}"],
]
```

🧾 **مثال:** استفاده از alias در قالب متن:

```python
click=[
   ["getText", "#el1", "my_p"],
   ["setText", "#el2", "text of element 2 is {my_p}"],
   ["setText", "#el3", "{my_p} is my new content"],
]
```

🧾 **مثال:** استفاده از expression:

```python
["setText", "#el1", ["getText", "#el2", "my_txt", "el2 change to {my_txt}"], 0]
```

می‌توانید از متدهای استرینگ زیر در ایندکس expression استفاده کنید:

`replace` · `upperCase` · `lowerCase` · `trim` · `slice` · `length` · `startsWith` · `endsWith` · `indexOf` · `split`

🧾 **مثال:**

```python
click=[
   ["getText", "#content-div", "my_p"],
   ["setText", "#my-paragraph", "content-div text is { upperCase(my_p) }"],
   ["setText", "#my-span", "{ replace(my_p,old text,NEW TEXT) } is my new content"],
]
```

```python
"{replace(my_p,old text,new text)}"
"{upperCase(my_p)}"
"{lowerCase(my_p)}"
"{trim(my_p)}"
"{slice(my_p,5)}"
"{length(my_p)}"
"{startsWith(my_p)}"
"{endsWith(my_p)}"
"{indexOf(my_p,letter)}"
"{split(my_p)}"
```

💡 **نکته:** `startsWith` و `endsWith` مقدار True یا False برمی‌گردانند و کاربرد اصلی آن‌ها در بخش if و elif و else است.
💡 **نکته:** `split` یک لیست از کلمات را برمی‌گرداند که می‌توانیم روی آن حلقه بزنیم که در بخش for بررسی‌اش می‌کنیم.

---

## Html Commands

```python
["setHtml", "#selector", "html", "delay"]
["appendHtml", "#selector", "html", "delay"]
["prependHtml", "#selector", "html", "delay"]
```

### getHtml — الگوی یکپارچهٔ Getter

```python
["getHtml", "#selector"]
["getHtml", "#selector", "alias"]
["getHtml", "#selector", "alias", "expression"]
```

➕ **ایندکس 0:** نام کامند
➕ **ایندکس 1:** سلکتور که می‌تواند هر سلکتور استاندارد CSS و JS و کلمهٔ `this` باشد.
➕ **ایندکس 2:** می‌تواند HTML به‌صورت دستی نوشته شود، یا از المنت دیگری get شود، یا یک view که با Ajax از سرور برگشته است.
➕ **ایندکس 3:** تأخیر در اجرای این کامند به میلی‌ثانیه. (پیش‌فرض 0)

🔘 `getHtml` محتوای درون تگ سلکت‌شده را برمی‌گرداند.

🧾 **مثال:** این کامند برخلاف setText، محتوا را به‌صورت المنت به DOM اضافه می‌کند. در این مثال تگ p به DOM اضافه می‌شود:

```python
click=["setHtml", "#el1", "<p>this is paragraph</p>", 0]
```

🧾 **مثال:**

```python
click=["setHtml", "#el1", ["getHtml", "#el3"], 0]
click=["setHtml", "#el1", ["getResponse", "view"], 0]
click=["setHtml", "#el1", "{response}", 0]
```

🔘 در مورد `getResponse` در بخش Ajax مفصل توضیح داده می‌شود.

💡💡💡 **نکتهٔ امنیتی:** کامندهای `setHtml` و `appendHtml` و `prependHtml` کدهای HTML را مستقیماً به DOM تزریق می‌کنند. همواره اطمینان حاصل کنید داده‌هایی که مستقیماً توسط کاربر نهایی در فرم‌ها نوشته می‌شوند را با `setText` مقداردهی کنید یا در صورت استفاده در ساختار HTML، مقادیر متنی آن‌ها در سمت سرور پاک‌سازی (Escape) شده باشند.

---

## Value Commands

```python
["setValue", "#selector", "value", "delay"]
```

### getValue — الگوی یکپارچهٔ Getter

```python
["getValue", "#selector"]
["getValue", "#selector", "alias"]
["getValue", "#selector", "alias", "expression"]
```

🧾 **مثال:**

```python
click=["setValue", "#input1", "alex", 0]
click=["setValue", "#el3", ["getValue", "#input2"], 0]
click=["setValue", "#el3", ["getValue", "#input2", "my_number", "{my_number+1}"], 0]
```

💡 **نکته:** کامند value، پراپرتی یک المنت را تغییر می‌دهد نه اتریبیوت آن را.

🧾 **مثال:**

```python
click=[
   ["getValue", "#input2", "my_number"],
   ["setText", "#el1", "{my_number+1}"],
   ["setText", "#el2", "{my_number*2}"],
   ["setText", "#el3", "my number is {my_number} ."],
]
```

---

## Class Commands

```python
["addClass", "#selector", "class", "delay"]
["removeClass", "#selector", "class", "delay"]
["toggleClass", "#selector", "class", "delay"]
["setClass", "#selector", "class", "delay"]
```

🔘 `setClass`: کلاس‌های موجود را حذف و کلاس جدید را اضافه می‌کند.

---

## Style Commands

```python
["addStyle", "#selector", "style", "delay"]
["removeStyle", "#selector", "style", "delay"]
["toggleStyle", "#selector", "style", "delay"]
["setStyle", "#selector", "style", "delay"]
```

🔘 `setStyle`: استایل‌های موجود را حذف و استایل جدید را اضافه می‌کند.

💡 **نکته:** کامندهای style مقادیر **inline style** را تغییر می‌دهند.

🧾 **مثال:**

```python
click=["addStyle", "#el1", "color:red;margin:8px;", 0]
```

---

## Animate Command

```python
["animate", "selector", {"css property": "value"}, "delay", "duration", "ease"]
```

از Web API Animation و متد animate جاوااسکریپت، CSS فعلی المنت را به CSS که در ورودی پاس می‌دهیم انیمیت می‌کند.

🧾 **مثال:**

```python
["animate", "this", {"color": "red", "margin": "8px"}, 0, 2000, "ease"]
```

---

## Attribute Commands

```python
["addAttr", "#selector", "Attribute key", "Attribute value", "delay"]
["removeAttr", "#selector", "Attribute key", "delay"]
["getAttr", "#selector", "Attribute key"]
["getAttr", "#selector", ["Attribute key", "alias"]]
["getAttr", "#selector", ["Attribute key", "alias"], "expression"]
```

در کوییک ایونت از اتریبیوت 2 استفادهٔ متفاوت داریم: استفادهٔ اول تغییر اتریبیوت‌های رسمی HTML است و دومی از آن به‌عنوان متغیر و نگهداری مقادیر استفاده می‌کنیم.

💡 **نکته:** در addAttr اگر اتریبیوت با کلید ورودی وجود داشته باشد مقدارش را set می‌کند و اگر نه آن را اضافه می‌کند.

```python
click=["addAttr", "#el1", "href", "https://www.nexelpy.net", 0]
click=["addAttr", "#el1", "counter", 1]
```

`counter` یک اتریبیوت رسمی نیست و ما به‌عنوان متغیر برای شمارنده از آن استفاده می‌کنیم.

🧾 **مثال:**

```python
click=[
   ["addAttr", "#el1", "counter", 1],
   ["addAttr", "#el2", ["getAttr", "#el1"]],
   ["addAttr", "#el3", ["getAttr", "#el1", "my_count", "{my_count+1}"]],
]
```

🧾 **مثال:**

```python
click=["setText", "#el4", ["getAttr", "#el1", "my_count", "{my_count+=1}"]]
```

💡 **نکته:** در این مثال عملیات assignment انجام دادیم. نه‌تنها مقداری که به el4 دادیم یک واحد بیشتر شده، بلکه مقدار اتریبیوت counter در el1 هم آپدیت و یک واحد اضافه شده است.

### Operators

| Operator | Description |
|---|---|
| `+ - * / % **` | Arithmetic |
| `> < >= <= == !=` | Comparison |
| `&& \|\| !` | Logical |
| `+= -= *= /= %=` | Assignment |

🧾 **مثال:** می‌توانید از کلید اتریبیوت برای نام متغیر استفاده کنید، به‌جای alias:

```python
click=[
   ["getAttr", "#el1", "number1"],
   ["getAttr", "#el2", "number2"],
   ["getAttr", "#el3", "result", "{result += number1 + number2}"],
   ["setText", "#el4", ["getAttr", "#el3", "result"], 0],
]
```

🧾 **مثال:** در این مثال getAttr مقدار تمام تگ‌های span که اتریبیوت `number` دارند را در `numbers` ذخیره می‌کند (به‌صورت لیست). در بخش expression با تابع sum همهٔ مقادیر جمع می‌شوند و درون el1 قرار می‌گیرند:

```python
click=["setText", "#el1", ["getAttr", "span", ["number", "numbers"], "{sum(numbers)}"]]
```

### توابع ریاضی

| Function | Description |
|---|---|
| `sum(x)` | Sum |
| `sub(x)` | Subtract |
| `min(x)` | Minimum |
| `max(x)` | Maximum |
| `avg(x)` | Average |
| `count(x)` | Count |
| `abs(x)` | Absolute |
| `floor(x)` | Floor |
| `ceil(x)` | Ceiling |
| `round(x)` | Round |
| `sqrt(x)` | Square root |
| `pow(x, n)` | Power |

---

## Props Commands

```python
["addProps", "#selector", "Props", "delay"]
["removeProps", "#selector", "Props", "delay"]
["toggleProps", "#selector", "Props", "delay"]
```

پراپ‌ها اتریبیوت‌های بدون value مثل `hidden`، `checked`، `readonly` هستند.

```python
click=["addProps", "this", "hidden"]
```

💡 **نکته:** پارامتر Props می‌تواند شامل یک یا چند خصوصیت باشد که با فاصله (space) از هم جدا شده‌اند؛ کوییک ایونت تمام آن‌ها را به‌صورت همزمان اعمال می‌کند.

🧾 **مثال (تغییر وضعیت چند پراپرتی همزمان):**

```python
click=["addProps", "#terms-checkbox", "checked disabled"]
click=["removeProps", "#submit-btn", "disabled hidden"]
```

## Utilities

```python
["wait", "ms"]
["then"]
["debounce", "ms"]
["log", "value"]
["redirect", "url"]
["reload"]
["scrollTo", "target"]
["focus", "selector"]
["copyClipboard", "selector", "value"]
["pasteClipboard", "selector"]
["getLocation", "href"]
["getLocation", "pathname"]
["getLocation", "search"]
["getLocation", "hash"]
```

🔘 `wait`: بین دو دسته از کامندها تأخیر ایجاد می‌کند. کامندهای بعد از wait هم‌زمان با کامندهای قبل اجرا نمی‌شوند، بلکه پس از مدت تعیین‌شده اجرا می‌شوند.

```python
click=[
   ["getValue", "#input2", "my_number"],
   ["setText", "#el1", "{my_number+1}"],
   ["wait", 2000],
   ["setText", "#el2", "{my_number*2}"],
   ["setText", "#el3", "my number is {my_number} ."],
]
```

🔘 `then`: تضمین می‌کند کامند بعدی پس از اتمام کامند یا عملیات async قبلی اجرا شود. در مثال زیر setText برای el3 بعد از اتمام انیمیشن اجرا می‌شود؛ setText برای el4 هم‌زمان با شروع انیمیشن اجرا می‌شود. برای اجرای خطی همهٔ کامندها، پس از هر کامند از then استفاده کنید.

```python
click=[
   ["animate", "this", {"color": "red", "margin": "8px"}, 0, 2000, "ease"],
   ["then"],
   ["setText", "#el3", "set new text after animate"],
   ["setText", "#el4", "set new text when click and run animate"],
]
```

🔘 `debounce`: فرض کنید یک input جست‌وجو با هر keyup به سرور درخواست می‌فرستد. برای کنترل تعداد درخواست‌ها نمی‌توان از wait استفاده کرد، چون wait فقط تأخیر می‌اندازد و تضمین می‌کند تمام ایونت‌های فراخوانی‌شده اجرا شوند. اما debounce تا زمان مشخص‌شده از اجرای ایونت جلوگیری می‌کند و پس از توقف ورودی، آخرین اجرا را انجام می‌دهد.

```python
keyup=[
   ["debounce", 1000],
   ["setText", "#el1", ["getValue", "#input1"]],
   ["setText", "#el2", ["getValue", "#input2"]],
]
```

---

## Cookie

```python
["setCookie", "key", "value"]
["getCookie", "key"]
["getCookie", "key", "alias"]
["getCookie", "key", "alias", "expression"]
```

🧾 **مثال:**

```python
click=["setCookie", "theme", "dark"]
click=["setText", "#el1", ["getCookie", "theme", "my_theme"], 0]
```

---

## Ajax

```python
["ajax", "url", "method", {"data": "value"}]
```

💡 **نکته:** url می‌تواند آدرس سرور داخلی، خارجی یا یک فایل استاتیک باشد.

💡 ورودی `method` نوع ارسال و پردازش درخواست را مشخص می‌کند:

- `GET`: دریافت اطلاعات با Query Parameters.
- `POST`: ارسال داده‌های استاندارد فرم.
- `json`: داده‌ها را با هدر `application/json` بسته‌بندی و با متد POST به سرور ارسال می‌کند تا مستقیماً در بک‌اند در دسترس باشد.

```python
id = await x.REQUEST.payload("json", "id")
id = await x.REQUEST.json("id")
```

🧾 **مثال:** درخواست به سرور برای فایل `my_file.txt`؛ محتوای فایل در el1 قرار می‌گیرد. متغیر `response` بدون نیاز به کامند get، در ایونتی که درخواست Ajax فرستاده شده در دسترس است.

```python
click=[
   ["ajax", "/my_file.txt"],
   ["setText", "#el1", "{response}"],
]
```

🧾 **مثال:** درخواست به سرور یک JSON برمی‌گرداند و با dot notation مقدار کلید name در المنت قرار می‌گیرد:

```python
click=[
   ["ajax", "/json-api", "GET"],
   ["setText", "#el1", "{response.name}"],
]
```

🧾 **مثال:** اگر از Vapi در nexelpy استفاده می‌کنید، خروجی یک JSON است که با کلید `view` المنت‌های ساخته‌شده سمت سرور را به DOM اضافه می‌کند.

```python
click=[
   ["ajax", "/v-api", "GET", {"name": "nexelpy", "id": 927}],
   ["then"],
   ["appendHtml", "#el1", "{response.view}"],
]
```

💡 از then استفاده می‌کنیم تا تضمین شود بعد از برگشت پاسخ از سرور و مقدار گرفتن response، appendHtml اجرا شود.

### مدیریت موفقیت و خطا

برای پروژه‌های واقعی معمولاً لازم است از نتیجهٔ درخواست مطلع شویم و پیام متناسب به کاربر نشان دهیم.

```python
["ajaxSuccess", ["commands"]]
["ajaxError", ["commands"]]
["ajaxError", ["commands"], {"statusCode": "custom message"}]
```

`ajaxSuccess`: اگر درخواست با موفقیت ارسال شد و پاسخ با موفقیت برگشت و response مقداردهی شد، کامندهای درون آن اجرا می‌شوند.

`ajaxError`: اگر درخواست یا ارسال ناموفق بود، کامندهای درون آن اجرا می‌شوند. از طریق `response.status_code` به کد برگشتی از سرور و از طریق `response.status_message` به توضیحات دسترسی دارید. این دو مقدار در ajaxSuccess نیز در دسترس هستند.

💡 در خطاهای زیرساختی و قطعی (0 و 5xx و 404 روتینگ) که بک‌اند نمی‌تواند status message بفرستد، status_message توسط کوییک ایونت با مقادیر پیش‌فرض مقداردهی می‌شود:

| کد | پیام پیش‌فرض |
|---:|---|
| 0 | Connection failed. Check your internet. |
| 400 | Invalid request. Please check your inputs. |
| 401 | Session expired. Please log in again. |
| 403 | Access denied. |
| 404 | Resource not found. |
| 405 | Method not allowed. |
| 408 | Request timed out. Try again. |
| 409 | Conflict occurred. Please refresh. |
| 410 | Resource no longer available. |
| 413 | File size exceeds the limit. |
| 415 | Unsupported file format. |
| 422 | Unprocessable data. Verify your inputs. |
| 429 | Too many requests. Please wait. |
| 500 | Internal server error. |
| 501 | Not implemented. |
| 502 | Bad gateway. Try again shortly. |
| 503 | Service unavailable. Under maintenance. |
| 504 | Gateway timeout. Try again. |

💡 برای تغییر مقدار پیش‌فرض، از ایندکس آخر برای تعیین پیام جدید استفاده کنید:

```python
["ajaxError", ["setText", "#el4", "{response.status_message}"], {404: "This item has been removed."}]
```

🧾 **مثال:** فقط یکی از دو شاخهٔ ajaxSuccess یا ajaxError اجرا می‌شود:

```python
click=[
   ["ajax", "/json-api", "GET", {"name": "nexelpy", "id": 927}],
   ["ajaxSuccess", ["appendHtml", "#el1", "{response.view}"]],
   ["ajaxError", ["setText", "#el4", "error : {response.status_message}"]],
]
```

🧾 **مثال:** با کلیک روی دکمه، اتریبیوت disabled به دکمه اضافه می‌شود تا کاربر نتواند پی‌درپی کلیک کند. پس از دریافت پاسخ و جایگذاری آن در DOM، disabled پاک می‌شود.

```python
click=[
   ["addProps", "this", "disabled"],
   ["ajax", "/json-api", "GET", {"name": "nexelpy", "id": 927}],
   ["ajaxSuccess", [
       ["appendHtml", "#el1", "{response.view}"],
       ["log", "{response.status_code}"],
       ["removeProps", "this", "disabled"],
   ]],
   ["ajaxError", ["setText", "#el4", "error : {response.status_message}"]],
]
```

💡 همانند دیگر بخش‌ها از لیست تو در تو برای چند کامند استفاده می‌کنیم. ajaxSuccess و ajaxError یک لیست (آرایه) در ورودی می‌گیرند.

💡 اگر از Vapi در nexelpy استفاده می‌کنید، ممکن است در view بک‌اند لینک‌های style و script را به تگ head اضافه کرده باشید. آن تگ‌ها در کلیدی به نام `QE_links_header` ایجاد می‌شوند. کوییک ایونت تضمین می‌کند لینک‌های غیر تکراری را بدون نوشتن کامند به تگ head صفحهٔ فعلی اضافه کند.

🧾 **مثال nexelpy:** بررسی وجود شناسهٔ کالا در پایگاه داده و بازگرداندن خطای 404 با پیام سفارشی:

```python
@AutoRegister("/vapi")
async def vapi():
   x = Vapi(__file__)
   id = await x.REQUEST.payload("GET", "id")
   if commodity.select(commodity[id]):
      pass
   else:
      return x.RESPONSE(statusCode=404, statusMessage="Item not found.")
```

در سمت کاربر می‌توان پیام 404 را با پیام سفارشی که در نمونهٔ بالا نشان داده شد جایگزین کرد.

---

## If / Else

```python
["if", ["Conditions"], ["commands"]]
["elif", ["Conditions"], ["commands"]]
["else", ["commands"]]
```

🧾 **مثال:** اگر اتریبیوت score در el1 بزرگ‌تر از 100 بود، بدنه که یک log است اجرا می‌شود:

```python
click=["if", ["getAttr", "#el1", "score", "{score > 100}"], ["log", "User wins!"]]
```

🧾 **مثال:** دو شرط بررسی می‌شود؛ اگر score بزرگ‌تر از 50 و کوچک‌تر از 90 باشد log اجرا می‌شود:

```python
click=[
   ["getAttr", "#el1", "score"],
   ["if", [["{score > 50}"], ["{score < 90}"]], ["log", "continue!!"]],
]
```

برای شرط OR از این روش استفاده می‌کنیم:

```python
click=[
   ["getAttr", "#el1", "score"],
   ["if", [["{score > 50}"], ["or"], ["{score < 90}"]], ["log", "continue!!"]],
]
```

🧾 **مثال:**

```python
click=[
   ["getAttr", "#el1", "score"],
   ["if", [
      ["{score > 50}"],
      ["{score < 60}"],
      ["or"],
      ["{score > 90}"],
      ["{score < 100}"],
   ], ["log", "continue!!"]],
]
```

معادل پایتونی کد بالا:

```python
score=getAttr("#el1", "score")
if (score > 50 and score < 60) or (score > 90 and score < 100):
   log("continue!!")
```

🧾 **مثال:** چند کامند در بدنهٔ شرط:

```python
click=["if", ["getAttr", "#el1", "score", "{score > 100}"], [
   ["log", "user win!!"],
   ["setText", "#el2", "User wins!"],
   ["wait", 3000],
   ["redirect", "/userlevel"],
]]
```

🧾 **مثال:** زنجیرهٔ if، elif و else:

```python
click=[
   ["getAttr", "#el1", "score"],
   ["if", ["{score > 100}"], ["log", "User wins!!!"]],
   ["elif", ["{score < 20}"], ["log", "User lost!"]],
   ["else", ["log", "The game continues!"]],
]
```

💡 برای بیش از یک شرط و نیز بیش از یک کامند، از لیست تو در تو استفاده کنید.

---

## For

```python
["for", "var name", "Iterators", ["commands"]]
["for", ["key", "value"], "dict/json", ["commands"]]
```

🧾 `getAttr` از spanهایی که اتریبیوت number دارند، یک لیست (آرایه) برمی‌گرداند؛ برای نمونه `Number = [23, 78, 91, 21, 12]`.

```python
click=["for", "i", ["getAttr", "span", "number"], ["log", "{i}"]]
```

```python
click=["for", "i", ["getAttr", "span", "number"], [
   ["log", "{i}"],
   ["getAttr", "#el1", "result", "{result += i}"],
]]
```

ایندکس آخر می‌تواند یک لیست برای یک کامند یا چند لیست درون یک لیست برای اجرای چند کامند باشد.

```python
click=[
   ["ajax", "/quickevent"],
   ["for", ["k", "v"], "{response.users}", ["appendText", "#el1", "{k}:{v} _ "]],
]
```

**نتیجهٔ نمونه:** `name:alex _ id:78 _ age:43 _ access:admin`

---

## Tick

```python
["setTick", "selector", "time", "mode"]
["playTick", "selector"]
["playTick", "selector", "time", "mode"]
["pauseTick", "selector"]
["resetTick", "selector", False]
```

`setTick` فقط تایمر را تنظیم می‌کند و آن را اجرا نمی‌کند. `playTick` بدون آرگومان‌های time و mode از زمان تنظیم‌شده استفاده می‌کند؛ اگر آن‌ها را دریافت کند، با مقادیر ورودی تنظیم و اجرا می‌شود. `pauseTick` تایمر را متوقف می‌کند. `resetTick` زمان را از نو تنظیم می‌کند؛ مقدار False فقط زمان را reset می‌کند و مقدار True علاوه بر reset، تایمر را اجرا می‌کند.

💡 این کامندها فقط کنترلرهای tick هستند. برای استفاده از تیک باید از اتریبیوت `tick` استفاده کنید.

🔘 `mode`: افزایشی یا کاهشی بودن تایمر را تنظیم می‌کند. اگر `++` باشد، از 0 تا زمان تنظیم‌شده می‌پیماید و اگر `--` باشد، از زمان تنظیم‌شده تا 0 می‌پیماید.

🧾 **مثال:** با کلیک روی دکمه، تایمر یک ساعت و 28 دقیقه و 32 ثانیه برای المنت my-div تنظیم و اجرا می‌شود. کامندهای درون اتریبیوت tick هر یک ثانیه یک‌بار اجرا می‌شوند.

```python
x.button("play tick", click=["playTick", "#my-div", "1:28:32", "--"])
x.div(id="my-div", tick=["setText", "this", "{tick}"])
```

💡 برای هر المنت یک tick تنظیم می‌شود و اتریبیوت tick و کامندهای آن باید روی همان المنت نوشته شوند. با این حال، کنترلرها می‌توانند از هر المنت دیگری با سلکت کردن المنت هدف، روی آن تغییر ایجاد کنند.

🧾 **مثال:**

```python
click=["setTick", "#el1", "28", "++"]
click=["setTick", "#el2", "01:00", "++"]
click=["setTick", "#el3", "01:00:00", "--"]
```

💡 نمی‌توانید بیش از مقادیر استاندارد برای زمان تنظیم کنید؛ برای مثال `01:05:63` یا `28:25:99` معتبر نیست.

🧾 مقدار عددی نیز پذیرفته می‌شود. در این مثال 650 ثانیه تنظیم و اجرا می‌شود:

```python
click=["playTick", "#el1", 650, "++"]
```

مقادیر قابل استفاده در ایونت tick:

```python
tick=["setText", "this", "{tick}"]
tick=["setText", "this", "{tick.h}"]
tick=["setText", "this", "{tick.m}"]
tick=["setText", "this", "{tick.s}"]
tick=["setText", "this", "{tick.total}"]
```

`{tick}` زمان کامل فعلی را به رشته برمی‌گرداند (مانند `01:00:00`). `{tick.h}` ساعت، `{tick.m}` دقیقه و `{tick.s}` ثانیه را به‌صورت عدد صحیح برمی‌گرداند. `{tick.total}` کل زمان باقی‌مانده را به ثانیه برمی‌گرداند؛ برای نمونه `34 + (8 * 60) + (60 * 60) = 4114`.

برای استفاده از مقدار تیک نیاز به کامند گت ندارید.

🧾 **مثال:** مقدار متن المنت هر ثانیه به‌روز می‌شود و اگر زمان باقی‌مانده کمتر از 30 ثانیه باشد، رنگ متن قرمز می‌شود:

```python
tick=[
   ["setText", "this", "{tick}"],
   ["if", ["{tick.total < 30}"], ["addStyle", "this", "color:red;"]],
]
```

💡 از لحظهٔ اجرای tick، کامندهای درون اتریبیوت tick هر یک ثانیه اجرا می‌شوند. برای نمونه، append در هر ثانیه یک متن به DOM اضافه می‌کند و Ajax نیز در صورت قرار گرفتن در این ایونت تکرار می‌شود؛ در انتخاب کامندها دقت کنید.

💡 کامندهای `addClass`، `addStyle` و `addProps` مقدار تکراری اضافه نمی‌کنند؛ کوییک ایونت پیش از افزودن بررسی می‌کند. در مثال بالا addStyle فقط یک‌بار اعمال می‌شود.

💡 `addAttr` نیز مانند دیکشنری پایتون عمل می‌کند: اگر مقدار جدید باشد، جایگزین می‌شود؛ در غیر این صورت مقدار قبلی باقی می‌ماند.

---

## Func

```python
["runFunc", "path", "funcname", "arg1", "arg2"]
```

یک تابع با نام funcname را از فایل JS موجود در path، با آرگومان‌های پاس‌داده‌شده اجرا می‌کند.

```python
click=["runFunc", "/my_lib/myfuncs.js", "myalert", "alex", "43", "972"]
```

---

## Dialog

کامند showDialog تگ dialog و محتوای درون آن را که به‌صورت پیش‌فرض مخفی است نمایش می‌دهد. از آن برای ساخت popover، منو، دیالوگ، popup، tooltip و منوی همبرگری استفاده می‌شود.

```python
["showDialog", ["dialog"], ["anchor"], "delay", "duration"]
```

➕ **ایندکس 0:** نام کامند
➕ **ایندکس 1:** سلکتور تگ dialog، به‌همراه تنظیمات آن در قالب لیست
➕ **ایندکس 2:** سلکتور المنتی که dialog در موقعیت آن نمایش داده می‌شود، به‌همراه تنظیماتش
➕ **ایندکس 3:** تأخیر در اجرای کامند
➕ **ایندکس 4:** زمان ترانزیشن fade

ساختار لیست dialog:

```python
["#dialog", "position", "offsetX", "offsetY", "auto hide"]
```

➕ **ایندکس 0:** سلکتور dialog
➕ **ایندکس 1:** موقعیتی از dialog که به anchor می‌چسبد؛ مانند `start-top` (`start` برای تعیین x و `top` برای y)
➕ **ایندکس 2:** فاصلهٔ dialog از anchor در محور x
➕ **ایندکس 3:** فاصلهٔ dialog از anchor در محور y
➕ **ایندکس 4:** پرچم auto hide؛ اگر True باشد، با کلیک بیرون dialog یا فشردن Escape مخفی می‌شود. اگر False باشد، برای مخفی‌کردن باید دکمه‌ای ایجاد کنید.

🧾 **مثال:**

```python
["showDialog", ["#dialog-tag", "start-top", "1rem", 8, True], ["#anchor", "end-bottom"], 0, 500]
```

💡 در مقادیر offset، عدد صحیح به معنی پیکسل است.

ساختار لیست anchor:

```python
["#anchor", "position"]
```

➕ **ایندکس 0:** سلکتور anchor (المنتی که dialog به آن می‌چسبد)
➕ **ایندکس 1:** موقعیتی از anchor که dialog به آن می‌چسبد

`position_X = "start, center, end"`  
`position_Y = "top, center, bottom"`

💡 `start` در جهت LTR یعنی چپ و در RTL یعنی راست. موقعیت‌ها را می‌توان ترکیب کرد:

```text
start-top       center-top       end-top
start-center    center-center    end-center
start-bottom    center-bottom    end-bottom
```

```
       start-top              center-top              end-top
           ●----------------------●----------------------●
           |                                             |
           |                                             |
start-     |                                             |     end-
center     ●                center-center                ●    center
           |                      ●                      |
           |                                             |
           |                                             |
           ●----------------------●----------------------●
      start-bottom          center-bottom           end-bottom

```




🧾 **مثال nexelpy:**

```python
x.button("show", mouseenter=["showDialog", ["#dialog-tag", "start-center", 8, 0], ["this", "end-center"], 0, 1000])
with x.dialog(id="dialog-tag"):
   with x.div(Class="bg-light"):
      x.h2("this is dialog", Class="text-dark")
```

💡 showDialog پیش از نمایش، استایل پیش‌فرض تگ dialog را پاک می‌کند و یک کانتینر بدون پس‌زمینه و استایل اضافی در اختیار شما می‌گذارد.

```python
["hideDialog", "#dialog-tag", 0, 500]
```

💡 **anchorهای ویژهٔ viewport و body:** علاوه بر انتخاب المنت واقعی، می‌توانید از مقدارهای ویژهٔ `viewport` و `body` برای موقعیت‌دهی استفاده کنید.

- `viewport`: موقعیت dialog نسبت به ناحیهٔ قابل‌مشاهدهٔ پنجرهٔ مرورگر محاسبه می‌شود. برای نمونه، `center-center` آن را در مرکز صفحهٔ قابل‌مشاهده نمایش می‌دهد؛ موقعیت با اسکرول صفحه تغییر نمی‌کند.
- `body`: موقعیت dialog نسبت به کل محتوای صفحه محاسبه می‌شود؛ در صفحهٔ اسکرول‌پذیر، جایگاه آن با محتوای صفحه ارتباط دارد.

```python
["viewport", "center-center"]
["body", "center-center"]
click=["showDialog", ["#dialog-tag", "center-center", 0, 0, False], ["viewport", "center-center"], 0, 300]
```

💡 viewport مقدار ویژه است و به‌جای سلکتور یک المنت واقعی استفاده می‌شود؛ viewport به ناحیهٔ قابل‌مشاهدهٔ مرورگر اشاره دارد و body به محتوای صفحه.

⚠️ dialog جایگزین modal نیست: backdrop و focus ندارد و صفحه را مسدود نمی‌کند.

```python
mouseenter=["showDialog", ["#dialog-tag", "center-center"], ["#anchor", "center-center"]]
mouseleave=["hideDialog", "#dialog-tag"]
```

🛑 در این نمونه با ورود موس روی anchor، محتوای dialog ممکن است به‌صورت پی‌درپی نمایش و مخفی شود. این رفتار ناشی از چرخهٔ رویدادهاست: dialog روی anchor قرار می‌گیرد، باعث اجرای mouseleave می‌شود، مخفی‌شدن آن دوباره mouseenter را فعال می‌کند. برای جلوگیری، باید موقعیت و ناحیهٔ تعاملی dialog را طوری طراحی کنید که این چرخه ایجاد نشود.

---

## Modal Commands

یک modal را در مرکز صفحه نمایش می‌دهد.

```python
["showModal", "selector", {"backdrop style"}, "auto hide", "delay", "duration"]
["hideModal", "selector", "delay", "duration"]
```

```python
click=["showModal", "#modal", {}, True, 0, 500]
click=["hideModal", "#modal", 0, 500]
```

اگر backdrop style خالی (`{}`) باشد، یک backdrop مشکی با opacity برابر 50 و blur پس‌زمینه ایجاد می‌شود. برای backdrop سفارشی، استایل دلخواه را به‌شکل زیر وارد کنید:

```python
{"backgroundColor": "white", "filter": "blur(2px)"}
```

💡 showModal پیش از نمایش، استایل پیش‌فرض تگ dialog را پاک می‌کند و یک کانتینر بدون پس‌زمینه و استایل اضافی در اختیار شما می‌گذارد.

🧾 **مثال nexelpy:**

```python
x.button("show modal", click=["showModal", "#modal", {}, True, 0, 500])
with x.dialog(id="modal"):
   with x.div(Class="bg-light w-50 h-50"):
      x.h2("this is modal", Class="text-dark")
      x.input(type="text", placeholder="First Name", autofocus=True)
```

💡 وقتی `auto hide = True` باشد، کلیک روی backdrop یا فشردن Escape، modal را به‌صورت خودکار می‌بندد. وقتی `auto hide = False` باشد، رویداد cancel بومی dialog مسدود می‌شود؛ Escape آن را نمی‌بندد و برای بستن باید صریحاً کامند hideModal را اجرا کنید، مثلاً از طریق دکمهٔ Close.

💡 showModal تگ dialog را مستقیماً وارد Top Layer مرورگر می‌کند؛ یعنی بالاتر از تمامی عناصر صفحه، حتی المنتی با `z-index: 999999`، رندر می‌شود و با `overflow: hidden` والدین بریده نمی‌شود.

---

## Collapse

دستور `collapse` در کوییک ایونت برای ساخت ویجت‌های بازوبسته‌شو (collapsible) به کار می‌رود؛ الگویی که در وب با نام Disclosure Widget شناخته می‌شود. این کامند روی جفت تگ‌های بومی HTML یعنی `details` و `summary` سوار می‌شود: تگ details ظرف محتوا و summary عنوان همیشه‌نمایان آن است. با کلیک یا tap روی summary، ویژگی open تگ details تغییر می‌کند و بقیهٔ محتوا نمایان یا پنهان می‌شود. این رفتار پایه‌ای را مرورگر بدون جاوااسکریپت ارائه می‌کند. کامند collapse آن را با انیمیشن fade تکمیل می‌کند.

این الگو برای FAQ، آکاردئون، منوهای تاشو و نمایش جزئیات اختیاری در فرم‌ها مناسب است. کامند دو مقدار می‌گیرد: delay (تأخیر شروع اجرا) و duration (طول ترانزیشن).

### سینتکس و مثال

الگوی استاندارد، قرار دادن کامند collapse روی تگ summary است؛ زیرا summary اولین فرزند details و نقطهٔ تعامل بومی کاربر است.

```python
with x.details():
   x.summary("collapse title", Class="marker-none", click=["collapse", 0, 1000])
   x.p("collapse body")
```

ساختار کامند:

- ایندکس 0: نام کامند (`collapse`).
- ایندکس 1: delay؛ تأخیر اجرای انیمیشن. مقدار 0 یعنی بدون تأخیر.
- ایندکس 2: duration؛ مدت ترانزیشن برحسب میلی‌ثانیه. مقدار 1000 یعنی یک ثانیه.

تگ details به‌صورت پیش‌فرض بسته است و فقط عنوان summary دیده می‌شود. بدنه پس از کلیک با انیمیشن نمایان می‌شود. کلیک روی summary وضعیت open را toggle می‌کند؛ پس یک کامند هم برای باز و هم برای بسته‌کردن کافی است.

### کلاس marker-none

در مثال، کلاس `marker-none` نشانگر پیش‌فرض مرورگر را حذف می‌کند؛ همان مثلثی که در ابتدای summary نمایش داده می‌شود. summary از شبه‌المان `::marker` پشتیبانی می‌کند. این کلاس همراه کوییک ایونت در دسترس است و نیازی به تعریف جداگانه در CSS پروژه ندارد.

اگر نشانگر را حذف می‌کنید، بهتر است جایگزینی مانند آیکون یا فلش دلخواه با `::before` قرار دهید تا کاربران از قابلیت بازوبسته‌شدن آگاه باشند و دسترسی‌پذیری ویجت حفظ شود.

### نکات کاربردی

- کامند را روی summary بگذارید، نه details.
- چون summary وضعیت را toggle می‌کند، یک کامند collapse کافی است و باز و بسته شدن با همان delay و duration انیمیت می‌شود.
- برای چند بخش مستقل، چند details بسازید و روی هر summary کامند collapse بگذارید.
- برای رفتار آکاردئونی که با باز شدن یک مورد، موارد هم‌نام بسته شوند، از اتریبیوت accordion در بخش بعد استفاده کنید.
- collapse استایل پیش‌فرض details را پاک نمی‌کند و رفتار بومی آن را حفظ می‌کند.

---

## Accordion

برای اتصال collapseها و ایجاد آکاردئون، از اتریبیوت `accordion` در تگ‌های summary استفاده کنید. وقتی value این اتریبیوت یکسان باشد، کوییک ایونت بخش‌های هم‌نام را پیدا می‌کند و پیش از باز کردن یک collapse بررسی می‌کند که collapse دیگری با همان نام باز نباشد؛ در صورت باز بودن، آن مورد بسته می‌شود.

```python
with x.details():
   x.summary("question1", accordion="FAQ", click=["collapse", 0, 1000])
   x.p("answer1")
with x.details():
   x.summary("question2", accordion="FAQ", click=["collapse", 0, 1000])
   x.p("answer2")
with x.details():
   x.summary("question3", accordion="FAQ", click=["collapse", 0, 1000])
   x.p("answer3")
```

اتریبیوت accordion روی تگ summary نوشته می‌شود. برای ساخت چند گروه مستقل، برای هر گروه value متفاوتی در نظر بگیرید.



*پایان مستندات QuickEvent*
