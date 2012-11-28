## What is chromesoul?

Chromesoul is a minimalist NetSoul client for Google Chrome. If you don't know what NetSoul is, you probably don't need it. If you're neither a student nor an employee of any [IONIS](http://www.ionis-group.com/) school (eg: Epitech, Epita, …), all you have to know is that NetSoul is an internal messaging protocol for thoses schools.


## Why?

When you're on the PIE, you're stuck in it unless you are connected to netsoul. With multiple operating systems it's a real pain to configure a NetSoul client for each of them. That's why chromesoul is awesome: not only it's a cross-platform NS client, but the Chrome synchronisation automaticaly install and configure it everywhere you uses chrome.


## Requirements

Sockets have been introduced in Chromium 24. Therefore, it is required to have a web-browser based on Chromium 24 or newer. At the time of writing, it's available on the [beta channel](http://www.chromium.org/getting-involved/dev-channel). For more informations, please refer to the [Chromium development calendar and release info](http://dev.chromium.org/developers/calendar).


## Features

### Messages
At first, chromesoul's was only intended to provide an access to internet from the PIE and didn't supported messages. However, I changed my mind and decided to include this feature. Don't panic if you don't want to be disturbed, it's possible to turn it off. All you have to do is to go in your settings and uncheck the little box.

### State change
It's on it's way.


## FAQ

### How do I install this app?
Because it's not packaged yet, you have to:
* Download it (aka: clone the git repository)
* Use the developer mode
* Click on "Load unpackaged extension..." and select the chromesoul directory

### Will you package it?
Yes, as soon as sockets are supported in the stable channel.

### How do I start chromesoul?
Just like any other app:
* open a new tab (Ctrl + T)
* click on the "apps" tab (have a look at the bottom of the page)
* click on "chromesoul"

### Do I really have to compile the version from beta channel?
No, you can wait until it comes to stable.

### Are my data stored encrypted?
By default it's not encrypted, that's why you are strongly encouraged to configure Chrome to [encrypt all your synced data](http://support.google.com/chrome/bin/answer.py?hl=en&answer=1181035). Please note that it's true for every application you uses.

### I found a bug, what should I do?
Please [report it](https://github.com/TychoBrahe/chromesoul/issues) with as much details as you can. Thanks in advance.

### I hate chromesoul!
It's your opinion and I don't care about it.

### I love chromesoul!
I'm happy you like it :-)


## Licence

Chromesoul is released under an [ISC licence](http://en.wikipedia.org/wiki/ISC_license "ISC licence"). See the LICENCE.txt file for more details.
Chromesoul uses third-party free softwares which belongs to their respective owners. Such softwares are listed in the CREDITS.md file.
