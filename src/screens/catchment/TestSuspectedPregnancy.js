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
import InputDate from '../../components/InputDate';
import IsConnectedScreen from '../IsConnectedScreen';

const TestSuspectedPregnancy = (props) => {
    const navigator=useNavigation()
    const {isConnected} = useContext(AuthContext)
    
    const data = props.route.params.data
    const datos = props.route.params.datos

    const [answer,setAnswer]=useState()
    const [change,setChange]=useState()
    const [questions,setQuestions]=useState()
    const [token,setToken]=useState()
    const [isSearch, setIsSearch] = useState(true)
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [alert, setAlert] = useState(false)
    const [alert2, setAlert2] = useState(false)
    const [fecha, setfecha] = useState('')
    const [error, setError] = useState({
        fecha: '',
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
            const resp = await http('get',Endpoint.listItemSospechaEmbarazo)
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


    const listadoPreguntas=(data)=>{
        const lista=[]
        data.map((i)=>{
          if(i.id !==57){
            var name=i.options[1].name
            var value=i.options[1].value
            var question_id=i.id
            lista.push({question_id,name,value})
            console.log({question_id,name,value})
          }
        })
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

    const sendValidator=()=>{
        if(answer[0].name ==='NO'){
          setAlert2(true)
        }else{
          handleTest()
        }
        
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

  const contentAlert2=
  <View style={styles.cAlert}>
      <Image
          source={require('../../assets/icons/modal-alert-Icon.png')}
          style={styles.imageAlert}
      />
      <Text style={styles.title}>Notificación</Text>
      <View style={styles.ctextAlert}>
          <Text style={styles.textAlert}>El paciente no aplica</Text>
          <Text style={styles.textAlert}>para el tamizaje Sospecha de Embarazo</Text>
      </View>
  </View>

  const close2=()=>{
      navigator.replace('TypeAlertScreen', { data: datos, token: token })
  }

    const send=async()=>{
        setIsSearchResult(true)
        const user = await AsyncStorage.getItem('user');
        const { id } =  JSON.parse(user);
        console.log(user);
        answer.push({"question_id": 57,"value": fecha,"name":"fecha"})
        const send={
            "dni":String(data.dni),
            "author_id":String(id),
            "test":answer
        }
        console.log(JSON.stringify(send));
        try {
            console.log('entro')
            const resp= await http('post',Endpoint.sendSospechaEmbarazo,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Tamizaje Sospecha de Embarazo'})
                setIsSearchResult(false)
            }
            
        } catch (error) {
            console.log('error',error)
        }
    }

    const handleTest = () => {
        console.log({fecha})
        const error = []
        if (fecha.trim().length === 0) {
            error.fecha = 'Campo Obligatorio'
        }
      
        if (fecha.trim().length>0) {
          setAlert(true)
        }

        setError(error)
    }

    const dateSelect =(date)=>{
      setfecha(date)
      console.log(date)
  }



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
                    if (item.id !== 57) {
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
                {
                (answer)?
                    (answer[0].name ==='SI')?
                    <View style={Styles.borderContainer}>
                        <View style={styles.cQuestion}>
                            <Text style={styles.tQuestion}>¿Cuál es la fecha de su ultima menstruación (FUM)?</Text>
                            <View>
                                <InputDate
                                    dateSelect={dateSelect}
                                    type={'date'}
                                    dimension='middle'
                                />
                                {(error)?
                                    (error.fecha==='')?null:
                                    <Text style={styles.textValid}>{error.fecha}</Text>: null
                                }
                            </View>
                        </View>
                    </View>:null
                :null
                }
                
                <View style={styles.cButton}>  
                    <Button 
                        title={"Calcular"}
                        onPress={()=>sendValidator()} 
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
                (alert2) ?
                    <WindowAlert
                        bool={true}
                        closeAlert={setAlert2}
                        content={contentAlert2}
                        width={50}
                        height={3}
                        btnText={'Aceptar'}
                        btnFunction={close2}
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
export default TestSuspectedPregnancy;

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
    },
    cAlert: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAlertError: {
        color: Colors.FONT_COLOR,
        fontFamily:Fonts.BOLD,
        fontSize:18,
        marginTop: 10,
        marginBottom: 20
    },
    textAlert: {
        color: Colors.FONT_COLOR,
        fontFamily:Fonts.REGULAR,
        fontSize:16

    },
    ctextAlert: {
        marginTop: 10,
        alignItems: 'center'
    },
    title: {
      color: Colors.FONT_COLOR,
      fontFamily:Fonts.BOLD,
      fontSize:18
    },
    textValid: {
        fontSize: 14,
        fontFamily: Fonts.BOLD,
        color: "#ff5d2f",
        marginBottom: 10,
    },
})


