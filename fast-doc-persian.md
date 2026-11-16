
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
## Quick start
#### html
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@stable/quickevent.min.js" defer></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@stable/quickevent-markers.css">
```
####  nexelpy (python)
```python
x.script(parent=x.HEAD_tag,src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@stable/quickevent.min.js",type="module",props="defer")
x.link(parent=x.HEAD_tag, rel="stylesheet" ,href="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@stable/quickevent-markers.css")
```

```html
<!-- برای آخرین نسخه ریلیز شده (حتی آلفا) -->
<script type="module" src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@latest/quickevent.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@latest/quickevent-markers.css">

<!-- برای نسخه پایدار و تست‌شده (توصیه‌شده) -->
<script type="module" src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@stable/quickevent.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@stable/quickevent-markers.css">
```
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
<button click='["setText", "#my-paragraph", "hello world!"]'>click me</button>
<!-- Note: In HTML attributes, array/JSON strings must use double quotes (") so that JavaScript can parse them correctly. Single quotes (') will cause a parsing error. -->
```
💡 **نکته: ** در نکسل پای تک کوتیشن و یا دابل کوتیشن برای نوشتن کامند ها مهم نیست و اروری نداریم.

**مثال nexelpy:**

```python
from nexelpy import AutoRegister, View

@AutoRegister("/quickevent")
async def home():
    x = View(__file__, title="QuickEvent Demo")

    x.button("click me", click=["setText", "#my-paragraph", "hello world!"])
    return x.RESPONSE()
```

در این مثال‌ها که هر دو یکی هستند، با کلیک روی دکمه کامند setText، المنتی با آی‌دی `my-paragraph` را سلکت کرده و متن آن را به `hello world!` تغییر می‌دهد.

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

➕ **ایندکس 0:** نام کامند<br>
➕ **ایندکس 1:** سلکتور المنتی که می‌خواهید متن آن را دریافت کنید.<br>
➕ **ایندکس 2:** (اختیاری) مقدار برگشتی را در یک متغیر با نامی که پاس می‌دهید ذخیره می‌کند. این نام تا پایان اجرای ایونت و کامندهای درونش در دسترس است و بعد از آن از بین می‌رود.<br>
➕ **ایندکس 3:** (اختیاری) expression برای پردازش مقدار.<br>

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
   ["getText", "#el1", "my_p"],   # Save '#el1' element text to the 'my_p' variable
   ["setText", "#el2", "{my_p}"], # Assign 'my_p' variable value to '#el2' element text
   ["setText", "#el3", "{my_p}"], # Assign 'my_p' variable value to '#el3' element text as well

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
🔘 این کامندها HTML را به DOM اضافه می‌کنند.

🛡️ امنیت (DOMPurify): این سه کامند به طور خودکار از کتابخانه DOMPurify استفاده می‌کنند. تگ‌های خطرناک مانند script، iframe و اتریبیوت‌های مخرب مثل onerror به طور کامل حذف می‌شوند تا از حملات XSS جلوگیری شود.

### getHtml — الگوی یکپارچهٔ Getter

```python
["getHtml", "#selector"]
["getHtml", "#selector", "alias"]
["getHtml", "#selector", "alias", "expression"]
```

➕ **ایندکس 0:** نام کامند<br>
➕ **ایندکس 1:** سلکتور که می‌تواند هر سلکتور استاندارد CSS و JS و کلمهٔ `this` باشد.<br>
➕ **ایندکس 2:** می‌تواند HTML به‌صورت دستی نوشته شود، یا از المنت دیگری get شود، یا یک view که با Ajax از سرور برگشته است.<br>
➕ **ایندکس 3:** تأخیر در اجرای این کامند به میلی‌ثانیه. (پیش‌فرض 0)<br>

🔘 `getHtml` محتوای درون تگ سلکت‌شده را برمی‌گرداند.

🧾 **مثال:** این کامند برخلاف setText، محتوا را به‌صورت المنت به DOM اضافه می‌کند. در این مثال تگ p به DOM اضافه می‌شود:

```python
click=["setHtml", "#el1", "<p>this is paragraph</p>", 0]
```
### HTML Trust Commands (بدون فیلتر)
```python
["setHtmlTrust", "#selector", "html", "delay"] 
["appendHtmlTrust", "#selector", "html", "delay"] 
["prependHtmlTrust", "#selector", "html", "delay"]
```
⚠️ هشدار امنیتی جدی: این کامندها HTML را بدون هیچ فیلتر یا پاک‌سازی مستقیماً در DOM قرار می‌دهند. این کامندها فقط برای محتوایی استفاده شوند که از بک‌اند امن خودتان (مثل Nexelpy/Vapi) می‌آید و مطمئن هستید حاوی کد مخرب نیست. هرگز داده‌های کاربری را به این کامندها ندهید.

🧾 **مثال:**

```python
click = ["setHtml", "#el1", ["getHtml", "#el3"], 0]      # Sanitizes content via DOMPurify to prevent XSS
click = ["setHtmlTrust", "#el1", "{response}", 0]        # Injects raw HTML without sanitization (trusted source: own server)
```

🔘 در مورد `response` در بخش Ajax مفصل توضیح داده می‌شود.

💡💡💡 **نکتهٔ امنیتی:** کامندهای `setHtmlTrust` و `appendHtmlTrust` و `prependHtmlTrust` کدهای HTML را مستقیماً به DOM تزریق می‌کنند. همواره اطمینان حاصل کنید داده‌هایی که مستقیماً توسط کاربر نهایی در فرم‌ها نوشته می‌شوند را با `setText` مقداردهی کنید یا در صورت استفاده در ساختار HTML، مقادیر متنی آن‌ها در سمت سرور پاک‌سازی (Escape) شده باشند.

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

## 🔍 دسترسی مستقیم به عناصر (getElement)

کامند `getElement` به شما اجازه می‌دهد یک یا چند المان DOM را در یک متغیر ذخیره کنید. سپس می‌توانید با استفاده از نقطه (`.`) به تمام ویژگی‌ها (Properties) و ویژگی‌های داده‌ای (dataset) آن المان دسترسی داشته باشید. این کار نیاز به استفاده از کامندهای تکراری برای خواندن اطلاعات را از بین می‌برد.

### 📝 سینتکس
```javascript
["getElement", "selector", "alias"]
```
*   **selector**: سلکتور CSS برای پیدا کردن المان.
*   **alias**: نام متغیری که المان در آن ذخیره می‌شود.

### 💡 مثال کاربردی

```html
<div id="user-profile" class="active" data-role="admin" style="color: blue;">
  <span>Ali</span>
</div>

<button click='[
  ["getElement", "#user-profile", "USER"],
  ["setText", "#out-id", "{USER.id}"],
  ["setText", "#out-class", "{USER.className}"],
  ["setText", "#out-role", "{USER.dataset.role}"],
  ["setText", "#out-text", "{USER.innerText}"],
  ["setText", "#out-color", "{USER.style.color}"]
]'>
  خواندن اطلاعات المان
</button>
```

### 📌 پراپرتی‌های پرکاربرد
با استفاده از این کامند، می‌توانید به همه‌ی پراپرتی‌های استاندارد DOM دسترسی داشته باشید. چند نمونه پرکاربرد:
- **`innerText` و `innerHTML`**: خواندن متن یا HTML داخل المان.
- **`id` و `className`**: خواندن شناسه و کلاس‌ها.
- **`tagName`**: نام تگ (مثلاً `DIV`).
- **`dataset`**: دسترسی به همه‌ی اتریبیوت‌های `data-*` (مثلاً `dataset.userId`).
- **`style`**: دسترسی به استایل‌های inline (مثلاً `style.color`).
- **`children` و `parentElement`**: دسترسی به فرزندان و والد المان.

### 🎯 حالت‌های خاص
- **چند المان**: اگر سلکتور شما به چند المان اشاره کند (مثلاً یک کلاس)، یک آرایه برگردانده می‌شود. می‌توانید از `count()` یا `{MY_ARRAY.length}` استفاده کنید.
- **استفاده در `if`**: می‌توانید مقادیر المان را مستقیماً در شرط‌ها بررسی کنید:
```python
  ["getElement", "#my-btn", "BTN"],
  ["if", "{BTN.disabled}", ["log", "دکمه غیرفعال است"]]
```

---
## Utilities

```python
["wait", "ms"]
["then"]
["debounce", "ms"]
["log", "value"]
["redirect", "url"]
["reload"]
["scrollTo", "target", "parent_selector"]
["focus", "selector"]
["copyClipboard", "selector", "value"]
["pasteClipboard", "selector"] 
```
🔘 `wait`: <br>
بین دو دسته از کامندها تأخیر ایجاد می‌کند. کامندهای بعد از ,ویت هم‌زمان با کامندهای قبل اجرا نمی‌شوند، بلکه پس از مدت تعیین‌شده اجرا می‌شوند.<br>
درمثال زیر کامند های 1 و 2 همزمان اجرا میشه و بعد از 2 ثانیه کامند های 4 و 4 همزمان اجرا میشن
```python
click=[
   ["getValue", "#input2", "my_number"],#1
   ["setText", "#el1", "{my_number+1}"],#2
   ["wait", 2000],
   ["setText", "#el2", "{my_number*2}"],#3
   ["setText", "#el3", "my number is {my_number} ."],#4
]
```

🔘 `then`:<br>
 تضمین می‌کند کامند بعدی پس از اتمام کامند یا عملیات ای سینک قبلی اجرا شود. در مثال زیر ست تکست برای ال3 بعد از اتمام انیمیشن اجرا می‌شود؛ ست تکست برای ال4 هم‌زمان با شروع انیمیشن اجرا می‌شود. برای اجرای خطی همهٔ کامندها، پس از هر کامند از دن استفاده کنید.
در مثال زیر کامند 1 و 3 همزمان اجرا میشن اما کامند 2 منتظر اتمام کامند 1 میماند و بعد اجرا میشود.
```python
click=[
   ["animate", "this", {"color": "red", "margin": "8px"}, 0, 2000, "ease"],#1
   ["then"],
   ["setText", "#el3", "set new text after animate"],#2
   ["setText", "#el4", "set new text when click and run animate"],#3
]
```
در این مثال هر کامند بعد از اتمام کامند قبل از خودش ران میشه 
```python
click=[
   ["animate", "this", {"color": "red", "margin": "8px"}, 0, 2000, "ease"],#1
   ["then"],
   ["setText", "#el3", "set new text after animate", 2000],#2
   ["then"],
   ["setText", "#el4", "set new text when click and run animate"],#3
]
```

🔘 `debounce`:<br>
 فرض کنید یک اینپوت جست‌وجو با هر کی آپ به سرور درخواست می‌فرستد. برای کنترل تعداد درخواست‌ها نمی‌توان از ویت استفاده کرد، چون ویت فقط تأخیر می‌اندازد و تضمین می‌کند تمام ایونت‌های فراخوانی‌شده اجرا شوند. اما دیبانس تا زمان مشخص‌شده از اجرای ایونت جلوگیری می‌کند و پس از توقف ورودی، آخرین اجرا را انجام می‌دهد.

```python
keyup=[
   ["debounce", 1000],
   ["setText", "#el1", ["getValue", "#input1"]],
   ["setText", "#el2", ["getValue", "#input2"]],
]
```

🔘 `scrollTo`:<br>
اسکرول به یک المنت یا به یک موقعیت پیکسلی. اگر می‌خواهید درون یک کانتینر خاص (مثلاً یک div با overflow) اسکرول کنید، می‌توانید سلکتور والد را در ایندکس سوم پاس دهید. پیش‌فرض این پارامتر، `window` (کل صفحه) است.
```python
# اسکرول کل صفحه به المنت
click=["scrollTo", "#section-2"]

# اسکرول درون یک کانتینر خاص
click=["scrollTo", "#target-item", "#my-scrollable-div"]
```

---

## Cookie

```python
["setCookie", "key", "value", {"options"}]
["getCookie", "key"]
["getCookie", "key", "alias"]
["getCookie", "key", "alias", "expression"]
["removeCookie", "key"]
["removeCookie"] # حذف تمام کوکی‌ها
```
### آپشن‌های setCookie (مقادیر پیش‌فرض):
```python
{
  "max_age": 0,
  "expires": 0,
  "path": "/",
  "domain": "",
  "secure": True,
  "samesite": "lax",
  "partitioned": False
}
```
(نکته: HttpOnly فقط از سمت سرور قابل تنظیم است و در کلاینت نادیده گرفته می‌شود).

🛡️ امنیت: مقادیر path و domain در برابر تزریق کاراکترهای کنترلی محافظت می‌شوند.

🧾 **مثال:**

```python
click=["setCookie", "theme", "dark"]
click=["setText", "#el1", ["getCookie", "theme", "my_theme"], 0]
```

---

## Ajax

```python
["ajax", "url", "method", {"data": "value"}, {"custom": "headers"}]
```

💡 **نکته:** url می‌تواند آدرس سرور داخلی، خارجی یا یک فایل استاتیک باشد.

💡 ورودی `method` نوع ارسال و پردازش درخواست را مشخص می‌کند:

- `GET`: دریافت اطلاعات با Query Parameters.
- `POST`: ارسال داده‌های استاندارد فرم.
- `json`: داده‌ها را با هدر `application/json` بسته‌بندی و با متد POST به سرور ارسال می‌کند تا مستقیماً در بک‌اند در دسترس باشد.<br>
🧾 **مثال:** دریافت دیتا در بک اند

```python
#client side
click=["ajax", "/example", "json", {"id": "36","name": "nexelpy"}, {"custom": "headers"}]

#server side
id = await x.REQUEST.payload("json", "id")
   #or
id = await x.REQUEST.json("id")
```

🧾 **مثال:** درخواست به سرور برای فایل `my_file.txt`؛ محتوای فایل در el1 قرار می‌گیرد. متغیر `response` بدون نیاز به کامند get، در ایونتی که درخواست Ajax فرستاده شده در دسترس است.<br>
اگر در  ایونتی از کامند ایجکس استفاده کرده باشید ، تا پایان آن ایونت {response} برای استفاده در دسترس است .{response} یک متغییر رزرو شده در کوییک ایونت است که بدون کامند getResponse در دسترس است .
```python
click=[
   ["ajax", "/my_file.txt"],
   ["setText", "#el1", "{response}"],
]
```

🧾 **مثال:** درخواست به سرور یک JSON برمی‌گرداند و با dot notation مقدار کلید name در المنت قرار می‌گیرد:

```python
#server side
from nexelpy import RestApi,AutoRegister
@AutoRegister("/restapi")
async def rest():
    x = RestApi(__file__)
    x.RESPONSE_json(name="Quick Event")

#client side
click=[
   ["ajax", "/json-api", "GET"],
   ["setText", "#el1", "{response.name}"],
]
```

🧾 **مثال:** اگر از Vapi در nexelpy استفاده می‌کنید، خروجی یک JSON است که با کلید `view` المنت‌های ساخته‌شده سمت سرور را به DOM اضافه می‌کند.

```python
#server side
from nexelpy import AutoRegister, Vapi
@AutoRegister("/vapi","GET")
async def vapi():
    x = Vapi(__file__)
    x.p(id="message", text="hello Vapi")
    return x.RESPONSE()

#client side
click=[
   ["ajax", "/vapi", "GET"],
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
`ajaxSuccess`: اگر درخواست با موفقیت ارسال شد و پاسخ با موفقیت برگشت و ریسپانس مقداردهی شد، کامندهای درون آن اجرا می‌شوند.

`ajaxError`:<br>
اگر درخواست یا ارسال ناموفق بود، کامندهای درون آن اجرا می‌شوند. از طریق <br>
`response.status_code`<br>
به کد برگشتی از سرور و از طریق<br>
`response.status_message`<br>
این دو کلید ریسپانس در<br>
ajaxSuccess<br>
نیز در دسترس هستند.<br>

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
#server side
from nexelpy import AutoRegister, Vapi
@AutoRegister("/vapi")
async def vapi():
    x = Vapi(__file__)
    getid = await x.REQUEST.args("id")
    if DB.user.find(getid):
        x.p(id="message", text="hello Vapi")
    else:
        return x.RESPONSE(status_message= "user not found")

    return x.RESPONSE()

#client side
click=[
   ["addProps", "this", "disabled"],
   ["ajax", "/vapi", "GET", {"name": "nexelpy", "id": 927}],
   ["ajaxSuccess", [
       ["appendHtml", "#el1", "{response.view}"],
       ["log", "{response.status_code}"],
       ["removeProps", "this", "disabled"],
   ]],
   ["ajaxError", ["setText", "#el4", "error : {response.status_message}"]],
   # status_message assignment from server, so do not use default message. {response.status_message} returns "user not found"
]
```

💡 همانند دیگر بخش‌ها از لیست تو در تو برای چند کامند استفاده می‌کنیم. ajaxSuccess و ajaxError یک لیست (آرایه) در ورودی می‌گیرند.

💡 اگر از Vapi در nexelpy استفاده می‌کنید، ممکن است در view بک‌اند لینک‌های style و script را به تگ head اضافه کرده باشید. آن تگ‌ها در کلیدی به نام `QE_links_header` ایجاد می‌شوند. کوییک ایونت تضمین می‌کند لینک‌های غیر تکراری را بدون نوشتن کامند به تگ head صفحهٔ فعلی اضافه کند.



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

💡 متغیر `{index}` به‌صورت خودکار در هر بار اجرای حلقه در دسترس است.

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

حق کاملاً با توست. این بخشی که نوشتم واقعاً گیج‌کننده و غیراستاندارد بود و با لحن و ساختار بقیه‌ی مستندات هماهنگ نبود. 

دستورات `createFunc` و `callFunc` در واقعیت پیچیده نیستن، ولی من توی توضیحم بد نوشتمشون. این دو کامند برای این هستن که شما یک **"ماکرو"** یا **"تابع سفارشی"** از چند کامند بسازید و هر جا خواستید بدون تکرار کد، صداشون بزنید.

بذار دقیقاً طبق ساختار و لحن خودت (ایندکس‌ها، مثال‌ها و توضیحات واضح) بازنویسی‌اش کنم. این بخش رو جایگزین بخش «Func» در داکیومنت خودت کن:

---


## Func

### اجرای توابع جاوااسکریپت خارجی

```python
["runFunc", "path", "funcname", "arg1", "arg2"]
```

یک تابع با نام funcname را از فایل JS موجود در path، با آرگومان‌های پاس‌داده‌شده اجرا می‌کند.

```python
click=["runFunc", "/my_lib/myfuncs.js", "myalert", "alex", "43", "972"]
```
🛡️ امنیت (CSP): این دستور مطابق با سیاست‌های امنیت محتوا (CSP) مرورگر عمل کرده و از بارگذاری اسکریپت‌ها از دامنه‌های غیرمجاز جلوگیری می‌کند؛ مگر اینکه آدرس (URL) مورد نظر توسط هدر‌های CSP تأیید (Valid) شده باشد.

### ساخت و فراخوانی توابع سفارشی (Macro)

گاهی اوقات یک سری کامند دارید (مثلاً یک روتین برای باز کردن یک منو) که می‌خواهید در جاهای مختلف صفحه بدون تکرار کد از آن استفاده کنید. کوییک ایونت به شما اجازه می‌دهد یک "تابع سفارشی" بسازید و روی یک المنت (مثلاً یک div مخفی) ذخیره کنید و بعداً هر جا خواستید آن را فراخوانی کنید.

#### ۱. ساخت تابع (`createFunc`)
برای ساخت تابع، از کامند `createFunc` استفاده می‌کنیم. این کامند روی یک **نام اتریبیوت دلخواه** (مثلاً `my_func`) تنظیم می‌شود و ساختار آن به این شکل است:

```python
["createFunc", ["تعریف ورودی‌ها"], ["بدنه تابع"]]
```

➕ **ایندکس 0:** نام کامند (`createFunc`)
➕ **ایندکس 1:** لیستی از ورودی‌هایی (آرگومان‌هایی) که این تابع می‌گیرد. (اگر تابع ورودی ندارد، یک لیست خالی `[]` بدهید)
➕ **ایندکس 2:** لیستی از کامندهایی که با فراخوانی این تابع اجرا می‌شوند (بدنه تابع).

**تعریف ورودی‌ها (ایندکس 1) به دو شکل است:**
1. **بدون مقدار پیش‌فرض:** یک لیست از رشته‌ها. مثلاً `["color", "size"]`.
2. **با مقدار پیش‌فرض:** یک لیست از دیکشنری‌ها. مثلاً `[{"color": "red"}, {"size": "16px"}]`.

**🧾 مثال:** یک تابع بدون ورودی برای قرمز کردن متن.

```html
<!-- 1. تعریف تابع روی یک المنت (با نام اتریبیوت set_red) -->
<div id="my-macros" set_red='["createFunc", [], ["addStyle", "this", "color:red"]]'></div>

<!-- 2. فراخوانی تابع با یک دکمه -->
<button click='["callFunc", "set_red", "#my-macros"]'>Red it</button>
```
*(در این مثال، وقتی دکمه کلیک می‌شود، کامند `callFunc` تابع `set_red` را که روی المنت `#my-macros` ذخیره شده پیدا کرده و اجرا می‌کند).*

**🧾 مثال:** یک تابع با ورودی (داینامیک).
اگر بخواهیم رنگ رو موقع فراخوانی مشخص کنیم، باید ورودی بگذاریم. در بدنه تابع، از نام ورودی داخل آکولاد (`{color}`) استفاده می‌کنیم.

```html
<!-- 1. تعریف تابع با یک ورودی به نام color -->
<div id="my-macros" set_color='[
  "createFunc", 
  ["color"], 
  ["addStyle", "this", "color:{color}"]
]'></div>
```

#### ۲. فراخوانی تابع (`callFunc`)
برای اجرای تابعی که ساختید، از کامند `callFunc` استفاده می‌کنیم.

```python
["callFunc", "func_name", "selector", ["مقادیر ورودی"]]
```

➕ **ایندکس 0:** نام کامند (`callFunc`)<br>
➕ **ایندکس 1:** نام اتریبیوتی که تابع روی آن تعریف شده (مثلاً `set_color`)<br>
➕ **ایندکس 2:** سلکتور المنتی که تابع روی آن تعریف شده (مثلاً `#my-macros`)<br>
➕ **ایندکس 3:** (اختیاری) یک لیست از مقادیر برای ورودی‌های تابع، دقیقاً به همان ترتیبی که تعریف شدند.
اگر تابع فقط یک ورودی دارد، می‌توانید مقدار را مستقیماً بنویسید (مثلاً "blue").
اگر تابع چند ورودی دارد، باید مقادیر را در قالب یک لیست و به ترتیب پاس دهید (مثلاً ["blue", "16px"]).
**🧾 مثال:**
```html
<!-- فراخوانی تابعی که ورودی می‌گیرد -->
<button click='["callFunc", "set_color", "#my-macros", "blue"]'>Blue it</button>
<button click='["callFunc", "set_color", "#my-macros", "green"]'>Green it</button>
```

💡 **نکته:** از این قابلیت برای ماژولار کردن کدهای تکراری استفاده کنید. 

---

## Dialog

کامند showDialog تگ dialog و محتوای درون آن را که به‌صورت پیش‌فرض مخفی است نمایش می‌دهد. از آن برای ساخت popover، منو، دیالوگ، popup، tooltip و منوی همبرگری استفاده می‌شود.

```python
["showDialog", ["dialog"], ["anchor"], "delay", "duration"]
```

➕ **ایندکس 0:** نام کامند<br>
➕ **ایندکس 1:** سلکتور تگ dialog، به‌همراه تنظیمات آن در قالب لیست<br>
➕ **ایندکس 2:** سلکتور المنتی که dialog در موقعیت آن نمایش داده می‌شود، به‌همراه تنظیماتش<br>
➕ **ایندکس 3:** تأخیر در اجرای کامند<br>
➕ **ایندکس 4:** زمان ترانزیشن fade

ساختار لیست dialog:

```python
["#dialog", "position", "offsetX", "offsetY", "auto hide"]
```

➕ **ایندکس 0:** سلکتور dialog<br>
➕ **ایندکس 1:** موقعیتی از dialog که به anchor می‌چسبد؛ مانند `start-top` (`start` برای تعیین x و `top` برای y)<br>
➕ **ایندکس 2:** فاصلهٔ dialog از anchor در محور x<br>
➕ **ایندکس 3:** فاصلهٔ dialog از anchor در محور y<br>
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

➕ **ایندکس 0:** سلکتور anchor (المنتی که dialog به آن می‌چسبد)<br>
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
💡شو دیالوگ پیش از نمایش، استایل پیش‌فرض تگ دیالوگ را پاک می‌کند و یک کانتینر بدون پس‌زمینه و استایل اضافی در اختیار شما می‌گذارد.

```python
["hideDialog", "#dialog-tag", 0, 500]
```
علاوه بر انتخاب المنت واقعی، می‌توانید از مقدار‌های ویژهٔ viewport و body برای موقعیت‌دهی استفاده کنید.


سلکتور  viewport: موقعیت dialog نسبت به ناحیهٔ قابل‌مشاهدهٔ پنجرهٔ مرورگر محاسبه می‌شود. برای نمونه، center-center آن را در مرکز صفحهٔ قابل‌مشاهده نمایش می‌دهد؛ موقعیت با اسکرول صفحه تغییر نمی‌کند.<br>
سلکتور body: موقعیت dialog نسبت به کل محتوای صفحه محاسبه می‌شود؛ در صفحهٔ اسکرول‌پذیر، جایگاه آن با محتوای صفحه ارتباط دارد.


```python
["viewport", "center-center"]
["body", "center-center"]
click=["showDialog", ["#dialog-tag", "center-center", 0, 0, False], ["viewport", "center-center"], 0, 300]
```

💡سلکتور  viewport مقدار ویژه است و به‌جای سلکتور یک المنت واقعی استفاده می‌شود؛ viewport به ناحیهٔ قابل‌مشاهدهٔ مرورگر اشاره دارد و body به محتوای صفحه.

⚠️ کامند dialog جایگزین modal نیست: backdrop و focus ندارد و صفحه را مسدود نمی‌کند.

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

💡کامند showModal پیش از نمایش، استایل پیش‌فرض تگ dialog را پاک می‌کند و یک کانتینر بدون پس‌زمینه و استایل اضافی در اختیار شما می‌گذارد.

🧾 **مثال nexelpy:**

```python
x.button("show modal", click=["showModal", "#modal", {}, True, 0, 500])
with x.dialog(id="modal"):
   with x.div(Class="bg-light w-50 h-50"):
      x.h2("this is modal", Class="text-dark")
      x.input(type="text", placeholder="First Name", autofocus=True)
```

💡 وقتی `auto hide = True` باشد، کلیک روی backdrop یا فشردن Escape، modal را به‌صورت خودکار می‌بندد. وقتی `auto hide = False` باشد، رویداد cancel بومی dialog مسدود می‌شود؛ Escape آن را نمی‌بندد و برای بستن باید صریحاً کامند hideModal را اجرا کنید، مثلاً از طریق دکمهٔ Close.

💡کامند showModal تگ dialog را مستقیماً وارد Top Layer مرورگر می‌کند؛ یعنی بالاتر از تمامی عناصر صفحه، حتی المنتی با z-index: ۹۹۹۹۹۹، رندر می‌شود و با overflow: hidden والدین بریده نمی‌شود.

---

## Collapse

دستور collapse در کوییک ایونت برای ساخت ویجت‌های بازوبسته‌شو (Collapsible) به کار می‌رود؛ الگویی که در وب با نام Disclosure Widget شناخته می‌شود. این کامند روی جفت تگ‌های بومی HTML یعنی details و summary سوار می‌شود.

 کوییک ایونت رفتار پیش‌فرض مرورگر را بلاک می‌کند و باز و بسته شدن را با انیمیشن نرم (بدون پرش و با محاسبه دقیق ارتفاع) انجام می‌دهد.




 ## کامندهای کنترل کولپس
 برای انعطاف‌پذیری بیشتر، سه کامند برای کنترل کولپس وجود دارد:

 ```python
 ["collapse", delay, duration]      # باز/بسته کردن (Toggle)
["showCollapse", selector, delay, duration] # همیشه باز کند
["hideCollapse", selector, delay, duration] # همیشه ببندد
["toggleCollapse", selector, delay, duration] # از بیرون باز/بسته کند
```
کولپس: روی تگ summary قرار می‌گیرد و با کلیک کاربر، آن را باز یا بسته می‌کند.

showCollapse / hideCollapse / toggleCollapse: <br>
این کامندها یک سلکتور می‌گیرند و می‌توانند کولپس را از بیرون (مثلاً با یک دکمه) کنترل کنند.

```python
with x.details(id="my-details"):
   x.summary("Title")
   x.p("Hidden content")

x.button("Open", click=["showCollapse", "#my-details", 0, 300])
x.button("Close", click=["hideCollapse", "#my-details", 0, 300])
x.button("Toggle", click=["toggleCollapse", "#my-details", 0, 300])
```
💡 نکته : در طول اجرای انیمیشن (به اندازه‌ی دیوریشن)، کولپس قفل می‌شود و کلیک‌های جدید نادیده گرفته می‌شوند تا از بهم ریختگی و پرش جلوگیری شود.
## مارکرهای آماده (Markers CSS)
برای اینکه کاربران بدون نوشتن حتی یک خط CSS، مارکرهای زیبا و حرفه‌ای داشته باشند، یک فایل CSS جداگانه به نام quickevent-markers.css ارائه شده است. این فایل باید در تگ head صفحه لود شود.
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@cdn/quickevent-markers.css">
```
پس از لود این فایل، می‌توانید با اضافه کردن کلاس‌ها به تگ summary، ظاهر مارکر را تغییر دهید:
اگه از نکسل پای استفاده میکنید نیازی به اضافه کردن فایل استایل ندارید اینکار اتوماتیک انجام میشود

### مارکرهای تک‌رنگ (مینیمال)
این مارکرها با رنگ متن هماهنگ می‌شوند و برای طراحی‌های مدرن مناسب‌اند:

marker-plus: علامت + / -

marker-chevron: فلش › / ˅

marker-caret: مثلث ▾ / ▴

marker-arrow: فلش ← / ↓

marker-circle: دایره ○ / ●

marker-triangle: مثلث ▽ / △

marker-square: مربع □ / ■

marker-diamond: لوزی ◇ / ◆

marker-star: ستاره ☆ / ★

marker-heart: قلب ♡ / ♥

marker-check: علامت + / ×

### مارکرهای ایموجی (با فیلتر Grayscale)
برای استفاده از ایموجی‌های رنگی بدون اینکه ظاهر صفحه را شلوغ کنند، از این مارکرها استفاده کنید. زمانی که کولپس بسته است، ایموجی خاکستری و محو است و زمانی که باز می‌شود، رنگی می‌شود:

marker-lock: قفل 🔒 / قفل باز 🔓

marker-folder: پوشه بسته 📁 / پوشه باز 📂

marker-doc: سند 📄 / ویرایش 📝

marker-theme: ماه ☾ / خورشید ☀

### موقعیت مارکر (Positions)

به طور پیش‌فرض، مارکر در سمت شروع (چپ) قرار می‌گیرد. برای انتقال آن به پایان (راست)، کلاس marker-end را اضافه کنید:

marker-start (پیش‌فرض)

marker-end

## Accordion
برای اتصال چند کولپس به یکدیگر و ایجاد رفتار آکاردئون (با باز شدن یک بخش، بقیه بخش‌های هم‌نام بسته شوند)، از اتریبیوت accordion روی تگ‌های summary استفاده کنید. وقتی مقدار این اتریبیوت در چند کولپس یکسان باشد، QuickEvent آن‌ها را هم‌گروه در نظر می‌گیرد.

```python
with x.details():
   x.summary("question1", accordion="FAQ", click=["collapse", 0, 400], Class="marker-caret")
   x.p("answer1")
with x.details():
   x.summary("question2", accordion="FAQ", click=["collapse", 0, 400], Class="marker-caret")
   x.p("answer2")
with x.details():
   x.summary("question3", accordion="FAQ", click=["collapse", 0, 400], Class="marker-caret")
   x.p("answer3")
```
💡 برای ساخت چند گروه مستقل، برای هر گروه یک مقدار متفاوت (مثلاً accordion="FAQ1" و accordion="FAQ2") در نظر بگیرید.

---
## submit event
ایونت سابمیت روی تگ فورم باید نوشته بشه تا رفتار پیشفرض که ارسال فورم به روش سنتی هست کنسل کنه و ایونت مورد نظر شما رو اجرا کنه .💡
به عنوان مثال بجای ارسال فورم ، شو دیالوگ ران بشه و تایید بگیره .



## 🪟 دسترسی به Window (بدون کامند گت)

در QuickEvent نیازی به استفاده از کامند اضافی برای خواندن اطلاعات مرورگر نیست. با استفاده از سینتکس `{window.property}` می‌توانید مستقیماً به تمام ویژگی‌ها و توابع استاندارد شیء `window` در جاوااسکریپت دسترسی داشته باشید.

> **نکته:** مقادیر ویندو همیشه در لحظه‌ای که کامند اجرا می‌شود خوانده می‌شوند. بنابراین اگر کاربر اسکرول کند یا سایز صفحه را تغییر دهد، مقدار جدید در کلیک بعدی خوانده می‌شود.

### 📍 آدرس و مسیریابی (Location)
یکی از پرکاربردترین بخش‌ها، دسترسی به آدرس صفحه و اجزای آن است.
```python
# آدرس کامل صفحه
"{window.location.href}"

# نام دامنه
"{window.location.hostname}"

# مسیر صفحه (بدون دامنه)
"{window.location.pathname}"

# کوئری استرینگ (بعد از علامت سوال)
"{window.location.search}"

# هش (بعد از علامت #)
"{window.location.hash}"

# پروتکل (http یا https)
"{window.location.protocol}"
```

### 📏 ابعاد و اندازه‌ها (Dimensions)
برای طراحی‌های واکنش‌گرا (Responsive) و محاسبه‌ی سایز صفحه:
```python
# عرض و ارتفاع ناحیه قابل مشاهده (Viewport) - شامل اسکرول‌بار
"{window.innerWidth}"
"{window.innerHeight}"

# عرض و ارتفاع کل پنجره مرورگر
"{window.outerWidth}"
"{window.outerHeight}"

# نسبت پیکسل فیزیکی دستگاه (مثلاً 1.5 برای رتینا)
"{window.devicePixelRatio}"
```

### 🖥️ مشخصات صفحه‌نمایش (Screen)
اطلاعات مربوط به مانیتور کاربر:
```python
# عرض و ارتفاع کل صفحه‌نمایش
"{window.screen.width}"
"{window.screen.height}"

# عرض و ارتفاع قابل استفاده (بدون نوار وظیفه ویندوز)
"{window.screen.availWidth}"
"{window.screen.availHeight}"
```

### 📜 موقعیت اسکرول (Scroll)
برای پیاده‌سازی افکت‌های پارالاکس یا استیکر (Sticky):
```python
# میزان اسکرول از محور افقی
"{window.scrollX}"

# میزان اسکرول از محور عمودی
"{window.scrollY}"

# مترادف‌های قدیمی‌تر
"{window.pageXOffset}"
"{window.pageYOffset}"
```

### 🌐 اطلاعات مرورگر و سیستم‌عامل (Navigator)
تشخیص نوع مرورگر، زبان و وضعیت اتصال:
```python
# رشته شناسایی مرورگر (User Agent)
"{window.navigator.userAgent}"

# زبان پیش‌فرض مرورگر
"{window.navigator.language}"

# سیستم‌عامل
"{window.navigator.platform}"

# آیا کوکی‌ها فعال هستند؟
"{window.navigator.cookieEnabled}"

# آیا کاربر آنلاین است؟
"{window.navigator.onLine}"
```

### 📄 اطلاعات سند (Document)
دسترسی به اطلاعات کلی صفحه:
```python
# عنوان صفحه (تیتر تب مرورگر)
"{window.document.title}"

# آدرس کامل صفحه (مترادف با href)
"{window.document.URL}"

# آدرس صفحه‌ای که کاربر از آن آمده است
"{window.document.referrer}"

# ابعاد واقعی محتوای صفحه (بدون اسکرول‌بار)
"{window.document.documentElement.clientWidth}"
"{window.document.documentElement.clientHeight}"
```

### 📚 تاریخچه (History)
```python
# تعداد صفحاتی که کاربر در این تب باز کرده است
"{window.history.length}"
```

---

### 💡 مثال‌های کاربردی

**۱. نمایش وضعیت اسکرول کاربر:**
```html
<button click='["setText", "#status", "شما {window.scrollY} پیکسل اسکرول کرده‌اید"]'>
  موقعیت من کجاست؟
</button>
```

**۲. تشخیص موبایل یا دسکتاپ (بر اساس عرض):**
```html
<button click='[
  ["if", "{window.innerWidth < 768}", [
    ["setText", "#device", "شما از موبایل استفاده می‌کنید"]
  ], [
    ["setText", "#device", "شما از دسکتاپ استفاده می‌کنید"]
  ]]
]'>
  تشخیص دستگاه
