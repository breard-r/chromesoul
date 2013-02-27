var chromesoul = (function() {
    var chromesoul = {
	"opts": new OptionsManager(),
	"ui": new Nsui(),
	"contacts": new ContactList(),
	"client": new Client(),
	"avatars": new AvatarManager()
    };

    return (window.chromesoul = window.$cs = chromesoul);
})();

$cs.opts.init();
$cs.ui.init();
$cs.client.init(new NsClient(), $cs.ui);
$cs.contacts.init();

$cs.ui.setReconnect(function() {
    $cs.client.disconnect();
    $cs.client.connect();
});
