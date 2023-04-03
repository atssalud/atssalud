import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import Button from '../../../components/Button';
import Checkbox from '../../../components/CheckBox';
import WindowAlert from '../../../components/WindowAlert';
import { AuthContext } from '../../../context/AuthContext';
import { Endpoint } from '../../../environment/Api';
import http from '../../../services/http';
import { Colors } from '../../../theme/Colors';
import { Fonts } from '../../../theme/Fonts';
import { Styles } from '../../../theme/GlobalStyle';
import IsConnectedScreen from '../../IsConnectedScreen';
import ViewAlertSkeletonScreen from '../../skeleton/ViewAlertSkeletonScreen';


const FilterTestCervicalCancer = (props) => {

    const navigator = useNavigation()

    const data = props.route.params.data
    const datos = props.route.params.datos

    const [edad,setEdad]=useState(false)
    const [multiparidad,setMultiparidad]=useState(false)
    const [compañeros,setCompañeros]=useState(false)
    const [alert,setAlert]= useState(false)
    const [token,setToken]= useState('')
    const [isSearchResult, setIsSearchResult] = useState(false)

    const {isConnected} = useContext(AuthContext)
    const [ netInfo,setNetInfo]=useState(false)

    useEffect(() => {
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

    const validarTest=async()=>{
        if(edad === true || multiparidad === true || compañeros === true){
            navigator.replace('TestCervicalCancer',{data:data,datos:datos,})
        }else{
            setAlert(true)
        }
    }

    const contentAlert=
    <View style={styles.cAlert}>
        <Image
            source={require('../../../assets/icons/modal-alert-Icon.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.titleAlert}>Notificación</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>EL paciente no aplica para la realización de este tamizaje</Text>
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
                    <Text style={styles.tQuestion}>¿Edad de inicio de relaciones sexuales antes de los 15 años?</Text>
                </View>
                <View style={styles.cCheckBox}>
                    <Checkbox
                        text={'Si'}
                        value={edad}
                        onValueChange={(newValue) => setEdad(newValue)}
                    />
                    <Checkbox
                        text={'No'}
                        value={!edad}
                        onValueChange={(newValue) => setEdad(!newValue)}
                    />
                </View>
            </View>
            <View style={Styles.borderContainer}>
                <View style={styles.cQuestion}>
                    <Text style={styles.tQuestion}>¿Multiparidad (3 o más hijos)?</Text>
                </View>
                <View style={styles.cCheckBox}>
                    <Checkbox
                        text={'Si'}
                        value={multiparidad}
                        onValueChange={(newValue) => setMultiparidad(newValue)}
                    />
                    <Checkbox
                        text={'No'}
                        value={!multiparidad}
                        onValueChange={(newValue) => setMultiparidad(!newValue)}
                    />
                </View>
            </View>
            <View style={Styles.borderContainer}>
                <View style={styles.cQuestion}>
                    <Text style={styles.tQuestion}>¿Múltiples compañeros sexuales: (Más de 2 en el último año)?</Text>
                </View>
                <View style={styles.cCheckBox}>
                    <Checkbox
                        text={'Si'}
                        value={compañeros}
                        onValueChange={(newValue) => setCompañeros(newValue)}
                    />
                    <Checkbox
                        text={'No'}
                        value={!compañeros}
                        onValueChange={(newValue) => setCompañeros(!newValue)}
                    />
                </View>
            </View>
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


export default FilterTestCervicalCancer;

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
    tOption:{
        fontFamily:Fonts.REGULAR,
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
        marginTop:5
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