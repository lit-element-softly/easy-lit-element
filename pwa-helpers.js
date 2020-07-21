/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
  This is a JavaScript mixin that you can use to connect a Custom Element base
  class to a Redux store. The `stateChanged(state)` method will be called when
  the state is updated.

  Example:

      import { connect } from 'pwa-helpers/connect-mixin.js';

      class MyElement extends connect(store)(HTMLElement) {
        stateChanged(state) {
          this.textContent = state.data.count.toString();
        }
      }
*/
const connect = (store) => (baseElement) => class extends baseElement {
    connectedCallback() {
        if (super.connectedCallback) {
            super.connectedCallback();
        }
        this._storeUnsubscribe = store.subscribe(() => this.stateChanged(store.getState()));
        this.stateChanged(store.getState());
    }
    disconnectedCallback() {
        this._storeUnsubscribe();
        if (super.disconnectedCallback) {
            super.disconnectedCallback();
        }
    }
    /**
     * The `stateChanged(state)` method will be called when the state is updated.
     */
    stateChanged(_state) { }
};

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
  A Redux store enhancer that lets you lazy-install reducers after the store
  has booted up. Use this if your application lazy-loads routes that are connected
  to a Redux store.

  Example:

      import { combineReducers } from 'redux';
      import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';
      import someReducer from './reducers/someReducer.js';

      export const store = createStore(
        (state, action) => state,
        compose(lazyReducerEnhancer(combineReducers))
      );

  Then, in your page/element, you can lazy load a specific reducer with:

      store.addReducers({
        someReducer
      });
*/
const lazyReducerEnhancer = (combineReducers) => {
    const enhancer = (nextCreator) => {
        return (origReducer, preloadedState) => {
            let lazyReducers = {};
            const nextStore = nextCreator(origReducer, preloadedState);
            return Object.assign({}, nextStore, { addReducers(newReducers) {
                    const combinedReducerMap = Object.assign({}, lazyReducers, newReducers);
                    this.replaceReducer(combineReducers(lazyReducers = combinedReducerMap));
                } });
        };
    };
    return enhancer;
};

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
  Utility method that calls a callback whenever a media-query matches in response
  to the viewport size changing. The callback should take a boolean parameter
  (with `true` meaning the media query is matched).

  Example:

      import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';

      installMediaQueryWatcher(`(min-width: 600px)`, (matches) => {
        console.log(matches ? 'wide screen' : 'narrow sreen');
      });
*/
const installMediaQueryWatcher = (mediaQuery, layoutChangedCallback) => {
    let mql = window.matchMedia(mediaQuery);
    mql.addListener((e) => layoutChangedCallback(e.matches));
    layoutChangedCallback(mql.matches);
};

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
  Utility method that updates the page's open graph and Twitter card metadata.
  It takes an object as a parameter with the following properties:
  title | description | url | image.

  If the `url` is not specified, `window.location.href` will be used; for
  all other properties, if they aren't specified, then that metadata field will not
  be set.

  Example (in your top level element or document, or in the router callback):

      import { updateMetadata } from 'pwa-helpers/metadata.js';

      updateMetadata({
        title: 'My App - view 1',
        description: 'This is my sample app',
        url: window.location.href,
        image: '/assets/view1-hero.png'
      });

*/
const updateMetadata = ({ title, description, url, image, imageAlt }) => {
    if (title) {
        document.title = title;
        setMetaTag('property', 'og:title', title);
    }
    if (description) {
        setMetaTag('name', 'description', description);
        setMetaTag('property', 'og:description', description);
    }
    if (image) {
        setMetaTag('property', 'og:image', image);
    }
    if (imageAlt) {
        setMetaTag('property', 'og:image:alt', imageAlt);
    }
    url = url || window.location.href;
    setMetaTag('property', 'og:url', url);
};
/**
  Utility method to create or update the content of a meta tag based on an
  attribute name/value pair.

  Example (in your top level element or document, or in the router callback):

      import { setMetaTag } from 'pwa-helpers/metadata.js';

      setMetaTag('name', 'twitter:card', 'summary');
      
  This would create the following meta tag in the head of the document (or
  update the content attribute if a meta tag with name="twitter:card" exists):

      <meta name="twitter:card" content="summary">

*/
function setMetaTag(attrName, attrValue, content) {
    let element = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content || '');
}

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
  Utility method that calls a callback whenever the network connectivity of the app changes.
  The callback should take a boolean parameter (with `true` meaning
  the network is offline, and `false` meaning online)

  Example:

      import { installOfflineWatcher } from 'pwa-helpers/network.js';

      installOfflineWatcher((offline) => {
        console.log('You are ' + offline ? ' offline' : 'online');
      });
*/
const installOfflineWatcher = (offlineUpdatedCallback) => {
    window.addEventListener('online', () => offlineUpdatedCallback(false));
    window.addEventListener('offline', () => offlineUpdatedCallback(true));
    offlineUpdatedCallback(navigator.onLine === false);
};

/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
/**
  Basic router that calls a callback whenever the location is updated.

  Example:

      import { installRouter } from 'pwa-helpers/router.js';

      installRouter((location) => handleNavigation(location));

  For example, if you're using this router in a Redux-connected component,
  you could dispatch an action in the callback:

      import { installRouter } from 'pwa-helpers/router.js';
      import { navigate } from '../actions/app.js';

      installRouter((location) => store.dispatch(navigate(location)))

  If you need to force a navigation to a new location programmatically, you can
  do so by pushing a new state using the History API, and then manually
  calling the callback with the new location:

      window.history.pushState({}, '', '/new-route');
      handleNavigation(window.location);

  Optionally, you can use the second argument to read the event that caused the
  navigation. For example, you may want to scroll to top only after a link click.

      installRouter((location, event) => {
        // Only scroll to top on link clicks, not popstate events.
        if (event && event.type === 'click') {
          window.scrollTo(0, 0);
        }
        handleNavigation(location);
      });
*/
const installRouter = (locationUpdatedCallback) => {
    document.body.addEventListener('click', e => {
        if (e.defaultPrevented || e.button !== 0 ||
            e.metaKey || e.ctrlKey || e.shiftKey)
            return;
        const anchor = e.composedPath().filter(n => n.tagName === 'A')[0];
        if (!anchor || anchor.target ||
            anchor.hasAttribute('download') ||
            anchor.getAttribute('rel') === 'external')
            return;
        const href = anchor.href;
        if (!href || href.indexOf('mailto:') !== -1)
            return;
        const location = window.location;
        const origin = location.origin || location.protocol + '//' + location.host;
        if (href.indexOf(origin) !== 0)
            return;
        e.preventDefault();
        if (href !== location.href) {
            window.history.pushState({}, '', href);
            locationUpdatedCallback(location, e);
        }
    });
    window.addEventListener('popstate', e => locationUpdatedCallback(window.location, e));
    locationUpdatedCallback(window.location, null /* event */);
};

export { connect, installMediaQueryWatcher, installOfflineWatcher, installRouter, lazyReducerEnhancer, setMetaTag, updateMetadata };
