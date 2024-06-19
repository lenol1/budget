import axios from 'axios';

const monobankApiClient = {
    getUserInfoAsync: async (token) => {
        return axios.get('https://api.monobank.ua/personal/client-info', {
            headers: {
                'X-Token': token
            }
        });
    },
    getUserTransactionsAsync: async (token, from, to) => {
        return axios.get(`https://api.monobank.ua/personal/statement/0/${from}/${to}`, {
            headers: {
                'X-Token': token
            }
        });
    },
    getUserAllTransactionsAsync: async (token, account, from, to) => {
        return axios.get(`https://api.monobank.ua/personal/statement/${account}/${from}/${to}`, {
            headers: {
                'X-Token': token
            }
        });
    }
};

export default monobankApiClient;
