
# 📘 QuickEvent Complete Documentation

## Introduction

**QuickEvent** is a modern JavaScript framework designed to work with the DOM, events, and element modifications, created by **Nexelpy** for use with Python. Although this framework is attribute-driven and doesn't depend on any specific language, using it with Python in Nexelpy is much smoother and more convenient.

---

## Syntax

QuickEvent provides numerous functions for working with the DOM. Just as in programming languages, to use a function, we write its name followed by its inputs in parentheses:

```python
setText(selector, text)
```

In QuickEvent, we follow the same approach to call functions, which we refer to as **commands**, using this format:

```python
["setText", "#selector", "text"]
```

```python
["setText", "#my-div", "this is new text"]
["addClass", "#btn", "bg-red"]
["addStyle", "#my-span", "color:red;margin:8px;"]
```

Each command in QuickEvent is a **list (array)** where index zero is the command name and subsequent indexes are its inputs.

---
## Quick Start
#### HTML
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@main/dist/quickevent.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@main/dist/quickevent-markers.css">
```
#### Nexelpy (Python)
```python
x.script(parent=x.headTag, type="module", props="defer", src="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@main/dist/quickevent.min.js")
x.link(parent=x.HEAD_tag, rel="stylesheet", href="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@main/dist/quickevent-markers.css")
```


## Events

QuickEvent supports the following events:

| Event | Description |
|---|---|
| `click` | Click |
| `dblclick` | Double-click |
| `keyup` | Key release |
| `keydown` | Key press |
| `change` | Value change |
| `submit` | Form submission |
| `focusin` | Focus enter |
| `mouseenter` | Mouse enter |
| `mouseleave` | Mouse leave |
| `tick` | Timer every second |
| `loadDom` | DOM ready |

To use and activate any of them, create an attribute with the same event name.

**HTML Example:**

```html
<button click='["setText", "#my-paragraph", "hello world!"]'>click me</button>
<!-- Note: In HTML attributes, array/JSON strings must use double quotes (") so that JavaScript can parse them correctly. Single quotes (') will cause a parsing error. -->
```
💡 **Note:** In Nexelpy, single or double quotes for writing commands don't matter, and there will be no errors.

**Nexelpy Example:**

```python
from nexelpy import AutoRegister, View

@AutoRegister("/quickevent")
async def home():
    x = View(__file__, title="QuickEvent Demo")

    x.button("click me", click=["setText", "#my-paragraph", "hello world!"])
    return x.RESPONSE()
```

In these examples, which are identical, clicking the button uses the setText command to select an element with the ID `my-paragraph` and change its text to `hello world!`.

💡 **Note:** To execute multiple commands in one event, we use a nested list:

```python
x.button("click me", click=[
   ["setText", "#my-paragraph", "this is new content"],
   ["setText", "#my-title", "this is new title"],
])
```

💡 **Note:** All commands within an event are scheduled asynchronously and don't necessarily wait for each other to finish; for sequential execution use `wait`, `then`, or `delay`.

🔘 **loadDom:** This event is equivalent to the standard `DOMContentLoaded` event in the browser. All commands defined in the `loadDom` attribute run automatically right after the DOM structure is fully prepared and parsed (even before images and styles are fully loaded).

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

🧾 **Example:**

```python
click=["setText", "#el1", "this is new text", 1000]
click=["appendText", "#el1", "this is new text", 1000]
click=["prependText", "#el1", "this is new text", 1000]
```

➕ **Index 0:** Command name
➕ **Index 1:** Selector, which can be any standard CSS or JS selector, or the keyword `this` to mean the same element. If the selector returns multiple elements, setText applies to all of them. (This behavior is true for all commands.)
➕ **Index 2:** Can be raw text or populated by get commands.
➕ **Index 3:** Delay in executing this command in milliseconds. (Default is 0 if not provided)

🔘 `setText`: Replaces the content of the selected element(s) with the new text.
🔘 `appendText`: Appends the new text to the end of the content of the selected element(s).
🔘 `prependText`: Prepends the new text to the beginning of the content of the selected element(s).

💡 **Note:** The setText command adds the input text as a string to the element; meaning even if you write an HTML tag in the input, you'll see the tag text in the final result and the written tag is not added to the element or DOM.

```python
click=["setText", "#el1", "<span>this is new text</span>"]
```

💻 **Result in browser:** `<span>this is new text</span>`

### getText — Unified Getter Pattern

```python
["getText", "#selector"]
["getText", "#selector", "alias"]
["getText", "#selector", "alias", "expression"]
```

➕ **Index 0:** Command name<br>
➕ **Index 1:** Selector of the element whose text you want to retrieve.<br>
➕ **Index 2:** (Optional) Stores the return value in a variable with the name you pass. This name is available until the end of the event execution and its commands, then disappears.<br>
➕ **Index 3:** (Optional) Expression for processing the value.<br>

🧾 **Example:** Direct substitution of return value:

```python
click=["setText", "#el2", ["getText", "#el3"]]
```

The above code replaces the content of the element with ID el2 with the text of the element with ID el3.

💡 **Note:** Instead of writing raw text directly, you can use the getText command to get the text of an element and assign it. The Python model of this command would be (one function inside another):

```python
setText("#my-paragraph", getText("#content-div"))
```

🧾 **Example:** Using alias in multiple commands:

```python
click=[
   ["getText", "#el1", "my_p"],   # Save '#el1' element text to the 'my_p' variable
   ["setText", "#el2", "{my_p}"], # Assign 'my_p' variable value to '#el2' element text
   ["setText", "#el3", "{my_p}"], # Assign 'my_p' variable value to '#el3' element text as well

]
```

🧾 **Example:** Using alias in text template:

```python
click=[
   ["getText", "#el1", "my_p"],
   ["setText", "#el2", "text of element 2 is {my_p}"],
   ["setText", "#el3", "{my_p} is my new content"],
]
```

🧾 **Example:** Using expression:

```python
["setText", "#el1", ["getText", "#el2", "my_txt", "el2 change to {my_txt}"], 0]
```

You can use the following string methods in the expression index:

`replace` · `upperCase` · `lowerCase` · `trim` · `slice` · `length` · `startsWith` · `endsWith` · `indexOf` · `split`

🧾 **Example:**

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

💡 **Note:** `startsWith` and `endsWith` return True or False, and their main use is in if, elif, and else sections.
💡 **Note:** `split` returns a list of words that we can loop over, which is covered in the for section.

---

## HTML Commands

```python
["setHtml", "#selector", "html", "delay"]
["appendHtml", "#selector", "html", "delay"]
["prependHtml", "#selector", "html", "delay"]
```
🔘 These commands add HTML to the DOM.

🛡️ Security (DOMPurify): These three commands automatically use the DOMPurify library. Dangerous tags like script, iframe, and malicious attributes like onerror are completely removed to prevent XSS attacks.

### getHtml — Unified Getter Pattern

```python
["getHtml", "#selector"]
["getHtml", "#selector", "alias"]
["getHtml", "#selector", "alias", "expression"]
```

➕ **Index 0:** Command name<br>
➕ **Index 1:** Selector, which can be any standard CSS or JS selector, or the keyword `this`.<br>
➕ **Index 2:** Can be HTML written manually, fetched from another element, or a view returned from the server via Ajax.<br>
➕ **Index 3:** Delay in executing this command in milliseconds. (Default 0)<br>

🔘 `getHtml` returns the content inside the selected tag.

🧾 **Example:** This command, unlike setText, adds the content as an element to the DOM. In this example, a p tag is added to the DOM:

```python
click=["setHtml", "#el1", "<p>this is paragraph</p>", 0]
```
### HTML Trust Commands (No Filter)
```python
["setHtmlTrust", "#selector", "html", "delay"] 
["appendHtmlTrust", "#selector", "html", "delay"] 
["prependHtmlTrust", "#selector", "html", "delay"]
```
⚠️ Serious security warning: These commands place HTML directly into the DOM without any filtering or sanitization. These commands should only be used for content that comes from your own secure backend (like Nexelpy/Vapi) and you're sure it contains no malicious code. Never pass user data to these commands.

🧾 **Example:**

```python
click = ["setHtml", "#el1", ["getHtml", "#el3"], 0]      # Sanitizes content via DOMPurify to prevent XSS
click = ["setHtmlTrust", "#el1", "{response}", 0]        # Injects raw HTML without sanitization (trusted source: own server)
```

🔘 The `response` is explained in detail in the Ajax section.

💡💡💡 **Security Note:** The `setHtmlTrust`, `appendHtmlTrust`, and `prependHtmlTrust` commands inject HTML code directly into the DOM. Always ensure that data written directly by end users in forms is assigned with `setText`, or if used in HTML structure, their text values should be escaped on the server side.

---

## Value Commands

```python
["setValue", "#selector", "value", "delay"]
```

### getValue — Unified Getter Pattern

```python
["getValue", "#selector"]
["getValue", "#selector", "alias"]
["getValue", "#selector", "alias", "expression"]
```

🧾 **Example:**

```python
click=["setValue", "#input1", "alex", 0]
click=["setValue", "#el3", ["getValue", "#input2"], 0]
click=["setValue", "#el3", ["getValue", "#input2", "my_number", "{my_number+1}"], 0]
```

💡 **Note:** The value command changes the property of an element, not its attribute.

🧾 **Example:**

```python
click=[
   ["getValue", "#input2", "my_number"],
   ["setText", "#el1", "{my_number+1}"],
   ["setText", "#el2", "{my_number*2}"],
   ["setText", "#el3", "my number is {my_number} ."],
]
```

## 🔍 Direct Element Access (getElement)

The `getElement` command allows you to store one or more DOM elements in a variable. You can then use the dot (`.`) to access all the element's Properties and dataset attributes. This eliminates the need for repeated commands to read information.

### 📝 Syntax
```javascript
["getElement", "selector", "alias"]
```
*   **selector**: CSS selector to find the element.
*   **alias**: Name of the variable in which the element is stored.

### 💡 Practical Example

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
  Read Element Info
</button>
```

### 📌 Common Properties
Using this command, you can access all standard DOM properties. A few common examples:
- **`innerText` and `innerHTML`**: Read text or HTML inside the element.
- **`id` and `className`**: Read the ID and classes.
- **`tagName`**: Tag name (e.g., `DIV`).
- **`dataset`**: Access all `data-*` attributes (e.g., `dataset.userId`).
- **`style`**: Access inline styles (e.g., `style.color`).
- **`children` and `parentElement`**: Access child elements and the parent element.

### 🎯 Special Cases
- **Multiple Elements**: If your selector targets multiple elements (e.g., a class), an array is returned. You can use `count()` or `{MY_ARRAY.length}`.
- **Use in `if`**: You can check element values directly in conditions:
```python
  ["getElement", "#my-btn", "BTN"],
  ["if", "{BTN.disabled}", ["log", "The button is disabled"]]
```

---

## Class Commands

```python
["addClass", "#selector", "class", "delay"]
["removeClass", "#selector", "class", "delay"]
["toggleClass", "#selector", "class", "delay"]
["setClass", "#selector", "class", "delay"]
```

🔘 `setClass`: Removes existing classes and adds the new class.

---

## Style Commands

```python
["addStyle", "#selector", "style", "delay"]
["removeStyle", "#selector", "style", "delay"]
["toggleStyle", "#selector", "style", "delay"]
["setStyle", "#selector", "style", "delay"]
```

🔘 `setStyle`: Removes existing styles and adds the new style.

💡 **Note:** The style commands change **inline style** values.

🧾 **Example:**

```python
click=["addStyle", "#el1", "color:red;margin:8px;", 0]
```

---

## Animate Command

```python
["animate", "selector", {"css property": "value"}, "delay", "duration", "ease"]
```

Uses the Web Animation API and JavaScript's animate method to animate the element's current CSS to the CSS passed in the input.

🧾 **Example:**

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

In QuickEvent, we use attribute 2 for different purposes: the first is to change official HTML attributes, and the second is to use it as a variable and store values.

💡 **Note:** In addAttr, if an attribute with the input key exists, it sets its value; otherwise, it adds it.

```python
click=["addAttr", "#el1", "href", "https://www.nexelpy.net", 0]
click=["addAttr", "#el1", "counter", 1]
```

`counter` is not an official attribute, and we use it as a variable for a counter.

🧾 **Example:**

```python
click=[
   ["addAttr", "#el1", "counter", 1],
   ["addAttr", "#el2", ["getAttr", "#el1"]],
   ["addAttr", "#el3", ["getAttr", "#el1", "my_count", "{my_count+1}"]],
]
```

🧾 **Example:**

```python
click=["setText", "#el4", ["getAttr", "#el1", "my_count", "{my_count+=1}"]]
```

💡 **Note:** In this example, we performed an assignment operation. Not only did the value we gave to el4 increase by one, but the value of the counter attribute in el1 was also updated and increased by one.

### Operators

| Operator | Description |
|---|---|
| `+ - * / % **` | Arithmetic |
| `> < >= <= == !=` | Comparison |
| `&& \|\| !` | Logical |
| `+= -= *= /= %=` | Assignment |

🧾 **Example:** You can use the attribute key as the variable name instead of an alias:

```python
click=[
   ["getAttr", "#el1", "number1"],
   ["getAttr", "#el2", "number2"],
   ["getAttr", "#el3", "result", "{result += number1 + number2}"],
   ["setText", "#el4", ["getAttr", "#el3", "result"], 0],
]
```

🧾 **Example:** In this example, getAttr stores the value of all span tags that have the `number` attribute in `numbers` (as a list). In the expression section, the sum function adds all values together and places them in el1:

```python
click=["setText", "#el1", ["getAttr", "span", ["number", "numbers"], "{sum(numbers)}"]]
```

### Math Functions

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

Props are attributes without a value like `hidden`, `checked`, `readonly`.

```python
click=["addProps", "this", "hidden"]
```

💡 **Note:** The Props parameter can contain one or more properties separated by spaces; QuickEvent applies all of them simultaneously.

🧾 **Example (Changing multiple properties at once):**

```python
click=["addProps", "#terms-checkbox", "checked disabled"]
click=["removeProps", "#submit-btn", "disabled hidden"]
```




## 📦 JSON Commands (Structured Data Management)

In complex projects (like building trees, nested lists, or saving state), you need to attach structured data (objects or dictionaries) to an element. Writing JSON as strings in HTML makes the code dirty, conflicts with QuickEvent's curly braces, and causes parsing errors. The `setJson` and `getJson` commands are designed to solve this problem.

### 📝 Saving Data (setJson)

```python
["setJson", "selector", "name", {"key": "value"}]
```

➕ **Index 0:** Command name (`setJson`)
➕ **Index 1:** Selector of the element where you want to save the data.
➕ **Index 2:** Key name (Name). The data is stored in an attribute named `data-json-{name}`.
➕ **Index 3:** The object or dictionary containing the data. All values inside this object (even variables like `{tag}`) are evaluated and replaced before being saved.

🧾 **Example:**
```python
click=[
  ["setJson", "#my-div", "user-info", {
    "id": 123,
    "name": "{ user_input }",
    "roles": ["admin", "editor"]
  }]
]
```
*(In this example, the data is stored as a clean JSON string in the `data-json-user-info` attribute.)*

### 📝 Reading Data (getJson)

```python
["getJson", "selector", "name"]
["getJson", "selector", "name", "alias"]
```

➕ **Index 0:** Command name (`getJson`)
➕ **Index 1:** Selector of the element where the data is stored.
➕ **Index 2:** Key name (Name) used during `setJson`.
➕ **Index 3:** (Optional) Name of the variable (alias) in which the read object is stored.

🧾 **Example:**
```python
click=[
  ["getJson", "#my-div", "user-info", "user"],
  ["setText", "#output", "User: { user.name }"]
]
```

---

### 💡 Why Use These Commands? (Comparison)

Suppose you want to render a list of information in HTML and simultaneously save the data of each item for future clicks.

**Old Way (Ugly & Error-Prone):**
```python
# Writing JSON manually inside HTML
["appendHtmlTrust", "#list", "<li data-info='{\"id\":\"{id}\", \"tag\":\"{tag}\"}'>...</li>"]
```

**New Way (Clean & Standard):**
```python
# 1. Save data in a variable
["setJson", "#list", "info", {"id": "{id}", "tag": "{tag}"}]

# 2. Inject empty HTML without any data
["appendHtmlTrust", "#list", "<li id=\"item-{id}\">...</li>"]
```

**Benefits of the New Way:**
1. **No Escaping:** No need to escape quotes and curly braces.
2. **Safe Parsing:** QuickEvent processes the object before saving, so the HTML parser won't break.
3. **Easy Access:** Each element's data is stored cleanly in a `data-json-*` attribute and can be read with `getJson`.


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
Creates a delay between two sets of commands. Commands after wait are not executed simultaneously with commands before it, but after the specified duration.<br>
In the example below, commands 1 and 2 execute simultaneously, and after 2 seconds, commands 3 and 4 execute simultaneously.
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
Ensures the next command runs after the previous asynchronous command or operation completes. In the example below, setText for el3 runs after the animation completes; setText for el4 runs simultaneously with the animation start. To run all commands linearly, use then after each command.
In the example below, commands 1 and 3 run simultaneously, but command 2 waits for command 1 to finish and then runs.
```python
click=[
   ["animate", "this", {"color": "red", "margin": "8px"}, 0, 2000, "ease"],#1
   ["then"],
   ["setText", "#el3", "set new text after animate"],#2
   ["setText", "#el4", "set new text when click and run animate"],#3
]
```
In this example, each command runs after the previous command finishes.
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
Suppose you have a search input that sends a request to the server on every keyup. To control the number of requests, you can't use wait, because wait only creates a delay and guarantees that all called events are executed. But debounce prevents the event from executing for a specified time and after input stops, performs the last execution.

```python
keyup=[
   ["debounce", 1000],
   ["setText", "#el1", ["getValue", "#input1"]],
   ["setText", "#el2", ["getValue", "#input2"]],
]
```

🔘 `scrollTo`:<br>
Scrolls to an element or to a pixel position. If you want to scroll inside a specific container (e.g., a div with overflow), you can pass the parent selector in the third index. The default for this parameter is `window` (the entire page).
```python
# Scroll the entire page to an element
click=["scrollTo", "#section-2"]

# Scroll inside a specific container
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
["removeCookie"] # Delete all cookies
```
### setCookie Options (Default values):
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
(Note: HttpOnly can only be set from the server side and is ignored on the client).

🛡️ Security: path and domain values are protected against injection of control characters.

🧾 **Example:**

```python
click=["setCookie", "theme", "dark"]
click=["setText", "#el1", ["getCookie", "theme", "my_theme"], 0]
```

---

## Ajax

```python
["ajax", "url", "method", {"data": "value"}, {"custom": "headers"}]
```

💡 **Note:** url can be an internal server address, external, or a static file.

💡 The `method` input specifies the type of request processing:

- `GET`: Fetch information with Query Parameters.
- `POST`: Send standard form data.
- `json`: Wraps data with `application/json` header and sends it to the server with POST method so it's directly available in the backend.<br>
🧾 **Example:** Fetching data in backend

```python
#client side
click=["ajax", "/example", "json", {"id": "36","name": "nexelpy"}, {"custom": "headers"}]

#server side
id = await x.REQUEST.payload("json", "id")
   #or
id = await x.REQUEST.json("id")
```

🧾 **Example:** Request to server for the file `my_file.txt`; the file content is placed in el1. The `response` variable is available in the event where the Ajax request was sent without needing a get command.<br>
If you used the ajax command in an event, `{response}` is available until the end of that event. `{response}` is a reserved variable in QuickEvent available without a getResponse command.
```python
click=[
   ["ajax", "/my_file.txt"],
   ["setText", "#el1", "{response}"],
]
```

🧾 **Example:** The request returns a JSON to the server, and with dot notation the value of the name key is placed in the element:

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

🧾 **Example:** If you use Vapi in nexelpy, the output is a JSON that adds the server-rendered elements to the DOM with the `view` key.

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

💡 We use then to ensure that after the server response returns and response is assigned, appendHtml executes.

### Success and Error Handling

For real projects, we usually need to know the request result and show an appropriate message to the user.

```python
["ajaxSuccess", ["commands"]]
["ajaxError", ["commands"]]
["ajaxError", ["commands"], {"statusCode": "custom message"}]
```
`ajaxSuccess`: If the request was sent successfully and the response returned successfully and response was assigned, the commands within it execute.

`ajaxError`:<br>
If the request or send was unsuccessful, the commands within it execute. Via <br>
`response.status_code`<br>
you get the return code from the server, and via<br>
`response.status_message`<br>
these two response keys are also available in<br>
ajaxSuccess.<br>

💡 In infrastructure and critical errors (0 and 5xx and 404 routing) where the backend cannot send a status message, status_message is assigned by QuickEvent with default values:

| Code | Default Message |
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

💡 To change the default value, use the last index to specify the new message:

```python
["ajaxError", ["setText", "#el4", "{response.status_message}"], {404: "This item has been removed."}]
```

🧾 **Example:** Only one of the two branches ajaxSuccess or ajaxError executes:

```python
click=[
   ["ajax", "/json-api", "GET", {"name": "nexelpy", "id": 927}],
   ["ajaxSuccess", ["appendHtml", "#el1", "{response.view}"]],
   ["ajaxError", ["setText", "#el4", "error : {response.status_message}"]],
]
```

🧾 **Example:** Clicking the button adds the disabled attribute to the button so the user can't click repeatedly. After receiving the response and placing it in the DOM, disabled is removed.

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

💡 Like other sections, use nested lists for multiple commands. ajaxSuccess and ajaxError take a list (array) as input.

💡 If you use Vapi in nexelpy, you may have added style and script links to the head tag in the backend view. Those tags are created in a key called `QE_links_header`. QuickEvent ensures that non-duplicate links are added to the current page's head tag without writing a command.

## If / Else

```python
["if", ["Conditions"], ["commands"]]
["elif", ["Conditions"], ["commands"]]
["else", ["commands"]]
```

🧾 **Example:** If the score attribute in el1 is greater than 100, the body, which is a log, executes:

```python
click=["if", ["getAttr", "#el1", "score", "{score > 100}"], ["log", "User wins!"]]
```

🧾 **Example:** Two conditions are checked; if score is greater than 50 and less than 90, log executes:

```python
click=[
   ["getAttr", "#el1", "score"],
   ["if", [["{score > 50}"], ["{score < 90}"]], ["log", "continue!!"]],
]
```

For the OR condition, we use this method:

```python
click=[
   ["getAttr", "#el1", "score"],
   ["if", [["{score > 50}"], ["or"], ["{score < 90}"]], ["log", "continue!!"]],
]
```

🧾 **Example:**

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

Python equivalent of the above code:

```python
score=getAttr("#el1", "score")
if (score > 50 and score < 60) or (score > 90 and score < 100):
   log("continue!!")
```

🧾 **Example:** Multiple commands in the condition body:

```python
click=["if", ["getAttr", "#el1", "score", "{score > 100}"], [
   ["log", "user win!!"],
   ["setText", "#el2", "User wins!"],
   ["wait", 3000],
   ["redirect", "/userlevel"],
]]
```

🧾 **Example:** Chain of if, elif, and else:

```python
click=[
   ["getAttr", "#el1", "score"],
   ["if", ["{score > 100}"], ["log", "User wins!!!"]],
   ["elif", ["{score < 20}"], ["log", "User lost!"]],
   ["else", ["log", "The game continues!"]],
]
```

💡 For more than one condition and more than one command, use nested lists.

---

## For

```python
["for", "var name", "Iterators", ["commands"]]
["for", ["key", "value"], "dict/json", ["commands"]]
```

🧾 `getAttr` returns a list (array) from spans that have the number attribute; for example `Number = [23, 78, 91, 21, 12]`.

```python
click=["for", "i", ["getAttr", "span", "number"], ["log", "{i}"]]
```

```python
click=["for", "i", ["getAttr", "span", "number"], [
   ["log", "{i}"],
   ["getAttr", "#el1", "result", "{result += i}"],
]]
```

The last index can be a list for one command or multiple lists within a list for executing multiple commands.

```python
click=[
   ["ajax", "/quickevent"],
   ["for", ["k", "v"], "{response.users}", ["appendText", "#el1", "{k}:{v} _ "]],
]
```

**Sample result:** `name:alex _ id:78 _ age:43 _ access:admin`

💡 The `{index}` variable is automatically available in each loop iteration.

---

## Tick

```python
["setTick", "selector", "time", "mode"]
["playTick", "selector"]
["playTick", "selector", "time", "mode"]
["pauseTick", "selector"]
["resetTick", "selector", False]
```

`setTick` only sets the timer and doesn't run it. `playTick` without time and mode arguments uses the set time; if it receives them, it sets and runs with the input values. `pauseTick` stops the timer. `resetTick` resets the time; the value False only resets the time, and True resets and runs the timer.

💡 These commands are only tick controllers. To use the tick, you must use the `tick` attribute.

🔘 `mode`: Sets whether the timer counts up or down. If `++`, it counts from 0 to the set time, and if `--`, it counts from the set time to 0.

🧾 **Example:** Clicking the button sets and runs a timer of one hour, 28 minutes, and 32 seconds for the my-div element. Commands in the tick attribute run once per second.

```python
x.button("play tick", click=["playTick", "#my-div", "1:28:32", "--"])
x.div(id="my-div", tick=["setText", "this", "{tick}"])
```

💡 For each element, one tick is set, and the tick attribute and its commands must be written on the same element. However, controllers can create changes on it by selecting the target element from any other element.

🧾 **Example:**

```python
click=["setTick", "#el1", "28", "++"]
click=["setTick", "#el2", "01:00", "++"]
click=["setTick", "#el3", "01:00:00", "--"]
```

💡 You can't set more than standard values for time; for example `01:05:63` or `28:25:99` is not valid.

🧾 Numeric values are also accepted. In this example, 650 seconds is set and run:

```python
click=["playTick", "#el1", 650, "++"]
```

Values usable in the tick event:

```python
tick=["setText", "this", "{tick}"]
tick=["setText", "this", "{tick.h}"]
tick=["setText", "this", "{tick.m}"]
tick=["setText", "this", "{tick.s}"]
tick=["setText", "this", "{tick.total}"]
```

`{tick}` returns the current full time as a string (like `01:00:00`). `{tick.h}` returns hours, `{tick.m}` minutes, and `{tick.s}` seconds as integers. `{tick.total}` returns the total remaining time in seconds; for example `34 + (8 * 60) + (60 * 60) = 4114`.

You don't need a get command to use the tick value.

🧾 **Example:** The element's text updates every second, and if the remaining time is less than 30 seconds, the text turns red:

```python
tick=[
   ["setText", "this", "{tick}"],
   ["if", ["{tick.total < 30}"], ["addStyle", "this", "color:red;"]],
]
```

💡 From the moment tick runs, commands in the tick attribute run once per second. For example, append adds text to the DOM every second, and Ajax also repeats if placed in this event; be careful in choosing commands.

💡 The `addClass`, `addStyle`, and `addProps` commands don't add duplicate values; QuickEvent checks before adding. In the above example, addStyle is applied only once.

💡 `addAttr` also works like a Python dictionary: if the value is new, it replaces it; otherwise, the previous value remains.

---

## Func

### Running External JavaScript Functions

```python
["runFunc", "path", "funcname", "arg1", "arg2"]
```

Runs a function named funcname from the JS file in path, with the passed arguments.

```python
click=["runFunc", "/my_lib/myfuncs.js", "myalert", "alex", "43", "972"]
```
🛡️ Security (CSP): This command operates in accordance with the browser's Content Security Policy (CSP) and prevents loading scripts from unauthorized domains; unless the target URL is validated by CSP headers.

### Creating and Calling Custom Functions (Macro)

Sometimes you have a set of commands (e.g., a routine to open a menu) that you want to reuse in different places without duplicating code. QuickEvent allows you to create a "custom function", store it on an element (e.g., a hidden div), and call it anywhere you want.

#### 1. Creating a Function (`createFunc`)
To create a function, we use the `createFunc` command. This command is set on a **custom attribute name** (e.g., `my_func`) and its structure is:

```python
["createFunc", ["input definitions"], ["function body"]]
```

➕ **Index 0:** Command name (`createFunc`)
➕ **Index 1:** A list of inputs (arguments) that this function takes. (If the function has no inputs, give an empty list `[]`)
➕ **Index 2:** A list of commands that execute when this function is called (function body).

**Input Definitions (Index 1) come in two forms:**
1. **Without default value:** A list of strings. E.g., `["color", "size"]`.
2. **With default value:** A list of dictionaries. E.g., `[{"color": "red"}, {"size": "16px"}]`.

**🧾 Example:** A function without inputs for making text red.

```html
<!-- 1. Define the function on an element (with the attribute name set_red) -->
<div id="my-macros" set_red='["createFunc", [], ["addStyle", "this", "color:red"]]'></div>

<!-- 2. Call the function with a button -->
<button click='["callFunc", "set_red", "#my-macros"]'>Red it</button>
```
*(In this example, when the button is clicked, the `callFunc` command finds the `set_red` function stored on the `#my-macros` element and executes it).*

**🧾 Example:** A function with an input (dynamic).
If we want to specify the color when calling, we need an input. In the function body, we use the input name inside curly braces (`{color}`).

```html
<!-- 1. Define the function with an input named color -->
<div id="my-macros" set_color='[
  "createFunc", 
  ["color"], 
  ["addStyle", "this", "color:{color}"]
]'></div>
```

#### 2. Calling a Function (`callFunc`)
To run the function you created, we use the `callFunc` command.

```python
["callFunc", "func_name", "selector", ["input values"]]
```

➕ **Index 0:** Command name (`callFunc`)<br>
➕ **Index 1:** The attribute name on which the function is defined (e.g., `set_color`)<br>
➕ **Index 2:** Selector of the element on which the function is defined (e.g., `#my-macros`)<br>
➕ **Index 3:** (Optional) A list of values for the function inputs, in the exact order they were defined.
If the function has only one input, you can write the value directly (e.g., "blue").
If the function has multiple inputs, you must pass the values as a list in order (e.g., ["blue", "16px"]).

**🧾 Example:**
```html
<!-- Call a function that takes an input -->
<button click='["callFunc", "set_color", "#my-macros", "blue"]'>Blue it</button>
<button click='["callFunc", "set_color", "#my-macros", "green"]'>Green it</button>
```

💡 **Note:** Use this feature to modularize repetitive code.

---

## Dialog

The showDialog command displays the dialog tag and its content, which is hidden by default. It is used to create popovers, menus, dialogs, popups, tooltips, and hamburger menus.

```python
["showDialog", ["dialog"], ["anchor"], "delay", "duration"]
```

➕ **Index 0:** Command name<br>
➕ **Index 1:** Selector of the dialog tag, along with its settings in a list format<br>
➕ **Index 2:** Selector of the element where the dialog is displayed in its position, along with its settings<br>
➕ **Index 3:** Delay in executing the command<br>
➕ **Index 4:** Fade transition time

Dialog list structure:

```python
["#dialog", "position", "offsetX", "offsetY", "auto hide"]
```

➕ **Index 0:** Dialog selector<br>
➕ **Index 1:** Position of the dialog that attaches to the anchor; like `start-top` (`start` for x and `top` for y)<br>
➕ **Index 2:** Dialog's distance from the anchor on the x axis<br>
➕ **Index 3:** Dialog's distance from the anchor on the y axis<br>
➕ **Index 4:** Auto-hide flag; if True, hides by clicking outside the dialog or pressing Escape. If False, you must create a button to hide it.

🧾 **Example:**

```python
["showDialog", ["#dialog-tag", "start-top", "1rem", 8, True], ["#anchor", "end-bottom"], 0, 500]
```

💡 In offset values, an integer means pixels.

Anchor list structure:

```python
["#anchor", "position"]
```

➕ **Index 0:** Anchor selector (the element the dialog attaches to)<br>
➕ **Index 1:** Position of the anchor that the dialog attaches to

`position_X = "start, center, end"`  
`position_Y = "top, center, bottom"`

💡 `start` in LTR means left and in RTL means right. Positions can be combined:

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


🧾 **Nexelpy Example:**

```python
x.button("show", mouseenter=["showDialog", ["#dialog-tag", "start-center", 8, 0], ["this", "end-center"], 0, 1000])
with x.dialog(id="dialog-tag"):
   with x.div(Class="bg-light"):
      x.h2("this is dialog", Class="text-dark")
```
💡 The showDialog command clears the dialog tag's default style before showing and provides you with a container without background or extra styles.

```python
["hideDialog", "#dialog-tag", 0, 500]
```
In addition to selecting a real element, you can use the special values viewport and body for positioning.

Viewport selector: The dialog position is calculated relative to the browser window's visible area. For example, center-center displays it in the center of the visible screen; the position doesn't change with page scroll.<br>
Body selector: The dialog position is calculated relative to the entire page content; in a scrollable page, its position relates to the page content.

```python
["viewport", "center-center"]
["body", "center-center"]
click=["showDialog", ["#dialog-tag", "center-center", 0, 0, False], ["viewport", "center-center"], 0, 300]
```

💡 Viewport selector is a special value used instead of a real element selector; viewport refers to the browser's visible area, and body refers to the page content.

⚠️ The dialog command is not a replacement for modal: it has no backdrop or focus and doesn't block the page.

```python
mouseenter=["showDialog", ["#dialog-tag", "center-center"], ["#anchor", "center-center"]]
mouseleave=["hideDialog", "#dialog-tag"]
```

🛑 In this example, hovering over the anchor may cause the dialog content to show and hide repeatedly. This behavior is due to the event cycle: the dialog is placed on the anchor, triggering mouseleave, and its hiding re-triggers mouseenter. To prevent this, design the dialog's position and interactive area so this cycle doesn't occur.

---

## Modal Commands

Displays a modal in the center of the screen.

```python
["showModal", "selector", {"backdrop style"}, "auto hide", "delay", "duration"]
["hideModal", "selector", "delay", "duration"]
```

```python
click=["showModal", "#modal", {}, True, 0, 500]
click=["hideModal", "#modal", 0, 500]
```

If backdrop style is empty (`{}`), a black backdrop with 50 opacity and background blur is created. For a custom backdrop, enter your desired style as follows:

```python
{"backgroundColor": "white", "filter": "blur(2px)"}
```

💡 The showModal command clears the dialog tag's default style before showing and provides you with a container without background or extra styles.

🧾 **Nexelpy Example:**

```python
x.button("show modal", click=["showModal", "#modal", {}, True, 0, 500])
with x.dialog(id="modal"):
   with x.div(Class="bg-light w-50 h-50"):
      x.h2("this is modal", Class="text-dark")
      x.input(type="text", placeholder="First Name", autofocus=True)
```

💡 When `auto hide = True`, clicking the backdrop or pressing Escape closes the modal automatically. When `auto hide = False`, the dialog's native cancel event is blocked; Escape doesn't close it, and you must explicitly run the hideModal command to close it, for example via a Close button.

💡 The showModal command puts the dialog tag directly into the browser's Top Layer; meaning it renders above all page elements, even an element with z-index: 999999, and isn't clipped by parents' overflow: hidden.

---

## Collapse

The collapse command in QuickEvent is used to build Collapsible widgets; a pattern known in web design as a Disclosure Widget. This command works on the native HTML tag pair details and summary.

QuickEvent blocks the browser's default behavior and performs opening and closing with smooth animation (without jumping and with precise height calculation).

## Collapse Control Commands
For more flexibility, there are three commands to control collapse:

```python
["collapse", delay, duration]      # Open/close (Toggle)
["showCollapse", selector, delay, duration] # Always open
["hideCollapse", selector, delay, duration] # Always close
["toggleCollapse", selector, delay, duration] # Toggle from outside
```
collapse: Placed on the summary tag and opens or closes it when the user clicks.

showCollapse / hideCollapse / toggleCollapse: <br>
These commands take a selector and can control the collapse from outside (e.g., with a button).

```python
with x.details(id="my-details"):
   x.summary("Title")
   x.p("Hidden content")

x.button("Open", click=["showCollapse", "#my-details", 0, 300])
x.button("Close", click=["hideCollapse", "#my-details", 0, 300])
x.button("Toggle", click=["toggleCollapse", "#my-details", 0, 300])
```
💡 Note: During the animation (for the duration), the collapse is locked, and new clicks are ignored to prevent disruption and jumping.

## Ready Markers (Markers CSS)
To provide users with beautiful, professional markers without writing a single line of CSS, a separate CSS file called quickevent-markers.css is provided. This file must be loaded in the page's head tag.
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/NexeLinstance/quickevent@cdn/quickevent-markers.css">
```
After loading this file, you can change the marker appearance by adding classes to the summary tag:
If you use Nexelpy, you don't need to add the style file; this is done automatically.

### Single-Color Markers (Minimal)
These markers match the text color and are suitable for modern designs:

marker-plus: plus sign + / -

marker-chevron: arrow › / ˅

marker-caret: triangle ▾ / ▴

marker-arrow: arrow ← / ↓

marker-circle: circle ○ / ●

marker-triangle: triangle ▽ / △

marker-square: square □ / ■

marker-diamond: diamond ◇ / ◆

marker-star: star ☆ / ★

marker-heart: heart ♡ / ♥

marker-check: checkmark + / ×

### Emoji Markers (with Grayscale Filter)
To use colored emojis without cluttering the page appearance, use these markers. When the collapse is closed, the emoji is gray and faded, and when open, it becomes colored:

marker-lock: lock 🔒 / unlock 🔓

marker-folder: closed folder 📁 / open folder 📂

marker-doc: document 📄 / edit 📝

marker-theme: moon ☾ / sun ☀

### Marker Position (Positions)

By default, the marker is on the start side (left). To move it to the end (right), add the marker-end class:

marker-start (default)

marker-end

## Accordion
To link multiple collapses together and create accordion behavior (when one section opens, others with the same name close), use the accordion attribute on summary tags. When the value of this attribute is the same in multiple collapses, QuickEvent considers them as one group.

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
💡 To create multiple independent groups, give each group a different value (e.g., accordion="FAQ1" and accordion="FAQ2").

---
## submit event
The submit event must be written on the form tag to cancel the default behavior of sending the form traditionally and run your desired event. 💡
For example, instead of sending the form, run showDialog and get confirmation.

## 🪟 Window Access (without get command)

In QuickEvent, there's no need for an additional command to read browser information. Using the `{window.property}` syntax, you can directly access all standard properties of the `window` object in JavaScript.

> **Note:** Window values are always read at the moment the command executes. So if the user scrolls or resizes the page, the new value is read on the next click.

### 📍 Address and Routing (Location)
One of the most used sections is accessing the page address and its components.
```python
# Full page address
"{window.location.href}"

# Domain name
"{window.location.hostname}"

# Page path (without domain)
"{window.location.pathname}"

# Query string (after the question mark)
"{window.location.search}"

# Hash (after the # sign)
"{window.location.hash}"

# Protocol (http or https)
"{window.location.protocol}"
```

### 📏 Dimensions and Sizes
For responsive design and calculating page size:
```python
# Width and height of the visible area (Viewport) - includes scrollbar
"{window.innerWidth}"
"{window.innerHeight}"

# Width and height of the entire browser window
"{window.outerWidth}"
"{window.outerHeight}"

# Device physical pixel ratio (e.g., 1.5 for Retina)
"{window.devicePixelRatio}"
```

### 🖥️ Screen Specifications
User monitor information:
```python
# Width and height of the entire screen
"{window.screen.width}"
"{window.screen.height}"

# Usable width and height (without the Windows taskbar)
"{window.screen.availWidth}"
"{window.screen.availHeight}"
```

### 📜 Scroll Position
For implementing parallax or sticky effects:
```python
# Scroll amount on the horizontal axis
"{window.scrollX}"

# Scroll amount on the vertical axis
"{window.scrollY}"

# Older synonyms
"{window.pageXOffset}"
"{window.pageYOffset}"
```

### 🌐 Browser and OS Information (Navigator)
Detecting browser type, language, and connection status:
```python
# Browser identification string (User Agent)
"{window.navigator.userAgent}"

# Default browser language
"{window.navigator.language}"

# Operating system
"{window.navigator.platform}"

# Are cookies enabled?
"{window.navigator.cookieEnabled}"

# Is the user online?
"{window.navigator.onLine}"
```

### 📄 Document Information
Accessing general page information:
```python
# Page title (browser tab title)
"{window.document.title}"

# Full page address (synonym with href)
"{window.document.URL}"

# Address of the page the user came from
"{window.document.referrer}"

# Actual page content dimensions (without scrollbar)
"{window.document.documentElement.clientWidth}"
"{window.document.documentElement.clientHeight}"
```

### 📚 History
```python
# Number of pages the user has opened in this tab
"{window.history.length}"
```

---

### 💡 Practical Examples

**1. Displaying user scroll status:**
```html
<button click='["setText", "#status", "You have scrolled {window.scrollY} pixels"]'>
  Where am I?
</button>
```

**2. Detecting mobile or desktop (based on width):**
```html
<button click='[
  ["if", "{window.innerWidth < 768}", [
    ["setText", "#device", "You are using mobile"]
  ], [
    ["setText", "#device", "You are using desktop"]
  ]]
]'>
  Detect Device
