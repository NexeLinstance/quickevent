

<div align="center">
  <h1>⚡ QuickEvent</h1>
  <p><strong>فریم‌ورک فوق‌سبک و مدرن برای ساخت رابط‌های کاربری تعاملی (Reactive UI) بدون نوشتن حتی یک خط جاوااسکریپت.</strong></p>
  
  <p>
    <!-- -->
    <a href="https://github.com/NexeLinstance/quickevent/releases">
      <img src="https://img.shields.io/github/v/release/NexeLinstance/quickevent?label=version&color=blue" alt="Version" />
    </a>
 <!-- -->
    <img src="https://img.shields.io/github/license/NexeLinstance/quickevent?color=purple" alt="License" />
     <!-- -->
    <!-- -->
    <img src="https://img.shields.io/github/size/NexeLinstance/quickevent/quickevent.min.js?branch=cdn&label=size&color=green" alt="Size" />
     <!-- -->
    <!-- -->
    <img src="https://img.shields.io/badge/python-Nexelpy-yellow.svg" alt="Nexelpy" />
  </p>
  
  <p>ساخته شده برای یکپارچگی کامل با <a href="https://nexelpy.net"> (نکسل پای)</a></p>
</div>

---

## ✨ چرا QuickEvent؟

**QuickEvent** پارادایم جدیدی برای توسعه‌ی فرانت‌اند است. به جای اینکه برای هر دکمه و فرم، کدهای طولانی جاوااسکریپت بنویسید و به دنبال `document.getElementById` بگردید، منطق برنامه را مستقیماً در اتریبیوت‌های HTML خود تعریف می‌کنید. 

- **🚀 بدون کدنویسی JS:** تمام تعاملات (کلیک، تغییر، اسکرول) با اتریبیوت‌های ساده HTML مدیریت می‌شوند.
- **🪶 فوق‌العاده سبک:** فقط ۱۴ کیلوبایت (بدون احتساب DOMPurify) - بدون نیاز به باندلر (Webpack/Vite) یا وابستگی‌های سنگین.
- **🛡️ امنیت در اولویت:** استفاده از `DOMPurify` به صورت داخلی برای جلوگیری از حملات XSS.
- **⚙️ معماری کامند-محور (Command-Based):** تمام عملیات به صورت یک لیست ساده و قابل ترکیب از کامندها انجام می‌شود.
- **🎯 اسکوپینگ هوشمند:** مدیریت آسان کامپوننت‌های تکراری با متغیر `{scopingSelector}` (بدون تداخل با سایر بخش‌ها).

---

## 🚀 شروع سریع (Quick Start)

### ۱. در HTML خالص
کافیست اسکریپت QuickEvent را به صفحه اضافه کنید و منطق را در اتریبیوت `click` بنویسید:

```html
<!-- بارگذاری فریم‌ورک -->
<script type="module" src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@cdn/quickevent.min.js"></script>

<button click='["setText", "#message", "سلام دنیا! 🎉"]'>
  کلیک کنید
</button>
<p id="message">منتظر کلیک شما...</p>
```

### ۲. در Nexelpy (پایتون)
اگر از فریم‌ورک پایتونی Nexelpy استفاده می‌کنید، یکپارچگی کامل با QuickEvent را تجربه کنید:

```python
from nexelpy import AutoRegister, View

@AutoRegister("/quickevent")
async def home():
    x = View(__file__, title="QuickEvent Demo")
    
    # بارگذاری QuickEvent در هد
    x.script(parent=x.headTag, type="module", props="defer", src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@cdn/quickevent.min.js")
    
    # استفاده از کامندها مستقیماً در کامپوننت‌های پایتون
    x.button("ثبت نام", click=["setText", "#status", "با موفقیت ثبت شد! ✅"])
    x.p(id="status", text="وضعیت: نامشخص")
    
    return x.RESPONSE()
```

---

## 🎯 قدرت در ترکیب کامندها

سینتکس QuickEvent شبیه به یک لیست ساده است: `["commandName", "arg1", "arg2"]`. این کامندها می‌توانند به صورت زنجیره‌ای و هوشمند با هم ترکیب شوند.

