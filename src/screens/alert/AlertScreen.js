import React,{useState,useContext,useEffect} from 'react'
import {View,SafeAreaView,Image,Text,StyleSheet,Platform,TouchableOpacity,ScrollView,KeyBoard,Alert,Linking, StatusBar, Dimensions} from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import { useForm } from '../../hooks/useForm';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API } from '../../environment/Api';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import WindowAlert from '../../components/WindowAlert';
import { Colors } from '../../theme/Colors';
import { Styles } from '../../theme/GlobalStyle';
import TextInputs from '../../components/TextInput';
import { Fonts } from '../../theme/Fonts';
import Button from '../../components/Button';
import ListOptions from '../../components/ListOptions';

const AlertScreen = () => {

    const navigator = useNavigation()

    const profession=[{'id':'1','profession':'Médico General'},{'id':'2','profession':'Odontólogo'},{'id':'3','profession':'Oncólogo'},{'id':'4','profession':'Enfermer@'},]

    const [errorAlert,setErrorAlert]= useState(false)
    const [alert,setAlert]= useState(false)

    const [userRegister, setUserRegister] = useState({
        name:'',
        email:'',
        password:'',
        phone:'',
        profession:'',
    })

    const [error, setError] = useState({
        name:'',
        email:'',
        password:'',
        phone:'',
        profession:'',
    })


    const handleRegister=() =>{
        const expReg=/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
        const errors={}
        if(userRegister.name.trim().length < 3 ){
            errors.name = 'Cedula inválida.'
        }
        if (expReg.test(userRegister.email)=== false){
            errors.email = 'Correo inválido'
        }
        if(userRegister.password.trim().length <6){
            errors.password = 'La contraseña debe ser mayor a 5 caracteres'
        }
        if(userRegister.phone.trim().length != 10){
            errors.phone = 'Celular inválido.'
        }
        if(userRegister.profession.trim().length !== 6){
            errors.profession = 'Seleccione una profesión'
        }
        if(userRegister.name.trim().length > 3 && expReg.test(userRegister.email)=== true &&
        userRegister.password.trim().length > 5 && userRegister.phone.trim().length === 10 &&
        userRegister.password.trim().length > 3){
            register()
        }
        
        setError(errors)
    }

    const register = async()=>{
    
        const data={
            "nombre": userRegister.name,
            "correo": userRegister.email,
            "contraseña": userRegister.password ,
            "celular": userRegister.phone,
            "profesion": userRegister.profession,
        }

        console.log(data)

        try {
            const resp = await http('post',Endpoint.preRegister, data);
            console.log('resp',resp)
            setAlert(true)

        } catch (error) {
            console.log('error',error)
            setErrorAlert(true)
        }
    }

    const contentErrorAlert=
        <View style={styles.cAlert}>
            <Image
                source={require('../../assets/icons/modal-alert-Icon.png')}
                style={styles.imageAlert}
            />
            <Text style={styles.title}>Notificación</Text>
            <Text style={styles.textAlertError}>!Ha ocurrido un error¡ , Registro no exitoso</Text>
        </View>

    const contentAlert=
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/checkCircle.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.title}>Notificación</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>Se ha registrado exitosamente</Text>
        </View>
    </View>

    const close=()=>{
        navigator.navigate('LoginScreen')
    }

    const itemSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, profession:value}) 
    }

    var {height}=Dimensions.get('window')
    var dimension=height/3

  return (
    <View style={styles.container}>
        <StatusBar barStyle='dark-content' />

        <View style={Styles.borderContainer}>

            
        </View>
        
    </View>
  )
}
export default AlertScreen;

const styles=StyleSheet.create({
    container:{
        marginHorizontal:30,
        marginVertical:20,
    },
    viewCheckboxContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    checkboxContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    tRemember:{
        fontFamily:Fonts.REGULAR,
        color:Colors.FONT_COLOR
    },
    tOlvide:{
        fontFamily:Fonts.LIGHT,
        borderBottomWidth:1,
        borderBottomColor:Colors.GREY_LIGHT,
        color:Colors.FONT_COLOR
    },
    tNuevo:{
        fontFamily:Fonts.REGULAR,
        fontSize:15,
        color:Colors.FONT_COLOR
    },
    tRegistrate:{
        fontFamily:Fonts.BOLD,
        fontSize:15,
        borderBottomWidth:1,
        color:Colors.FONT_COLOR
    },
    containerRegistrate:{
        flexDirection:'row',
        justifyContent:'center',
        marginBottom:20,
    },
    cButton:{
        marginTop:10,
    }


})