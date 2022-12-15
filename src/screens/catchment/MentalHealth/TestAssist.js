import React, { useContext, useEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import CheckBox from '../../../components/CheckBox';
import { Styles } from '../../../theme/GlobalStyle';
import {Fonts} from '../../../theme/Fonts'
import { Colors } from '../../../theme/Colors';
import Button from '../../../components/Button';
import { Endpoint } from '../../../environment/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from '../../../services/http';
import { useNavigation } from '@react-navigation/native';
import TestSkeletonScreen from '../../skeleton/TestSkeletonScreen';
import ViewAlertSkeletonScreen from '../../skeleton/ViewAlertSkeletonScreen';
import { AuthContext } from '../../../context/AuthContext';
import WindowAlert from '../../../components/WindowAlert';
import TextInputs from '../../../components/TextInput';

const TestAssist = (props) => {

    const {logOut} = useContext(AuthContext)
    const [answer,setAnswer]=useState()
    const [change,setChange]=useState()
    const [questions,setQuestions]=useState()
    const [nextquestion,setNextquestion]=useState(0)
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
    // console.log('daaataaa',data)
    const datos = props.route.params.datos
    const points = props.route.params.points

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
            const resp = await http('get',Endpoint.listTestAssist)
            if(resp.message==='token no válido'){
                logOut()
            }
            // console.log("Items:",JSON.stringify(resp));
            
            listadoPreguntas(resp)
            listadoOpciones(resp)
            setIsSearch(false)
        } catch (error) {
            console.log('error',error)
        }
    }


    const listadoPreguntas=(data)=>{
        const lista=[]
        var options=[]
        // console.log('length',data[0])
        data.map((i,item)=>{
            
            if(i.options[0].name !=='FALSE'){
                var id=item-1
                if(data[id].options[0].name==='FALSE'){
                    options.push(data[id])
                }
                options.push(i)
            }else{
                if(item !== 0){
                    lista.push(options)
                    // console.log({options})
                    options=[]
                }
            }
        })
        // console.log('lista',lista[0])
        setQuestions(lista)
    }
    const listadoOpciones=(data)=>{
        const lista=[]
        var options=[]
        data.map((i,item)=>{

            if(i.options[0].name !=='FALSE'){
                var id=item-1
                if(data[id].options[0].name==='FALSE'){
                    var name=data[id].options[0].name
                    var value=data[id].options[0].value
                    var question_id=data[id].id
                    options.push({question_id,name,value})
                }
                if(item<12){
                    var name=i.options[1].name
                    var value=i.options[1].value
                    var question_id=i.id
            
                    options.push({question_id,name,value})
                }else{
                    var name=i.options[0].name
                    var value=i.options[0].value
                    var question_id=i.id
            
                    options.push({question_id,name,value})
                }
                
            }else{
                if(item !== 0){
                    lista.push(options)
                    options=[]
                }
            }
        })
        console.log('listaaaaa',lista[0])
        setAnswer(lista)
    }
   

    const itemCheckboxSelected = (id, value,name)=>{
        console.log('prueba',answer[0][id].name)
        console.log('asasa',name,id,value)
        answer[nextquestion][id].value=value
        answer[nextquestion][id].name=name
        console.log(answer[nextquestion])
        console.log(answer[nextquestion][id])
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
            source={require('../../../assets/icons/modal-alert-Icon.png')}
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
            "extra_values":points,
            "test":answer
        }
        console.log('send',JSON.stringify(send));
        try {
            console.log('entro')
            const resp= await http('post',Endpoint.sendTestAssist,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Tamizaje Demencia'})
                setIsSearchResult(false)
            }
            
        } catch (error) {
            console.log('error',error)
        }
    }

    const nextOrBeforeQuestion=(action)=>{
        const length = questions.length - 1
        const count=nextquestion+1 

        if(action==='+1'){
            if(count > length){
                sendValidator()
            }else{
                setNextquestion(nextquestion+1)
            }
        }else{
            setNextquestion(nextquestion-1)
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
                {(questions)?questions[nextquestion].map((item,id)=>{
                    return(
                        <View key={id}>
                            {
                                (nextquestion !==0 && answer[0][id].name ==='NO')?null:
                                    (nextquestion >1 && answer[1][id].name ==='Nunca')?
                                        (nextquestion >4)?
                                        <View style={(item.options[0].name==="FALSE")?{marginTop:20}:Styles.borderContainer} key={id}>                      
                                        <View style={styles.cQuestion}>
                                            <Text style={styles.tQuestion}>{item.name}</Text>
                                        </View>
                                        {
                                            (item.options[0].name==="FALSE")?null
                                            :
                                            <View>
                                                <CheckBox
                                                    text={item.options[0].name}
                                                    value={(answer[nextquestion][id].value=== item.options[0].value)?true:false}
                                                    disabled={false}
                                                    onValueChange={(newValue) => itemCheckboxSelected(id,item.options[0].value,String(item.options[0].name))}
                                                />
                                                <CheckBox
                                                    text={item.options[1].name}
                                                    value={(answer[nextquestion][id].value=== item.options[1].value)?true:false}
                                                    disabled={false}
                                                    onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value),String(item.options[1].name))}
                                                />
                                                {
                                                (item.options.length >= 3)?
                                                <CheckBox
                                                text={item.options[2].name}
                                                value={(answer[nextquestion][id].value=== item.options[2].value)?true:false}
                                                disabled={false}
                                                onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[2].value),String(item.options[2].name))}
                                                />:null
                                                }
                                                {
                                                    (item.options.length >= 4)?
                                                        <CheckBox
                                                        text={item.options[3].name}
                                                        value={(answer[nextquestion][id].value=== item.options[3].value)?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[3].value),String(item.options[3].name))}
                                                        />:null
                                                }
                                                {
                                                    (item.options.length === 5)?
                                                        <CheckBox
                                                        text={item.options[3].name}
                                                        value={(answer[nextquestion][id].value=== item.options[4].value)?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[4].value),String(item.options[4].name))}
                                                        />:null
                                                }
                                                
                                                
                                            </View>
                                            
                                        }
                                        </View>
                                        :null
                                    :
                                    <View style={(item.options[0].name==="FALSE")?{marginTop:20}:Styles.borderContainer} key={id}>                      
                                        <View style={styles.cQuestion}>
                                            <Text style={styles.tQuestion}>{item.name}</Text>
                                        </View>
                                        {
                                            (item.options[0].name==="FALSE")?null
                                            :
                                            <View>
                                                <CheckBox
                                                    text={item.options[0].name}
                                                    value={(answer[nextquestion][id].value=== item.options[0].value)?true:false}
                                                    disabled={false}
                                                    onValueChange={(newValue) => itemCheckboxSelected(id,item.options[0].value,String(item.options[0].name))}
                                                />
                                                <CheckBox
                                                    text={item.options[1].name}
                                                    value={(answer[nextquestion][id].value=== item.options[1].value)?true:false}
                                                    disabled={false}
                                                    onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value),String(item.options[1].name))}
                                                />
                                                {
                                                (item.options.length >= 3)?
                                                <CheckBox
                                                text={item.options[2].name}
                                                value={(answer[nextquestion][id].value=== item.options[2].value)?true:false}
                                                disabled={false}
                                                onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[2].value),String(item.options[2].name))}
                                                />:null
                                                }
                                                {
                                                    (item.options.length >= 4)?
                                                        <CheckBox
                                                        text={item.options[3].name}
                                                        value={(answer[nextquestion][id].value=== item.options[3].value)?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[3].value),String(item.options[3].name))}
                                                        />:null
                                                }
                                                {
                                                    (item.options.length === 5)?
                                                        <CheckBox
                                                        text={item.options[3].name}
                                                        value={(answer[nextquestion][id].value=== item.options[4].value)?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[4].value),String(item.options[4].name))}
                                                        />:null
                                                }
                                                
                                                
                                            </View>
                                            
                                        }
                                    </View>
                            }
                        </View>
                        
                    )
                
                
            }):null
            }
            {
                (nextquestion!==0)?
                <View style={styles.cButton}>  
                    <Button 
                        title={"Anterior"}
                        onPress={()=>nextOrBeforeQuestion('-1')} 
                        fill='solid'
                    /> 
                </View>
                :null
            }
            <View style={styles.cButton}>  
                <Button 
                    title={"Siguiente"}
                    onPress={()=>nextOrBeforeQuestion('+1')} 
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
export default TestAssist;

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

