# xkcd-card [![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration) <a href="https://www.buymeacoffee.com/brianfit" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 25 px !important;width: 100px !important;" ></a>

This pulls the latest awesome xkcd comic into your Home Assistant dashboard. 

"Why can't I just grab the image in a picture entity from the RSS feed" you ask?  Because browsers cache images, m'geek. It's normally a feature, but when you want to point to a file that gets refreshed regularly, it's a bug. We need to trick the browser into thinking it hasn't seen the url it's fetching the comic from, and we do that with this nifty trick, built right into the card:

        const imageUrl = `/local/xkcd-card/xkcd.png?_ts=${new Date().getTime()}`;
        this.content.innerHTML = `<img src="${imageUrl}" style="width: 100%;">`;

Get it? If not, it doesn't matter. Just think of it as the magic spell that the card is chanting in the middle of the night to summon your next dose of nerdy goodness. (But if you read xkcd, you probably get it.) 

## Installation

> [!IMPORTANT]
> <strong> If you just install the card, you'll only see the default comic. Every day. I mean it's a good one, but if you want to see it refresh, you need to create an automation! </strong>

Good news is it's easy. Here's how to do it. When the card installs, it creates a file called xkcd.sh

You'll want to run that every 24 hours to get the latest comic. First, open up your configuration.yaml and add the following code:

        `shell_command:
           run_xkcd: "sh /local/xkcd-card/xkcd.sh"`

The file is actually in your /config/www directory, but in a normal install that's read by Home Assitant from the alias /local/

> [!IMPORTANT]
> Go to the Developers menu, click on "Check Configuration" and "Restart Home Assistant" (Really restart it, don't just reload the YAML. You're creating a new entity, and you won't have access to it until you restart Home Assistant.)

### Set up your automation

Got to the Settings Menu and choose "Automations and Scenes"

<img src = "https://github.com/Brianfit/images/blob/main/automations%26scenes.jpg">

Click on the "Create Automation" button lower right. 

<img src="https://github.com/Brianfit/images/blob/main/create.jpg" height="25%" width=25%>

Click "Create New Automation"

<img src="https://github.com/Brianfit/images/blob/main/new.jpg" height="50%" width="50%">

Choose "Time"

<img src = "https://github.com/Brianfit/images/blob/main/time.jpg" height="50%" width="50%">

And set it up to run `shell_command.run_xkcd` once a day at any time you choose.

<img src = "https://github.com/Brianfit/images/blob/main/automation.jpg" height="75%" width="75%">


Every day at the time you specify, the image xkcd.png and json data of the alt text and title will download to the /config/local/xkcd-card/ directory 

The card will then access it from the url /local/xkcd-card/ and voila! Your daily nerdgasm. 

> [!NOTE]
> Mouseover the comic to see the alt-text below the image

## Credits

xkcd is created by Randall Munroe, and like this HACS Card the comic carries a Creative Commons BY NC license - meaning you are free to share provided attribution is made and the work is not used for commercial purposes. 

Thanks also to u/lau1406 and the guys and gals in <a href="https://www.reddit.com/r/homeassistant/comments/zwf4z1/i_integrated_xkcd_comics_into_home_assistant/">this Reddit thread </a> who created a card as camera element before HA changed the way that element works and broke it. 

## License
<p align="center">
<img src="https://imgs.xkcd.com/comics/copyright.jpg" alt="After reading Slashdot and BoingBoing, sometimes I just have to go outside" height="55%" width="55%">
</p>
This card was made by Brian Fitzgerald under a Creative Commons BY-NC license. You are free to use or modify the code under two conditions: you don't sell it and you mention I made it. 
This card delivers content made by Randall Munroe under the same conditions. 

[![License: CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc/4.0/)

## Say Thanks
This is one of many open source projects I create or contribute to. I buy coffee for folks who do stuff for free that I love, and I love it when people show appreciation to me for doing stuff I love. If more of the world worked like the buy-me-a-coffee economy of generosity and appreciation and work for the love of creating something, well we'd all make Kurt Vonnegut proud. 

<p align="center">
<a href="https://www.buymeacoffee.com/brianfit" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
</p>




