# xkcd-card [![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration) <a href="https://www.buymeacoffee.com/brianfit" target="_blank"><a href="#"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 25 px !important;width: 100px !important;" ></a></a>

This pulls the latest awesome xkcd comic into your Home Assistant dashboard. New comics are published every Monday, Wednesday, and Friday. On other days, the card pulls a random comic from the archive. 

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Brian+Fitzgerald&repository=https%3A%2F%2Fgithub.com%2FBrianfit%2Fxkcd-card-ha&category=Lovelace)

"Why can't I just grab the image in a picture entity from the RSS feed" you ask?  Because browsers cache images, m'geek. It's normally a feature, but when you want to point to a file that gets refreshed regularly, it's a bug. We need to trick the browser into thinking it hasn't seen the url it's fetching the comic from, and we do that with this nifty trick, built right into the card:

        const imageUrl = `/local/community/xkcd-card-ha/xkcd.png?_ts=${new Date()}`;
        this.content.innerHTML = `<a href="#"><img src="${imageUrl}" style="width: 100%;"></a>`;

Get it? If you read XKCD, you probably do. If not, it doesn't matter. Just imagine a stick figure in a wizard's hat chanting a magic spell in the middle of the night to summon your next dose of nerdy goodness. 

## Installation

Ensure HACS is Installed:
If you haven’t already [installed HACS (Home Assistant Community Store), you’ll need to do that first](https://www.hacs.xyz/docs/use/download/download/). But I’m assuming you’re good to go here.


Add the Repository:
Go to HACS, search on "xkcd' and click on the xkcd-card-ha plugin. Hit that download button: 

<a href="#"><img src = "https://github.com/Brianfit/images/blob/main/install.jpg" style="width:75%; height:75%; margin-left:10%"></a>

Boom. The card has now been quantum transported into your instance of Home Assistant. 

Edit your dashboard (Three dots upper right > Edit Dashboard)
Click Add Card +

Way down at the bottom of the card options, you'll see this: 

<a href="#"><img src = "https://github.com/Brianfit/images/blob/main/cardoption.jpg" style="width:75%; height:75%;margin-left:10%"></a>

Click on it. Click Done and you are. Kinda. See steps below to set up your automation. 

If you prefer to roll your own, you can use the following YAML to add and configure the card to your liking:

`type: 'custom:xkcd-card'`

### Set up your automation

> [!IMPORTANT]
> <strong> If you just install the card, you'll only see the default comic. Every day. I mean it's a good one, but if you want to see it refresh, you need to create an automation! </strong>

Good news is it's easy. When the card installs, it creates a bash file called xkcd.sh to fetch a new comic & alt text. 

You'll want to run that every 24 hours to get the latest comic. First, open up your configuration.yaml and add the following code:
```
        shell_command:
          run_xkcd: "sh /config/www/community/xkcd-card-ha/xkcd.sh"
```

> [!IMPORTANT]
> Go to the Developers menu, click on "Check Configuration" and "Restart Home Assistant" (Really restart it, don't just reload the YAML. You're creating a new entity, and you won't have access to it until you restart Home Assistant. If you're superstitious, go ahead and reboot, you'll feel better.)


Got to the Settings Menu and choose "Automations and Scenes"

<a href="#"><img src = "https://github.com/Brianfit/images/blob/main/automations%26scenes.jpg"></a>

Click on the "Create Automation" button lower right. 

<a href="#"><img src="https://github.com/Brianfit/images/blob/main/create.jpg" height="25%" width=25%></a>

Click "Create New Automation"

<a href="#"><img src="https://github.com/Brianfit/images/blob/main/new.jpg" height="50%" width="50%"></a>

Choose "Time"

<a href="#"><img src = "https://github.com/Brianfit/images/blob/main/time.jpg" height="50%" width="50%"></a>

And set it up to run `shell_command.run_xkcd` once a day at 11:57 p.m. -- or any time just before midnight when the date changes. 

<a href="#">
<img src = "https://github.com/Brianfit/images/blob/main/actionpopup.jpg" height="50%" width="50%">
</a>

If you've properly set up your shell command in configuration.yaml AND restarted HA (you really restarted, didn't just reload the yaml, right?) you should see an autocomplete when you type "shell". In the example above, which has multiple shell commands, my configuration.yaml looked like this:

<a href="#">
<img src = "https://github.com/Brianfit/images/blob/main/multishell.jpg">
</a>

NB: If you have more than one shell command, they need to be gathered under one header like the above. If you scatter them in your yaml only one will be loaded. 


<a href="#"><img src = "https://github.com/Brianfit/images/blob/main/automation.jpg" height="75%" width="75%"></a>


Every day at the time you specify, the image xkcd.png and json data of the alt text and title will download to the /config/local/commmunity/xkcd-card-ha/ directory 
And at midnight, since the date changes, the url of the image changes. And voila! A fresh giggle. Mouseover or touch/click the image to see the alt text. 


## Credits

xkcd is created by Randall Munroe, and like this HACS Card the comic carries a Creative Commons BY NC license - meaning you are free to share provided attribution is made and the work is not used for commercial purposes. 

Thanks also to u/lau1406 and the guys and gals in <a href="https://www.reddit.com/r/homeassistant/comments/zwf4z1/i_integrated_xkcd_comics_into_home_assistant/">this Reddit thread </a> who created a card as camera element before HA changed the way that element works and broke it. 

## License
<p align="center">
<a href="#"><img src="https://imgs.xkcd.com/comics/copyright.jpg" alt="After reading Slashdot and BoingBoing, sometimes I just have to go outside" height="55%" width="55%"></a>
</p>
This card was made by Brian Fitzgerald under a Creative Commons BY-NC license. You are free to use or modify the code under two conditions: you don't sell it and you mention I made it. 
This card delivers content made by Randall Munroe and published at xkcd.com under the same conditions. 

[![License: CC BY-NC 4.0](https://licensebuttons.net/l/by-nc/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc/4.0/)

## Say Thanks
This is one of many open source projects I create or contribute to. I buy coffee for folks who do stuff for free that I love, and I love it when people show appreciation to me for doing stuff I love. If more of the world worked like the buy-me-a-coffee economy of generosity and appreciation and work for the love of creating something, well we'd all make Kurt Vonnegut proud. 

<p align="center">
<a href="https://www.buymeacoffee.com/brianfit" target="_blank"><a href="#"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a></a>
</p>




