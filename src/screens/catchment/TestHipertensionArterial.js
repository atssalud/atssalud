import React, { useContext, useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import CheckBox from '../../components/CheckBox';
import { Styles } from '../../theme/GlobalStyle';
import {Fonts} from '../../theme/Fonts'
import { Colors } from '../../theme/Colors';
import Button from '../../components/Button';
import { Endpoint } from '../../environment/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from '../../services/http';
import { useNavigation } from '@react-navigation/native';
import TestSkeletonScreen from '../skeleton/TestSkeletonScreen';
import ViewAlertSkeletonScreen from '../skeleton/ViewAlertSkeletonScreen';
import { AuthContext } from '../../context/AuthContext';
import WindowAlert from '../../components/WindowAlert';
import TextInputs from '../../components/TextInput';
import IsConnectedScreen from '../IsConnectedScreen';

const TestHipertensionArterial = (props) => {
    const navigator=useNavigation()
    const {isConnected} = useContext(AuthContext)

    const data = props.route.params.data
    const datos = props.route.params.datos

    const [isSearchResult, setIsSearchResult] = useState(false)
    const [alert, setAlert] = useState(false)
    const [pSistolica, setPSistolica] = useState('')
    const [pDiastolica, setPDiastolica] = useState('')
    const [error, setError] = useState({
        pSistolica: '',
        pDiastolica: ''
    })
    const [ netInfo,setNetInfo]=useState(false)

    useEffect(()=> {

        const unsubscribe = isConnected(setNetInfo)
        return()=>{
            unsubscribe
        }
        
    }, [])

    const sendValidator=()=>{
        setAlert(true)
    }
    const close = () => {
        send()
    }
    const contentAlert =
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/modal-alert-Icon.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.title}>Alerta</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>¿ Desea proceder a Tamizar Paciente ?</Text>
        </View>
    </View>

    const send=async()=>{
        setIsSearchResult(true)
        const user = await AsyncStorage.getItem('user');
        const { id } =  JSON.parse(user);
        console.log(user);

        const answer=[
          {
            "question_id": "41",
            "value": pSistolica
          },
          {
              "question_id": "42",
              "value": pDiastolica
          }
        ]
        const send={
            "dni":String(data.dni),
            "author_id":String(id),
            "test":answer
        }
        console.log(JSON.stringify(send));
        try {
            console.log('entro')
            const resp= await http('post',Endpoint.sendTestHipertensionArterial,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Tamizaje Hipertensión Arterial'})
                setIsSearchResult(false)
            }
            
        } catch (error) {
            console.log('error',error)
        }
    }

    const handleTest = () => {

        const error = []
        if (pSistolica.trim().length === 0) {
            error.pSistolica = 'Campo Obligatorio'
        }
        if (pDiastolica.trim().length === 0) {
            error.pDiastolica = 'Campo Obligatorio'
        }

        const vpSistolica = pSistolica.includes(',')
        const vpDiastolica = pDiastolica.includes(',')

        console.log({ vpSistolica })
        if (vpDiastolica) {
            error.pDiastolica = 'Use punto'
        }
        if (vpSistolica) {
            error.pSistolica = 'Use punto'
        }
        if (pSistolica.trim().length>0 && pDiastolica.trim().length>0 && (vpDiastolica=== false) && (vpSistolica === false)) {
          sendValidator()
        }

        setError(error)
    }



  return (
    <>
        {
            (netInfo=== false)? <IsConnectedScreen/>:
            <>
            {
                (isSearchResult)?
                <ViewAlertSkeletonScreen/>:
                <ScrollView>
                <View style={styles.container}>
                        <View style={Styles.borderContainer}>
                        <View style={styles.cQuestion}>
                            <Text style={styles.tQuestion}>Haga toma de presión y digite los siguienes datos:</Text>
                            <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', width: '100%', marginLeft: 50 }}>

                                <View>
                                    <TextInputs
                                        label={'P.Sistólica'}
                                        placeholder={'Ej: 180'}
                                        keyboardType='numeric'
                                        dimension='middle'
                                        onChangeText={(value) => setPSistolica(value)}
                                        value={pSistolica}
                                    />
                                    {(error) ?
                                        (error.pSistolica === '') ? null :
                                            <Text style={styles.textValid}>{error.pSistolica}</Text> : null
                                    }
                                </View>
                                <View>
                                    <TextInputs
                                        label={'P.Diastólica'}
                                        placeholder={'Ej: 90'}
                                        keyboardType='numeric'
                                        dimension='middle'
                                        onChangeText={(value) => setPDiastolica(value)}
                                        value={pDiastolica}
                                    />
                                    {(error) ?
                                        (error.pDiastolica === '') ? null :
                                            <Text style={styles.textValid}>{error.pDiastolica}</Text> : null
                                    }
                                </View>
                            </View>

                        </View>
                    </View>
                    
                    <View style={styles.cButton}>  
                        <Button 
                            title={"Calcular"}
                            onPress={()=>handleTest()} 
                            fill='solid'
                        /> 
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
                            btnClose={'yes'}
                            
                        />
                        : null
                }
                
                </ScrollView>
            }
            </>
        }
        
    </>
    
  )
}
export default TestHipertensionArterial;

const styles= StyleSheet.create({
    container:{
        marginHorizontal:10,
        marginVertical:20
    },
    
    cQuestion:{
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10
    },
    tQuestion:{
        fontFamily:Fonts.BOLD,
        fontSize:16,
        color:Colors.FONT_COLOR
    },
    cButton:{
        marginBottom:10,
        marginTop:20
    },
    imageAlert: {
        width: 60,
        height: 60,
        bottom: 20,
        marginTop: 15
    },
    cAlert: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAlertError: {
        color: 'black',
        marginTop: 10,
        marginBottom: 20
    },
    textAlert: {
        color: 'black',
    },
    ctextAlert: {
        marginTop: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        color: 'black'
    },
    textValid: {
        fontSize: 14,
        fontFamily: Fonts.BOLD,
        color: "#ff5d2f",
        marginBottom: 10
    },
})
