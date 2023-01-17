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

const TestCardiovascularOms = (props) => {
    const navigator=useNavigation()
    const {logOut,isConnected} = useContext(AuthContext)

    const data = props.route.params.data
    const datos = props.route.params.datos

    const [answer,setAnswer]=useState()
    const [change,setChange]=useState()
    const [questions,setQuestions]=useState()
    const [token,setToken]=useState()
    const [isSearch, setIsSearch] = useState(true)
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alertError, setAlertError] = useState(false)
    const [pSistolica, setpSistolica] = useState('')
    const [error, setError] = useState({
        pSistolica: '',
    })
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
        getQuestion(userToken)
        setToken(userToken)
    
    }
    const getQuestion=async()=>{
        
        try {
            const resp = await http('get',Endpoint.listItemTesOms)
            if(resp.message==='token no válido'){
                logOut()
            }
            console.log("Items:",JSON.stringify(resp));
            setQuestions(resp)
            listadoPreguntas(resp)
            setIsSearch(false)
        } catch (error) {
            console.log('error',error)
        }
    }


    const listadoPreguntas=(resp)=>{
        const lista=[]
        resp.map((i,id)=>{
            if(i.options[0]){
                // console.log(i.options[0])
                var name=i.options[0].name
                var value=i.options[0].name
                var question_id=resp[id].id
                lista.push({question_id,name,value})
                console.log({question_id,name,value})
            }else{
                var name='por asignar'
                var value='por asignar'
                var question_id=resp[id].id
                lista.push({question_id,name,value})
                console.log({question_id,name,value})
            }
            

        })
        lista[0].value=data.age
        lista[0].name='Edad'

        const gender=data.gender
        if (gender==='F') {
            lista[1].name='Femenino'
            lista[1].value='Femenino'
        }
        if (gender==='M') {
            lista[1].name='Masculino'
            lista[1].value='Masculino'
        }


        setAnswer(lista)
    }
   

    const itemCheckboxSelected = (id, value,name)=>{
        console.log('asasa',id,value)
        answer[id].value=name
        answer[id].name=name
        console.log(answer[id])
        if(change===false){
            setChange(true)
        }else{
            setChange(false)
        }
    }

    const changePsistolica=()=>{
        answer[4].value=pSistolica
        answer[4].name='P.Sistolica'
        sendValidator()
    }

    const handleTest = () => {

        const error = []
        if (pSistolica.trim().length === 0) {
            error.pSistolica = 'Campo Obligatorio'
        }

        const vpSistolica = pSistolica.includes(',')
        if (vpSistolica) {
            error.pSistolica = 'Use punto'
        }
        if (pSistolica.trim().length>0 && (vpSistolica === false)) {
            
            changePsistolica()
        }

        setError(error)
    }

    const sendValidator=()=>{
        setAlert(true)
    }
    const close = () => {
        send()
    }
    const closeError = () => {
        console.log('error')
        setAlertError(false)
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

    const contentAlertError =
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/modal-alert-Icon.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.title}>Alerta</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>Ha ocurrido un error, vuelva a intentar</Text>
        </View>
    </View>

    const send=async()=>{
        setIsSearchResult(true)
        const user = await AsyncStorage.getItem('user');
        const { id } =  JSON.parse(user);
        console.log(user);
        const send={
            "dni":String(data.dni),
            "author_id":String(id),
            "test":answer
        }
        console.log('send',JSON.stringify(send));
        try {
            console.log('entro')
            const resp= await http('post',Endpoint.sendTestOms,send)
            console.log({resp})

            if(resp.errors){
                setError(resp.errors)
            }
            else{
                if(resp.success===false){
                    setIsSearchResult(false)
                    setAlertError(true)
                }else{
                    navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Tamizaje Cardiovascular'})
                    setIsSearchResult(false)
                }
            }
            
        } catch (error) {
            console.log('error',error)
        }
    }


    // const changeQData=()=>{
        
    //     answer[0].value=data.age

    //     const gender=data.gender
    //     if (gender==='F') {
    //         answer[1].value='Femenino'
    //     }
    //     if (gender==='M') {
    //         answer[1].value='Masculino'
    //     }
    //     sendValidator()
    // }

    console.log({answer})




  return (
    <>
         {
            (netInfo=== false)? <IsConnectedScreen/>:
            <>
        {
            (isSearch)?
            <TestSkeletonScreen/>
            :(isSearchResult)?
            <ViewAlertSkeletonScreen/>:
            <ScrollView>
            {(answer)?
                <View style={styles.container}>
                {(questions)?questions.map((item,id)=>{
                    if (item.id !== 70 && item.id !== 71 && item.id !== 74) {

                    return(
                        <View style={Styles.borderContainer} key={id}>
                            <View style={styles.cQuestion}>
                                <Text style={styles.tQuestion}>{item.name}</Text>
                            </View>
                            <View>
                                <CheckBox
                                    text={item.options[0].name}
                                    value={(answer[id].name=== item.options[0].name)?true:false}
                                    disabled={false}
                                    onValueChange={(newValue) => itemCheckboxSelected(id,item.options[0].value,String(item.options[0].name))}
                                />
                                <CheckBox
                                    text={item.options[1].name}
                                    value={(answer[id].name === item.options[1].name)?true:false}
                                    disabled={false}
                                    onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value),String(item.options[1].name))}
                                />
                                
                            </View>
                        </View>
                    )
                    }
                }):null
                }
                <View style={Styles.borderContainer}>
                <View style={styles.cQuestion}>
                    {/* <Text style={styles.tQuestion}>¿Ha fumado 30 o más paquetes de productos derivados del tabaco? </Text> */}
                    <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', width: '100%', marginLeft: 50 }}>

                        <View>
                            <TextInputs
                                label={'Digite P.sistólica'}
                                placeholder={'140'}
                                keyboardType='numeric'
                                dimension='middle'
                                onChangeText={(value) => setpSistolica(value)}
                                value={pSistolica}
                            />
                            {(error) ?
                                (error.pSistolica === '') ? null :
                                    <Text style={styles.textValid}>{error.pSistolica}</Text> : null
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
            :null}
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
            {
                (alertError) ?
                    <WindowAlert
                        bool={true}
                        closeAlert={setAlertError}
                        content={contentAlertError}
                        width={50}
                        height={3}
                        btnText={'Aceptar'}
                        btnFunction={closeError}
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
export default TestCardiovascularOms;

const styles= StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20
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
