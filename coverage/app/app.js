class Freshdesk {
    constructor(client) {
        this.client = client;
        this.key64 = window.btoa(client.iparams.apiKey);
        this.getReqOptions = {
            headers: {
                "Authorization": this.key64,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            method: 'get'
        };
        this.getParams = function () {
            return Promise.resolve().then(() => client.iparams.get());
        };
        this.activateApp = function(callback) {
            return Promise.resolve().then(() => client.events.on('app.activated', callback));
        };
        this.showNotification = function (type, message) {
            return Promise.resolve().then(() => client.interface.trigger("showNotify", { type, message }));
        };
        this.errMsg = '\n==========================\nCheck search parameters format. Correct format:\nDate: 00-00-00\nString: A%20String%20with%20whitespaces\n==========================\n\n';
    }
    set iparams(auth) {
        /*const self = this;
        this.createRequest = function(type, request, body) {
            const options = {
                headers: {
                    "Authorization": this.key64,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                maxAttempts: 3,
                retryDelay: 500
            };
            let url = `https://ozon-marketplace.freshdesk.com/api/v2/${request}`;

            options.method = type;
            if (body) {
                options.body = typeof body === "string" ? body : JSON.stringify(body);
            }

            return Promise.resolve().then(() => self.client.request[type](url, options));
        };*/

        this.getTicket = function() {
            const url = `https://swedbyte.freshdesk.com/api/v2/tickets/7338`;
            return fetch(url, this.getReqOptions).then(res => {return res.json()});
        }
    }
}

let freshdesk;

$(document).ready(function () {
    app.initialized()
        .then(initGlobals)
        .catch(error => {
            console.error("[ERROR]", error);
            freshdesk.showNotification("danger", "Unable to retrieve logged-in agent details");
        })
});

function initGlobals(client) {
    freshdesk = new Freshdesk(client);
    freshdesk.getTicket()
        .then(res => console.log(res))
        .catch(err => console.log(err))
}