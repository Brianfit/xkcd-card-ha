class XKCDcard extends HTMLElement {

    config;
    content;

    // required
    setConfig(config) {
        this.config = config;
    }


    // Initialize a variable to store the date when the script is loaded
let lastFetchDate = new Date().getDate();

function getImageUrl() {
    const currentDate = new Date().getDate();

    // Check if the current date is different from the last fetch date
    if (currentDate !== lastFetchDate) {
        lastFetchDate = currentDate; // Update the last fetch date
        // Fetch and update the image URL with the current date
        return `/local/community/xkcd-card-ha/xkcd.png?_ts=${currentDate}`;
    } else {
        // If the dates are the same, no need to update the image
        return `/local/community/xkcd-card-ha/xkcd.png?_ts=${lastFetchDate}`;
    }
}


    set hass(hass) {
        if (!this.content) {
            this.innerHTML = `
                <ha-card>
                    <div id="content"></div>
                </ha-card>`;
            this.content = this.querySelector('#content');
        }
        const imageUrl = getImageUrl();
        this.content.innerHTML = `<br /><img src="${imageUrl}" style="width: 100%;"><br />`;
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
