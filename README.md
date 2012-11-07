## What is chromesoul?

Chromesoul is a minimalist NetSoul client for Google Chrome. It aim to connect to the NetSoul server and stay active, but does not provide all the functionalities you can expect from a real client.


## Why?

When you're on the PIE, you're stuck in it unless you are connected to netsoul, and with multiple boot and mobile devices it's a real pain to configure many NetSoul clients. That's why chromesoul is awesome: not only it's a cross-platform NS client, but with the Chrome synchronisation it's automaticaly installed and configured.


## Requirements

Sockets have been introduced in Chromium 24. Therefore, it is required to have a web-browser based on Chromium 24 or newer. At the time of writing, it's available on the [dev early release channel](http://www.chromium.org/getting-involved/dev-channel). For more informations, please refer to the [Chromium development calendar and release info](http://dev.chromium.org/developers/calendar).


## Features

### Password encryption
Storing your socks password encrypted is a priority but is not available yet. Yes, the chromesoul dev version is unsafe; so is the official NetSoul server which doesn't store a hash but the password itself (it's required by the NetSoul protocol).

### Messages
Because the only purpose of this extension is to provide an access to internet when you're on the PIE, there is no plan to support messages at this time. Thoses stupid guys who have fun spamming everyone by broadcasting messages are the second reasons why you won't see any message using chromesoul. Maybe one day I'll write a chat interface, however it will be unobtrusive.

### Contacts
If you cannot send and receive messages, you don't need a contact list.

### State change
Same as contacts. Why changing your state if you're not gonna talk?


## FAQ

### How do I install this extension?
Because it's not packaged yet, you have to:
* Download it
* Use the developer mode
* Click on "Load unpackaged extension..." and select the chromesoul directory

### Will you package it?
Yes, as soon as sockets are supported in the stable channel.

### How do I start chromesoul?
Just like any other app:
* open a new tab (Ctrl + T)
* click on the "apps" tab (have a look at the bottom of the page)
* click on "chromesoul"

### Could not load extension from '/path/to/chromesoul'. Invalid value for 'permissions[2]'.
It seems your browser doesn't support sockets. Have you checked the requirements?

### Do I really have to compile the version from dev channel?
No, you can wait until it comes to stable.

### Chromesoul isn't an extension but a packaged app!
Yes, you're right. Chromesoul should be an extension, but sockets can be used in apps only.

### Where do I send and receive messages?
Please have a look at the features lists.

### Will you ever support sending and receiving messages?
Maybe. If someone pay me I will, otherwise I'll do it if have time to invest in this project. Notice: I accept beer as payment .

### I talked to you on netsoul but you never reply!
I started this project for my personal usage, which means I use it. Now look at the features list and the previous questions.

### I found a bug, what should I do?
Hum, please [report it](https://github.com/TychoBrahe/chromesoul/issues) with as much details as you can. Thanks in advance.

### I hate chromesoul!
It's your opinion and I don't care about it.

### I love chromesoul!
I'm happy you like it :-)


## Licence

Chromesoul is released under an [ISC licence](http://en.wikipedia.org/wiki/ISC_license "ISC licence"). See the LICENCE.txt file for more details.
Chromesoul uses third-party free softwares which belongs to their respective owners. Such softwares are listed in the CREDITS.md file.
