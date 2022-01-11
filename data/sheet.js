const { GoogleSpreadsheet } = require('google-spreadsheet');

const secrets = require('../secrets')


class Sheet {
    constructor() {
        this.doc = new GoogleSpreadsheet(secrets.sheetUrl);
    }

    async load() {
        await this.doc.useServiceAccountAuth(secrets.credentials);
        await this.doc.loadInfo();
    }

    async addRows(rows) {
        const sheet = this.doc.sheetsByIndex[0];
        await sheet.addRows([rows]);
    }

    async getRows(i) {
        const sheet = this.doc.sheetsByIndex[i];
        const rows = await sheet.getRows();
        return rows;
    }

    async getCurrentShift(date) {
        const sheet = this.doc.sheetsByIndex[0];
        const rows = await sheet.getRows();
        const lastRow = rows[rows.length - 1];

        if (lastRow.date === date) {
            return lastRow;
        }
        return {};
    }
}

module.exports = Sheet;