import axios from 'axios';

class GoogleSheetsService {
  async getSheetData(sheetUrl) {
    const response = await axios.get(sheetUrl);
    const jsonData = JSON.parse(response.data.substr(47).slice(0, -2));
    const rows = jsonData.table.rows;
    return rows.map(row => row.c.map(cell => (cell ? cell.v : '')));
  }

  async getCuentas() {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1JtIXWt_5xxcv_l-0z6Nb1yahWEQaSuPV2ZVHyuCQtOk/gviz/tq?tqx=out:json';
    const data = await this.getSheetData(sheetUrl);
    console.log(data);
    return data.map(row => ({
      id: row[0],
      email: row[1],
      password: row[2],
      service: row[3],
      cost: row[4],
      status: row[5],
      rating: row[6],
      date: row[7]
    }));
  }

  async getClientes() {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1kLObfEKeOvJNHy8S1U1BAQ046woL9dclZ348JVg_5Hs/gviz/tq?tqx=out:json';
    const data = await this.getSheetData(sheetUrl);
    return data.map(row => ({
      id: row[0],
      idCuenta: row[1],
      numeroCliente: row[2]
    }));
  }

  async getClientesConCuentas() {
    const cuentas = await this.getCuentas();
    const clientes = await this.getClientes();

    return clientes.map(cliente => {
      const cuenta = cuentas.find(cuenta => cuenta.id === cliente.idCuenta);
      return {
        id: cliente.id,
        email: cuenta ? cuenta.email : '',
        numeroCliente: cliente.numeroCliente,
        status: cuenta ? cuenta.status : ''
      };
    });
  }

  async getPlataformas() {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1PUhs49saTyMQHu3xeIinYXnmga_NupfOw-RHBqc19lU/gviz/tq?tqx=out:json';
    const data = await this.getSheetData(sheetUrl);
    console.log(data);
    return data.map(row => ({
      id: row[0],
      name: row[1]
    }));
  }

  async addRow(sheetUrl, values) {
    const response = await axios.post(sheetUrl, { values });
    return response.data;
  }

  async updateRow(sheetUrl, rowIndex, values) {
    const response = await axios.put(`${sheetUrl}/${rowIndex}`, { values });
    return response.data;
  }

  async deleteRow(sheetUrl, rowIndex) {
    const response = await axios.delete(`${sheetUrl}/${rowIndex}`);
    return response.data;
  }

  async addCuenta(values) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1JtIXWt_5xxcv_l-0z6Nb1yahWEQaSuPV2ZVHyuCQtOk/gviz/tq?tqx=out:json';
    return await this.addRow(sheetUrl, values);
  }

  async updateCuenta(rowIndex, values) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1JtIXWt_5xxcv_l-0z6Nb1yahWEQaSuPV2ZVHyuCQtOk/gviz/tq?tqx=out:json';
    return await this.updateRow(sheetUrl, rowIndex, values);
  }

  async deleteCuenta(rowIndex) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1JtIXWt_5xxcv_l-0z6Nb1yahWEQaSuPV2ZVHyuCQtOk/gviz/tq?tqx=out:json';
    return await this.deleteRow(sheetUrl, rowIndex);
  }

  async addCliente(values) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1kLObfEKeOvJNHy8S1U1BAQ046woL9dclZ348JVg_5Hs/gviz/tq?tqx=out:json';
    return await this.addRow(sheetUrl, values);
  }

  async updateCliente(rowIndex, values) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1kLObfEKeOvJNHy8S1U1BAQ046woL9dclZ348JVg_5Hs/gviz/tq?tqx=out:json';
    return await this.updateRow(sheetUrl, rowIndex, values);
  }

  async deleteCliente(rowIndex) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1kLObfEKeOvJNHy8S1U1BAQ046woL9dclZ348JVg_5Hs/gviz/tq?tqx=out:json';
    return await this.deleteRow(sheetUrl, rowIndex);
  }

  async addPlataforma(values) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1PUhs49saTyMQHu3xeIinYXnmga_NupfOw-RHBqc19lU/gviz/tq?tqx=out:json';
    return await this.addRow(sheetUrl, values);
  }

  async updatePlataforma(rowIndex, values) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1PUhs49saTyMQHu3xeIinYXnmga_NupfOw-RHBqc19lU/gviz/tq?tqx=out:json';
    return await this.updateRow(sheetUrl, rowIndex, values);
  }

  async deletePlataforma(rowIndex) {
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1PUhs49saTyMQHu3xeIinYXnmga_NupfOw-RHBqc19lU/gviz/tq?tqx=out:json';
    return await this.deleteRow(sheetUrl, rowIndex);
  }
}

export default new GoogleSheetsService();