 var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        hasReadPermission();
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:none;');

        console.log('Received Event: ' + id);
    }
};
function simInfosuccessCallback(result) {
    var element = document.getElementById('SIMInformation');
    if (result !== undefined && result != null && result != '') {
        var tblHmlt = '<h3>Sim basic Information </h3><table style="width:100%"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>';
        tblHmlt += '<tr><td>carrierName</td><td> ' + result.carrierName + '</td></tr>' +
                 '<tr><td>countryCode</td><td> ' + result.countryCode + '</td></tr>' +
                 '<tr><td>mcc</td><td> ' + result.mcc + '</td></tr>' +
                 '<tr><td>mnc</td><td>' + result.mnc + '</td></tr>' +
                 '<tr><td>callState</td><td> ' + result.callState + '</td></tr>' +
                 '<tr><td>dataActivity</td><td> ' + result.dataActivity + '</td></tr>' +
                 '<tr><td>networkType</td><td> ' + result.networkType + '</td></tr>' +
                 '<tr><td>phoneType</td><td> ' + result.phoneType + '</td></tr>' +
                 '<tr><td>simState</td><td> ' + result.simState + '</td></tr>' +
                 '<tr><td>isNetworkRoaming</td><td> ' + result.isNetworkRoaming + '</td></tr>' +
                 '<tr><td>phoneCount</td><td> ' + result.phoneCount + '</td></tr>' +
                 '<tr><td>activeSubscriptionInfoCount</td><td> ' + result.activeSubscriptionInfoCount + '</td></tr>' +
                 '<tr><td>activeSubInfoCountMax</td><td>' + result.activeSubscriptionInfoCountMax + '</td></tr>' +
                 '<tr><td>phoneNumber</td><td> ' + result.phoneNumber + '</td></tr>' +
                 '<tr><td>deviceId</td><td> ' + result.deviceId + '</td></tr>' +
                 '<tr><td>deviceSoftwareVersion</td><td> ' + result.deviceSoftwareVersion + '</td></tr>' +
                 '<tr><td>simSerialNumber</td><td> ' + result.simSerialNumber + '</td></tr>' +
                 '<tr><td>subscriberId</td><td> ' + result.subscriberId + '</td></tr>' +
                  '</tbody></table>';

        element.innerHTML = tblHmlt;
    }

    var elementSimInfo = document.getElementById('SIMInfo');
    if (result.cards.length > 0 && result.phoneCount > 1) {
        var innerHtml = '';
        var totalSim = 1;
        for (var i = 0; i < result.cards.length; i++) {

            var tblHmlt = '<h3>Sim ' + totalSim + ' Information </h3>' + '<br /><table style="width:100%"><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>';

            tblHmlt += '<tr><td>carrierName</td><td>' + result.cards[i].carrierName + '</td></tr>' +
                                   '<tr><td>displayName</td><td>' + result.cards[i].displayName + '</td></tr>' +
                                   '<tr><td>countryCode</td><td>' + result.cards[i].countryCode + '</td></tr>' +
                                   '<tr><td>mcc</td><td>' + result.cards[i].mcc + '</td></tr>' +
                                   '<tr><td>mnc</td><td>' + result.cards[i].mnc + '</td></tr>' +
                                   '<tr><td>isNetworkRoaming</td><td>' + result.cards[i].isNetworkRoaming + '</td></tr>' +
                                   '<tr><td>isDataRoaming</td><td>' + result.cards[i].isDataRoaming + '</td></tr>' +
                                   '<tr><td>simSlotIndex</td><td>' + result.cards[i].simSlotIndex + '</td></tr>' +
                                   '<tr><td>phoneNumber</td><td>' + result.cards[i].phoneNumber + '</td></tr>' +
                                   '<tr><td>deviceId</td><td>' + result.cards[i].deviceId + '</td></tr>' +
                                   '<tr><td>simSerialNumber</td><td>' + result.cards[i].simSerialNumber + '</td></tr>' +
                                   '<tr><td>subscriptionId</td><td>' + result.cards[i].subscriptionId + '</td></tr>' +
                                    '</tbody></table>';
            totalSim++;
            innerHtml += tblHmlt
        }
        elementSimInfo.innerHTML = innerHtml;
    }
}

function HasPerminionSuccessCallback(result) {

    if (result) {
        window.plugins.sim.getSimInfo(simInfosuccessCallback, errorCallback);
    } else {
        requestReadPermission();
    }
}


function errorCallback(error) {

    var elementSimInfo = document.getElementById('ErrorInfo');
    elementSimInfo.innerHTML = error;

}
function requestSuccessCallback(result) {
    if (result) {
        hasReadPermission();
    }
}
// Android only: check permission
function hasReadPermission() {
    window.plugins.sim.hasReadPermission(HasPerminionSuccessCallback, errorCallback);
}

// Android only: request permission
function requestReadPermission() {
    window.plugins.sim.requestReadPermission(requestSuccessCallback, errorCallback);

}