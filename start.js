var cs = new NsClient();
cs.init();
document.getElementById('reconnect').addEventListener('click', function() {
    cs.disconnect();
    cs.connect();
}, false);
