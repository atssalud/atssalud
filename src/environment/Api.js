import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASEURL = 'https://ewcweb.site/alert-risks';


export const Endpoint = {

    login:`${BASEURL}/auth`,
    professions:`${BASEURL}/professions`,
    departaments:`${BASEURL}/states`,
    dniTypes:`${BASEURL}/dni-types`,
    eps:`${BASEURL}/companies`,
    cities:(idDepartament)=>{return `${BASEURL}/cities&state=${idDepartament}`;},
    signUp:`${BASEURL}/sign-up`,
    login:`${BASEURL}/login`,
    dataUser:`${BASEURL}/list-profile-user`,
    editDataUser:`${BASEURL}/update-profile-user`,
    editDataBankUser:`${BASEURL}/update-databank-user`,
    forgetPassword:`${BASEURL}/forget-password`,
    logout:`${BASEURL}/logout`,
    banks:`${BASEURL}/banks`,
    typeAccount:`${BASEURL}/banks-types-account`,
    findPeople:`${BASEURL}/find-patient-dni`,
    testCardiovascular:`${BASEURL}/test-cardiovascular`,
    createPatient :`${BASEURL}/create-patient`,
    editPatient :`${BASEURL}/update-patient`,
    listItemTestAsthma :`${BASEURL}/list-items-test-childrem-asthma`,
    sendTestAsthma:`${BASEURL}/test-childrem-asthma`,
    listItemTestEpoc :`${BASEURL}/list-items-test-epoc`,
    sendTestEpoc:`${BASEURL}/test-epoc`,
}   

const Api = axios.create(Endpoint)
// const Api = axios.create({BASEURL})
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