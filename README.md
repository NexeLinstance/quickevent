

<div align="center">
  <h1>⚡ QuickEvent</h1>
  <p><strong>An ultra-light and modern framework for building interactive user interfaces (Reactive UI) without writing a single line of JavaScript.</strong></p>
  
  <p>
    <a href="https://github.com/NexeLinstance/quickevent/releases">
      <img src="https://img.shields.io/github/v/release/NexeLinstance/quickevent?label=version&color=blue" alt="Version" />
    </a>
    <img src="https://img.shields.io/github/license/NexeLinstance/quickevent?color=purple" alt="License" />
    <img src="https://img.shields.io/github/size/NexeLinstance/quickevent/quickevent.min.js?branch=cdn&label=size&color=green" alt="Size" />
    <img src="https://img.shields.io/badge/python-Nexelpy-yellow.svg" alt="Nexelpy" />
  </p>
  
  <p>Built for seamless integration with <a href="https://nexelpy.net">Nexelpy (Python)</a></p>
</div>

---

## ✨ Why QuickEvent?

**QuickEvent** introduces a new paradigm for front-end development. Instead of writing long JavaScript codes for every button and form and looking for `document.getElementById`, you define your application logic directly in your HTML attributes.

- **🚀 No JS Coding:** All interactions (click, change, scroll) are managed with simple HTML attributes.
- **🪶 Ultra-Light:** Only 14 KB (excluding DOMPurify) - no need for bundlers (Webpack/Vite) or heavy dependencies.
- **🛡️ Security First:** Built-in use of `DOMPurify` to prevent XSS (Cross-Site Scripting) attacks.
- **⚙️ Command-Based Architecture:** All operations are performed as a simple, composable list of commands.
- **🎯 Smart Scoping:** Easily manage repeated components using the `{scopingSelector}` variable (with zero conflicts).

---

## 🚀 Quick Start

### 1. In Pure HTML
Simply add the QuickEvent script to your page and define the logic in the `click` attribute:

```html
<!-- Load the framework -->
<script type="module" src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@latest/quickevent.min.js"></script>

<button click='["setText", "#message", "Hello World! 🎉"]'>
  Click Me
</button>
<p id="message">Waiting for your click...</p>
```

### 2. In Nexelpy (Python)
If you are using the Nexelpy Python framework, experience full integration with QuickEvent:

```python
from nexelpy import AutoRegister, View

@AutoRegister("/quickevent")
async def home():
    x = View(__file__, title="QuickEvent Demo")
    
    # Load QuickEvent in the head
    x.script(parent=x.headTag, type="module", props="defer", src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@latest/quickevent.min.js")
    
    # Use commands directly in Python components
    x.button("Register", click=["setText", "#status", "Successfully registered! ✅"])
    x.p(id="status", text="Status: Unknown")
    
    return x.RESPONSE()
```

---

## 🎯 The Power of Command Composition

The QuickEvent syntax resembles a simple list: `["commandName", "arg1", "arg2"]`. These commands can be chained and smartly composed together.

### 1. Logic and Conditions (Flow)
```html
<button click='[
  ["getValue", "#age-input", "age"],
  ["if", "{ age * 1 >= 18 }", [ 
    ["setText", "#result", "You are an adult."], 
    ["addClass", "#result", "text-green"] 
  ], 
  ["setText", "#result", "You are under 18."],
  ["addClass", "#result", "text-red"] 
  ]'>Check Age</button>
```

### 2. Direct Window Access
No need for specific commands to read browser information. With `{window.property}`, you have access to all standard properties:
```html
<!-- Display screen width and scroll position -->
<button click='["setText", "#info", "width: {window.innerWidth}px | scroll: {window.scrollY}px"]'>
  Screen Status
</button>
```

### 3. Scoping - A Special Feature
Create containers with the `data-scoping` attribute and use `{scopingSelector}` to control only that specific section without writing long selectors:
```html
<div data-scoping="user-list">
  <p class="name">Ali</p>
  <button click='["setText", "{scopingSelector} .name", "Reza"]'>
    Change name in this box
  </button>
</div>
<div data-scoping="other-list">
  <p class="name">Sara</p>
</div>
```

---

## 📚 Quick Command Reference

| Category | Commands | Description |
|---|---|---|
| **Text** | `setText`, `appendText`, `prependText`, `getText` | Insert, append, and read text. |
| **HTML** | `setHtml`, `appendHtml`, `prependHtml`, `getHtml` | Modify HTML content (with DOMPurify security filter). |
| **Class** | `addClass`, `removeClass`, `toggleClass`, `setClass` | Manage CSS classes. |
| **Style** | `addStyle`, `removeStyle`, `toggleStyle`, `setStyle` | Manage inline styles. |
| **Attr** | `addAttr`, `removeAttr`, `getAttr` | Manage HTML attributes. |
| **Flow** | `if`, `elif`, `else`, `for`, `wait`, `then` | Control execution flow and conditions. |
| **Dialog** | `showDialog`, `hideDialog`, `showModal`, `hideModal` | Create Popovers and Modals. |
| **Animate** | `animate` | Animate elements using the Web Animations API. |
| **Ajax** | `ajax`, `ajaxSuccess`, `ajaxError` | Send server requests and manage responses. |
| **Func** | `runFunc`, `createFunc`, `callFunc` | Create and call custom functions. |

---

## 🛡️ Security

Security in QuickEvent is not an option; it is the default:
- All HTML content injected via `setHtml` is automatically sanitized by **DOMPurify**.
- Commands like `addAttr` and `redirect` are fully protected against injection of malicious code (such as `javascript: `).
- Variables are evaluated in an isolated environment (Sandbox), and access to `prototype` or execution of unknown codes is not possible.

---

## 📖 Full Documentation

This is just the beginning! To learn all features, mathematical functions, custom functions, and advanced tips, refer to the **[Documentation (docs.md)](./docs.md)**.

## 📦 Releases
To view the latest changes and get stable versions, visit the **[Releases page](https://github.com/NexeLinstance/quickevent/releases)**.

## 📄 License
This project is licensed under the [MIT License](LICENSE).
