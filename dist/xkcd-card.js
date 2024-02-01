class XKCDcard extends HTMLElement {

    config;
    content;
    lastFetchDate = new Date().getDate(); // Initialize lastFetchDate as a class property

    // required
    setConfig(config) {
        this.config = config;
    }

    async fetchData() {
        const response = await fetch('/local/community/xkcd-card-ha/xkcd_data.json');
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
            console.log('Dates equal');
            return `/local/community/xkcd-card-ha/xkcd.png?_ts=${currentDate}`;
        } else {
            // If the dates are the same, no need to update the image
            return `/local/community/xkcd-card-ha/xkcd.png?_ts=${this.lastFetchDate}`;
            console.log('Dates differ');
        }
    }

 async updateContent() {
        const imageUrl = this.getImageUrl(); // Call getImageUrl as a method of this class
        const data = await this.fetchData(); // Fetch the JSON data

        // Encode the ALT text as a URL parameter
        const altTextParam = encodeURIComponent(data.alt_text);

        // Update the content to include the image with the ALT text as a parameter
        this.content.innerHTML = `
            <style>
                .alt-text {
                    visibility: hidden;
                    color: black;
                    text-align: center;
                    padding: 5px 0;
                    position: absolute;
                    bottom: 10px;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.7);
                    transition: visibility 0.2s, opacity 0.2s linear;
                }

                .image-container:hover .alt-text {
                    visibility: visible;
                    opacity: 1;
                }
            </style>
            <div class="image-container" style="position: relative; cursor: pointer;">
                <img src="${imageUrl}&alt_text=${altTextParam}" style="width: 100%;" onload="this.nextElementSibling.innerHTML = decodeURIComponent(this.src.split('alt_text=')[1])">
                <div class="alt-text"></div>
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
             console.info(`%c XKCD-CARD-HA`, "color: white; font-weight: bold; background: purple");
            console.log(imageUrl);
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
