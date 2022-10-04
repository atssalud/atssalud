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
import { Fonts } from '../../theme/Fonts';

const RecoverPasswordScreen =()=>{

    const navigator = useNavigation()

    const [alert,setAlert]= useState(false)
    const [errorAlert,setErrorAlert]= useState(false)
    const [messageError,setMessageError]= useState('')

    const {correo,onChange} = useForm({
        correo:''
    })


    const send=async()=>{
        console.log({correo})
        const data={
            "email":correo
        }
        try {
            const resp= await http('post',Endpoint.forgetPassword,data)
            console.log('resp',resp)

            if(resp.errors){
                setMessageError(resp.errors.email)
                setErrorAlert(true)
            }
            if(resp.message){
                if (resp.success){
                    setAlert(true)
                }else{
                    setMessageError(resp.message)
                    setErrorAlert(true)
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
            <Text style={styles.title}>Notificación</Text>
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


    
    const close=()=>{
        navigator.navigate('LoginScreen')
    }
    const close2=()=>{
        console.log('cerrar mensaje error')
    }

    return(

        <View style={styles.container}>
        
            <View style={Styles.borderContainer}>
                <TextInput
                    label='Correo electrónico'
                    value={correo}
                    name='correo'
                    onChangeText={(value)=>onChange(value,'correo')}
                    placeholder='ejemplo@hotmail.com'
                    line='blue'
                />
            </View>
            <View style={styles.cButton}>
                <Button
                    title='Recuperar contraseña'
                    onPress={() =>send()}
                    fill='solid'
                />
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
                    btnFunction={close2}
                    messageError={messageError}
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

export default RecoverPasswordScreen
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
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.BOLD
    },
    cText:{
        marginTop:30
    },
    text:{
        color:Colors.FONT_COLOR,
        fontSize:16
    },
    textValid:{
        fontSize: 14,
        color:"#ff5d2f",
        marginLeft:4,
        marginTop:-20
    },
    text:{
        color:Colors.FONT_COLOR,
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
        color:Colors.FONT_COLOR,
        marginTop:10,
        marginBottom:20
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
    cButton:{
        marginTop:20
    }
})