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
import TextInputs from '../../../components/TextInput'

export const FilterTestColonAndRectalCancer = (props) => {

    const navigator=useNavigation()
    const {logOut,isConnected} = useContext(AuthContext)
    const [ netInfo,setNetInfo]=useState(false)
    const [ isSearch,setIsSearch]=useState(true)
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [ questions,setQuestions]=useState()
    const [ answer,setAnswer]=useState()
    const [change,setChange]=useState()
    const [noAnwer,setNoAnwer]=useState()
    const [spa, setspa] = useState('')
    const [error, setError] = useState({
        spa: '',
    })

    const data = props.route.params.data
    const datos = props.route.params.datos

    console.log(data.age)

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
            const resp = await http('get',Endpoint.listTestColonAndRectalCancer)
            if(resp.message==='token no válido'){
                logOut()
            }
            console.log({resp})
            listadoPreguntas(resp)
            setIsSearch(false)
            
        } catch (error) {
            console.log('error getQuestion',error)
        }
    }

    const listadoPreguntas=(datos)=>{
        const lista1=[]
        const question1=[]
        datos.map(i=>{
            if(i.id !== 319){
                var question_id =i.id
                var extra_values=i.extra_values
                var value=i.options[1].value
                lista1.push({question_id,extra_values,value})
                question1.push(i) 
            }else{
                var question_id =i.id
                var extra_values=i.extra_values
                var value=data.age
                lista1.push({question_id,extra_values,value})
                question1.push(i) 
            }
            
        })
        console.log({question1})

        setAnswer(lista1)
        setQuestions(question1)
        
        
    }

    const itemCheckboxSelected = (id, value)=>{
        answer[id].value = value
        console.log(answer[id])
        if (change === false) {
            setChange(true)
        } else {
            setChange(false)
        }
    }

    const validate=()=>{
        let count=0
        answer.map(item=>{
            if(item.value==='1'){
                send()
                console.log('entro')
            }else{
                count+=1
            }
        })
        if(count===13){
            navigator.navigate('TestColonAndRectalCancer',{data:data,datos:datos,answer:answer,questions:questions})
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
            "test": answer,
        }
        console.log(JSON.stringify(send));
        try {
            const resp= await http('post',Endpoint.sendTestColonAndRectalCancer,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Riesgo Cancer de colon y recto'})
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
                                <>
                                    {(questions)?questions.map((item,id)=>{
                                        if(item.id !== 319 && item.id !== 330 && item.id !==331){
                                                return(
                                                    <View style={Styles.borderContainer} key={id}>
                                                        <View style={styles.cQuestion}>
                                                            <Text style={styles.tQuestion}>{item.name}</Text>
                                                        </View>
                                                        <View>
                                                            <Checkbox
                                                                text={item.options[0].name}
                                                                value={(answer[id].value === item.options[0].value)?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[0].value))}
                                                            />
                                                            <Checkbox
                                                                text={item.options[1].name}
                                                                value={(answer[id].value === item.options[1].value)?true:false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value))}
                                                            />
                                                            {
                                                                (item.options.length >= 3) ?
                                                                    <Checkbox
                                                                        text={item.options[2].name}
                                                                        value={(answer[id].value === item.options[2].value) ? true : false}
                                                                        disabled={false}
                                                                        onValueChange={(newValue) => itemCheckboxSelected(id, String(item.options[2].value))}
                                                                    /> : null
                                                            }
                                                            
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
                                title={data.age>49?"Siguiente":"Calcular"}
                                onPress={()=>data.age>49?validate():send()} 
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
    textValid: {
        fontSize: 14,
        fontFamily: Fonts.BOLD,
        color: "#ff5d2f",
        marginBottom: 10
    },
})
