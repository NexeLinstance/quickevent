
<div align="center">
  <h1>⚡ QuickEvent</h1>
  <p><strong>فریم‌ورک سبک و مدرن جاوااسکریپت برای ساخت رابط‌های کاربری واکنش‌گرا (Reactive) بدون نیاز به کدنویسی پیچیده.</strong></p>
  <p>ساخته شده برای یکپارچگی کامل با <a href="https://nexelpy.net">Nexelpy</a> (پایتون)</p>
</div>

---

## ✨ چرا QuickEvent؟

- **🚀 بدون کدنویسی جاوااسکریپت:** با اتریبیوت‌های ساده HTML، منطق برنامه را پیاده‌سازی کنید.
- **🔒 امنیت در اولویت:** استفاده از `DOMPurify` برای جلوگیری از حملات XSS (Cross-Site Scripting).
- **🪶 فوق‌العاده سبک:** فقط ۱۴ کیلوبایت (بدون احتساب DOMPurify).
- **🐍 یکپارچگی کامل با پایتون:** بهترین تجربه توسعه در Nexelpy.
- **⚙️ مبتنی بر کامند:** تمام عملیات (از تغییر متن تا ارسال Ajax) به صورت یک لیست ساده و قابل ترکیب انجام می‌شود.

---

## 🚀 شروع سریع

### در Nexelpy (پایتون)

در Nexelpy، کافی است اسکریپت QuickEvent را به تگ `head` اضافه کنید و از اتریبیوت‌های ایونت (مثل `click`) در کامپوننت‌های خود استفاده کنید:

```python
from nexelpy import AutoRegister, View

@AutoRegister("/quickevent")
async def home():
    x = View(__file__, title="QuickEvent Demo")
    
    # 1. بارگذاری QuickEvent
    x.script(parent=x.HEAD_tag, type="module", props="defer", src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@cdn/quickevent.min.js")
    
    # 2. استفاده از کامندها در ایونت‌ها
    x.button("کلیک کنید", click=["setText", "#message", "سلام دنیا! 🎉"])
    x.p(id="message", text="منتظر کلیک شما...")
    
    return x.RESPONSE()
```

### در HTML خالص

اگر از پایتون استفاده نمی‌کنید، می‌توانید QuickEvent را مستقیماً در HTML خود بارگذاری کنید:

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@cdn/quickevent.min.js"></script>

<button click='["setText", "#message", "سلام دنیا! 🎉"]'>
  کلیک کنید
</button>
<p id="message">منتظر کلیک شما...</p>
```

---

## 📚 کامندهای کلیدی (Quick Reference)

QuickEvent مجموعه‌ای از کامندهای آماده برای انجام عملیات مختلف روی DOM دارد:

| دسته‌بندی | کامندها | توضیح |
|---|---|---|
| **متن (Text)** | `setText`, `appendText`, `prependText`, `getText` | جایگذاری، افزودن و خواندن متن. |
| **HTML** | `setHtml`, `appendHtml`, `prependHtml`, `getHtml` | تغییر محتوای HTML (با فیلتر امنیتی). |
| **مقدار (Value)** | `setValue`, `getValue` | تغییر و خواندن مقدار `input` و `textarea`. |
| **کلاس (Class)** | `addClass`, `removeClass`, `toggleClass`, `setClass` | مدیریت کلاس‌های CSS. |
| **استایل (Style)** | `addStyle`, `removeStyle`, `toggleStyle`, `setStyle` | مدیریت استایل‌های inline. |
| **اتریبیوت (Attr)** | `addAttr`, `removeAttr`, `getAttr` | مدیریت اتریبیوت‌های HTML. |
| **انیمیشن (Animate)** | `animate` | انیمیت کردن المنت‌ها با Web Animations API. |
| **شبکه (Ajax)** | `ajax`, `ajaxSuccess`, `ajaxError` | ارسال درخواست به سرور و مدیریت پاسخ. |
| **منطق (Flow)** | `if`, `elif`, `else`, `for`, `wait`, `then` | کنترل جریان اجرا و شرط‌ها. |
| **دیالوگ (Dialog)** | `showDialog`, `hideDialog`, `showModal`, `hideModal` | ساخت Popover و Modal. |
| **سیستم (System)** | `log`, `redirect`, `reload`, `setCookie`, `getCookie` | ابزارهای سیستمی و کوکی‌ها. |

---

## 🛡️ امنیت

QuickEvent به طور خودکار از کتابخانه **DOMPurify** برای پاک‌سازی HTML استفاده می‌کند. این بدان معناست که اگر داده‌ای از سمت کاربر دریافت کنید و آن را با `setHtml` نمایش دهید، کدهای مخرب (مثل `<script>`) به طور خودکار حذف می‌شوند. 

همچنین کامندهای `addAttr` و `redirect` در برابر تزریق کدهای مخرب (مانند `javascript:`) محافظت شده‌اند.

---

## 📖 مستندات کامل

برای مشاهده لیست کامل ایونت‌ها، کامندها، توابع ریاضی، و نکات پیشرفته، به **[فایل مستندات (docs.md)](./docs.md)** مراجعه کنید.

## 📦 دریافت نسخه‌ها

برای مشاهده آخرین تغییرات و دریافت نسخه‌های پایدار، به **[صفحه Releases](https://github.com/NexeLinstance/quickevent/releases)** بروید.

## 📄 لایسنس

MIT