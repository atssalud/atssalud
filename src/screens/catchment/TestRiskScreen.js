import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const TestRiskScreen = (props) => {
    
    const idTest=props.route.params.id

    const {logOut} = useContext(AuthContext)
    const [answer,setAnswer]=useState()
    const [change,setChange]=useState()
    const [questions,setQuestions]=useState()
    const [token,setToken]=useState()
    const [error, setError] = useState()
    const [isSearch, setIsSearch] = useState(true)
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [checkBox, setCheckBox] = useState()
    
    const data = props.route.params.data
    const datos = props.route.params.datos

    const navigator=useNavigation()

    useEffect(() => {
      getToken()
      navigator.setOptions({
        // headerLeft:()=>(
        //     <TouchableOpacity
        //         onPress={()=> navigator.replace('BankDataScreen',{dataUser:data})}
        //     >
        //         <Icon
        //             name="chevron-left"
        //             color= {'white'}
        //             size={24}
        //         />
        //     </TouchableOpacity>
        // ),
        // headerTitle:props.route.params.title,
        // headerTitleStyle:{
        //     fontSize:14
        // }
        
    })
    }, [])
    
    const getToken =async()=>{
        const userToken = await AsyncStorage.getItem('token')
        getQuestion()
        setToken(userToken)
    
    }
    const getQuestion=async()=>{
        
        try {
            const resp = await http('get',Endpoint.getCheckRisk(idTest))
            console.log('respee',resp[0])
            if(resp.message==='token no válido'){
                logOut()
            }
            setQuestions(resp[0])
            listCkeckBox(resp[0].options.length)
            setIsSearch(false)
        } catch (error) {
            console.log('error',error)
        }
    }

    const listCkeckBox =(length)=>{
        const list=[]
        for (let i = 0; i < length; i++) {
            list.push({item:false})
        }
        
        setCheckBox(list)
    }
    
    const itemCheckboxSelected = (id,value)=>{

        let answ=[]
        if (answer !== undefined) answer.map(item=> answ.push(item))
        answ.push({'question_id':'9','name':value,'value':''})

        const filter= removeDuplicates(answ)
        setAnswer(filter)
        console.log(filter)

        if(checkBox[id].item === false){
            checkBox[id].item=true
            setCheckBox(checkBox)
        }else{
            checkBox[id].item=false
            setCheckBox(checkBox)
        }
    }

    const removeDuplicates=(elements)=>{
        let cleaned = []
        elements.forEach(element => {
          let encoded_value = JSON.stringify(element)
          if(cleaned.includes(encoded_value)){
            let position = cleaned.indexOf(encoded_value)
            cleaned.splice(position, 1)
          }else{
            cleaned.push(encoded_value)
          }
        })
        return cleaned.map(element => {
          return JSON.parse(element)
        })
      }

    const send=async()=>{
        setIsSearchResult(true)
        const user = await AsyncStorage.getItem('user');
        const { id } =  JSON.parse(user);
        console.log(user);
        const send={
            "token":token,
            "people_id":data.id,
            "user_id":id,
            "test":answer
        }
        console.log(JSON.stringify(send));
        try {
            const resp= await http('post',Endpoint.sendTestMenntal,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Riesgo Salud Mental'})
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
            {(questions)?
                <View style={styles.container}>
                    <View style={Styles.borderContainer}>
                        <View style={styles.cQuestion}>
                            <Text style={styles.tQuestion}>{questions.name}</Text>
                        </View>
                        <View>
                            {
                                questions.options.map((option,id)=>{
                                    return(
                                        <CheckBox
                                            key={id}
                                            text={option.name}
                                            value={checkBox[id].item}
                                            onValueChange={(newValue) => itemCheckboxSelected(id,option.name)}
                                        />
                                    )
                                })
                            }
                        </View>
                    </View>
                
                
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

export default TestRiskScreen;

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
