# Easy Lit Element

This project provides standalone versions of [LitElement](https://lit-element.polymer-project.org/) and [Pwa Helpers](https://github.com/Polymer/pwa-helpers). That means you don't need to build anything to start playing with LitElement.

> 🖐️ I use **[Snowpack](https://www.snowpack.dev/)** to generate these two files.

You just need these 2 files:

- `lit-element.js` **v2.3.1**
- `pwa-helpers.js` **v0.9.1** (optional, but useful if you need a router)

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
      └── pwa-helpers.js
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