</button>
```

**4. Warning before leaving the page (combined with `beforeunload`):**
```html
<body loadDom='[
  ["addAttr", "window", "onbeforeunload", "return confirm(\"Are you sure?\")"]
]'>
```


## 🎯 Smart Scoping (Scoping Selector)

In large projects, writing long and repetitive selectors (like `#sidebar .user-list .item`) is tedious and error-prone. QuickEvent has completely solved this problem with `{scopingSelector}`.

This feature allows you to mark a container (parent) with the `data-scoping` attribute. Then, using `{scopingSelector}` anywhere inside that container, it automatically refers to that parent.

### 📝 Syntax and Usage

1. Define the parent (Container):
```html
<div data-scoping="user-section">
  <p class="name">Ali</p>
  <button click='["setText", "{scopingSelector} .name", "Reza"]'>
    Change Name
  </button>
</div>
```

2. In the button above, when clicked, the `{scopingSelector}` expression is converted by QuickEvent to `[data-scoping="user-section"]`. 
As a result, the final selector for the `setText` command will be:
```css
[data-scoping="user-section"] .name
```

### ✨ Why Is This Feature Great?

1. **No Conflict:** If you have multiple boxes with the same class (e.g., `.name`) on the page, QuickEvent only changes the element inside its own box and leaves the rest untouched.
2. **Shorter Code:** No need to write complex nested selectors.
3. **Reusable Components:** You can write one HTML component and repeat it 10 times on the page. The buttons inside each component only affect their own content.

### 🔄 Nested Scoping
If inside a `data-scoping` there is another `data-scoping`, `{scopingSelector}` always finds the **nearest parent**.

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
In the code above, the Inner button refers to `[data-scoping="inner"]`, not `outer`.

### 🛠️ Usage in Different Commands
This feature is an evaluated variable (like `{window.innerWidth}`), so it works in **all commands** (Effect, Source, and Flow):

**In `if`:**
```html
<button click='[
  ["if", "{ window.innerWidth > 768 }", [
    ["setText", "{scopingSelector} .layout", "Desktop Mode"]
  ]]
]'>Check Layout</button>
```

**In `getText` (reading value):**
```html
<button click='[
  ["getText", "{scopingSelector} .username", "name"],
  ["log", "User: {name}"]
]'>Read Username</button>
```

### ⚠️ What If the Scope Is Not Found?
If you use `{scopingSelector}` in an element that has no parent with the `data-scoping` attribute, this variable returns `null` (or an empty string).
To prevent unwanted errors, QuickEvent logs a Warning in the browser console so the developer knows they forgot the scope.



### 📌 Note: `{scopingSelector}` under the hood uses `element.closest('[data-scoping]')`. This means even if the button is 10 levels deep inside the box, it correctly finds the main parent.