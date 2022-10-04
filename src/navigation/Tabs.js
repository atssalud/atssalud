import React,{useEffect} from 'react'
import {Text,TouchableOpacity,Image} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import CargaScreen from '../screens/cargaScreen/CargaScreen';
// import InicioScreen from '../screens/inicioScreen/InicioScreen';
// import { PerfilScreen } from '../screens/perfilScreen/PerfilScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import HomeScreen from '../screens/home/HomeScreen';
import CatchmentScreen from '../screens/catchment/CatchmentScreen';
import PerfilScreen from '../screens/profile/PerfilScreen'


const Tab = createBottomTabNavigator();

export const Tabs = ()=>{

  return (
    <Tab.Navigator
        screenOptions={
            ({route})=>({
           tabBarIcon:({color,focused,size})=>{
                let iconName =''

                switch (route.name) {
                    case 'InicioScreen':
                        iconName = 'home';
                    break;
                    case 'CatchmentScreen':
                        iconName = 'stethoscope';
                    break;
                    case 'PerfilScreen':
                        iconName = 'user';
                    break;
                }
                return <Icon name={iconName} size={25} color={color} />;
            },
            tabBarActiveTintColor:'#222171',
            tabBarInactiveTintColor:'#fff',
            headerStyle: {
                backgroundColor: '#f4511e',
              },
            headerShown:false,
            contentStyle:{
              backgroundColor: 'white',
            },
            tabBarActiveBackgroundColor:'#3465A5',
            tabBarInactiveBackgroundColor:'#3465A5',
            tabBarShowLabel:false
          
        })
        }
        sceneContainerStyle={{ backgroundColor : 'white',}}
        initialRouteName="CatchmentScreen"
        


    >
      <Tab.Screen name="InicioScreen"  component={HomeScreen} options={{ title:''}} />
      <Tab.Screen name="CatchmentScreen" component={CatchmentScreen} options={{title:'Captar',}}  />
      <Tab.Screen name="PerfilScreen" component={PerfilScreen} options={{title:'Perfil'}} />
    </Tab.Navigator>
  );
}