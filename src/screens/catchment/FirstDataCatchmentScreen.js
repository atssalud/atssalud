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

const FirstDataCatchmentScreen = (props) => {

    const navigator = useNavigation()
    const genero=[{'id':'M', 'item':'Masculino'},{'id':'F', 'item':'Femenino'}]
    const [errorAlert,setErrorAlert]= useState(false)
    const [alert,setAlert]= useState(false)

    const data = props.route.params.data
    console.log(data.id)

    const [userRegister, setUserRegister] = useState({
        nombre:(data)?data.first_name:'',
        apellido:(data)?data.last_name:'',
        tipoIdentificacion:(data)?data.dni_type:'',
        numIdentificacion:(data)?data.dni:'',
        direccion:(data)?data.address:'',
        celular:(data)?data.phone:'',
        departamento:(data)?data.state_name:'',
        ciudad:(data)?data.city_name:'',
        correo:(data)?data.email:'',
        fechaNacimiento:(data)?data.birthday:'',
        genero:(data)?data.gender:'',
        edad:(data)?data.age:'',
        id:data.id
    })

    
    const [departaments,setDepartaments]= useState()
    const [cities,setCities]= useState()
    const [dniTypes,setDniTypes]= useState()
    const [eps,setEps]= useState()

    useEffect(() => {
        getDniTypes()
        getDepartaments()
        getEps()
    }, [userRegister.departamento])


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
    // const [error, setError] = useState({
    //     name:'',
    //     email:'',
    //     password:'',
    //     phone:'',
    //     profession:'',
    // })


    // const handleRegister=() =>{
    //     const expReg=/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    //     const errors={}
    //     if(userRegister.name.trim().length < 3 ){
    //         errors.name = 'Cedula inválida.'
    //     }
    //     if (expReg.test(userRegister.email)=== false){
    //         errors.email = 'Correo inválido'
    //     }
    //     if(userRegister.password.trim().length <6){
    //         errors.password = 'La contraseña debe ser mayor a 5 caracteres'
    //     }
    //     if(userRegister.phone.trim().length != 10){
    //         errors.phone = 'Celular inválido.'
    //     }
    //     if(userRegister.profession.trim().length !== 6){
    //         errors.profession = 'Seleccione una profesión'
    //     }
    //     if(userRegister.name.trim().length > 3 && expReg.test(userRegister.email)=== true &&
    //     userRegister.password.trim().length > 5 && userRegister.phone.trim().length === 10 &&
    //     userRegister.password.trim().length > 3){
    //         register()
    //     }
        
    //     setError(errors)
    // }

    const register = async()=>{
    
        const data={
            'first_name':userRegister.nombre,
            'last_name':userRegister.apellido,
            'dni_type':userRegister.tipoIdentificacion,
            'dni':userRegister.numIdentificacion,
            'address':userRegister.direccion,
            'phone':userRegister.celular,
            'state_name':userRegister.departamento,
            'city_name':userRegister.ciudad,
            'email':userRegister.correo,
            'date_birth':userRegister.fechaNacimiento,
            'sex':userRegister.genero,
            'age':userRegister.edad,
        }

        console.log(data)
        navigator.navigate('TypeAlertScreen',{data:userRegister})

        // try {
        //     const resp = await http('post',Endpoint.preRegister, data);
        //     console.log('resp',resp)
        //     setAlert(true)

        // } catch (error) {
        //     console.log('error',error)
        //     setErrorAlert(true)
        // }
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
        setUserRegister({...userRegister, tipoIdentificacion:key}) 
    }
    const departamentSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, departamento:key})
        getCities() 
    }
    const citySelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, ciudad:key}) 
    }
    const tipogeneroSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, genero:value}) 
    }

    var {height}=Dimensions.get('window')
    var dimension=height/3

  return (
    <View style={styles.container}>
        <StatusBar barStyle='dark-content' />

        <ScrollView style={Styles.borderContainer}>

            <View>
                <View style={{flexDirection:'row',}}>
                    <TextInputs
                        label='Nombre'
                        placeholder="Juan José"
                        onChangeText= { (value) => setUserRegister({...userRegister ,nombre:value}) }
                        value={userRegister.nombre}
                        dimension='middle'
                    /> 
                    <TextInputs
                        label='Apellido'
                        placeholder="Andrade Perez"
                        onChangeText= { (value) => setUserRegister({...userRegister ,apellido:value}) }
                        value={userRegister.apellido}
                        dimension='middle'
                    />
                </View>
                <View style={{flexDirection:'row',}}>
                    <ListOptions
                        label='Tipo identificación'
                        options={dniTypes}
                        itemSelect={typeDniSelect}
                        dimension='middle'
                        placeholder={userRegister.tipoIdentificacion}
                        isSelect={(userRegister.tipoIdentificacion)? true:false}
                    />
                    
                    <TextInputs
                        label='Num identificación'
                        placeholder="1234567890"
                        onChangeText= { (value) => setUserRegister({...userRegister ,numIdentificacion:value}) }
                        value={userRegister.numIdentificacion}
                        dimension='middle'
                    />
                </View>
                <View style={{flexDirection:'row',}}>
                    <ListOptions
                        label='Genero'
                        options={genero}
                        itemSelect={tipogeneroSelect}
                        dimension='middle'
                        placeholder={userRegister.genero}
                        isSelect={(userRegister.genero)? true:false}
                    />
                    <TextInputs
                        label='Edad'
                        placeholder="15"
                        onChangeText= { (value) => setUserRegister({...userRegister ,edad:value}) }
                        value={userRegister.edad}
                        dimension='middle'
                    />
                </View>
                <View style={{flexDirection:'row',}}>
                    <TextInputs
                        label='Fecha Nacimiento'
                        placeholder="12/03/1990"

                        onChangeText= { (value) => setUserRegister({...userRegister ,fechaNacimiento:value}) }
                        value={userRegister.fechaNacimiento}
                        dimension='middle'
                    />
                    <TextInputs
                        label='Celular'
                        placeholder="3014567890"
                        onChangeText= { (value) => setUserRegister({...userRegister ,celular:value}) }
                        value={userRegister.celular}
                        dimension='middle'
                    />
                </View>
                <View style={{flexDirection:'row',}}>
                    <ListOptions
                        label='Departamento'
                        options={departaments}
                        itemSelect={departamentSelect}
                        dimension='middle'
                        placeholder={userRegister.departamento}
                        isSelect={(userRegister.departamento)? true:false}
                    />
                    {(userRegister.departamento)?
                        <ListOptions
                        label='Ciudad'
                        options={cities}
                        itemSelect={citySelect}
                        dimension='middle'
                        placeholder={userRegister.ciudad}
                        isSelect={(userRegister.ciudad)? true:false}
                        />
                    
                        :
                        // <TextInputs
                        //     label='Ciudad'
                        //     placeholder="Seleccione"
                        //     dimension='middle'
                        //     value={userRegister.ciudad}
                        // />
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
                
                    }
                    
                </View>
                <View style={{flexDirection:'row',}}>
    
                    <TextInputs
                        label='Dirección'
                        placeholder="cra 6b #34-45"
                        onChangeText= { (value) => setUserRegister({...userRegister ,direccion:value}) }
                        value={userRegister.direccion}
                        dimension='middle'
                    />
                </View> 
                
                <View style={{flexDirection:'row',}}>
                    <TextInputs
                        label='Correo'
                        placeholder="ejemplo@gmail.com"
                        onChangeText= { (value) => setUserRegister({...userRegister ,correo:value}) }
                        value={userRegister.correo}
                    />
                </View>
                
            </View>

            <View style={styles.cButton}>  
                <Button 
                    title="Siguiente"
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
    subtitle:{
        fontFamily:Fonts.REGULAR,
        fontSize:15,
        color:Colors.FONT_COLOR
    },
    subtitle2:{
        fontFamily:Fonts.REGULAR,
        fontSize:16,
        color:Colors.GREY_LIGHT,
        marginTop:10
    },
    cText:{
        borderBottomWidth:2,
        borderColor:Colors.GREY_LIGHT,
        marginBottom:15,
        width:Width/3

    }


})