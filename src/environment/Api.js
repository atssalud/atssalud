import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASEURL = 'https://attsalud.com/api';
// const BASEURL = 'http://157.230.219.132/api-test';
const BASEURL = 'https://www.atssalud.com/api-test';
// const BASEURL = 'https://www.atssalud.com/api';


export const Endpoint = {

    login:`${BASEURL}/auth`,
    professions:`${BASEURL}/professions`,
    departaments:`${BASEURL}/states`,
    dniTypes:`${BASEURL}/dni-types`,
    eps:`${BASEURL}/companies`,
    cities:(idDepartament)=>{return `${BASEURL}/cities&state=${idDepartament}`;},
    signUp:`${BASEURL}/sign-up`,
    login:`${BASEURL}/login`,
    dataUser:`${BASEURL}/get-user-profile`,
    editDataUser:`${BASEURL}/update-user-profile`,
    editDataBankUser:`${BASEURL}/update-user-databank`,
    forgetPassword:`${BASEURL}/forget-password`,
    logout:`${BASEURL}/logout`,
    banks:`${BASEURL}/banks`,
    typeAccount:`${BASEURL}/banks-types-account`,
    findPeople:`${BASEURL}/find-patient-dni`,
    testCardiovascular:`${BASEURL}/test-cardiovascular`,
    createPatient:`${BASEURL}/create-patient`,
    editPatient:`${BASEURL}/update-patient`,
    listItemTestAsthma :`${BASEURL}/list-items-test-childrem-asthma`,
    sendTestAsthma:`${BASEURL}/test-childrem-asthma`,
    listItemTestEpoc :`${BASEURL}/list-items-test-epoc`,
    sendTestEpoc:`${BASEURL}/test-epoc`,
    historial:`${BASEURL}/list-history-risk-user`,
    listItemTestMental :`${BASEURL}/list-items-test-mental-health`,
    sendTestMenntal:`${BASEURL}/test-mental-health`,
}   

const Api = axios.create(Endpoint)
Api.interceptors.request.use(
    async (config)=>{
        const token = await AsyncStorage.getItem('token')
        console.log('token3',token)
        if (token){
            config.headers.Authorization = `bearer ${token}`;
        }
        return config;
    }
)

export default Api;