import React,{useContext} from 'react';
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

const Stack = createNativeStackNavigator();

const Navigator = () => {

  const {status} = useContext( AuthContext)
  
  if (status === 'checking') return <LoadingScreen/>;

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
            headerTitleAlign:'center',
            contentStyle:{
              backgroundColor: 'white',
            },
            
          }}
      >
        
        {
          (status !== 'authenticated')
            ? (
              <>
              <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown:false,}}/>
              <Stack.Screen name="UsuarioRegisterScreen" component={UsuarioRegisterScreen} options={{title: 'Registro',headerShown:false}} />
              <Stack.Screen name="RecoverPasswordScreen" component={RecoverPasswordScreen} options={{title: 'Recuperar Contraseña',headerStyle: {
              backgroundColor: Colors.SECONDARY_COLOR,
            },}} />
            
              </>
            )
            
            : (
              <>
              <Stack.Screen name="Tabs" component={Tabs} options={{headerShown:false}} />
              <Stack.Screen name="FirstDataCatchmentScreen" component={FirstDataCatchmentScreen} options={{title: 'Captación'}}/>
              <Stack.Screen name="SecondDataCatchmentScreen" component={SecondDataCatchmentScreen} options={{title: 'Captación'}}/>
              <Stack.Screen name="AlertScreen" component={AlertScreen}/>
              <Stack.Screen name="MyDataScreen" component={MyDataScreen} options={{title: 'Mis datos',}} />
              <Stack.Screen name="BankDataScreen" component={BankDataScreen} options={{title: 'Mis datos bancarios',}} />
              <Stack.Screen name="EditMyDataScreen" component={EditMyDataScreen} options={{title: 'Editar Mis Datos',}} />
              <Stack.Screen name="EditbankDataScreen" component={EditbankDataScreen} options={{title: 'Mis datos bancarios',}} />
              <Stack.Screen name="TypeAlertScreen" component={TypeAlertScreen} options={{title: 'Alertas a evaluar',}} />
              <Stack.Screen name="TestCardiovascularScreen" component={TestCardiovascularScreen} options={{title: 'Test Cardiovascular',}} />
              <Stack.Screen name="ViewAlertScreen" component={ViewAlertScreen} options={{title: 'Resultado Test',}} />
              <Stack.Screen name="TestAsthmaScreen" component={TestAsthmaScreen} options={{title: 'Test Asma',}} />
              <Stack.Screen name="TestEpocScreen" component={TestEpocScreen} options={{title: 'Test Epoc',}} />
              <Stack.Screen name="ListHistoryRiskUserScreen" component={ListHistoryRiskUserScreen} options={{title: 'Historial',}} />
              <Stack.Screen name="UpdateDataPatientScreen" component={UpdateDataPatientScreen} options={{title: 'Actualizar Datos',}} />
              <Stack.Screen name="DataPatientScreen" component={DataPatientScreen} options={{title: 'Datos del Paciente',}} />
              </>
            )
        }
      </Stack.Navigator>
  );
}

export default Navigator;