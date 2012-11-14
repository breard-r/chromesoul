var ui = new Nsui(),
    cs = new NsClient();

ui.init();
cs.init();
ui.setReconnect(function() {
    cs.disconnect();
    cs.connect();
});
