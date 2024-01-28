class XKCDcard extends HTMLElement {

    config;
    content;
    lastFetchDate = new Date().getDate(); // Initialize lastFetchDate as a class property

    // required
    setConfig(config) {
        this.config = config;
    }

    async fetchData() {
        const response = await fetch('./xkcd_data.json');
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

    async set hass(hass) {
        if (!this.content) {
            this.innerHTML = `
                <ha-card>
                    <div id="content"></div>
                </ha-card>`;
            this.content = this.querySelector('#content');
        }

        const imageUrl = this.getImageUrl(); // Call getImageUrl as a method of this class
        const data = await this.fetchData(); // Fetch the JSON data

        // Update the content to include the ALT text
        this.content.innerHTML = `
            <br />
            <img src="${imageUrl}" style="width: 100%;">
            <br />
            <p>${data.alt_text}</p> <!-- Display the ALT text here -->
        `;
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
