export class LuminaGallery {
    constructor(selector = '.js-gallery-item') {
        this.selector = selector;
        this.galleryNodes = document.querySelectorAll(this.selector);
        this.galleryData = [];
        this.currentIndex = 0;
        this.isOpen = false;
        this.showInfo = false;
        this.dom = {};

        // Bind the global keydown handler so it can be added/removed properly
        this.handleKeyDown = this.handleKeyDown.bind(this);

        // Initialize base event listeners on the thumbnail images
        if (this.galleryNodes.length > 0) {
            this.initBase();
        }
    }

    initBase() {
        // Parse HTML dataset into internal state array and add click triggers
        this.galleryData = Array.from(this.galleryNodes).map((node, index) => {
            node.addEventListener('click', () => this.open(index));
            return {
                highres: node.dataset.highres || node.src,
                caption: node.dataset.caption || 'Untitled Image',
                author: node.dataset.author || 'Unknown Author',
                alt: node.alt || ''
            };
        });
    }

    // Injects the markup into the DOM dynamically when opened
    buildLightbox() {
        if (document.getElementById('js-lightbox')) return; // Prevent duplicates

        const lightboxMarkup = `
                    <div id="js-lightbox" class="lightbox lightbox-hidden">
                        <!-- Top Bar Controls -->
                        <div class="lightbox-topbar">
                            <div id="js-counter" class="lightbox-counter">1 / 1</div>
                            <div class="lightbox-controls">
                                <button id="js-btn-info" class="btn-icon" title="Toggle Info">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                </button>
                                <button id="js-btn-close" class="btn-icon" title="Close (Esc)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </div>
                        </div>

                        <!-- Navigation Arrows -->
                        <button id="js-btn-prev" class="btn-icon btn-nav btn-prev" title="Previous (Left Arrow)">
                            <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="rotate: 180deg">
                                <path d="M9 20L17 12L9 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                            
                        <button id="js-btn-next" class="btn-icon btn-nav btn-next" title="Next (Right Arrow)">
                            <svg width="25px" height="25px" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 20L17 12L9 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>

                        <!-- Main Image Container -->
                        <div id="js-backdrop" class="lightbox-backdrop"></div>
                        
                        <div class="lightbox-content">
                            <img id="js-main-img" src="" alt="" class="lightbox-img img-zoomed-out" draggable="false" />
                            <!-- Image Caption/Info Panel -->
                            <div id="js-info-panel" class="info-panel info-hidden">
                                <h3 id="js-info-title" class="info-title"></h3>
                                <p class="info-author">Captured by <span id="js-info-author"></span></p>
                            </div>
                        </div>
                    </div>
                `;

        document.body.insertAdjacentHTML('beforeend', lightboxMarkup);

        // Cache DOM nodes now that they exist
        this.dom = {
            lightbox: document.getElementById('js-lightbox'),
            backdrop: document.getElementById('js-backdrop'),
            img: document.getElementById('js-main-img'),
            counter: document.getElementById('js-counter'),
            infoPanel: document.getElementById('js-info-panel'),
            infoTitle: document.getElementById('js-info-title'),
            infoAuthor: document.getElementById('js-info-author'),
            btnInfo: document.getElementById('js-btn-info'),
            btnClose: document.getElementById('js-btn-close'),
            btnPrev: document.getElementById('js-btn-prev'),
            btnNext: document.getElementById('js-btn-next'),
        };

        // Bind events to the newly created DOM elements
        this.dom.btnClose.addEventListener('click', () => this.close());
        this.dom.backdrop.addEventListener('click', () => this.close());
        this.dom.btnNext.addEventListener('click', (e) => this.next(e));
        this.dom.btnPrev.addEventListener('click', (e) => this.prev(e));

        this.dom.btnInfo.addEventListener('click', () => {
            this.showInfo = !this.showInfo;
            this.updateInfoState();
        });

        // Attach global keyboard listener
        window.addEventListener('keydown', this.handleKeyDown);
    }

