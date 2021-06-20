import axios from "axios";
import {count, mean, sum} from "d3";

const func = {
    'TAM EX-0-Flex':(arr,arr2)=>sum(arr)/sum(arr2),
    'TAM Pro-0-Sup':(arr,arr2)=>sum(arr)/sum(arr2),
    'TAM Rad-0-Ulnar':(arr,arr2)=>sum(arr)/sum(arr2),
    'Mean of 3 Trials': (arr,arr2)=> (sum(arr)/3)/(sum(arr2)/3),
    'Grip Strength Supination Ratio':(a,b)=> a/b,
    'Grip Strength Pronation Ratio':(a,b)=> a/b,
    'PSFS score':(PSFS)=>mean(PSFS),
    'PRWE Pain Scale':(PRWE)=>sum(PRWE.slice(0,5)),
    'PRWE Function subscale':(PRWE)=>(sum(PRWE.slice(5, 15))+(10-count(PRWE.slice(5, 15)))*mean(PRWE.slice(5, 15)))/2,
    'SANE score':(PRWE)=>PRWE[17],
    'MHQ score':(MHQ)=>(sum(MHQ)-5)/20*100,
};
const baseUrl = ((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL);
//request interceptor to add the auth token header to requests
axios.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
            config.headers["withCredentials"] = true;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);
//response interceptor to refresh token on receiving token expired error
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        const originalRequest = error.config;
        let refreshToken = localStorage.getItem("refreshToken");
        if (
            refreshToken &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            return axios
                .post(`${baseUrl}/accounts/refresh-token`, { refreshToken: refreshToken })
                .then((res) => {
                    if (res.status === 200) {
                        localStorage.setItem("accessToken", res.data.jwtToken);
                        console.log("Access token refreshed!");
                        return axios(originalRequest);
                    }
                }).catch(e=>{
                    return Promise.reject(error);
                });
        }
        return Promise.reject(error);
    }
);
//functions to make api calls
const api = {
    signup: (body) => {
        return axios.post(`${baseUrl}/accounts/signup`, body);
    },
    login: (body) => {
        return axios.post(`${baseUrl}/accounts/authenticate`, body);
    },
    refreshToken: (body) => {
        return axios.post(`${baseUrl}/accounts/refresh-token`, body);
    },
    logout: () => {
        return axios.post(`${baseUrl}/accounts/revoke-token`, {token:localStorage.getItem('refreshToken')});
    },
    getProtected: (id) => {
        return axios.get(`${baseUrl}/accounts/${id}`);
    },
    cleanToken: ()=>{
        localStorage.setItem("accessToken", null);
        localStorage.setItem("refreshToken", null);
    },
    sharePatient: (data,shareWith) => {
        return axios.post(`${baseUrl}/patientProfile/${data._id}`,{shareWith});
    },
    getPatientData :(id)=>{
        return  axios.get(`${((process.env.NODE_ENV === 'production')?process.env.REACT_APP_API_URL:process.env.REACT_APP_API_URL_LOCAL)}/patientProfile/${id}`)
            .then(r=>{
                const _data = r.data;
                // recalculate
                if (_data["WristIndex"]){
                    _data["WristIndex"].forEach(d=>{
                        ["TAM EX-0-Flex", "TAM Pro-0-Sup", "TAM Rad-0-Ulnar", "Mean of 3 Trials", "Grip Strength Supination Ratio", "Grip Strength Pronation Ratio"].forEach(k=>{
                            d[k].result = func[k](d[k]['Involved Hand'],d[k]['Contra-lateral Hand'])
                        });

                        d['PSFS score'] = func['PSFS score'](d.PSFS);
                        d['PRWE Pain Scale'] = func['PRWE Pain Scale'](d.PRWE);
                        d['PRWE Function subscale'] = func['PRWE Function subscale'](d.PRWE);
                        d['SANE score'] = func['SANE score'](d.PRWE);
                        d['MHQ score'] = func['MHQ score'](d.MHQ);

                        d['Wrist range motion Flexion/Extension'] = d["TAM EX-0-Flex"].result*100;
                        d['Wrist range motion Pronation/Supination'] = d["TAM Pro-0-Sup"].result*100;
                        d['Wrist range motion Radial / Ulnar Deviation'] = d["TAM Rad-0-Ulnar"].result*100;
                        d['Grip Strength Ratio'] = d["Mean of 3 Trials"].result*100;
                    })
                }
                return _data;
            })
    },
    func
};
export default api;
