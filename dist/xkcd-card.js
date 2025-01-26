class XKCDcard extends HTMLElement {
    // Class properties
    config;
    content;
    lastFetchDate = null;
    lastImageUrl = null;
    lastData = null;
    updateTimer = null;
    debounceTimeout = null;
    initialized = false;

    // Required config setter
    setConfig(config) {
        this.config = config;
    }

    // Connected callback for proper initialization
    connectedCallback() {
        if (!this.initialized) {
            this.initialized = true;
            this.initializeCard();
        }
    }

    // Initialize card structure and content
    async initializeCard() {
        const card = document.createElement('ha-card');
        this.content = document.createElement('div');
        this.content.id = 'content';
        card.appendChild(this.content);
        this.appendChild(card);

        // Show loading state
        this.content.innerHTML = `
            <style>
                .loading-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 200px;
                }
            </style>
            <div class="loading-container">
                Loading XKCD comic...
            </div>
        `;

        // Initial content update
        await this.updateContent();

        // Set up periodic refresh every hour
        setInterval(() => {
            this.updateContent();
        }, 3600000); // Every hour
    }

    // Debounced fetch implementation
    async fetchDataDebounced() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        return new Promise((resolve) => {
            this.debounceTimeout = setTimeout(async () => {
                try {
                    if (!this.lastData) {
                        const response = await fetch('/local/community/xkcd-card-ha/xkcd_data.json', {
                            cache: 'no-cache'
                        });
                        this.lastData = await response.json();
                    }
                    resolve(this.lastData);
                } catch (error) {
                    console.error('Failed to fetch XKCD data:', error);
                    this.content.innerHTML = `
                        <div style="color: red; padding: 16px;">
                            Failed to load XKCD comic. Please check your connection.
                        </div>
                    `;
                    resolve(null);
                }
            }, 250); // 250ms debounce delay
        });
    }

    // Get image URL with caching
    getImageUrl() {
        const timestamp = new Date().getTime();
        this.lastImageUrl = `/local/community/xkcd-card-ha/xkcd.png?_ts=${timestamp}`;
        return this.lastImageUrl;
    }

    // Optimized content update with state checking
    async updateContent() {
        // Prevent multiple simultaneous updates
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }

        this.updateTimer = setTimeout(async () => {
            const imageUrl = this.getImageUrl();
            const data = await this.fetchDataDebounced();

            if (!data) return;

            // Only update DOM if content has changed
            const newContent = `
                <style>
                    ha-card .xkcd-alt-text {
                        color: white;
                        background-color: rgba(0, 0, 0, 0.8);
                        text-align: center;
                        padding: 15px;
                        margin-top: 10px;
                        font-size: 12px;
                        line-height: 1.6;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }
                    ha-card .xkcd-image-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    ha-card .xkcd-alt-text a {
                        color: #add8e6;
                        text-decoration: none;
                    }
                    ha-card .xkcd-alt-text a:hover {
                        text-decoration: underline;
                    }
                    ha-card img {
                        width: 100%;
                        height: auto;
                        display: block;
                    }
                    ha-card .smoll {
                        color: #add8e6;
                        font-size: x-small;
                    }
                    /* Modal styles */
                    .modal {
                        display: none; 
                        position: fixed; 
                        z-index: 1000; 
                        left: 0; 
                        top: 0; 
                        width: 100%; 
                        height: 100%; 
                        overflow: auto; 
                        background-color: rgba(0, 0, 0, 0.8); 
                    }
                    .modal-content {
                        margin: 10% auto;
                        display: block;
                        width: 50%; /* 50% larger size */
                    }
                    .modal-content img {
                        width: 100%;
                        height: auto;
                    }
                    .close {
                        position: absolute;
                        top: 15px;
                        right: 25px;
                        color: #ffffff;
                        font-size: 24px;
                        font-weight: bold;
                        cursor: pointer;
                    }
                </style>
                <div class="xkcd-image-container">
                    <img id="xkcd-comic" src="${imageUrl}" alt="xkcd comic" loading="lazy">
                    <div class="xkcd-alt-text">
                        <strong>${data.title}</strong>
                        <div class="smoll">
                            Comic #${data.comic_number}
                            <em>${data.date}</em>
                        </div>
                        ${data.alt_text}<br>
                        <em>
                            <div class="smoll">
                                <a href="#" id="embiggen-link">Embiggen</a>&nbsp;&nbsp;&nbsp;           
                                <a href="https://buymeacoffee.com/brianfit" target="_blank">☕️</a>&nbsp;&nbsp;&nbsp;    
                                <a href="${data.explain_url}" target="_blank">Explain</a>
                            </div>
                        </em>
                    </div>
                </div>
                <!-- Modal structure -->
                <div id="xkcd-modal" class="modal">
                    <span id="close-modal" class="close">&times;</span>
                    <div class="modal-content">
                        <img src="${imageUrl}" alt="xkcd comic enlarged">
                    </div>
                </div>
            `;

            this.content.innerHTML = newContent;

            // Add modal functionality
            const modal = this.content.querySelector('#xkcd-modal');
            const embiggenLink = this.content.querySelector('#embiggen-link');
            const closeModal = this.content.querySelector('#close-modal');

            // Open modal on "Embiggen" link click
            embiggenLink.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'block';
            });

            // Close modal on close button click
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // Close modal on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }, 100); // Small delay to batch rapid updates
    }

    // Simplified hass setter that only triggers initialization
    set hass(hass) {
        if (!this.initialized) {
            this.connectedCallback();
        }
    }

    getCardSize() {
        return 3;
    }

    // Cleanup on disconnect
    disconnectedCallback() {
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
    }
}

// Register the custom element
customElements.define('xkcd-card', XKCDcard);

// Register card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
    type: "xkcd-card",
    name: "xkcd",
    description: "Your daily(xkcd).pull"
});