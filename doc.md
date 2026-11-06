
***

# 📘 مستندات کامل QuickEvent

## مقدمه

**کوییک ایونت (QuickEvent)** یک فریم‌ورک مدرن جاوااسکریپت است که برای کار با DOM، ایونت‌ها و تغییرات روی المنت‌ها توسط **Nexelpy** و برای استفاده در پایتون نوشته شده است. هرچند این فریم‌ورک اتریبیوت‌محور است و به زبان خاصی وابسته نیست، اما استفاده از آن با پایتون در Nexelpy بسیار ساده‌تر و یکپارچه‌تر است.

---

## سینتکس

کوییک ایونت توابع زیادی برای کار با DOM ایجاد کرده است. همان‌طور که در زبان‌های برنامه‌نویسی برای استفاده از یک تابع، نام آن را می‌نویسیم و در پرانتزهای بعد آن ورودی‌ها را پاس می‌دهیم:

```python
setText(selector, text)
```

در کوییک ایونت هم همین رویکرد را برای صدا کردن تابع داریم که به آن‌ها **command** می‌گوییم و برای صدا کردنشان از این روش (لیست/آرایه) استفاده می‌کنیم:

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

## Quick Start

#### HTML
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@cdn/quickevent.min.js"></script>
```

#### Nexelpy (Python)
```python
x.script(parent=x.HEAD_tag, src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@cdn/quickevent.min.js", type="module", props="defer")
```

---

## ایونت‌ها

کوییک ایونت از ایونت‌های زیر پشتیبانی می‌کند. برای فعال کردن هر کدام، کافیست یک اتریبیوت با همان نام روی المنت خود قرار دهید.

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

**مثال HTML:**
```html
<button click='["setText", "#my-paragraph", "this is new text"]'>click me</button>
```

**مثال Nexelpy:**
```python
x.button("click me", click=["setText", "#my-paragraph", "this is new text"])
```

💡 **نکته:** برای اجرای چند کامند در یک ایونت از لیست تو در تو استفاده می‌کنیم:
```python
x.button("click me", click=[
   ["setText", "#my-paragraph", "this is new content"],
   ["setText", "#my-title", "this is new title"],
])
```

💡 **نکته زمان‌بندی:** همهٔ کامندهای درون یک ایونت به‌صورت async زمان‌بندی می‌شوند و لزوماً منتظر اتمام یکدیگر نمی‌مانند؛ برای اجرای ترتیبی از `wait`، `then` یا پارامتر `delay` استفاده کنید.

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

➕ **ایندکس 0:** نام کامند
➕ **ایندکس 1:** سلکتور (CSS، JS یا کلمه `this`). اگر چند المنت را سلکت کند، روی همه اعمال می‌شود.
➕ **ایندکس 2:** متن جدید (می‌تواند متن خام یا خروجی کامندهای get باشد).
➕ **ایندکس 3:** تأخیر در اجرا (میلی‌ثانیه). پیش‌فرض 0 است.

🔘 `setText`: جایگزینی محتوا.
🔘 `appendText`: افزودن به انتهای محتوا.
🔘 `prependText`: افزودن به ابتدای محتوا.

💡 **نکته:** کامند `setText` متن ورودی را در قالب رشته درج می‌کند؛ یعنی حتی اگر یک تگ HTML بدهید، خود تگ به عنوان متن نمایش داده می‌شود.
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
➕ **ایندکس 2 (alias):** مقدار را در متغیری با این نام ذخیره می‌کند (تا پایان ایونت در دسترس است).
➕ **ایندکس 3 (expression):** پردازش روی مقدار برگشتی.

🧾 **مثال:** جایگذاری مستقیم:
```python
click=["setText", "#el2", ["getText", "#el3"]]
```

🧾 **مثال:** استفاده از alias و دسترسی در کامندهای بعدی:
```python
click=[
   ["getText", "#el1", "my_p"],
   ["setText", "#el2", "text of element 2 is {my_p}"],
   ["setText", "#el3", "{my_p} is my new content"],
]
```

🧾 **مثال:** استفاده از expression (با متدهای رشته‌ای):
```python
click=[
   ["getText", "#content-div", "my_p"],
   ["setText", "#my-paragraph", "content-div text is { upperCase(my_p) }"],
   ["setText", "#my-span", "{ replace(my_p,old text,NEW TEXT) } is my new content"],
]
```
*متدهای مجاز:* `replace` · `upperCase` · `lowerCase` · `trim` · `slice` · `length` · `startsWith` · `endsWith` · `indexOf` · `split`

---

## Html Commands

```python
["setHtml", "#selector", "html", "delay"]
["appendHtml", "#selector", "html", "delay"]
["prependHtml", "#selector", "html", "delay"]
```
🔘 این کامندها HTML را به DOM اضافه می‌کنند.

🛡️ **امنیت (DOMPurify):** این سه کامند به طور خودکار از کتابخانه `DOMPurify` استفاده می‌کنند. تگ‌های خطرناک مانند `<script>`، `<iframe>` و اتریبیوت‌های مخرب مثل `onerror` به طور کامل حذف می‌شوند تا از حملات XSS جلوگیری شود.

### getHtml
```python
["getHtml", "#selector"]
["getHtml", "#selector", "alias"]
["getHtml", "#selector", "alias", "expression"]
```
🔘 `getHtml` محتوای درون تگ سلکت‌شده را برمی‌گرداند.

### HTML Trust Commands (بدون فیلتر)
```python
["setHtmlTrust", "#selector", "html", "delay"]
["appendHtmlTrust", "#selector", "html", "delay"]
["prependHtmlTrust", "#selector", "html", "delay"]
```
⚠️ **هشدار امنیتی جدی:** این کامندها HTML را **بدون هیچ فیلتر یا پاک‌سازی** مستقیماً در DOM قرار می‌دهند. این کامندها فقط برای محتوایی استفاده شوند که از **بک‌اند امن خودتان** (مثل Nexelpy/Vapi) می‌آید و مطمئن هستید حاوی کد مخرب نیست. هرگز داده‌های کاربری را به این کامندها ندهید.

---

## Value Commands

```python
["setValue", "#selector", "value", "delay"]
```
💡 **نکته:** این کامند پراپرتی `value` یک المنت (مثل input) را تغییر می‌دهد، نه اتریبیوت آن را.

### getValue — الگوی یکپارچهٔ Getter
```python
["getValue", "#selector"]
["getValue", "#selector", "alias"]
["getValue", "#selector", "alias", "expression"]
```
🧾 **مثال:**
```python
click=[
   ["getValue", "#input2", "my_number"],
   ["setText", "#el1", "{my_number+1}"],
   ["setText", "#el2", "{my_number*2}"],
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
💡 **نکته:** این کامندها مقادیر **inline style** را تغییر می‌دهند.
🧾 **مثال:** `click=["addStyle", "#el1", "color:red;margin:8px;", 0]`

---

## Animate Command

```python
["animate", "selector", {"css property": "value"}, "delay", "duration", "ease"]
```
از Web API Animation و متد animate جاوااسکریپت، CSS فعلی المنت را به CSS مدنظر انیمیت می‌کند.
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
در کوییک ایونت از اتریبیوت‌ها به دو صورت استفاده می‌کنیم: یا برای تغییر اتریبیوت‌های رسمی HTML (مثل href)، یا به عنوان متغیر برای نگهداری مقادیر (مثل counter).
💡 **نکته:** در `addAttr` اگر اتریبیوت وجود داشته باشد مقدارش را set می‌کند و اگر نه آن را می‌سازد.

🛡️ **امنیت (AttrGuard):** کامند `addAttr` از یک نگهبان استفاده می‌کند که از افزودن اتریبیوت‌های خطرناک (مثل `onclick`، `onerror` یا `href="javascript:..."`) جلوگیری می‌کند.

🧾 **مثال:**
```python
click=[
   ["addAttr", "#el1", "counter", 1],
   ["addAttr", "#el3", ["getAttr", "#el1", "my_count", "{my_count+1}"]],
]
```

🧾 **مثال (عملیات ریاضی روی اتریبیوت):**
```python
click=["setText", "#el4", ["getAttr", "#el1", "my_count", "{my_count+=1}"]]
```
*(در اینجا مقدار counter یک واحد افزایش می‌یابد و سپس در el4 قرار می‌گیرد).*

---

## Props Commands

```python
["addProps", "#selector", "Props", "delay"]
["removeProps", "#selector", "Props", "delay"]
["toggleProps", "#selector", "Props", "delay"]
```
پراپ‌ها اتریبیوت‌های بدون value مثل `hidden`، `checked`، `readonly` هستند.
💡 **نکته:** می‌توانید چند پراپرتی را با فاصله بدهید. کوییک ایونت همه را همزمان اعمال می‌کند.
```python
click=["addProps", "#terms-checkbox", "checked disabled"]
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
["scrollTo", "target"]
["focus", "selector"]
["copyClipboard", "selector", "value"]
["pasteClipboard", "selector"]
["getLocation", "href"]
["getLocation", "pathname"]
["getLocation", "search"]
["getLocation", "hash"]
```

🔘 `wait`: بین دو دسته از کامندها تأخیر ایجاد می‌کند.
🔘 `then`: تضمین می‌کند کامند بعدی پس از اتمام عملیات async قبلی اجرا شود.
🔘 `debounce`: تا زمان مشخص‌شده از اجرای ایونت جلوگیری می‌کند (برای جلوگیری از درخواست‌های تکراری در جستجو).
🛡️ **امنیت:** کامند `redirect` در برابر اسکیم‌های خطرناک مثل `javascript:` و `data:` محافظت شده است.

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

**آپشن‌های `setCookie` (مقادیر پیش‌فرض):**
```json
{
  "max_age": 0,
  "expires": 0,
  "path": "/",
  "domain": "",
  "secure": false,
  "samesite": "lax",
  "partitioned": false
}
```
*(نکته: `HttpOnly` فقط از سمت سرور قابل تنظیم است و در کلاینت نادیده گرفته می‌شود).*

🛡️ **امنیت:** مقادیر `path` و `domain` در برابر تزریق کاراکترهای کنترلی محافظت می‌شوند.

---

## Ajax

```python
["ajax", "url", "method", {"data": "value"}, {"custom": "headers"}]
```
- `url`: آدرس سرور داخلی، خارجی یا فایل استاتیک.
- `method`: `GET` (کوئری پارامز)، `POST` (فرم استاندارد)، `json` (ارسال با هدر application/json).
- **آرگومان چهارم (اختیاری):** هدرهای سفارشی، مثلاً برای ارسال `X-CSRF-Token`.

🛡️ **امنیت (CSP):** برای جلوگیری از حملات SSRF و XSS، بارگذاری اسکریپت‌ها و لینک‌های خارجی توسط هدر `Content-Security-Policy` مرورگر کنترل می‌شود. همچنین `runFunc` نیز از این سیاست پیروی می‌کند.

🧾 **مثال (درخواست JSON):**
```python
click=[
   ["ajax", "/json-api", "GET"],
   ["setText", "#el1", "{response.name}"],
]
```

### مدیریت موفقیت و خطا
```python
["ajaxSuccess", ["commands"]]
["ajaxError", ["commands"]]
["ajaxError", ["commands"], {"404": "Item not found"}]
```
- `ajaxSuccess`: اگر درخواست موفق باشد اجرا می‌شود.
- `ajaxError`: اگر ناموفق باشد اجرا می‌شود. از طریق `{response.status_code}` و `{response.status_message}` به کد و پیام خطا دسترسی دارید.
- **آرگومان سوم (اختیاری):** یک دیکشنری/آبجکت برای جایگزینی پیام‌های پیش‌فرض خطا. مثلاً اگر کد 404 برگشت، پیام "Item not found" نمایش داده می‌شود.

**جدول پیام‌های پیش‌فرض خطا:**
| کد | پیام پیش‌فرض |
|---:|---|
| 0 | Connection failed. Check your internet. |
| 400 | Invalid request. Please check your inputs. |
| 401 | Session expired. Please log in again. |
| 403 | Access denied. |
| 404 | Resource not found. |
| 405 | Method not allowed. |
| 408 | Request timed out. Try again. |
| 500 | Internal server error. |
| 502 | Bad gateway. Try again shortly. |
| 503 | Service unavailable. Under maintenance. |

### تزریق خودکار هدرها (QE_links_header)
اگر پاسخ JSON سرور شامل کلیدی به نام `QE_links_header` باشد، QuickEvent به طور خودکار تگ‌های `link`، `script` و `meta` موجود در آن را (در صورت تکراری نبودن و امن بودن دامنه) به تگ `<head>` صفحه اضافه می‌کند.

---

## If / Else

```python
["if", ["Conditions"], ["commands"]]
["elif", ["Conditions"], ["commands"]]
["else", ["commands"]]
```

🧾 **مثال:**
```python
click=[
   ["getAttr", "#el1", "score"],
   ["if", ["{score > 100}"], ["log", "User wins!!!"]],
   ["elif", ["{score < 20}"], ["log", "User lost!"]],
   ["else", ["log", "The game continues!"]],
]
```
💡 برای بیش از یک شرط (AND/OR) یا چند کامند در بدنه، از لیست تو در تو استفاده کنید.

---

## For

```python
["for", "var name", "Iterators", ["commands"]]
["for", ["key", "value"], "dict/json", ["commands"]]
```

🧾 **مثال:**
```python
click=[
   ["ajax", "/quickevent"],
   ["for", ["k", "v"], "{response.users}", ["appendText", "#el1", "{k}:{v} _ "]],
]
```
**نتیجهٔ نمونه:** `name:alex _ id:78 _ age:43 _ access:admin`

🛡️ **امنیت:** نام متغیرها در برابر تزریق (مانند `__proto__`) محافظت می‌شوند.

---

## Tick

```python
["setTick", "selector", "time", "mode"]
["playTick", "selector"]
["playTick", "selector", "time", "mode"]
["pauseTick", "selector"]
["resetTick", "selector", False]
```
`setTick` فقط تنظیم می‌کند. `playTick` اجرا می‌کند. `pauseTick` متوقف می‌کند. `resetTick` صفر می‌کند (مقدار `True` بعد از ریست، بلافاصله اجرا می‌کند).
- `mode`: `"++"` (شمردن به جلو) یا `"--"` (شمردن به عقب).

💡 **نحوه استفاده:** کامندهای tick باید روی همان المنتی نوشته شوند که می‌خواهید تایمر برای آن کار کند.
🧾 **مثال:**
```python
x.button("play tick", click=["playTick", "#my-div", "1:28:32", "--"])
x.div(id="my-div", tick=["setText", "this", "{tick}"])
```

**مقادیر قابل استفاده در ایونت tick:**
- `{tick}` (کل زمان به صورت رشته)
- `{tick.h}` (ساعت)
- `{tick.m}` (دقیقه)
- `{tick.s}` (ثانیه)
- `{tick.total}` (کل ثانیه‌های باقیمانده)

🧾 **مثال (قرمز شدن متن در 30 ثانیه آخر):**
```python
tick=[
   ["setText", "this", "{tick}"],
   ["if", ["{tick.total < 30}"], ["addStyle", "this", "color:red;"]],
]
```

---

## Func

### runFunc
```python
["runFunc", "path", "funcname", "arg1", "arg2"]
```
یک تابع جاوااسکریپت را از فایل موجود در `path` با آرگومان‌های داده شده اجرا می‌کند.
🛡️ **امنیت (CSP):** این کامند به سیاست‌های امنیتی مرورگر (CSP) پایبند است و از بارگذاری فایل‌های JS از دامنه‌های ناشناس جلوگیری می‌کند.

### createFunc / callFunc
ساخت و فراخوانی توابع سفارشی درون خود HTML.

🧾 **مثال:**
```python
x.div(id="my-div", set_spans=[
   ["createFunc", ["span_selector", {"text": "this is text"}],
      ["setText", "{span_selector}", "{text}"]
   ]
])
x.button("use function", click=["callFunc", "set_spans", "#my-div", ["span", "spans text are change!!!"]])
```
🛡️ **امنیت:** `callFunc` از فراخوانی بی‌نهایت (Stack Overflow) و تزریق متغیرهای خطرناک جلوگیری می‌کند.

---

## Dialog

```python
["showDialog", ["dialog"], ["anchor"], "delay", "duration"]
["hideDialog", "#dialog-tag", "delay", "duration"]
```
**ساختار لیست dialog:** `["#dialog", "position", "offsetX", "offsetY", "auto hide"]`
**ساختار لیست anchor:** `["#anchor", "position"]`
- `position_X = "start, center, end"`
- `position_Y = "top, center, bottom"`
*(مثال: `start-top`، `center-bottom`)*

🧾 **مثال Nexelpy:**
```python
x.button("show", mouseenter=["showDialog", ["#dialog-tag", "start-center", 8, 0], ["this", "end-center"], 0, 1000])
with x.dialog(id="dialog-tag"):
   with x.div(Class="bg-light"):
      x.h2("this is dialog", Class="text-dark")
```

---

## Modal Commands

```python
["showModal", "selector", {"backdrop style"}, "auto hide", "delay", "duration"]
["hideModal", "selector", "delay", "duration"]
```
🧾 **مثال:**
```python
click=["showModal", "#modal", {}, True, 0, 500]
click=["hideModal", "#modal", 0, 500]
```
💡 **نکته:** `showModal` تگ dialog را مستقیماً وارد Top Layer مرورگر می‌کند (بالاتر از همه چیز).

---

## Collapse

```python
with x.details():
   x.summary("collapse title", Class="marker-none", click=["collapse", 0, 1000])
   x.p("collapse body")
```
💡 `collapse` روی تگ `summary` قرار می‌گیرد و به صورت خودکار باز و بسته می‌شود. کلاس `marker-none` نشانگر پیش‌فرض مثلثی را حذف می‌کند.

---

## Accordion

```python
with x.details():
   x.summary("question1", accordion="FAQ", click=["collapse", 0, 1000])
   x.p("answer1")
```
💡 استفاده از اتریبیوت `accordion` باعث می‌شود با باز شدن یک بخش، بقیه بخش‌های هم‌نام (با همان مقدار) بسته شوند.

---

## 🛡️ بخش امنیت (Security)

QuickEvent به صورت پیش‌فرض و بدون نیاز به تنظیمات اضافی، امن است:
1. **DOMPurify:** برای پاک‌سازی کدهای HTML در کامندهای `setHtml`، `appendHtml` و `prependHtml`.
2. **AttrGuard:** برای جلوگیری از تزریق اتریبیوت‌های ایونت (`on*`) و URLهای خطرناک (`javascript:`).
3. **Secure Cookies:** جلوگیری از تزریق کاراکترهای کنترلی در `path` و `domain`.
4. **Safe Redirect:** جلوگیری از ریدایرکت به اسکیم‌های خطرناک.
5. **Secure Expressions:** موتور ارزیابی عبارات (`{}`) بدون استفاده از `eval` یا `Function` کار می‌کند.
6. **CSP (Content Security Policy):** وابستگی‌های خارجی و اسکریپت‌های تزریقی توسط مرورگر کنترل می‌شوند.

*پایان مستندات QuickEvent*

***