</button>
```



**۴. هشدار قبل از ترک صفحه (ترکیب با `beforeunload`):**
```html
<body loadDom='[
  ["addAttr", "window", "onbeforeunload", "return confirm(\"آیا مطمئن هستید؟\")"]
]'>
```


## 🎯 اسکوپینگ هوشمند (Scoping Selector)

در پروژه‌های بزرگ، نوشتن سلکتورهای طولانی و تکراری (مثل `#sidebar .user-list .item`) خسته‌کننده و مستعد خطاست. QuickEvent با معرفی `{scopingSelector}` این مشکل را کاملاً حل کرده است.

این ویژگی به شما اجازه می‌دهد یک کانتینر (والد) را با اتریبیوت `data-scoping` علامت‌گذاری کنید. سپس با استفاده از `{scopingSelector}` در هر جای داخل آن کانتینر، به صورت خودکار به آن والد اشاره کنید.

### 📝 سینتکس و نحوه استفاده

۱. والد (Container) را تعریف کنید:
```html
<div data-scoping="user-section">
  <p class="name">Ali</p>
  <button click='["setText", "{scopingSelector} .name", "Reza"]'>
    Change Name
  </button>
</div>
```

۲. در دکمه‌ی بالا، وقتی کلیک شود، عبارت `{scopingSelector}` توسط QuickEvent به `[data-scoping="user-section"]` تبدیل می‌شود. 
در نتیجه، سلکتور نهایی برای کامند `setText` به این شکل خواهد بود:
```css
[data-scoping="user-section"] .name
```

