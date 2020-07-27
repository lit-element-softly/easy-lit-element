# Easy Lit Element

This project provides **standalone**(*) versions of:
- [LitElement](https://lit-element.polymer-project.org/) 
- [Pwa Helpers](https://github.com/Polymer/pwa-helpers)
- [Redux](https://redux.js.org/)

🎉 (*) That means you don't need to build anything to start playing with LitElement.

> 🖐️ I use **[Snowpack](https://www.snowpack.dev/)** to generate these files.

You just need these 2 files:

- `lit-element.js` **v2.3.1**
- `pwa-helpers.js` **v0.9.1** (optional, but useful if you need a router... and other tools)
- `redux.js` **v4.0.5** (optional, but useful for state management)

## How to use it?

Create a project structure like that:

```bash
.
└── public
   ├── components
   │  └── MainApplication.js
   ├── index.html
   └── js
      ├── lit-element.js
      ├── pwa-helpers.js
      └── redux.js
```

> **index.html**

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Hello World!</title>
  </head>
  <body>
    <main-application></main-application>
  </body>

  <script type="module">
    import {} from '/components/MainApplication.js'
  </script>
</html>  
```

> **/components/MainApplication.js**

```javascript
import { LitElement, html } from '../js/lit-element.js'
import { installRouter } from '../js/pwa-helpers.js'

export class MainApplication extends LitElement {

  constructor() {
    super()
    // only if you want to use the router of pwa-helpers
    installRouter((location) => {
      console.log(location.hash)
    })
  }

  render() {
    return html`
      <div>
        <h1>🖖 live long and prosper 🌍</h1>
      </div>
    `
  }
}

customElements.define('main-application', MainApplication)
```

Then serve the webapp with the http server of your choice (for example: [http-server](https://github.com/http-party/http-server)). That's all 🎉 

## How to use it with `redux.js`?

First, create `store.js` file:

```bash
.
└── public
   ├── components
   │  ├── MainApplication.js
   │  └── store.js 🖐️
   ├── index.html
   └── js
      ├── lit-element.js
      ├── pwa-helpers.js
      └── redux.js
```

> **/components/store.js**

```javascript
import { createStore } from '../js/redux.js'

// reducer
function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

// Create and export store so 
//it can be imported and shared by app elements
export const store = createStore(counterReducer)
```

Then update `MainApplication.js` like that:


> **/components/MainApplication.js**

```javascript
import { LitElement, html } from '../js/lit-element.js'
import { installRouter } from '../js/pwa-helpers.js'

import { store } from './store.js' 🖐️

export class MainApplication extends LitElement {

  constructor() {
    super()
    installRouter((location) => {
      console.log(location.hash)
    })
  }

  static get properties(){
    return {
      counter: Number
    }
  }

  // initialize at first change
  firstUpdated(changedProperties) { // 🖐️ it's a lit-element event
    this.counter = store.getState()
    store.subscribe(() => {
      this.counter = store.getState()
    })
  }

  render() {
    return html`
      <div>
        <h1>🖖 live long and prosper 🌍</h1>
        <h1>
          ${this.counter}
        </h1> 
        <button @click="${this.onClickPlus}">😃 Increment</button>
        <button @click="${this.onClickMinus}">😠 Decrement</button>
      </div>
    `
  }

  onClickPlus() {
    store.dispatch({ type: 'INCREMENT' })
  }

  onClickMinus() {
    store.dispatch({ type: 'DECREMENT' })
  }
}

customElements.define('main-application', MainApplication)
```