    // Removes the markup from the DOM completely
    destroyLightbox() {
        // Remove global event listener to prevent memory leaks
        window.removeEventListener('keydown', this.handleKeyDown);

        // Remove DOM node
        if (this.dom.lightbox) {
            this.dom.lightbox.remove();
        }

        // Clear cache
        this.dom = {};
        this.isOpen = false;
    }

    handleKeyDown(e) {
        if (!this.isOpen) return;
        switch (e.key) {
            case 'Escape': this.close(); break;
            case 'ArrowRight': this.next(); break;
            case 'ArrowLeft': this.prev(); break;
        }
    }

    updateUI() {
        const data = this.galleryData[this.currentIndex];

        // Cross-fade if already open and switching
        if (this.isOpen && this.dom.img.src !== data.highres && this.dom.img.src !== '') {
            this.dom.img.classList.remove('img-zoomed-in');
            this.dom.img.classList.add('img-zoomed-out');

            setTimeout(() => {
                this.dom.img.src = data.highres;
                this.dom.img.alt = data.alt;
                this.dom.counter.textContent = `${this.currentIndex + 1} / ${this.galleryData.length}`;
                this.dom.infoTitle.textContent = data.caption;
                this.dom.infoAuthor.textContent = data.author;

                this.dom.img.classList.remove('img-zoomed-out');
                this.dom.img.classList.add('img-zoomed-in');
            }, 200);
        } else {
            // Standard load when opening
            this.dom.img.src = data.highres;
            this.dom.img.alt = data.alt;
            this.dom.counter.textContent = `${this.currentIndex + 1} / ${this.galleryData.length}`;
            this.dom.infoTitle.textContent = data.caption;
            this.dom.infoAuthor.textContent = data.author;
        }
    }

    updateInfoState() {
        if (this.showInfo) {
            this.dom.infoPanel.classList.remove('info-hidden');
            this.dom.infoPanel.classList.add('info-visible');
            this.dom.btnInfo.classList.add('active');
        } else {
            this.dom.infoPanel.classList.remove('info-visible');
            this.dom.infoPanel.classList.add('info-hidden');
            this.dom.btnInfo.classList.remove('active');
        }
    }

    open(index) {
        this.currentIndex = index;
        this.isOpen = true;
        this.showInfo = false;

        // Build DOM and attach listeners
        this.buildLightbox();

        this.updateInfoState();
        this.updateUI();

        // Double RequestAnimationFrame ensures the browser paints the injected DOM
        // before we trigger the CSS transition classes
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.dom.lightbox.classList.remove('lightbox-hidden');
                this.dom.lightbox.classList.add('lightbox-visible');

                setTimeout(() => {
                    this.dom.img.classList.remove('img-zoomed-out');
                    this.dom.img.classList.add('img-zoomed-in');
                }, 50);
            });
        });

        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    close() {
        if (!this.isOpen) return;

        // Animate out
        this.dom.lightbox.classList.remove('lightbox-visible');
        this.dom.lightbox.classList.add('lightbox-hidden');

        this.dom.img.classList.remove('img-zoomed-in');
        this.dom.img.classList.add('img-zoomed-out');

        document.body.style.overflow = ''; // Unlock scroll

        // Wait for the 500ms CSS transition to finish, then destroy the DOM completely
        setTimeout(() => {
            this.destroyLightbox();
        }, 500);
    }

    next(e) {
        if (e) e.stopPropagation();
        this.currentIndex = (this.currentIndex === this.galleryData.length - 1) ? 0 : this.currentIndex + 1;
        this.updateUI();
    }

    prev(e) {
        if (e) e.stopPropagation();
        this.currentIndex = (this.currentIndex === 0) ? this.galleryData.length - 1 : this.currentIndex - 1;
        this.updateUI();
    }
}