var om, ui, cs;


om = new OptionsManager();
om.init();

ui = new Nsui();
ui.init();

cs = new NsClient();
cs.init();

ui.setReconnect(function() {
    cs.disconnect();
    cs.connect();
});
