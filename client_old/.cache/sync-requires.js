const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/home/blaz/plac/client/.cache/dev-404-page.js"))),
  "component---src-pages-home-components-event-form-event-form-js": hot(preferDefault(require("/home/blaz/plac/client/src/pages/Home/components/EventForm/EventForm.js"))),
  "component---src-pages-home-components-event-form-index-js": hot(preferDefault(require("/home/blaz/plac/client/src/pages/Home/components/EventForm/index.js"))),
  "component---src-pages-home-home-js": hot(preferDefault(require("/home/blaz/plac/client/src/pages/Home/Home.js"))),
  "component---src-pages-home-index-js": hot(preferDefault(require("/home/blaz/plac/client/src/pages/Home/index.js"))),
  "component---src-pages-login-index-js": hot(preferDefault(require("/home/blaz/plac/client/src/pages/Login/index.js"))),
  "component---src-pages-login-login-js": hot(preferDefault(require("/home/blaz/plac/client/src/pages/Login/Login.js")))
}

