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

    async addRow(row) {
        const sheet = this.doc.sheetsByIndex[0];
        await sheet.addRows([row]);
    }

    async getRows(i) {
        const sheet = this.doc.sheetsByIndex[i];
        const rows = await sheet.getRows();
        return rows;
    }

    async getCurrentShift(date) {
        const sheet = this.doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        for (const row of rows) {
            if (row.date === date) {
                return row;
            }
        }

        return {};
    }
}

module.exports = Sheet;