### ✨ چرا این ویژگی عالی است؟

۱. **عدم تداخل (No Conflict):** اگر چند باکس با کلاس یکسان (مثلاً `.name`) در صفحه داشته باشید، QuickEvent فقط المان داخل باکس خودش را تغییر می‌دهد و بقیه دست‌نخورده می‌مانند.
۲. **کدهای کوتاه‌تر:** نیازی به نوشتن سلکتورهای تو در توی پیچیده نیست.
۳. **قابلیت استفاده مجدد (Reusable Components):** می‌توانید یک کامپوننت HTML را بنویسید و ۱۰ بار در صفحه تکرار کنید. دکمه‌های داخل هر کامپوننت، فقط روی محتوای خودشان اثر می‌گذارند.

### 🔄 اسکوپینگ تو در تو (Nested Scoping)
اگر داخل یک `data-scoping`، یک `data-scoping` دیگر وجود داشته باشد، `{scopingSelector}` همیشه **نزدیک‌ترین والد** را پیدا می‌کند.

```html
<div data-scoping="outer">
  <button click='["log", "I am in outer"]'>Outer Button</button>
  
  <div data-scoping="inner">
    <button click='["setText", "{scopingSelector} .msg", "Hello from Inner!"]'>
      Inner Button
    </button>
  </div>
</div>
```
در کد بالا، دکمه‌ی Inner به `[data-scoping="inner"]` اشاره می‌کند، نه `outer`.

