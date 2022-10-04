
import React, { useState } from 'react';
import { View,Text,TouchableOpacity, Image, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import WindowAlert from '../../components/WindowAlert';
import { Endpoint } from '../../environment/Api';
import { useForm } from '../../hooks/useForm';
import http from '../../services/http';
import TextInput from '../../components/TextInput';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/Colors';
import { Styles } from '../../theme/GlobalStyle';
import ListOptions from '../../components/ListOptions'
import { Fonts } from '../../theme/Fonts';

const CatchmentScreen =()=>{

    const navigator = useNavigation()
    const dni =[{'id':'1','dni':'Cédula de ciudadania'},{'id':'2','dni':'Tarjeta de Identidad'},{'id':'3','dni':'Pasaporte'}]

    const [alert,setAlert]= useState(false)
    const [errorAlert,setErrorAlert]= useState(false)
    const [fieldError,setFieldError]= useState(false)

    const {tipoDocumento,numDocumento,onChange} = useForm({
        tipoDocumento:'',
        numDocumento:'',
    })

    const [error, setError] = useState({
        correo: "",
    })

    // const validator =()=>{
    //     console.log(correo)
    //     const expReg=/^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/

    //     const errors={}
        
    //     if (expReg.test(correo)=== false){
    //         errors.correo = 'Campo vacio'
    //     }else{
    //         send()
    //     }
        
    //     setError(errors)
    // }

    const send=async()=>{

        const data={
            "email":correo
        }
        try {
            const resp= await http('post',Endpoint.recoverPassword,data)
            console.log('resp',resp)
            if(resp.data === 'El email no existe.'){
                setErrorAlert(true)
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
            <Text style={styles.title}>Notificación</Text>
            <Text style={styles.textAlertError}>Este correo no esta asociado a ninguna cuenta</Text>
        </View>

    const contentAlert=
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/checkCircle.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.title}>Notificación</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>Tu solicitud ha sido enviada</Text>
            <Text style={styles.textAlert}>satisfactoriamente, revisa tu corro</Text>
        </View>
    </View>

    const contentFieldError=
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/modal-alert-Icon.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.title}>Notificación</Text>
        <Text style={styles.textAlertError}>Ha ocurrido un error, intenta nuevamente</Text>
    </View>



    const close=()=>{
        navigator.navigate('LoginScreen')
    }

    const itemSelect=(key,value)=>{
        console.log(key,value)
        setUserRegister({...userRegister, profession:value}) 
    }

    return(

        <View style={styles.container}>
        
            <View style={Styles.borderContainer}>
                {/* <ListOptions
                    label='Tipo de documento'
                    options={dni}
                    itemSelect={itemSelect}
                /> */}
                <TextInput
                    label='Tipo de documento'
                    value={tipoDocumento}
                    name='correo'
                    onChangeText={(value)=>onChange(value,'tipoDocumento')}
                    placeholder='Cédula de ciudadania'
                    line='blue'
                />
                <TextInput
                    label='Número de documento'
                    value={numDocumento}
                    name='correo'
                    onChangeText={(value)=>onChange(value,'numDocumento')}
                    placeholder='1042143543'
                    line='blue'
                />
                {error.correo === '' ? null :
                    <Text style={styles.textValid}>{error.correo}</Text>
                }
                <View style={styles.cBtn}>
                    <TouchableOpacity
                        style={styles.Btn}
                        onPress={()=>navigator.navigate('FirstDataCatchmentScreen')}
                    >
                        <Text style={styles.tBtn}>Buscar</Text>
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
            {
                (fieldError) ?
                    <WindowAlert
                    bool={true}
                    closeAlert={setFieldError}
                    content={contentFieldError}
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

export default CatchmentScreen

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20,
        flex:1,
        marginTop:150
    },
    cImagen:{
        justifyContent:'center',
        alignItems:'center',
    },
    image:{
        width:'100%',
        height:83
    },
    cTitle:{
        justifyContent:'center',
        alignItems:'center',
    },
    title:{
        fontSize:18,
        color:'black'
    },
    cText:{
        marginTop:30
    },
    text:{
        color:'black',
        fontSize:16
    },
    textValid:{
        fontSize: 14,
        color:"#ff5d2f",
        marginLeft:4,
        marginTop:-20
    },
    text:{
        color:'black',
    },
    imageAlert:{
        width:60,
        height:60,
        bottom:20,
        marginTop:15
    },
    cAlert:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAlertError:{
        color:'black',
        marginTop:10,
        marginBottom:20
    },
    textAlert:{
        color:'black',
    },
    ctextAlert:{
        marginTop:10,
        alignItems: 'center'
    },
    cButton:{
        marginTop:20
    },
    cBtn:{
        justifyContent:'center',
        alignItems:'center',
        marginBottom:-20
    },
    Btn:{
        backgroundColor:Colors.PRIMARY_COLOR,
        width:250,
        justifyContent:'center',
        alignItems:'center',
        borderTopStartRadius:10,
        borderTopEndRadius:10,
        paddingVertical:10
    },
    tBtn:{
        fontFamily:Fonts.BOLD,
        fontSize:15,
        color:Colors.WHITE
    }
})