import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASEURL = 'https://attsalud.com/api';
// const BASEURL = 'http://157.230.219.132/api-test';
const BASEURL = 'https://www.atssalud.com/api-test';
// const BASEURL = 'https://www.atssalud.com/api';
const NODE_BASEURL='https://api.atssalud.com'


export const Endpoint = {

    login:`${NODE_BASEURL}/auth/login`,
    professions:`${BASEURL}/professions`,
    departaments:`${BASEURL}/states`,
    dniTypes:`${BASEURL}/dni-types`,
    eps:`${BASEURL}/companies`,
    cities:(idDepartament)=>{return `${BASEURL}/cities&state=${idDepartament}`;},
    signUp:`${BASEURL}/sign-up`,
    // login:`${BASEURL}/login`,
    dataUser:`${BASEURL}/get-user-profile`,
    editDataUser:`${BASEURL}/update-user-profile`,
    editDataBankUser:`${BASEURL}/update-user-databank`,
    forgetPassword:`${BASEURL}/forget-password`,
    logout:`${BASEURL}/logout`,
    banks:`${BASEURL}/banks`,
    typeAccount:`${BASEURL}/banks-types-account`,
    findPeople:`${NODE_BASEURL}/affiliates`,
    createPatient:`${BASEURL}/create-patient`,
    editPatient:(dni)=>{return `${NODE_BASEURL}/affiliates/${dni}`;},
    listItemTestAsthma :`${BASEURL}/list-items-test-childrem-asthma`,
    sendTestAsthma:`${BASEURL}/test-childrem-asthma`,
    historial:`${BASEURL}/list-history-risk-user`,
    listItemTestMental :`${BASEURL}/list-items-test-mental-health`,
    sendTestMenntal:`${BASEURL}/test-mental-health`,
    listTamizaje:`${NODE_BASEURL}/tests?type=TAMIZAJE`,
    listRiesgo:`${NODE_BASEURL}/tests?type=MARCA EN SALUD`,
    getCheckRisk:(idTest)=>{return `${NODE_BASEURL}/tests/${idTest}`;},
    sendMark:`${NODE_BASEURL}/tests/health-marking`,
    listItemDiabetes :`${NODE_BASEURL}/tests/5`,
    sendTestDiabetes:`${NODE_BASEURL}/tests/deabetes`,
    listItemTestEpoc :`${NODE_BASEURL}/tests/3`,
    sendTestEpoc:`${NODE_BASEURL}/tests/epoc`,
    listItemTesOms :`${NODE_BASEURL}/tests/24`,
    sendTestOms:`${NODE_BASEURL}/tests/rcvOms`,
    sendTestCardiovascular:`${NODE_BASEURL}/tests/framingham`,
    sendValidationTestCardiovascular:`${NODE_BASEURL}/tests/is-cardiovascular`,
    sendValidationTestEPOC:`${NODE_BASEURL}/tests/is-epoc`,
    sendTestHipertensionArterial:`${NODE_BASEURL}/tests/arterialHypertension`,
    sendTestEnfermedadRenalCronica:`${NODE_BASEURL}/tests/chronicKidneyDisease`,
    sendTestPoblacionRiesgo:`${NODE_BASEURL}/tests/populationAtRiskOrPresenceNutritionalAlterations`,
    listItemSRQ :`${NODE_BASEURL}/tests/29`,
    sendTestSRQ:`${NODE_BASEURL}/tests/mentalHealthSRQ`,
    listItemRQC :`${NODE_BASEURL}/tests/30`,
    sendTestRQC:`${NODE_BASEURL}/tests/mentalHealthRQC`,
    listItemSospechaEmbarazo :`${NODE_BASEURL}/tests/23`,
    sendSospechaEmbarazo:`${NODE_BASEURL}/tests/perinatalControlRisk`,
    listFilterTestMH:`${NODE_BASEURL}/tests/28`,
    sendFilterTestMH:`${NODE_BASEURL}/tests/questionnaireRiskFactorsMentalHealth`,
    listTestHighReproductiveRisk:`${NODE_BASEURL}/tests/31`,
    sendTestHighReproductiveRisk:`${NODE_BASEURL}/tests/highReproductiveRisk`,
    listTestDementia:`${NODE_BASEURL}/tests/32`,
    sendTestDementia:`${NODE_BASEURL}/tests/highReproductiveRisk`,
    // validateToken:`${NODE_BASEURL}/token`,
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