### 🛠️ استفاده در کامندهای مختلف
این ویژگی یک متغیر ارزیابی‌شده (مثل `{window.innerWidth}`) است، بنابراین در **تمام کامندها** (چه Effect، چه Source و چه Flow) کار می‌کند:

**در `if`:**
```html
<button click='[
  ["if", "{ window.innerWidth > 768 }", [
    ["setText", "{scopingSelector} .layout", "Desktop Mode"]
  ]]
]'>Check Layout</button>
```

**در `getText` (خواندن مقدار):**
```html
<button click='[
  ["getText", "{scopingSelector} .username", "name"],
  ["log", "User: {name}"]
]'>Read Username</button>
```

### ⚠️ اگر اسکوپ پیدا نشود چه می‌شود؟
اگر از `{scopingSelector}` در المانی استفاده کنید که هیچ والدی با اتریبیوت `data-scoping` ندارد، این متغیر مقدار `null` (یا رشته خالی) برمی‌گرداند. 
برای جلوگیری از خطاهای ناخواسته، QuickEvent یک هشدار (Warning) در کنسول مرورگر ثبت می‌کند تا توسعه‌دهنده متوجه شود که اسکوپ را فراموش کرده است.
```

### 📌 نکته :`{scopingSelector}` در پس‌زمینه از `element. closest ('[data-scoping]') ` استفاده می‌کند. این یعنی حتی اگر دکمه در عمق ۱۰ سطحی داخل باکس باشد، به درستی والد اصلی را پیدا می‌کند.
