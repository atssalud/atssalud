
import React, { useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const CatchmentScreen =()=>{

    const navigator = useNavigation()

    const [alert,setAlert]= useState(false)
    const [errorAlert,setErrorAlert]= useState(false)
    const [fieldError,setFieldError]= useState(false)
    const [dniTypes,setDniTypes]= useState()
    const [token,setToken]=useState()

    const {typeDni,idDni,numberDni,onChange} = useForm({
        typeDni:'CC',
        idDni:'1',
        numberDni:''
    })

    const [error, setError] = useState()

    useEffect(() => {
        getDniTypes()
        getToken()
    }, [])
    

    const getDniTypes = async()=>{
        try {
          const res = await http('get',Endpoint.dniTypes)
          setDniTypes(res)
        } catch (error) {
          console.log('error',error)
        }
    }

    const getToken =async()=>{
        const userToken = await AsyncStorage.getItem('token')
        setToken(userToken)
    
    }

    const send=async()=>{

        const data={
            "token":token,
            "dni":numberDni,
            "dni_type":idDni
        }
        console.log({data})
        try {
            const resp= await http('post',Endpoint.findPeople,data)
            console.log(resp.data)
            if(resp.errors){
                setError(resp.errors)
            }else{
                if(Object.keys(resp.data).length === 0){
                    navigator.navigate('FirstDataCatchmentScreen',{data:resp.data,dni:numberDni})
                }else{
                    navigator.navigate('DataPatientScreen',{data:resp.data,dni:numberDni})
                }
            }

            console.log('resp',resp)
            
        } catch (error) {
            console.log('error',error)
            setErrorAlert(true)
        }
    }
   
    const contentAlert=
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/checkCircle.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.title}>Notificación</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>Este usuario ya ha sido evaluado</Text>
        </View>
    </View>


    const close=()=>{
        console.log('hola')
    }

    const itemSelect=(key,value)=>{
        console.log(key,value)
        onChange(key,'idDni')
    }

    return(

        <View style={styles.container}>
        
            <View style={Styles.borderContainer}>
                <ListOptions
                    label='Tipo de documento'
                    options={dniTypes}
                    itemSelect={itemSelect}
                    placeholder={typeDni}
                    isSelect={true}
                />
                <TextInput
                    label='Número de documento'
                    value={numberDni}
                    name='correo'
                    onChangeText={(value)=>onChange(value,'numberDni')}
                    placeholder='1042143543'
                    line='blue'
                />
                {(error)?
                    (error.dni==='')?null:
                    <Text style={styles.textValid}>{error.dni}</Text>: null
                }
                <View style={styles.cBtn}>
                    <TouchableOpacity
                        style={styles.Btn}
                        onPress={()=>send()}
                    >
                        <Text style={styles.tBtn}>Buscar</Text>
                    </TouchableOpacity>
                </View>
            </View>
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

export default CatchmentScreen;

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
        fontFamily:Fonts.BOLD,
        color:"#ff5d2f",
        marginLeft:4,
        marginTop:-10,
        marginBottom:5
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