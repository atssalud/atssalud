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
import IsConnectedScreen from '../IsConnectedScreen';

const LoginScreen = () => {

    const {signIn,errorMessage,removeError,isConnected} = useContext(AuthContext)
    const navigator = useNavigation()

    const [help,setHelp]=useState(false)
    
    const getUser = async()=>{
        const email= await AsyncStorage.getItem('email')
        const isSelected = await AsyncStorage.getItem('isSelected')
        console.log({isSelected})
        if(isSelected === "true"){
            setSelection(true)
        }
        if(isSelected=== null){
            setSelection(true)
        }else{
            setSelection(false)
        }
        
        onChange(email,'email')
        
        
    }
    const getPassword = async()=>{
        const password = await AsyncStorage.getItem('password')
        console.log('password',password)
        onChange2(password,'password')
        console.log('hola',password)
    }

    
    
    const {email,password,onChange} = useForm({
        email,
        password
    })

    const [ netInfo,setNetInfo]=useState(false)

    useEffect(() => {
        const unsubscribe = isConnected(setNetInfo)
        // getUser()
        // getPassword()
        if (errorMessage.length === 0) return;
        if (email === "" || password ===""){
            Alert.alert('Login incorrecto', 'Digite usuario y contraseña')
        }else{
            Alert.alert(
                'Login incorrecto',
                errorMessage,
                [
                    {
                        text:'Ok',
                        onPress: removeError,
                    }
                ]
            )
        }
        return()=>{
            unsubscribe
        }
        
    },[errorMessage,removeError,signIn]);


    const onLogin = () => {
        console.log('onlogin',email,password)
        signIn(email,password,isSelected)
        KeyBoard
    }

    const [isSelected, setSelection] = useState(false);

    const toCall =async ()=>{
        let phoneWithCountryCode = '573175139628';

        let mobile = Platform.OS == 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
    
        await Linking.openURL(`tel:${mobile}`)
    }

    const openWhatsapp= async()=>{
        let msg = '¡Hola necesito ayuda!';
        let phoneWithCountryCode = '573175139628';

        let mobile = Platform.OS == 'ios' ? phoneWithCountryCode : '+' + phoneWithCountryCode;
    
        let url = 'whatsapp://send?text=' + msg + '&phone=' + mobile;
        await Linking.openURL(url).then((data) => {
          console.log('WhatsApp Opened');
        }).catch(() => {
          Alert.alert('Notificación','Asegurate de tener whatsapp instalado en tu teléfono');
        });
    }

    const close=()=>{
        console.log('cerrar')
    }
    const contentHelp =

    <View style={styles.cContentHelp}>
        <Text style={styles.titleContentHelp}>Contactar con GOCARGO</Text>
        {/* <Button 
            title="+57 3175139628"
            onPress={toCall} 
            fill='solid'
        /> */}
        <TouchableOpacity
            onPress={()=>openWhatsapp()}
            style={styles.btnWhatsapp}
        >
            <Icon
                name="logo-whatsapp"
                size={50}
                color={'black'}
            />
        </TouchableOpacity>
        
    </View>

    var {height}=Dimensions.get('window')
    var dimension=height/3

  return (
    <>
        {
            (netInfo=== false)? <IsConnectedScreen/>:
            <View style={styles.container}>
        <StatusBar barStyle='dark-content' />
        
        <View style={{justifyContent:'center',alignItems:'center',marginTop:10, height:dimension}}>
            <Image
                source={require('../../assets/images/logo.jpeg')}
                style={{width:250.0,height:60.0}}
            />
            <View style={{height: 15.0}} />
        </View>

        <View style={Styles.borderContainer}>

            <View>
                <TextInputs
                    label='Correo'
                    placeholder="ejemplo@gmail.com"
                    onChangeText= { (value) => onChange(value, 'email') }
                    value={email}
                /> 
                <TextInputs
                    label='Contraseña'
                    placeholder="Micontraseña"
                    secureTextEntry={true}
                    onChangeText= { (value) => onChange(value, "password") }
                    value={password}
                />
            </View>

            <View style={styles.viewCheckboxContainer}>
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        disabled={false}
                        value={isSelected}
                        onValueChange={(newValue) => setSelection(newValue)}
                        style={styles.checkbox}
                    />
                    <Text style={styles.tRemember}>Recordarme</Text>
                </View>
                <View style={styles.cOlvideContraseña}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={()=>navigator.navigate('RecoverPasswordScreen')}
                    >
                        <Text style={styles.tOlvide}>Olvide mi clave</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.cButton}>  
                <Button 
                    title="Iniciar sesión"
                    onPress={()=> onLogin()} 
                    fill='solid'
                /> 
            </View>
            <View style={styles.containerRegistrate}>
                <Text style={styles.tNuevo}>¿Nuevo Usuario?</Text>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={()=> navigator.navigate('UsuarioRegisterScreen')}
                >
                    <Text style={styles.tRegistrate}> Regístrate</Text>
                </TouchableOpacity>
            </View>
        </View>
        
        {
            (help) ?
                <WindowAlert
                bool={true}
                closeAlert={setHelp}
                content={contentHelp}
                width={50}
                height={2.5}
                btnText={'Cancelar'}
                btnFunction={close}
                type='fill'
                />
            : null
        }
        
            </View>
        }
    </>
    
  )
}
export default LoginScreen;

const styles=StyleSheet.create({
    container:{
        marginHorizontal:50,
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
        justifyContent:'center'
    },
    cButton:{
        marginTop:30,
        marginBottom:10
    }


})
