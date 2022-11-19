import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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

const TestAsthmaScreen = (props) => {
    const [answer,setAnswer]=useState()
    const [change,setChange]=useState()
    const [questions,setQuestions]=useState()
    const [token,setToken]=useState()
    const [error, setError] = useState()
    const [isSearch, setIsSearch] = useState(true)
    const [isSearchResult, setIsSearchResult] = useState(false)
    const {logOut} = useContext(AuthContext)

    const data = props.route.params.data
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
    const getQuestion=async(token)=>{
        const data={
            'token':token
        }
        console.log({data})
        try {
            const resp = await http('post',Endpoint.listItemTestAsthma,data)
            if(resp.message==='token no válido'){
                logOut()
            }
            console.log(resp)
            setQuestions(resp.data)
            listadoPreguntas(resp.data)
            setIsSearch(false)
        } catch (error) {
            console.log('error',error)
        }
    }


    const listadoPreguntas=(data)=>{
        const lista=[]
        data.map(i=>{
            var id =i.id
            var question=i.name
            var answer=i.options[0].value

            lista.push({id,question,answer})
        })
        setAnswer(lista)
    }
   

    const itemCheckboxSelected = (id, value)=>{
        console.log(id,value)
        answer[id].answer=value
        console.log(answer)
        if(change===false){
            setChange(true)
        }else{
            setChange(false)
        }
    }

    const send=async()=>{
        setIsSearchResult(true)
        const user = await AsyncStorage.getItem('user');
        const { id } =  JSON.parse(user);
        const send={
            "token":token,
            "people_id":data.id,            
            "user_id":id,
            "test":answer
        }
        console.log({datos})
        try {
            const resp= await http('post',Endpoint.sendTestAsthma,send)
            console.log(resp)
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Riesgo Asma'})
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

                    return(
                        <View style={Styles.borderContainer} key={id}>
                            <View style={styles.cQuestion}>
                                <Text style={styles.tQuestion}>{item.name}</Text>
                            </View>
                            <View style={styles.cCheckBox}>
                                <CheckBox
                                    text={item.options[0].name}
                                    value={(answer[id].answer=== '0')?true:false}
                                    disabled={false}
                                    onValueChange={(newValue) => itemCheckboxSelected(id,'0')}
                                />
                                <CheckBox
                                    text={item.options[1].name}
                                    value={(answer[id].answer !== '0')?true:false}
                                    disabled={false}
                                    onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value))}
                                />
                            </View>
                        </View>
                    )
                }):null
                }
                
                <View style={styles.cButton}>  
                    <Button 
                        title={"Calcular"}
                        onPress={()=>send()} 
                        fill='solid'
                    /> 
                </View>
            </View>
            :null}
            
        </ScrollView>
    }
    </>
  )
}
export default TestAsthmaScreen;

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
    }
})
