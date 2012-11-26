var chromesoul = (function() {
    var chromesoul = {
	"opts": new OptionsManager(),
	"ui": new Nsui(),
	"client": new NsClient()
    };

    return (window.chromesoul = window.$cs = chromesoul);
})();

$cs.opts.init();
$cs.ui.init();
$cs.client.init();

$cs.ui.setReconnect(function() {
    $cs.client.disconnect();
    $cs.client.connect();
});
