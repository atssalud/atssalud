import React,{useState,useContext,useEffect} from 'react'
import {View,SafeAreaView,Image,Text,StyleSheet,Platform,TouchableOpacity,ScrollView,KeyBoard,Alert,Linking, StatusBar, Dimensions} from 'react-native'
import CheckBox from '@react-native-community/checkbox';
import { useForm } from '../../hooks/useForm';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API, Endpoint } from '../../environment/Api';
import { AuthContext } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import WindowAlert from '../../components/WindowAlert';
import { Colors } from '../../theme/Colors';
import { Styles } from '../../theme/GlobalStyle';
import TextInputs from '../../components/TextInput';
import { Fonts } from '../../theme/Fonts';
import Button from '../../components/Button';
import ListOptions from '../../components/ListOptions';
import http from '../../services/http';
import InputDate from '../../components/InputDate';

const FirstDataCatchmentScreen = (props) => {

    const navigator = useNavigation()
    const genero=[{'id':'M', 'item':'M'},{'id':'F', 'item':'F'}]
    const [errorAlert,setErrorAlert]= useState(false)
    const [alert,setAlert]= useState(false)
    const today= new Date()

    const data = props.route.params.data
    const dni = props.route.params.dni
    console.log('rr',props.token)

    const [userRegister, setUserRegister] = useState({
        nombre:(Object.keys(data).length === 0)?'':data.first_name,
        apellido:(Object.keys(data).length === 0)?'':data.last_name,
        tipoIdentificacion:(Object.keys(data).length === 0)?'':data.dni_type_name,
        idTipoIdentificacion:(Object.keys(data).length === 0)?'':data.dni_type,
        numIdentificacion:(Object.keys(data).length === 0)?dni:data.dni,
        direccion:(Object.keys(data).length === 0)?'':data.address,
        celular:(Object.keys(data).length === 0)?'':data.phone,
        departamento:(Object.keys(data).length === 0)?'':data.state_name,
        ciudad:(Object.keys(data).length === 0)?'':data.city_name,
        correo:(Object.keys(data).length === 0)?'':data.email,
        fechaNacimiento:(Object.keys(data).length === 0)?'':data.birthday,
        genero:(Object.keys(data).length === 0)?'':data.gender,
        edad:(data.birthday)?today.getFullYear()-data.birthday.split('-')[0]:'',
        ciudad_id:(Object.keys(data).length === 0)?'':data.city,
        departamento_id:(Object.keys(data).length === 0)?'':data.state,
    })

    console.log('fecha', )

   
    const [departaments,setDepartaments]= useState()
    const [cities,setCities]= useState()
    const [dniTypes,setDniTypes]= useState()
    const [eps,setEps]= useState()
    const [error, setError] = useState()
    const [token,setToken]=useState()

    useEffect(() => {
        getDniTypes()
        getDepartaments()
        getEps()
        getToken()
    }, [])

    const getToken =async()=>{
        const userToken = await AsyncStorage.getItem('token')
        setToken(userToken)
    
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
          const res = await http('get',Endpoint.cities(userRegister.departamento))
          console.log('cities',res)
          setCities(res)
        } catch (error) {
          console.log('error',error)
        }
    }

    const dateSelect =(date)=>{
        const edad = today.getFullYear()-date.split('-')[0]
        setUserRegister({...userRegister, fechaNacimiento:date, edad:edad})
        console.log(date)
    }

    const register = async()=>{
    
        const datos={
            'token':token,
            'first_name':userRegister.nombre,
            'last_name':userRegister.apellido,
            'dni_type':userRegister.idTipoIdentificacion,
            'dni':userRegister.numIdentificacion,
            'address':userRegister.direccion,
            'phone':userRegister.celular,
            'state':userRegister.departamento_id,
            'city':userRegister.ciudad_id,
            'email':userRegister.correo,
            'birthday':userRegister.fechaNacimiento,
            'gender':userRegister.genero,
        }
        const updateDatos={
            'token':token,
            'first_name':userRegister.nombre,
            'last_name':userRegister.apellido,
            'dni_type':userRegister.idTipoIdentificacion,
            'dni':userRegister.numIdentificacion,
            'address':userRegister.direccion,
            'phone':userRegister.celular,
            'state':userRegister.departamento_id,
            'city':userRegister.ciudad_id,
            'email':userRegister.correo,
            'birthday':userRegister.fechaNacimiento,
            'gender':userRegister.genero,
            'id':data.id
        }
       
        
        if (Object.keys(data).length === 0){
            try {
                const resp = await http('post',Endpoint.createPatient, datos);
                console.log('resp',resp)
                if(resp.errors){
                    setError(resp.errors)
                }else{
                    navigator.navigate('TypeAlertScreen',{data:userRegister,token:token})
                }
    
            } catch (error) {
                console.log('error',error)
                setErrorAlert(true)
            }
        }else{

            console.log({updateDatos})
            navigator.navigate('TypeAlertScreen',{data:userRegister,token:token})

            // try {
            //     const resp = await http('post',Endpoint.editPatient, datos);
            //     console.log('resp',resp)
            //     if(resp.errors){
            //         setError(resp.errors)
            //     }else{
            //         navigator.navigate('TypeAlertScreen',{data:userRegister,token:token})
            //     }
    
            // } catch (error) {
            //     console.log('error',error)
            //     setErrorAlert(true)
            // }

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

    const typeDniSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, idTipoIdentificacion:key,tipoIdentificacion:value}) 
    }
    const departamentSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, departamento_id:key,departamento:value})
        getCities() 
    }
    const citySelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, ciudad_id:key,ciudad:value}) 
    }
    const tipogeneroSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, genero:key}) 
    }

    var {height}=Dimensions.get('window')
    

  return (
    <View style={styles.container}>
        <StatusBar barStyle='dark-content' />

        <ScrollView style={Styles.borderContainer}>

            <View>
                <TextInputs
                    label='Nombre'
                    placeholder="Juan José"
                    onChangeText= { (value) => setUserRegister({...userRegister ,nombre:value}) }
                    value={userRegister.nombre}

                />
                {(error)?
                    (error.first_name==='')?null:
                    <Text style={styles.textValid}>{error.first_name}</Text>: null
                }
                    
                <TextInputs
                    label='Apellido'
                    placeholder="Andrade Perez"
                    onChangeText= { (value) => setUserRegister({...userRegister ,apellido:value}) }
                    value={userRegister.apellido}

                />
                {(error)?
                    (error.last_name==='')?null:
                    <Text style={styles.textValid}>{error.last_name}</Text>: null
                }

                <ListOptions
                    label='Tipo identificación'
                    options={dniTypes}
                    itemSelect={typeDniSelect}

                    placeholder={userRegister.tipoIdentificacion}
                    isSelect={(userRegister.tipoIdentificacion)? true:false}
                />
                {(error)?
                    (error.dni_type==='')?null:
                    <Text style={styles.textValid}>{error.dni_type}</Text>: null
                }

                <TextInputs
                    label='Num identificación'
                    placeholder="1234567890"
                    onChangeText= { (value) => setUserRegister({...userRegister ,numIdentificacion:value}) }
                    value={userRegister.numIdentificacion}

                />
                {(error)?
                    (error.dni==='')?null:
                    <Text style={styles.textValid}>{error.dni}</Text>: null
                }

                <ListOptions
                    label='Genero'
                    options={genero}
                    itemSelect={tipogeneroSelect}

                    placeholder={userRegister.genero}
                    isSelect={(userRegister.genero)? true:false}
                />
                {(error)?
                    (error.gender==='')?null:
                    <Text style={styles.textValid}>{error.gender}</Text>: null
                }
                
                <InputDate
                    label='F.de nacimiento'
                    dateSelect={dateSelect}
                    type={'date'}

                    text={userRegister.fechaNacimiento}
                />
                {(error)?
                    (error.birthday==='')?null:
                    <Text style={styles.textValid}>{error.birthday}</Text>: null
                }

                <View style={[styles.cText]}>
                    <Text style={styles.text}>Edad:</Text> 
                    <Text style={(userRegister.edad)?styles.tEdad:styles.subtitle2}>{(userRegister.edad)?userRegister.edad:'25'}</Text>
                </View>
                {(userRegister.edad)?null:
                    <Text style={styles.textValid}>La edad es requerida</Text>
                }
                
                
                <TextInputs
                    label='Celular'
                    placeholder="3014567890"
                    onChangeText= { (value) => setUserRegister({...userRegister ,celular:value}) }
                    value={userRegister.celular}

                />
                {(error)?
                    (error.phone==='')?null:
                    <Text style={styles.textValid}>{error.phone}</Text>: null
                }

                <ListOptions
                    label='Departamento'
                    options={departaments}
                    itemSelect={departamentSelect}

                    placeholder={userRegister.departamento}
                    isSelect={(userRegister.departamento)? true:false}
                />
                {(error)?
                    (error.state==='')?null:
                    <Text style={styles.textValid}>{error.state}</Text>: null
                }
                    
                    {(userRegister.departamento)?
                        <View>
                        <ListOptions
                        label='Ciudad'
                        options={cities}
                        itemSelect={citySelect}
                        placeholder={userRegister.ciudad}
                        isSelect={(userRegister.ciudad)? true:false}
                        />
                        {(error)?
                            (error.city==='')?null:
                            <Text style={styles.textValid}>{error.city}</Text>: null
                        }
                        </View>
                        :
                        <View>
                        <View style={styles.cText}>
                            <Text style={styles.text}>Ciudad</Text>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={(userRegister.ciudad)?styles.subtitle:styles.subtitle2}>{(userRegister.ciudad)?userRegister.ciudad:'Seleccionar'}</Text>
                                <Icon
                                    name='chevron-down'
                                    color={Colors.GREY}
                                    size={20}
                                    style={{marginRight:10,marginTop:10}}
                                />
                            </View>
                        </View>
                        {(error)?
                            (error.city==='')?null:
                            <Text style={styles.textValid}>{error.city}</Text>: null
                        }
                        </View>
                    }
                
                    <TextInputs
                        label='Dirección'
                        placeholder="cra 6b #34-45"
                        onChangeText= { (value) => setUserRegister({...userRegister ,direccion:value}) }
                        value={userRegister.direccion}
    
                    />
                    {(error)?
                        (error.address==='')?null:
                        <Text style={styles.textValid}>{error.address}</Text>: null
                    }
                
                    <TextInputs
                        label='Correo'
                        placeholder="ejemplo@gmail.com"
                        onChangeText= { (value) => setUserRegister({...userRegister ,correo:value}) }
                        value={userRegister.correo}
                    />
                    {(error)?
                        (error.email==='')?null:
                        <Text style={styles.textValid}>{error.email}</Text>: null
                    }
                    
                
            </View>

            <View style={styles.cButton}>  
                <Button 
                    title={(data)?"Siguiente":"Registrar"}
                    onPress={()=>register()} 
                    fill='solid'
                /> 
            </View>
    </ScrollView>
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
  )
}
export default FirstDataCatchmentScreen;

const Width=Dimensions.get('window').width

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
        marginBottom:20,

    },
    text:{
        fontFamily:Fonts.BOLD,
        fontSize:15,
        color:Colors.FONT_COLOR
    },
    tEdad:{
        fontFamily:Fonts.REGULAR,
        fontSize:15,
        color:Colors.FONT_COLOR,
        marginTop:10,
        marginBottom:15
    },
    subtitle:{
        fontFamily:Fonts.REGULAR,
        fontSize:15,
        color:Colors.FONT_COLOR,
        marginBottom:15
    },
    subtitle2:{
        fontFamily:Fonts.REGULAR,
        fontSize:16,
        color:Colors.GREY_LIGHT,
        marginTop:10,
        marginBottom:15
    },
    cText:{
        borderBottomWidth:2,
        borderColor:Colors.GREY_LIGHT,
        marginBottom:15,

    },
    textValid:{
        fontSize: 14,
        fontFamily:Fonts.BOLD,
        color:"#ff5d2f",
        marginBottom:10
    },


})