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
            console.log('Dates differ');
            return `/local/community/xkcd-card-ha/xkcd.png?_ts=${this.lastFetchDate}`;
        }
    }

async updateContent() {
    const data = await this.fetchData(); // Fetch the JSON data
    const currentDate = new Date();
    const uniqueTimestamp = currentDate.getTime(); // Unique timestamp as a more reliable cache buster

    // Use the fetched data directly rather than encoding it into the URL
    const imageUrl = `/local/community/xkcd-card-ha/xkcd.png?_ts=${uniqueTimestamp}`;

    // Update the content to include the image and directly set the ALT text in the DOM
    this.content.innerHTML = `
        <style>
            .alt-text {
                display: none; // Initially hide the ALT text
                color: black;
                text-align: center;
                padding: 5px 0;
                position: absolute;
                bottom: 10px;
                width: 100%;
                background: rgba(255, 255, 255, 0.7);
            }

            .image-container:hover .alt-text {
                display: block; // Show the ALT text on hover
            }
        </style>
        <div class="image-container" style="position: relative; cursor: pointer;">
            <img src="${imageUrl}" style="width: 100%;">
            <div class="alt-text">${data.alt_text}</div> <!-- Directly inject the ALT text -->
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
