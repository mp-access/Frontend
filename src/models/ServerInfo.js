export default class ServerInfo {
    constructor(json) {
        this.zoneId = '';
        this.utcTime = '';
        this.offsetDateTime = '';
        this.version = '';
        Object.assign(this, json);
    }

    toString() {
        return JSON.stringify(this);
    }

}