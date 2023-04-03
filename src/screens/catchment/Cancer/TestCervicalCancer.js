
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

export const TestCervicalCancer = (props) => {

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
            const resp = await http('get',Endpoint.listTestCervicalCancer)
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
        datos.map(i=>{
            if (i.extra_values ==='1'){
                var question_id =i.id
                var extra_values=i.extra_values
                var value=null
                lista1.push({question_id,extra_values,value})
                question1.push(i)
            }  
        })

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
            const resp= await http('post',Endpoint.sendTestCervicalCancer,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Riesgo Cancer de cervix'})
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
                                        if(id === 0){
                                        return(
                                            <View style={Styles.borderContainer} key={id}>
                                                <View style={styles.cQuestion}>
                                                    <Text style={styles.tQuestion}>{item.name}</Text>
                                                </View>
                                                <View style={styles.cCheckBox}>
                                                    <Checkbox
                                                        text={item.options[0].name}
                                                        value={(answer[id].value === item.options[0].value)?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected(id,'1')}
                                                    />
                                                    <Checkbox
                                                        text={item.options[1].name}
                                                        value={(answer[id].value === item.options[1].value)?true:false}
                                                        disabled={false}
                                                        onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value))}
                                                    />
                                                </View>
                                            </View>
                                            )
                                        }
                                        if(id !== 0 && answer[0].value === '1'){
                                            if(id===1){
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
                                            if(id===2 && answer[1].value === 'ccu' ){
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
                                            if(id===3 && answer[2].value === '0'&& answer[1].value === 'ccu'){
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
                                            if(id===4 && answer[1].value === 'and_vph' ){
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
                                            if(id===5 && answer[1].value === 'and_vph' && answer[4].value === '0' ){
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
                                            if(id===6 && answer[1].value === 'and_vph' && answer[4].value === '0' && answer[5].value === '1' ){
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
                                            if(id===7 && answer[1].value === 'cb'){
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
