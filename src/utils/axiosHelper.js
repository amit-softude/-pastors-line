import axios from 'axios';

class AxiosHelper {
  constructor() {
    this.instance = axios.create({
      timeout: 50000, // set timeout to 5 seconds
    });
    // delete this.instance.defaults.headers.common['crossDomain'];
  }

  async get(endpoint, params) {
    try {
      const response = await this.instance.get(endpoint, {
        params,
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getAuthHeader() {
    const headers = {};
    let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjU2MCwiZXhwIjoxNzI2NTY3MTc5LCJ0eXBlIjoiYWNjZXNzIiwidGltZXN0YW1wIjoxNjk1MDMxMTc5fQ.0y7NtuVDCvcPvmWbliMs1q02sov2oFC6u2Hi6H4A2W4";
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      // headers.Authorization = token;
    }
    return headers;
  }
}

const axiosHelper = new AxiosHelper();
// module.exports = axiosHelper;
export default axiosHelper;