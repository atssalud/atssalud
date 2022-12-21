
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
import ViewAlertSkeletonScreen from '../skeleton/ViewAlertSkeletonScreen';
import { AuthContext } from '../../context/AuthContext';
import WindowAlert from '../../components/WindowAlert';
import TextInputs from '../../components/TextInput';
import TestSkeletonScreen from '../skeleton/TestSkeletonScreen';

const TestHighReproductiveRisk = (props) => {

    const {logOut} = useContext(AuthContext)
    const [answer,setAnswer]=useState()
    const [change,setChange]=useState()
    const [questions,setQuestions]=useState()
    const [token,setToken]=useState()
    const [isSearch, setIsSearch] = useState(true)
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [alert, setAlert] = useState(false)

    const [numPaquete, setNumPaquete] = useState('')
    const [años, setAños] = useState('')
    const [error, setError] = useState({
        numPaquete: '',
        años: ''
    })

    const data = props.route.params.data
    console.log('daaataaa',data)
    const datos = props.route.params.datos

    const navigator=useNavigation()

    useEffect(() => {
      getToken()
    }, [])
    
    const getToken =async()=>{
        const userToken = await AsyncStorage.getItem('token')
        getQuestion(userToken)
        setToken(userToken)
    
    }
    const getQuestion=async()=>{
        
        try {
            const resp = await http('get',Endpoint.listTestHighReproductiveRisk)
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
        data.map((i,index)=>{
            var name=i.options[1].name
            var value=i.options[1].value
            var question_id=i.id
            lista.push({question_id,name,value})
        })
        setAnswer(lista)
        
    }

    const changeQAge=()=>{
        
        const edad=data.age

        console.log({edad})

        if (edad >35 || edad <18) {
            console.log('alto',edad)
            answer[0].name='SI'
            answer[0].value='1'
        }
        if (edad>17&&edad<36) {
            console.log('bajo',edad)
            answer[1].name='NO'
            answer[1].value='0'
        }
    }
   

    const itemCheckboxSelected = (id, value,name)=>{
        changeQAge()
        console.log('asasa',id,value)
        answer[id].value=value
        answer[id].name=name
        console.log('pregunta',answer)
        if(change===false){
            setChange(true)
        }else{
            setChange(false)
        }
    }

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
        
        const send={
            "dni":String(data.dni),
            "author_id":String(id),
            "test":answer
        }
        
        console.log('send',JSON.stringify(send));
        try {
            console.log('entro')
            const resp= await http('post',Endpoint.sendTestHighReproductiveRisk,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Tamizaje Alto Riesgo Reproductivo'})
                setIsSearchResult(false)
            }
            
        } catch (error) {
            console.log('error',error)
        }
    }

  return (

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

                    if(item.id !== 119){
                        return(
                            <View style={Styles.borderContainer} key={id}>
                                <View style={styles.cQuestion}>
                                    <Text style={styles.tQuestion}>{item.name}</Text>
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                                    <CheckBox
                                        text={item.options[0].name}
                                        value={(answer[id].value=== item.options[0].value)?true:false}
                                        disabled={false}
                                        onValueChange={(newValue) => itemCheckboxSelected(id,item.options[0].value,String(item.options[0].name))}
                                    />
                                    <CheckBox
                                        text={item.options[1].name}
                                        value={(answer[id].value === item.options[1].value)?true:false}
                                        disabled={false}
                                        onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value),String(item.options[1].name))}
                                    />
                                    
                                </View>
                            </View>
                        )
                    }
                
            }):null
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
        
        </ScrollView>
    }
    </>
    
  )
}
export default TestHighReproductiveRisk;

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

