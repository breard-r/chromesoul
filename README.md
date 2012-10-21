## What is chromesoul?

Chromesoul is a minimalist NetSoul client for Google Chrome. It aim to connect to the NetSoul server and stay active, but does not provide all the functionalities you can expect from a real client.


## Why?

When you're on the PIE, you're stuck in it unless you are connected to netsoul, and with multiple boot and mobile devices it's a real pain to configure many NetSoul clients. That's why chromesoul is awesome: not only it's a cross-platform NS client, but with the Chrome synchronisation it's automaticaly installed and configured.


## Requirements

Sockets have been introduced in Chromium 24. Therefore, it is required to have a web-browser based on Chromium 24 or newer. At the time of writing, it's available on the [dev early release channel](http://www.chromium.org/getting-involved/dev-channel). For more informations, please refer to the [Chromium development calendar and release info](http://dev.chromium.org/developers/calendar).


## Features

### Password encryption
Storing your socks password encrypted is a priority but is not available yet. Yes, the chromesoul dev version is unsafe; so is the official NetSoul server which doesn't store a hash but the password itself (it's a requirement from the NetSoul protocol).

### Messages
Because the only purpose of this extension is to provide an access to internet when you're on the PIE, there is no plan to support messages at this time. Thoses stupid guys who have fun spamming everyone by broadcasting messages are the second reasons why you won't see any message using chromesoul. Maybe one day I'll write a chat interface, however it will be unobtrusive.

### Contacts
If you cannot send and receive messages, you don't need a contact list.

### State change
Same as contacts. Why changing your state if you're not gonna talk?


## Licence

Chromesoul is released under an [ISC licence](http://en.wikipedia.org/wiki/ISC_license "ISC licence"). See the LICENCE.txt file for more details.
Chromesoul uses third-party free softwares which belongs to their respective owners. Such softwares are listed in the CREDITS.md file.
