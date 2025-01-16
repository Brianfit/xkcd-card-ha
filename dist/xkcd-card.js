class XKCDcard extends HTMLElement {

    config;
    content;
    lastFetchDate = new Date().getDate(); // Initialize lastFetchDate as a class property

    // required
    setConfig(config) {
        this.config = config;
    }

    async fetchData() {
        const response = await fetch('/local/community/xkcd-card-ha/xkcd_data.json', { cache: 'no-cache' });
        const data = await response.json();
        return data;
    }

    // Method to get the image URL
    getImageUrl() {
        const currentDate = new Date().getDate();

        // Check if the current date is different from the last fetch date
        if (currentDate !== this.lastFetchDate) {
            this.lastFetchDate = currentDate; // Update the last fetch date
            // Fetch and update the image URL with the current date
            return `/local/community/xkcd-card-ha/xkcd.png?_ts=${currentDate}`;
        } else {
            // If the dates are the same, no need to update the image
            return `/local/community/xkcd-card-ha/xkcd.png?_ts=${this.lastFetchDate}`;
        }
    }
    async updateContent() {
        const imageUrl = this.getImageUrl();
        const data = await this.fetchData();

        this.content.innerHTML = `
            <style>
                /* Scoped to the XKCD card only */
                ha-card .xkcd-alt-text {
                    color: white;
                    background-color: rgba(0, 0, 0, 0.8); /* Slight transparency */
                    text-align: center;
                    padding: 15px; /* Better spacing */
                    margin-top: 10px;
                    font-size: 16px; /* Improved readability */
                    line-height: 1.6;
                    border-radius: 8px; /* Rounded corners */
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5); /* Subtle shadow */
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }
                ha-card .xkcd-image-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                ha-card .xkcd-alt-text a {
                    color: #add8e6; /* Light blue for links */
                    text-decoration: none;
                }
                ha-card .xkcd-alt-text a:hover {
                    text-decoration: underline;
                }
            </style>
            <div class="xkcd-image-container">
                <a href="${imageUrl}" target="_blank" title="Open image in a new window">
                    <img src="${imageUrl}" style="width: 100%;" alt="xkcd comic">
                </a>
                <div class="xkcd-alt-text">
                    Comic #${data.comic_number}
                    <em>${data.date}</em><br>
                    ${data.alt_text}<br><em><div style="font-size:x-small">
                    <a href="${data.explain_url}" target="_blank">Explain</a></em></div>
                </div>
            </div>
        `;
    }


 set hass(hass) {
        if (!this.content) {
            this.innerHTML = `
                <ha-card>
                    <div id="content"></div>
                </ha-card>`;
            this.content = this.querySelector('#content');
        }

        // Call the asynchronous method to update the content
        this.updateContent().catch(error => console.error('Failed to update content:', error));
    }


    getCardSize() {
        return 3;
    }
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "xkcd-card",
    name: "xkcd",
    description: "Your daily(xkcd).pull" // optional
});

customElements.define('xkcd-card', XKCDcard);