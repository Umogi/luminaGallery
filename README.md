# LuminaGallery

LuminaGallery is a lightweight, dependency-free JavaScript lightbox gallery for modern web applications. It transforms a grid of images into an interactive fullscreen gallery with smooth animations, keyboard navigation, and optional image metadata.

The library is designed to be simple to integrate while remaining flexible and performant.

---

## Features

* Lightweight and dependency-free
* Easy initialization
* Dynamic lightbox creation
* Smooth image transitions
* Keyboard navigation
* Image caption and author support
* Responsive layout
* Lazy-loading compatible
* Automatic scroll locking while open

---

## Installation

### npm

```bash
npm install luminagallery
```

### Import

```javascript
import { LuminaGallery } from "luminagallery";

document.addEventListener("DOMContentLoaded", () => {
  new LuminaGallery(".js-gallery-item");
});
```

---

## Basic Usage

### HTML Markup

Create a gallery grid with image elements. LuminaGallery reads metadata from `data-*` attributes.

```html
<div class="gallery-grid">
  <div class="gallery-item">
    <img
      class="js-gallery-item"
      src="thumbnail.jpg"
      data-highres="image-large.jpg"
      data-caption="Image description"
      data-author="Photographer Name"
      alt="Image description"
      loading="lazy"
    />
  </div>
</div>
```

### Initialize the Gallery

```javascript
import { LuminaGallery } from "luminagallery";

new LuminaGallery(".js-gallery-item");
```
or
```javascript
import { LuminaGallery } from "luminaGallery";

Object.assign(window, {
    LuminaGallery
});
```
---

## Data Attributes

LuminaGallery uses HTML `data-*` attributes to configure images.

| Attribute      | Description                          |
| -------------- | ------------------------------------ |
| `data-highres` | High resolution version of the image |
| `data-caption` | Caption displayed in the info panel  |
| `data-author`  | Photographer or author credit        |
| `alt`          | Image accessibility description      |

If `data-highres` is not provided, the `src` value will be used.

---

## Keyboard Controls

| Key        | Action             |
| ---------- | ------------------ |
| Escape     | Close the lightbox |
| ArrowRight | Next image         |
| ArrowLeft  | Previous image     |

---

## Lightbox Controls

The generated lightbox includes:

* Close button
* Image counter
* Navigation arrows
* Toggleable information panel
* Caption and author display

---

## Example

```javascript
import { LuminaGallery } from "luminagallery";

const gallery = new LuminaGallery(".js-gallery-item");
```

---

## How It Works

LuminaGallery scans the document for images matching the provided selector and stores their metadata internally. When an image is clicked, a lightbox interface is dynamically injected into the DOM.

The lightbox is fully removed when closed to avoid memory leaks and keep the page lightweight.

---

## Requirements

LuminaGallery works in modern browsers supporting:

* ES6 modules
* `classList`
* `dataset`
* `querySelectorAll`
* CSS transitions

---

## License

MIT License
