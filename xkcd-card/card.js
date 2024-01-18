class XKCDcard extends HTMLElement {

    config;
    content;

    // required
    setConfig(config) {
        this.config = config;
    }

        set hass(hass) {
            if (!this.content) {
                this.innerHTML = `
                    <ha-card>
                        <div id="content" style="position: relative;"></div>
                    </ha-card>`;
                this.content = this.querySelector('#content');
            }

            if (hass.states['sensor.xkcd_data']) {
                const title = hass.states['sensor.xkcd_data'].attributes.title;
                const altText = hass.states['sensor.xkcd_data'].attributes.alt_text;
                const imageUrl = `/local/community/xkcd-card/xkcd.png?_ts=${new Date().getTime()}`;

                // Use JavaScript's template literals to construct the innerHTML
                this.content.innerHTML = `
                    <div>
                        <strong>${title}</strong><br />
                        <img src="${imageUrl}" style="width: 100%;" alt="${altText}" id="xkcdImage"><br />
                    </div>`;

                // Select the image element
                const imageElement = this.content.querySelector('#xkcdImage');

                // Create the tooltip element
                const tooltip = document.createElement('div');
                tooltip.id = 'tooltip';
                tooltip.style.cssText = `
                    position: absolute;
                    visibility: hidden;
                    width: auto;
                    background-color: black;
                    color: white;
                    text-align: center;
                    padding: 5px;
                    border-radius: 6px;
                    z-index: 1;
                `;
                tooltip.textContent = altText;
                this.content.appendChild(tooltip);

                // Show tooltip when the image is clicked
                imageElement.addEventListener('mouseover', () => {
                    tooltip.style.visibility = tooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
                    tooltip.style.left = `${imageElement.offsetLeft}px`;
                    tooltip.style.top = `${imageElement.offsetTop + imageElement.offsetHeight}px`;
                });

                // Hide tooltip when clicking elsewhere
                document.addEventListener('click', (e) => {
                    if (e.target !== imageElement) {
                        tooltip.style.visibility = 'hidden';
                    }
                });
            } else {
                this.content.innerHTML = 'XKCD data not available';
            }
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
