import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import Checkbox from '../../components/CheckBox';
import WindowAlert from '../../components/WindowAlert';
import { AuthContext } from '../../context/AuthContext';
import { Endpoint } from '../../environment/Api';
import http from '../../services/http';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { Styles } from '../../theme/GlobalStyle';
import IsConnectedScreen from '../IsConnectedScreen';
import ViewAlertSkeletonScreen from '../skeleton/ViewAlertSkeletonScreen';



const FilterTestEpocScreen = (props) => {

    const navigator = useNavigation()

    const data = props.route.params.data
    const datos = props.route.params.datos

    const [fumador,setFumador]=useState(false)
    const [biomasa,setBiomasa]=useState(false)
    const [biomasa10,setBiomasa10]=useState(false)
    const [alert,setAlert]= useState(false)
    const [token,setToken]= useState('')
    const [isSearchResult, setIsSearchResult] = useState(false)

    const {isConnected} = useContext(AuthContext)
    const [ netInfo,setNetInfo]=useState(false)

    useEffect(()=> {

        const unsubscribe = isConnected(setNetInfo)
        getToken()
        return()=>{
            unsubscribe
        }
        
    }, [])

    const getToken =async()=>{
          const userToken = await AsyncStorage.getItem('token')
          setToken(userToken)
      
    }

    const send = async()=>{
        setIsSearchResult(true)
        const user = await AsyncStorage.getItem('user');
        const userJson =  JSON.parse(user)

        const send={
            'dni':String(data.dni),
            'author_id':String(userJson.id)
        }
        console.log({send})

        try {
            const resp= await http('post',Endpoint.sendValidationTestEPOC,send)
            if(resp.success=== true){
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Riesgo EPOC'})
                setIsSearchResult(false)
            }else{
                Alert.alert('Notificación','Ha ocurrido un error vuelva a intentar')
            }
        } catch (error) {
            console.log('error',error)
        }
    }

    const validarTest=()=>{
        if(fumador=== false && biomasa===false){
            setAlert(true)
        }else{
            if(biomasa10===true){
                send()
            }else{
                navigator.replace('TestEpocScreen',{data:data,datos:datos,})
            }
        }
    }

    const contentAlert=
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/modal-alert-Icon.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.titleAlert}>Notificación</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>El paciente no aplica</Text>
            <Text style={styles.textAlert}>para el tamizaje EPOC</Text>
        </View>
    </View>

    const close=()=>{
        navigator.replace('TypeAlertScreen', { data: datos, token: token })
    }

    
  return (
    <>
        {
            (netInfo=== false)? <IsConnectedScreen/>:
            <>
            {
            (isSearchResult)?
                <ViewAlertSkeletonScreen/>
            :
                <View style={styles.container}>
            <View style={Styles.borderContainer}>
                <View style={styles.cQuestion}>
                    <Text style={styles.tQuestion}>¿Es o fue fumador?</Text>
                </View>
                <View style={styles.cCheckBox}>
                    <Checkbox
                        text={'Si'}
                        value={fumador}
                        disabled={false}
                        onValueChange={(newValue) => setFumador(newValue)}
                    />
                    <Checkbox
                        text={'No'}
                        value={!fumador}
                        disabled={false}
                        onValueChange={(newValue) => setFumador(!newValue)}
                    />
                </View>
            </View>
            <View style={Styles.borderContainer}>
                <View style={styles.cQuestion}>
                <Text style={styles.tQuestion}>¿Estuvo expuesto a biomasa?</Text>
                </View>
                <View style={styles.cCheckBox}>
                    <Checkbox
                        text={'Si'}
                        value={biomasa}
                        disabled={false}
                        onValueChange={(newValue) => setBiomasa(newValue)}
                    />
                    <Checkbox
                        text={'No'}
                        value={!biomasa}
                        disabled={false}
                        onValueChange={(newValue) => setBiomasa(!newValue)}
                    />
                </View>
            </View>
            {
                (biomasa === true)?

                <View style={Styles.borderContainer}>
                <View style={styles.cQuestion}>
                    <Text style={styles.tQuestion}>¿Estuvo expuesto a biomasa por</Text>
                    <Text style={styles.tQuestion}>más de 10 años seguidos?</Text>
                </View>
                <View style={styles.cCheckBox}>
                    <Checkbox
                        text={'Si'}
                        value={biomasa10}
                        disabled={false}
                        onValueChange={(newValue) => setBiomasa10(newValue)}
                    />
                    <Checkbox
                        text={'No'}
                        value={!biomasa10}
                        disabled={false}
                        onValueChange={(newValue) => setBiomasa10(!newValue)}
                    />
                </View>
            </View>:null
            }
            <View style={styles.cButton}>
            <Button
            title="Aplicar Test"
            onPress={() => validarTest()}
            color='secondary'
            fill='solid'
            />
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

                </View>
            } 
        
            </>
        }
        
    </>
  )
}


export default FilterTestEpocScreen;

const styles= StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:'20%',
        flex:1
    },
    cCheckBox:{
        flexDirection:'row',
        justifyContent:'space-around'
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
        marginTop:20,
        flex:1,
        bottom: 0,
        left: 0,
        right: 0,
        position:'absolute',
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
        width:55,
        height:55,
        bottom:20,
        marginTop:15
    },
    cAlert:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:-15
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