### ۱. منطق و شرط‌ها (Flow)
```html
<button click='[
  ["getValue", "#age-input", "age"],
  ["if", "{ age * 1 >= 18 }", [
    ["setText", "#result", "شما بزرگسال هستید."],
    ["addClass", "#result", "text-green"]
  ], [
    ["setText", "#result", "شما زیر ۱۸ سال هستید."],
    ["addClass", "#result", "text-red"]
  ]]
]'>بررسی سن</button>
```

### ۲. دسترسی مستقیم به Window
نیازی به کامند خاصی برای خواندن اطلاعات مرورگر نیست. با `{window.property}` به تمام ویژگی‌های استاندارد دسترسی دارید:
```html
<!-- نمایش عرض صفحه و موقعیت اسکرول -->
<button click='["setText", "#info", "عرض صفحه: {window.innerWidth}px | اسکرول: {window.scrollY}px"]'>
  وضعیت صفحه
</button>
```

### ۳. اسکوپینگ (Scoping) - قابلیت ویژه
با اتریبیوت `data-scoping` کانتینر بسازید و با `{scopingSelector}` بدون نوشتن سلکتورهای طولانی، فقط روی همان بخش کنترل داشته باشید:
```html
<div data-scoping="user-list">
  <p class="name">Ali</p>
  <button click='["setText", "{scopingSelector} .name", "Reza"]'>
    تغییر نام در این باکس
  </button>
</div>
<div data-scoping="other-list">
  <p class="name">Sara</p>
</div>
```

---

## 📚 مرجع سریع کامندها

| دسته‌بندی | کامندها | توضیح |
|---|---|---|
| **متن (Text)** | `setText`, `appendText`, `prependText`, `getText` | جایگذاری، افزودن و خواندن متن. |
| **HTML** | `setHtml`, `appendHtml`, `prependHtml`, `getHtml` | تغییر محتوای HTML (با فیلتر امنیتی DOMPurify). |
| **کلاس (Class)** | `addClass`, `removeClass`, `toggleClass`, `setClass` | مدیریت کلاس‌های CSS. |
| **استایل (Style)** | `addStyle`, `removeStyle`, `toggleStyle`, `setStyle` | مدیریت استایل‌های inline. |
| **اتریبیوت (Attr)** | `addAttr`, `removeAttr`, `getAttr` | مدیریت اتریبیوت‌های HTML. |
| **منطق (Flow)** | `if`, `elif`, `else`, `for`, `wait`, `then` | کنترل جریان اجرا و شرط‌ها. |
| **دیالوگ (Dialog)** | `showDialog`, `hideDialog`, `showModal`, `hideModal` | ساخت Popover و Modal. |
| **انیمیشن (Animate)** | `animate` | انیمیت کردن المان‌ها با Web Animations API. |
| **شبکه (Ajax)** | `ajax`, `ajaxSuccess`, `ajaxError` | ارسال درخواست به سرور و مدیریت پاسخ. |
| **توابع (Func)** | `runFunc`, `createFunc`, `callFunc` | ساخت و فراخوانی توابع سفارشی. |

---

## 🛡️ امنیت (Security)

امنیت در QuickEvent یک انتخاب نیست، بلکه یک پیش‌فرض است:
- تمام محتوای HTML که با `setHtml` تزریق می‌شود، به طور خودکار توسط **DOMPurify** پاک‌سازی می‌شود.
- کامندهایی مثل `addAttr` و `redirect` در برابر تزریق کدهای مخرب (مانند `javascript: `) کاملاً محافظت شده‌اند.
- متغیرها در یک محیط ایزوله (Sandbox) ارزیابی می‌شوند و امکان دسترسی به `prototype` یا اجرای کدهای ناشناخته وجود ندارد.

---

## 📖 مستندات کامل

این فقط شروع ماجراست! برای یادگیری تمام قابلیت‌ها، توابع ریاضی، ساخت توابع سفارشی و نکات پیشرفته، به **[فایل مستندات (docs.md)](./docs.md)** مراجعه کنید.

## 📦 دریافت نسخه‌ها
برای مشاهده آخرین تغییرات و دریافت نسخه‌های پایدار (Stable)، به **[صفحه Releases](https://github.com/NexeLinstance/quickevent/releases)** مراجعه کنید.

## 📄 لایسنس
این پروژه تحت لایسنس [MIT](LICENSE) منتشر شده است.


