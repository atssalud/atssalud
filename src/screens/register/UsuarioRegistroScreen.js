import React,{useState,useContext,useEffect} from 'react'
import {View,Image,Text,StyleSheet,TouchableOpacity,ScrollView,KeyBoard,Alert,Linking, StatusBar, Dimensions} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API, Endpoint } from '../../environment/Api';
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
import http from '../../services/http';

const UsuarioRegisterScreen = () => {

    const navigator = useNavigation()

    // const profession=[{'id':'1','profession':'Médico General'},{'id':'2','profession':'Odontólogo'},{'id':'3','profession':'Oncólogo'},{'id':'4','profession':'Enfermer@'},]

    const [errorAlert,setErrorAlert]= useState(false)
    const [alert,setAlert]= useState(false)
    const [profession,setProfession]= useState()
    const [departaments,setDepartaments]= useState()
    const [cities,setCities]= useState()
    const [dniTypes,setDniTypes]= useState()
    const [eps,setEps]= useState()
    const [message,setMessage]= useState()

    const [userRegister, setUserRegister] = useState({
        dni:'',
        dni_type:'',
        first_name:'',
        last_name:'',
        address:'',
        city:'',
        state:'',
        phone:'',
        profession:'',
        company:'',
        email:'',
        password:'',
        same_password:'',
    })

    const [error, setError] = useState()

    useEffect(() => {
        getDniTypes()
        getProfessions()
        getDepartaments()
        getEps()
        if (userRegister.state){
            getCities()
        }
    }, [userRegister.state])
    

    const getProfessions = async()=>{
        try {
          const res = await http('get',Endpoint.professions)
          setProfession(res)
        } catch (error) {
          console.log('error',error)
        }
    }

    const getDepartaments = async()=>{
        try {
          const res = await http('get',Endpoint.departaments)
          setDepartaments(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getDniTypes = async()=>{
        try {
          const res = await http('get',Endpoint.dniTypes)
          setDniTypes(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getEps = async()=>{
        try {
          const res = await http('get',Endpoint.eps)
          setEps(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getCities = async()=>{
        console.log('dep',userRegister.state)
        try {
          const res = await http('get',Endpoint.cities(userRegister.state))
          console.log('cities',res)
          setCities(res)
        } catch (error) {
          console.log('error',error)
        }
    }

    const register = async()=>{
        
        const send={
            "dni":userRegister.dni.trim(),
            "dni_type":userRegister.dni_type,
            "first_name":userRegister.first_name.trim(),
            "last_name":userRegister.last_name.trim(),
            "address":userRegister.address.trim(),
            "city":userRegister.city,
            "state":userRegister.state,
            "phone":userRegister.phone.trim(),
            "profession":userRegister.profession,
            "company":userRegister.company,
            "email":userRegister.email.trim(),
            "password":userRegister.password.trim(),
            "same_password":userRegister.same_password.trim()
        }

        console.log(send)

        try {
            const resp = await http('post',Endpoint.signUp, send);
            console.log('resp',resp)
            if(resp.errors){
                setError(resp.errors)
            }else{
                if(resp.success===false){
                    setMessage(resp.message)
                    setErrorAlert(true)
                }else{
                    setAlert(true)
                }
                
            }
            

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
            <Text style={styles.tTitleAlert}>Notificación</Text>
            <Text style={styles.textAlertError}>{(message)?message:'!Ha ocurrido un error¡ , Registro no exitoso'}</Text>
        </View>

    const contentAlert=
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/checkCircle.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.tTitleAlert}>Notificación</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>Se ha registrado exitosamente</Text>
        </View>
    </View>

    const close=()=>{
        navigator.navigate('LoginScreen')
    }

    const typedniSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, dni_type:key}) 
    }
    const citySelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, city:key}) 
    }
    const departamentSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, state:key}) 
    }
    const professionSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, profession:key}) 
    }
    const epsSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, company:key}) 
    }

    var {height}=Dimensions.get('window')
    var dimension=height/3

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container} >
        <StatusBar barStyle='dark-content' />
        
        <View style={{justifyContent:'center',alignItems:'center',marginTop:10, height:dimension/2}}>
            <Image
                source={require('../../assets/images/logo.jpeg')}
                style={{width:250.0,height:60.0}}
            />
            <View style={{height: 15.0}} />
        </View>

        <View style={Styles.borderContainer}>

            <View>
                <TextInputs
                    label='Nombre'
                    placeholder="Juan José"
                    onChangeText= { (value) => setUserRegister({...userRegister ,first_name:value}) }
                    value={userRegister.first_name}
                /> 
                {(error)?
                    (error.first_name==='')?null:
                    <Text style={styles.textValid}>{error.first_name}</Text>: null   
                }
                <TextInputs
                    label='Apellido'
                    placeholder="Beltran Perez"
                    onChangeText= { (value) => setUserRegister({...userRegister ,last_name:value}) }
                    value={userRegister.last_name}
                />
                {(error)?
                    (error.last_name==='')?null:
                    <Text style={styles.textValid}>{error.last_name}</Text>: null   
                }
                <ListOptions
                    label='Tipo de documento'
                    options={dniTypes}
                    itemSelect={typedniSelect}
                /> 
                {(error)?
                    (error.dni_type==='')?null:
                    <Text style={styles.textValid}>{error.dni_type}</Text>: null   
                }
                <TextInputs
                    label='Numero de documento'
                    placeholder="1134567890"
                    onChangeText= { (value) => setUserRegister({...userRegister ,dni:value}) }
                    value={userRegister.dni}
                /> 
                {(error)?
                    (error.dni==='')?null:
                    <Text style={styles.textValid}>{error.dni}</Text>: null   
                }
                <ListOptions
                    label='Departamento'
                    options={departaments}
                    itemSelect={departamentSelect}
                    placeholder='Dpto donde reside'
                />
                {(error)?
                    (error.state==='')?null:
                    <Text style={styles.textValid}>{error.state}</Text>: null   
                } 
                {
                    (userRegister.state)?
                    <>
                    <ListOptions
                        label='Ciudad'
                        options={cities}
                        itemSelect={citySelect}
                        placeholder='Ciudad donde reside'
                    />
                    {(error)?
                        (error.city==='')?null:
                        <Text style={styles.textValid}>{error.city}</Text>: null   
                    }
                    </>
                    :null
                }
                <TextInputs
                    label='Dirección'
                    placeholder="Cra 58 # 76 -56"
                    onChangeText= { (value) => setUserRegister({...userRegister ,address:value}) }
                    value={userRegister.address}
                /> 
                {(error)?
                    (error.address==='')?null:
                    <Text style={styles.textValid}>{error.address}</Text>: null   
                }
                <TextInputs
                    label='Celular'
                    placeholder="3014567890"
                    onChangeText= { (value) => setUserRegister({...userRegister ,phone:value}) }
                    value={userRegister.phone}
                />
                {(error)?
                    (error.phone==='')?null:
                    <Text style={styles.textValid}>{error.phone}</Text>: null   
                }
                <ListOptions
                    label='Profesión'
                    options={profession}
                    itemSelect={professionSelect}
                />
                {(error)?
                    (error.profession==='')?null:
                    <Text style={styles.textValid}>{error.profession}</Text>: null   
                }
                <ListOptions
                    label='EPS'
                    options={eps}
                    itemSelect={epsSelect}
                />
                {(error)?
                    (error.company==='')?null:
                    <Text style={styles.textValid}>{error.company}</Text>: null   
                }
                <TextInputs
                    label='Correo'
                    placeholder="ejemplo@gmail.com"
                    onChangeText= { (value) => setUserRegister({...userRegister ,email:value}) }
                    value={userRegister.email}
                />
                {(error)?
                    (error.email==='')?null:
                    <Text style={styles.textValid}>{error.email}</Text>: null   
                }
                <TextInputs
                    label='Contraseña'
                    placeholder="Micontraseña"
                    secureTextEntry={true}
                    onChangeText= { (value) => setUserRegister({...userRegister ,password:value}) }
                    value={userRegister.password}
                />
                {(error)?
                    (error.password==='')?null:
                    <Text style={styles.textValid}>{error.password}</Text>: null   
                }
                <TextInputs
                    label='Repetir Contraseña'
                    placeholder="Micontraseña"
                    secureTextEntry={true}
                    onChangeText= { (value) => setUserRegister({...userRegister ,same_password:value}) }
                    value={userRegister.same_password}
                />
                {(error)?
                    (error.same_password==='')?null:
                    <Text style={styles.textValid}>{error.same_password}</Text>: null   
                }
            </View>

            <View style={styles.cButton}>  
                <Button 
                    title="Registrarme"
                    onPress={()=> register()} 
                    fill='solid'
                /> 
            </View>
            <View style={styles.containerRegistrate}>
                <Text style={styles.tNuevo}>Tengo una cuenta</Text>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={()=> navigator.navigate('LoginScreen')}
                >
                    <Text style={styles.tRegistrate}> Iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
        {
            (errorAlert) ?
                <WindowAlert
                bool={true}
                closeAlert={setErrorAlert}
                content={contentErrorAlert}
                width={50}
                height={3}
                btnText={'Aceptar'}
                btnFunction={close}
                />
            : null
        }
        {
            (alert) ?
                <WindowAlert
                bool={true}
                closeAlert={setAlert}
                content={contentAlert}
                width={50}
                height={3}
                btnText={'Aceptar'}
                btnFunction={close}
                />
            : null
        }
       
       </View>   
    </ScrollView>
  )
}
export default UsuarioRegisterScreen;

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
    },
    textValid:{
        fontSize: 14,
        color:Colors.PRIMARY_COLOR,
        fontFamily:Fonts.BOLD,
        marginTop:-10,
        marginBottom:10
    },
    imageAlert:{
        width:60,
        height:60,
        bottom:20,
        marginTop:10
    },
    cAlert:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:20
    },
    textAlertError:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.REGULAR,
        fontSize:15
    },
    textAlert:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.REGULAR,
        fontSize:15
    },
    ctextAlert:{
        marginTop:10,
        alignItems: 'center'
    },
    tTitleAlert:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.BOLD,
        fontSize:18
    }

})