import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Endpoint } from '../../environment/Api'
import http from '../../services/http'
import { Colors } from '../../theme/Colors'
import { Fonts } from '../../theme/Fonts'
import { Styles } from '../../theme/GlobalStyle'
import ListOptions from '../../components/ListOptions';
import TextInputs from '../../components/TextInput';
import Button from '../../components/Button'
import WindowAlert from '../../components/WindowAlert'
import Icon from 'react-native-vector-icons/FontAwesome';
import Checkbox from '../../components/CheckBox'
import { AuthContext } from '../../context/AuthContext'

const UpdateDataPatientScreen = (props) => {
    const {logOut} = useContext(AuthContext)

    const navigator = useNavigation()

    const etnia=[{'id':'1', 'item':'Indígena'},{'id':'2', 'item':'ROM(Gitano)'},{'id':'3', 'item':'Raizal'},{'id':'4', 'item':'Palenquero'},
                  {'id':'5', 'item':'Negro,Mulato,Afrocolombiano o Afrodescendiente'},{'id':'6', 'item':'Otro'},{'id':'7', 'item':'Ninguno'}]

    const grupoPoblacional=[{'id':'1', 'item':'Personas trabajadoras sexuales'},{'id':'2', 'item':'Mujeres transgénero'},{'id':'3', 'item':'Hombres transgénero'},{'id':'4', 'item':'Hombres que tienen relaciones sexuales con otros hombres'},
                  {'id':'5', 'item':'Habitantes de la calle'},{'id':'6', 'item':'Población privada de la libertad'},{'id':'7', 'item':'Migratoria'},{'id':'8', 'item':'Desmovilizados'},
                  {'id':'9', 'item':'Desplazados'},{'id':'10', 'item':'Población infantil a cargo del ICBF'},{'id':'11', 'item':'Víctimas del conflicto armado'},{'id':'12', 'item':'Población en centros psiquiátricos'},
                  {'id':'13', 'item':'Poblaciones en situación de discapacidad'},{'id':'14', 'item':'Otro'},{'id':'15', 'item':'Ninguno'}]
    
    const [errorAlert,setErrorAlert]= useState(false)
    const [alert,setAlert]= useState(false)
    const [checkboxEmail,setCheckboxEmail]= useState(false)

    const today= new Date()

    const data = props.route.params.data

    const [userRegister, setUserRegister] = useState({
        nombre:data.first_name,
        apellido:data.last_name,
        tipoIdentificacion:data.dni_type_name,
        idTipoIdentificacion:data.dni_type,
        numIdentificacion:data.dni,
        direccion:'',
        celular:'',
        telefono:'',
        departamento:'',
        ciudad:'',
        correo:'',
        fechaNacimiento:data.birthday,
        genero:data.gender,
        edad:(data.birthday)?today.getFullYear()-data.birthday.split('-')[0]:'',
        ciudad_id:'',
        departamento_id:'',
        etnia:'',
        etniaId:'',
        grupoPoblacional:'',
        grupoPoblacionalId:''
    })

    console.log('fecha', )

   
    const [departaments,setDepartaments]= useState()
    const [cities,setCities]= useState()
    const [dniTypes,setDniTypes]= useState()
    const [eps,setEps]= useState()
    const [error, setError] = useState()
    const [token,setToken]=useState()

    useEffect(() => {
        navigator.setOptions({
            headerRight:()=>(
                <TouchableOpacity
                    style={{padding:5}}
                    onPress={() => navigator.replace('Tabs', { screen: 'CatchmentScreen' })}
                >
                    <Icon
                        name="stethoscope"
                        color= {'white'}
                        size={25}
                    />
                </TouchableOpacity>
            ),
          })
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
          if(res.message==='token no válido'){
            logOut()
          }
          setDniTypes(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getEps = async()=>{
        try {
          const res = await http('get',Endpoint.eps)
          if(res.message==='token no válido'){
            logOut()
          }
          setEps(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getCities = async(id)=>{
        console.log('dep',userRegister.departamento_id)
        try {
          const res = await http('get',Endpoint.cities(id))
          console.log('cities',res)
          setCities(res)
        } catch (error) {
          console.log('error',error)
        }
    }

    // const handlePhone =()=>{
    //     const errors={}
    //     if(userRegister.celular.trim().length === 0){
    //         errors.celular='El célular es requerido'
    //     }
    //     if(userRegister.celular.trim().length !==10){
    //         errors.celular='El célular debe tener 10 dígitos'
    //     }
    //     if(isNaN(userRegister.telefono) === true){
    //         errors.celular='El celular deber ser un número'
    //     }
    //     if(userRegister.telefono){

    //         if(userRegister.telefono.trim().length !==10){
    //             errors.telefono='El teléfono debe tener 10 dígitos'
    //         }
    //         if(isNaN(userRegister.telefono) === true){
    //             errors.telefono='El teléfono deber ser un número'
    //         }
    //     }
    //     setErrorPhone(errors)
    // }

    const register = async()=>{
        
        const updateDatos={
            'first_name':userRegister.nombre,
            'last_name':userRegister.apellido,
            'dni_type':userRegister.idTipoIdentificacion,
            'dni':userRegister.numIdentificacion,
            'address':userRegister.direccion,
            'phone':userRegister.telefono,
            'movil':userRegister.celular,
            'state':userRegister.departamento_id,
            'city':userRegister.ciudad_id,
            'email':(checkboxEmail)?'sincorreo@sincorreo.com':userRegister.correo,
            'birthday':userRegister.fechaNacimiento,
            'gender':userRegister.genero,
            'id':data.id
        }
        console.log('updateDatos',updateDatos)
       
        try {
            const resp = await http('put',Endpoint.editPatient,updateDatos);
            console.log('resp',resp)
            if(resp.errors){
                setError(resp.errors)
            }else{
                setAlert(true)
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
            <Text style={styles.titleAlert}>Notificación</Text>
            <Text style={styles.textAlertError}>!Ha ocurrido un error¡ , Registro no exitoso</Text>
        </View>

    const contentAlert=
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/checkCircle.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.titleAlert}>Notificación</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>Se ha actualizado exitosamente</Text>
        </View>
    </View>

    const close=()=>{
        console.log('userRegister',userRegister)
        navigator.navigate('CatchmentOptionsScreen',{data:userRegister})
    }
    const closeError=()=>{
        console.log('error')
    }
    const departamentSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, departamento_id:key,departamento:value})
        getCities(key) 
    }
    const etniaSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, etniaId:key,etnia:value})
        getCities(key) 
    }
    const grupoPoblacionalSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, grupoPoblacionalId:key,grupoPoblacional:value})
        getCities(key) 
    }
    const citySelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, ciudad_id:key,ciudad:value}) 
    }

  return (
    <View style={styles.container}>
        <StatusBar barStyle='dark-content' />

        <ScrollView style={Styles.borderContainer}>
            <View>
                <TextInputs
                    label='Celular'
                    placeholder="3014567890"
                    onChangeText= { (value) => setUserRegister({...userRegister ,celular:value}) }
                    value={userRegister.celular}

                />
                {(error)?
                    (error.movil==='')?null:
                    <Text style={styles.textValid}>{error.movil}</Text>: null
                }
                <TextInputs
                    label='Teléfono'
                    placeholder="3014567890"
                    onChangeText= { (value) => setUserRegister({...userRegister ,telefono:value}) }
                    value={userRegister.telefono}

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
                    
                    {(cities)?
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

                    <ListOptions
                        label='Etnia'
                        options={etnia}
                        itemSelect={etniaSelect}
                        placeholder={userRegister.etnia}
                        isSelect={(userRegister.etnia)? true:false}
                    />
                    {
                        (userRegister.etnia==='')?<Text style={styles.textValid}>Campo requerido</Text>:null
                    }

                    <ListOptions
                        label='Grupo Poblacional'
                        options={grupoPoblacional}
                        itemSelect={grupoPoblacionalSelect}
                        placeholder={userRegister.grupoPoblacional}
                        isSelect={(userRegister.grupoPoblacional)? true:false}
                    />
                    {
                        (userRegister.grupoPoblacional==='')?<Text style={styles.textValid}>Campo requerido</Text>:null
                    }

                    {
                        !checkboxEmail &&
                        <>
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
                        </>
                    }

                    <Checkbox
                        text={'No tengo correo'}
                        value={checkboxEmail}
                        onValueChange={(value) => setCheckboxEmail(value)}
                    />
                    
                
            </View>

            <View style={styles.cButton}>  
                <Button 
                    title={"Actualizar"}
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
                btnFunction={closeError}
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
export default UpdateDataPatientScreen;

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
    textAlert:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.REGULAR,
        fontSize:16
    },
    ctextAlert:{
        marginTop:10,
        alignItems: 'center'
    },
    imageAlert:{
      width:60,
      height:60,
      bottom:20,
      marginTop:15
    },
    cAlert:{
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:20
    },
    titleAlert:{
      color:Colors.FONT_COLOR,
      fontSize:16,
      fontFamily:Fonts.BOLD
    },
    title:{
        color:Colors.BLUE_GREY,
        fontSize:16,
        fontFamily:Fonts.REGULAR
    },


})
