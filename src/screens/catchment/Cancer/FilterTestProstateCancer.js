import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
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


const FilterTestProstateCancer = (props) => {

    const navigator = useNavigation()

    const data = props.route.params.data
    const datos = props.route.params.datos

    const [etnia,setEtnia]=useState(false)
    const [antecedentesPrimer,setAntecedentesPrimer]=useState(false)
    const [antecedentesF,setAntecedentesF]=useState(false)
    const [uMiccional,setuMiccional]=useState(false)
    const [pujo,setPujo]=useState(false)
    const [nicturia,setNicturia]=useState(false)
    const [disuria,setDisuria]=useState(false)
    const [chorro,setChorro]=useState(false)
    const [hematuria,setHematuria]=useState(false)
    const [hematospermia,setHematospermia]=useState(false)
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
        if(etnia === true || antecedentesPrimer === true || antecedentesF === true ||uMiccional==true
            || pujo === true || nicturia === true || disuria === true || chorro === true || hematuria === true
            || hematospermia=== true
            ){
            navigator.replace('TestProstateCancer',{data:data,datos:datos,})
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
        // navigator.replace('TypeAlertScreen', { data: datos, token: token })
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
            <ScrollView>
                <View style={styles.container}>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Etnia: ¿Negra?</Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={etnia}
                            onValueChange={(newValue) => setEtnia(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!etnia}
                            onValueChange={(newValue) => setEtnia(!newValue)}
                        />
                    </View>
                </View>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Antecedente de Cáncer de prostata en familiar de primer o segundo grado (Padres, hermanos, Tios) </Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={antecedentesPrimer}
                            onValueChange={(newValue) => setAntecedentesPrimer(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!antecedentesPrimer}
                            onValueChange={(newValue) => setAntecedentesPrimer(!newValue)}
                        />
                    </View>
                </View>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Antecedente de Cáncer de prostata en varios familiares</Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={antecedentesF}
                            onValueChange={(newValue) => setAntecedentesF(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!antecedentesF}
                            onValueChange={(newValue) => setAntecedentesF(!newValue)}
                        />
                    </View>
                </View>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Urgencia miccional</Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={uMiccional}
                            onValueChange={(newValue) => setuMiccional(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!uMiccional}
                            onValueChange={(newValue) => setuMiccional(!newValue)}
                        />
                    </View>
                </View>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Pujo y-o tenesmo vesical</Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={pujo}
                            onValueChange={(newValue) => setPujo(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!pujo}
                            onValueChange={(newValue) => setPujo(!newValue)}
                        />
                    </View>
                </View>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Nicturia</Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={nicturia}
                            onValueChange={(newValue) => setNicturia(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!nicturia}
                            onValueChange={(newValue) => setNicturia(!newValue)}
                        />
                    </View>
                </View>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Disuria</Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={disuria}
                            onValueChange={(newValue) => setDisuria(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!disuria}
                            onValueChange={(newValue) => setDisuria(!newValue)}
                        />
                    </View>
                </View>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Reducción del calibre del chorro</Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={chorro}
                            onValueChange={(newValue) => setChorro(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!chorro}
                            onValueChange={(newValue) => setChorro(!newValue)}
                        />
                    </View>
                </View>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Hematuria</Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={hematuria}
                            onValueChange={(newValue) => setHematuria(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!hematuria}
                            onValueChange={(newValue) => setHematuria(!newValue)}
                        />
                    </View>
                </View>
                <View style={Styles.borderContainer}>
                    <View style={styles.cQuestion}>
                        <Text style={styles.tQuestion}>Hematospermia o dolor en el área pélvica</Text>
                    </View>
                    <View style={styles.cCheckBox}>
                        <Checkbox
                            text={'Si'}
                            value={hematospermia}
                            onValueChange={(newValue) => setHematospermia(newValue)}
                        />
                        <Checkbox
                            text={'No'}
                            value={!hematospermia}
                            onValueChange={(newValue) => setHematospermia(!newValue)}
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
            </ScrollView>
            }
        
        </>
    }

        
    </>
  )
}


export default FilterTestProstateCancer;

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