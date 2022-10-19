import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
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

const UpdateDataPatientScreen = (props) => {

    const navigator = useNavigation()
    const genero=[{'id':'M', 'item':'M'},{'id':'F', 'item':'F'}]
    const [errorAlert,setErrorAlert]= useState(false)
    const [alert,setAlert]= useState(false)
    const today= new Date()

    const data = props.route.params.data

    const [userRegister, setUserRegister] = useState({
        nombre:data.first_name,
        apellido:data.last_name,
        tipoIdentificacion:data.dni_type_name,
        idTipoIdentificacion:data.dni_type,
        numIdentificacion:(Object.keys(data).length === 0)?dni:data.dni,
        direccion:'',
        celular:'',
        departamento:'',
        ciudad:'',
        correo:'',
        fechaNacimiento:data.birthday,
        genero:data.gender,
        edad:(data.birthday)?today.getFullYear()-data.birthday.split('-')[0]:'',
        ciudad_id:'',
        departamento_id:'',
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

    const register = async()=>{
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
        navigator.navigate('TypeAlertScreen',{data:userRegister,token:token})
    }
    const closeError=()=>{
        console.log('error')
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
