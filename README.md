# Polyfill for svh, dvh, lvh viewport units

This polyfile is needed to support svh, dvh, lvh units in older browsers. Basically, support is needed for mobile devices, which do not yet have such extensive support, but the polyfile also takes into account situations when a user may have a fairly old version of a browser that does not have support.

> ⚠️**At the moment, the library is ready for use, but there may be cases that were not taken into account during the tests, pay attention to this**

## How it works

The polyfile adds a custom property, in the form of 1 unit (`--1svh`, `--1dvh`, `--1lvh`). These units are updated automatically when the screen size changes, when the device orientation changes, and set values at initial boot. The polyfile takes into account the SSR. It is possible to install the necessary units yourself

## How to use

### 1. Install the package

```shell
npm install vh-unit-support
```

### 2. Set polifyll

```js
import initVHPolyfill from "vh-unit-support";

// All 3 units will be generated
initVHPolyfill();

// If necessary, specify the parameters you need and only they will be generated
initVHPolyfill(["svh", "dvh"]);
```

### 3. Write CSS

```css
.dvh-element {
  height: calc(var(--1dvh, 1vh) * 50); /* polyfill create 50dvh; */
  height: 50dvh; /* will be used if supported */
}
```

> An important point is that the polyfil must be higher than the standard use in order to correctly work out the specificity

### 4. Bonus for preprocessor

```scss
// An example of a function on SCSS

@function viewport-height($height, $unit) {
  @return calc(var(--1#{$unit}, 1vh) * #{$height});
}

.element {
  --42dvh: viewport-height(42, "dvh");
  height: var(--42dvh);
}

// or

.element {
  height: viewport-height(42, "dvh");
}
```
