import axios from 'axios';

const apiConfig = axios.create({
    baseURL: "https://zavnweqhytaqbpswyhcl.supabase.co/rest/v1/",
    headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    timeout: 10000
});

apiConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('API Error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Network Error: No response received');
        } else {
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiConfig;