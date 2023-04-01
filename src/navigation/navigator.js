import React, { useContext, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/login/LoginScreen';
import UsuarioRegisterScreen from '../screens/register/UsuarioRegistroScreen';
import { AuthContext } from '../context/AuthContext';
import { Tabs } from './Tabs';
import RecoverPasswordScreen from '../screens/login/RecoverPasswordScreen';
import LoadingScreen from '../screens/LoadingScreen'
import MyDataScreen from '../screens/profile/myData/MyDataScreen'
import { Colors } from '../theme/Colors';
import FirstDataCatchmentScreen from '../screens/catchment/FirstDataCatchmentScreen';
import SecondDataCatchmentScreen from '../screens/catchment/SecondDataCatchmentScreen';
import AlertScreen from '../screens/alert/AlertScreen';
import BankDataScreen from '../screens/profile/bankData/BankDataScreen';
import EditbankDataScreen from '../screens/profile/bankData/EditbankDataScreen';
import EditMyDataScreen from '../screens/profile/myData/EditMyDataScreen';
import TypeAlertScreen from '../screens/catchment/TypeAlertScreen';
import TestCardiovascularScreen from '../screens/catchment/TestCardiovascularScreen';
import ViewAlertScreen from '../screens/catchment/ViewAlertScreen';
import TestAsthmaScreen from '../screens/catchment/TestAsthmaScreen';
import TestEpocScreen from '../screens/catchment/TestEpocScreen';
import ListHistoryRiskUserScreen from '../screens/catchment/ListHistoryRiskUserScreen';
import UpdateDataPatientScreen from '../screens/catchment/UpdateDataPatientScreen';
import DataPatientScreen from '../screens/catchment/DataPatientScreen';
import TestMentalHealthScreen from '../screens/catchment/TestMentalHealthScreen';
import TypeAlertSkeletonScreen from '../screens/skeleton/TypeAlertSkeletonScreen';
import DataPatientSkeletonScreen from '../screens/skeleton/DataPatientSkeletonScreen';
import TestSkeletonScreen from '../screens/skeleton/TestSkeletonScreen';
import ViewAlertSkeletonScreen from '../screens/skeleton/ViewAlertSkeletonScreen';
import FilterTestEpocScreen from '../screens/catchment/FilterTestEpocScreen';
import SupportScreen from '../screens/profile/SupportScreen';
import NetInfo from "@react-native-community/netinfo";
import IsConnectedScreen from '../screens/IsConnectedScreen';
import FailedService from '../screens/catchment/FailedService';
import CatchmentOptionsScreen from '../screens/catchment/CatchmentOptionsScreen';
import TypeRiskScreen from '../screens/catchment/TypeRiskScreen';
import TestRiskScreen from '../screens/catchment/TestRiskScreen';
import TestDiabetesScreen from '../screens/catchment/TestDiabetesScreen';
import TypeRiskScreen2 from '../screens/catchment/TypeRiskScreen2';
import FilterTestCardiovascular from '../screens/catchment/FilterTestCardiovascular';
import TestHipertensionArterial from '../screens/catchment/TestHipertensionArterial';
import FilterTestEnfermedadRenalCronico from '../screens/catchment/FilterTestEnfermedadRenalCronico';
import TestEnfermedadRenalCronica from '../screens/catchment/TestEnfermedadRenalCronica';
import TestPoblacionRiesgo from '../screens/catchment/TestPoblacionRiesgo';
import TestCardiovascularOms from '../screens/catchment/TestCardiovascularOms';
import FilterMentalHealth from '../screens/catchment/MentalHealth/FilterMentalHealth';
import FilterItemTPsicosocialesMH from '../screens/catchment/MentalHealth/FilterItemTPsicosocialesMH';
import FilterItemPRiesgoMH from '../screens/catchment/MentalHealth/FilterItemPRiesgoMH';
import TestSRQ from '../screens/catchment/MentalHealth/TestSRQ';
import TestRQC from '../screens/catchment/MentalHealth/TestRQC';
import FilterTestSRQ from '../screens/catchment/MentalHealth/FilterTestSRQ';
import FilterItemTestMaternoPerinatal from '../screens/catchment/FilterItemTestMaternoPerinatal';
import TestSuspectedPregnancy from '../screens/catchment/TestSuspectedPregnancy';
import FilterTestMH from '../screens/catchment/MentalHealth/FilterTestMH';
import TestHighReproductiveRisk from '../screens/catchment/TestHighReproductiveRisk';
import TestDementia from '../screens/catchment/MentalHealth/TestDementia';
import TestAssist from '../screens/catchment/MentalHealth/TestAssist';
import PymentScreen from '../screens/profile/PymentScreen';
import TestSchizophrenia from '../screens/catchment/MentalHealth/TestSchizophrenia';
import ViewAlertScreen2 from '../screens/catchment/ViewAlertScreen2';
import ChangePasswordScreen from '../screens/profile/myData/ChangePasswordScreen';
import TestRiskCancerScreen from '../screens/catchment/TestRiskCancerScreen';
import TestRiskInfecciontvScreen from '../screens/catchment/TestRiskInfecciontvScreen';
import TestBreastCancer from '../screens/catchment/Cancer/TestBreastCancer';
import TestRheumatoidArthritis from '../screens/catchment/TestRheumatoidArthritis';
import RiskMaternoPerinatal from '../screens/catchment/MaternoPerinatal/RiskMaternoPerinatal';


const Stack = createNativeStackNavigator();

const Navigator = () => {

  const {status} = useContext(AuthContext)

  if (status === 'checking') return <LoadingScreen />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.PRIMARY_COLOR,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        contentStyle: {
          backgroundColor: 'white',
        },

      }}
    >

      {
        (status !== 'authenticated')
          ? (
            <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false, }} />
              <Stack.Screen name="UsuarioRegisterScreen" component={UsuarioRegisterScreen} options={{ title: 'Registro', headerShown: false }} />
              <Stack.Screen name="RecoverPasswordScreen" component={RecoverPasswordScreen} options={{
                title: 'Recuperar Contraseña', headerStyle: {
                  backgroundColor: Colors.SECONDARY_COLOR,
                },
              }} />
              <Stack.Screen name="FailedService" component={FailedService} options={{  title: 'Conexión'}} />

            </>
          )

          : (
            <>
              {/* <Stack.Screen name="FilterTestEpocScreen" component={FilterTestEpocScreen} options={{  title: 'Filtro Test EPOC'  }} /> */}
              <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
              <Stack.Screen name="FirstDataCatchmentScreen" component={FirstDataCatchmentScreen} options={{ title: 'Captación' }} />
              <Stack.Screen name="SecondDataCatchmentScreen" component={SecondDataCatchmentScreen} options={{ title: 'Captación' }} />
              <Stack.Screen name="AlertScreen" component={AlertScreen} />
              <Stack.Screen name="MyDataScreen" component={MyDataScreen} options={{ title: 'Mis datos', }} />
              <Stack.Screen name="BankDataScreen" component={BankDataScreen} options={{ title: 'Mis datos bancarios', }} />
              <Stack.Screen name="EditMyDataScreen" component={EditMyDataScreen} options={{ title: 'Editar Mis Datos', }} />
              <Stack.Screen name="EditbankDataScreen" component={EditbankDataScreen} options={{ title: 'Mis datos bancarios', }} />
              <Stack.Screen name="TypeAlertScreen" component={TypeAlertScreen} options={{ title: 'Riesgos a evaluar', }} />
              <Stack.Screen name="TestCardiovascularScreen" component={TestCardiovascularScreen} options={{ title: 'Test Cardiovascular', }} />
              <Stack.Screen name="ViewAlertScreen" component={ViewAlertScreen} options={{ title: 'Resultado Test', headerLeft: null }} />
              <Stack.Screen name="TestAsthmaScreen" component={TestAsthmaScreen} options={{ title: 'Test Asma', }} />
              <Stack.Screen name="TestEpocScreen" component={TestEpocScreen} options={{ title: 'Test EPOC', }} />
              <Stack.Screen name="ListHistoryRiskUserScreen" component={ListHistoryRiskUserScreen} options={{ title: 'Historial', }} />
              <Stack.Screen name="UpdateDataPatientScreen" component={UpdateDataPatientScreen} options={{ title: 'Actualizar Datos', }} />
              <Stack.Screen name="DataPatientScreen" component={DataPatientScreen} options={{ title: 'Datos del Paciente', }} />
              <Stack.Screen name="TestMentalHealthScreen" component={TestMentalHealthScreen} options={{ title: 'Test Salud Mental', }} />
              <Stack.Screen name="TypeAlertSkeletonScreen" component={TypeAlertSkeletonScreen} options={{ headerShown: false }} />
              <Stack.Screen name="DataPatientSkeletonScreen" component={DataPatientSkeletonScreen} options={{ headerShown: false }} />
              <Stack.Screen name="TestSkeletonScreen" component={TestSkeletonScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ViewAlertSkeletonScreen" component={ViewAlertSkeletonScreen} options={{ headerShown: false }} />
              <Stack.Screen name="FilterTestEpocScreen" component={FilterTestEpocScreen} options={{ title: 'Filtro Test EPOC'}} />
              <Stack.Screen name="SupportScreen" component={SupportScreen} options={{ title: 'Soporte'}} />
              <Stack.Screen name="FailedService" component={FailedService} options={{  title: 'Conexión'}} />
              <Stack.Screen name="CatchmentOptionsScreen" component={CatchmentOptionsScreen} options={{  title: 'Opciones'}} />
              <Stack.Screen name="TypeRiskScreen" component={TypeRiskScreen} options={{  title: 'Lista de Marcas'}} />
              <Stack.Screen name="TestRiskScreen" component={TestRiskScreen} options={{  title: 'Marca en Salud'}}/>
              <Stack.Screen name="TestDiabetesScreen" component={TestDiabetesScreen} options={{  title: 'Test Diabetes'}}/>
              <Stack.Screen name="TypeRiskScreen2" component={TypeRiskScreen2} options={{  title: 'Marca en Salud'}}/>
              <Stack.Screen name="FilterTestCardiovascular" component={FilterTestCardiovascular} options={{  title: 'Filtro Test Cardiovascular '}}/>
              <Stack.Screen name="TestEnfermedadRenalCronica" component={TestEnfermedadRenalCronica} options={{  title: 'Test Enfermedad Renal Crónica '}}/>
              <Stack.Screen name="TestHipertensionArterial" component={TestHipertensionArterial} options={{  title: 'Test Hipertensión Arterial'}}/>
              <Stack.Screen name="FilterTestEnfermedadRenalCronico" component={FilterTestEnfermedadRenalCronico} options={{  title: ' Filtro Test ERC'}}/>
              <Stack.Screen name="TestPoblacionRiesgo" component={TestPoblacionRiesgo} options={{  title: 'Test Población en Riesgo ...'}}/>
              <Stack.Screen name="TestCardiovascularOms" component={TestCardiovascularOms} options={{  title: 'Test Cardiovascular'}}/>
              <Stack.Screen name="FilterMentalHealth" component={FilterMentalHealth} options={{  title: 'Salud Mental'}}/>
              <Stack.Screen name="FilterItemTPsicosocialesMH" component={FilterItemTPsicosocialesMH} options={{  title: 'T. Psicosociales'}}/>
              <Stack.Screen name="FilterItemPRiesgoMH" component={FilterItemPRiesgoMH} options={{  title: 'Población en Riesgo ...'}}/>
              <Stack.Screen name="TestSRQ" component={TestSRQ} options={{  title: 'Test SRQ'}}/>
              <Stack.Screen name="TestRQC" component={TestRQC} options={{  title: 'Test RQC'}}/>
              <Stack.Screen name="FilterTestSRQ" component={FilterTestSRQ} options={{  title: 'Filtro Test SRQ'}}/>
              <Stack.Screen name="FilterItemTestMaternoPerinatal" component={FilterItemTestMaternoPerinatal} options={{  title: 'Filtro Test Materno Perinatal'}}/>
              <Stack.Screen name="TestSuspectedPregnancy" component={TestSuspectedPregnancy} options={{  title: 'Test Sospecha Embarazo'}}/>
              <Stack.Screen name="FilterTestMH" component={FilterTestMH} options={{  title: 'Filtro Test Salud Mental'}}/>
              <Stack.Screen name="TestHighReproductiveRisk" component={TestHighReproductiveRisk} options={{  title: 'Test Alto Riesgo Reproductivo'}}/>
              <Stack.Screen name="TestDementia" component={TestDementia} options={{  title: 'Test Demencia'}}/>
              <Stack.Screen name="TestAssist" component={TestAssist} options={{  title: 'Test Assist'}}/>
              <Stack.Screen name="PymentScreen" component={PymentScreen} options={{  title: 'Pagos'}}/>
              <Stack.Screen name="TestSchizophrenia" component={TestSchizophrenia} options={{  title: 'Test Esquizofrenia'}}/>
              <Stack.Screen name="ViewAlertScreen2" component={ViewAlertScreen2} options={{  title: 'Resultado Test', headerLeft: null}}/>
              <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{  title: 'Cambiar Contraseña'}}/>
              <Stack.Screen name="TestRiskCancerScreen" component={TestRiskCancerScreen} options={{  title: 'Marca en Salud'}}/>
              <Stack.Screen name="TestRiskInfecciontvScreen" component={TestRiskInfecciontvScreen} options={{  title: 'Marca en Salud'}}/>
              <Stack.Screen name="TestBreastCancer" component={TestBreastCancer} options={{  title: 'Test Cancer Mama'}}/>
              <Stack.Screen name="TestRheumatoidArthritis" component={TestRheumatoidArthritis} options={{  title: 'Test Artritis Reumatoidea'}}/>
              <Stack.Screen name="RiskMaternoPerinatal" component={RiskMaternoPerinatal} options={{  title: 'Materno Perinatal'}}/>

            </>
          )
      }
    </Stack.Navigator>
  );
}

export default Navigator;