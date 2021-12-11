const { GoogleSpreadsheet } = require('google-spreadsheet');

const secrets = require('./secrets')


class Sheet {
    constructor() {
        this.doc = new GoogleSpreadsheet(secrets.sheetUrl);
    }

    async load() {
        await this.doc.useServiceAccountAuth(secrets.credentials);
        await this.doc.loadInfo();
    }

    async addRows(rows, i) {
        const sheet = this.doc.sheetsByIndex[i];
        await sheet.addRows([rows]);
    }

    async getRows(i) {
        const sheet = this.doc.sheetsByIndex[i];
        const rows = await sheet.getRows();
        return rows;
    }
}

module.exports = Sheet;