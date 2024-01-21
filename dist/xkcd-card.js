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
                    <div id="content"></div>
                </ha-card>`;
            this.content = this.querySelector('#content');
        }
        const imageUrl = `/local/community/xkcd-card-ha/xkcd.png?_ts=${new Date().getDate()}`;
        console.log('Yes Slothrop...')
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
