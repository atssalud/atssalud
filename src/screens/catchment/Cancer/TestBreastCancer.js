

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Button from '../../../components/Button'
import Checkbox from '../../../components/CheckBox'
import { AuthContext } from '../../../context/AuthContext'
import { Endpoint } from '../../../environment/Api'
import http from '../../../services/http'
import { Colors } from '../../../theme/Colors'
import { Fonts } from '../../../theme/Fonts'
import { Styles } from '../../../theme/GlobalStyle'
import IsConnectedScreen from '../../IsConnectedScreen'
import TestSkeletonScreen from '../../skeleton/TestSkeletonScreen'
import ViewAlertSkeletonScreen from '../../skeleton/ViewAlertSkeletonScreen'

const TestBreastCancer = (props) => {

    const navigator=useNavigation()
    const {logOut,isConnected} = useContext(AuthContext)
    const [ netInfo,setNetInfo]=useState(false)
    const [ isSearch,setIsSearch]=useState(true)
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [ questions,setQuestions]=useState()
    const [ answer,setAnswer]=useState()
    const [change,setChange]=useState()
    const [noAnwer,setNoAnwer]=useState()

    const data = props.route.params.data
    const datos = props.route.params.datos

    console.log({data})
    console.log({datos})

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
        // setToken(userToken)
    }

    const getQuestion =async()=>{
        try {
            setIsSearch(true)
            const resp = await http('get',Endpoint.listTestBreastCancer)
            if(resp.message==='token no válido'){
                logOut()
            }
            console.log(resp)
            listadoPreguntas(resp)
            setIsSearch(false)
            
        } catch (error) {
            console.log('error getQuestion',error)
        }
    }

    const listadoPreguntas=(datos)=>{
        const lista1=[]
        const question1=[]
        const question2=[]
        const lista2=[]
        datos.map(i=>{
            if (i.extra_values ==='1'){
                var question_id =i.id
                var extra_values=i.extra_values
                var value=i.options[1].value
                lista1.push({question_id,extra_values,value})
                question1.push(i)
            }
            if (i.extra_values ==='2'){
                var question_id =i.id
                var extra_values=i.extra_values
                var value=i.options[1].value
                lista2.push({question_id,extra_values,value})
                question2.push(i)
            }   
        })

        if(data.age<50){
            setAnswer(lista1)
            setQuestions(question1)
            setNoAnwer(lista2)
            console.log({lista1})
        }else{
            setAnswer(lista2)
            setQuestions(question2)
            setNoAnwer(lista1)
            console.log({lista2})
        }
        
        
    }

    const itemCheckboxSelected = (id, value)=>{
        if(id===0 && value ==='0'){
            answer[id].value=value
            answer[1].value=value
        }
        if(id===2 && value ==='0'){
            answer[id].value=value
            answer[3].value=value
        }
        answer[id].value=value
        console.log({answer})
        if(change===false){
            setChange(true)
        }else{
            setChange(false)
        }
    }

    const itemCheckboxSelected2 = (id, value)=>{
        console.log(id)
        if(id===0){
            if(value==='1'){
                answer[id].value=value
            }else{
                answer.map((index,i)=>{
                    answer[i].value=value
                })
            }
        }else{
            answer.map((index,i)=>{
                if(i!==0 && value==='1'){
                    if(i===id){
                        answer[i].value=value
                    }else{
                        answer[i].value='0'
                    }
                }
            })
            
        }
        console.log({answer})
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
        console.log(user);
        const send={
            "dni": data.dni,
            "author_id": String(id),
            "test": [{
                "question_id": 280,
                "value": String(data.age),
                "extra_values": "0"
            },...answer,...noAnwer]
        }
        console.log(JSON.stringify(send));
        try {
            const resp= await http('post',Endpoint.sendTestBreastCancer,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Riesgo Cancer de mama'})
                setIsSearchResult(false)
            }
            
        } catch (error) {
            console.log('error',error)
        }
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
                            {
                                (data.age<50)?
                                <>
                                    {(questions)?questions.map((item,id)=>{
                                        if(id !== 1 && id !== 3 && answer[0].value==='0'&& answer[2].value==='0'){
                                
                                        return(
                                            <View style={Styles.borderContainer} key={id}>
                                                <View style={styles.cQuestion}>
                                                    <Text style={styles.tQuestion}>{item.name}</Text>
                                                </View>
                                                <View style={styles.cCheckBox}>
                                                    <Checkbox
                                                        text={item.options[0].name}
                                                        value={(answer[id].value=== '1')?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected(id,'1')}
                                                    />
                                                    <Checkbox
                                                        text={item.options[1].name}
                                                        value={(answer[id].value !== '1')?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value))}
                                                    />
                                                </View>
                                            </View>
                                        )
                                
                                        }
                                        if(id==1 && answer[0].value==='1'){
                                            const itemAnterior=questions[id-1]
                                            return(
                                                <View key={id*6}>
                                                    <View style={Styles.borderContainer}>
                                                        <View style={styles.cQuestion}>
                                                            <Text style={styles.tQuestion}>{itemAnterior.name}</Text>
                                                        </View>
                                                        <View style={styles.cCheckBox}>
                                                            <Checkbox
                                                                text={itemAnterior.options[0].name}
                                                                value={(answer[id-1].value=== '1')?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id-1,'1')}
                                                            />
                                                            <Checkbox
                                                                text={itemAnterior.options[1].name}
                                                                value={(answer[id-1].value !== '1')?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id-1,String(itemAnterior.options[1].value))}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={Styles.borderContainer} key={id}>
                                                        <View style={styles.cQuestion}>
                                                            <Text style={styles.tQuestion}>{item.name}</Text>
                                                        </View>
                                                        <View style={styles.cCheckBox}>
                                                            <Checkbox
                                                                text={item.options[0].name}
                                                                value={(answer[id].value=== '1')?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id,'1')}
                                                            />
                                                            <Checkbox
                                                                text={item.options[1].name}
                                                                value={(answer[id].value !== '1')?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value))}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                
                                            }
                                        if(id==3 && answer[2].value==='1'){
                                            const itemAnterior=questions[id-1]
                                            return(
                                                <View key={id*9}>
                                                    <View style={Styles.borderContainer}>
                                                        <View style={styles.cQuestion}>
                                                            <Text style={styles.tQuestion}>{itemAnterior.name}</Text>
                                                        </View>
                                                        <View style={styles.cCheckBox}>
                                                            <Checkbox
                                                                text={itemAnterior.options[0].name}
                                                                value={(answer[id-1].value=== '1')?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id-1,'1')}
                                                            />
                                                            <Checkbox
                                                                text={itemAnterior.options[1].name}
                                                                value={(answer[id-1].value !== '1')?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id-1,String(itemAnterior.options[1].value))}
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={Styles.borderContainer} key={id}>
                                                        <View style={styles.cQuestion}>
                                                            <Text style={styles.tQuestion}>{item.name}</Text>
                                                        </View>
                                                        <View style={styles.cCheckBox}>
                                                            <Checkbox
                                                                text={item.options[0].name}
                                                                value={(answer[id].value=== '1')?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id,'1')}
                                                            />
                                                            <Checkbox
                                                                text={item.options[1].name}
                                                                value={(answer[id].value !== '1')?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value))}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                            
                                        }
                                        
                                            
                                        
                                    }):null
                                    }


                                </>
                                :
                                
                                <>
                                    {(questions)?questions.map((item,id)=>{
                                        if(id === 0){
                                        return(
                                            <View style={Styles.borderContainer} key={id}>
                                                <View style={styles.cQuestion}>
                                                    <Text style={styles.tQuestion}>{item.name}</Text>
                                                </View>
                                                <View style={styles.cCheckBox}>
                                                    <Checkbox
                                                        text={item.options[0].name}
                                                        value={(answer[id].value=== '1')?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected2(id,'1')}
                                                    />
                                                    <Checkbox
                                                        text={item.options[1].name}
                                                        value={(answer[id].value !== '1')?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected2(id,String(item.options[1].value))}
                                                    />
                                                </View>
                                            </View>
                                            )
                                        }
                                        if(id !== 0 && answer[0].value === '1'){
                                            return(
                                                <View style={Styles.borderContainer} key={id}>
                                                    <View style={styles.cQuestion}>
                                                        <Text style={styles.tQuestion}>{item.name}</Text>
                                                    </View>
                                                    <View style={styles.cCheckBox}>
                                                        <Checkbox
                                                            text={item.options[0].name}
                                                            value={(answer[id].value=== '1')?true:false}
                                                            disabled={false}
                                                            onValueChange={(newValue) => itemCheckboxSelected2(id,'1')}
                                                        />
                                                        <Checkbox
                                                            text={item.options[1].name}
                                                            value={(answer[id].value !== '1')?true:false}
                                                            disabled={false}
                                                            onValueChange={(newValue) => itemCheckboxSelected2(id,String(item.options[1].value))}
                                                        />
                                                    </View>
                                                </View>
                                                )
                                            }
                                        
                                        
                                    }):null
                                    }
                                </>
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
            }
            
        </>
    )
}
export default TestBreastCancer

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

