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

export const TestProstateCancer = (props) => {

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
            const resp = await http('get',Endpoint.listTestProstateCancer)
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
            if(i.id !== 317 && i.id !==318){
                var question_id =i.id
                var extra_values="0"
                var value=i.options[1].value
                lista1.push({question_id,extra_values,value})
                question1.push(i) 
            }else{
                if(i.id ===317){
                    var question_id =i.id
                    var extra_values="0"
                    var value="0"
                    lista1.push({question_id,extra_values,value})
                    question1.push(i) 
                }else{
                    var question_id =i.id
                    var extra_values="0"
                    var value=data.age
                    lista1.push({question_id,extra_values,value})
                    question1.push(i) 
                    
                }
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
            const resp= await http('post',Endpoint.sendTestProstateCancer,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Riesgo Cancer de Prostata'})
                setIsSearchResult(false)
            }
            
        } catch (error) {
            console.log('error',error)
        }
    }

    const handleTest = () => {

        const error = []
        if (spa.trim().length === 0) {
            error.spa = 'Campo Obligatorio'
        }

        const vspa = spa.includes(',')
        if (vspa) {
            error.spa = 'Use punto'
        }
        if ((spa.trim().length>0 ||answer[2].value === '0' ) && (vspa === false)) {
            send()
        }

        setError(error)
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
                                        if(item.id !== 317 && item.id !== 318 && item.id !==315){
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
                                        if(item.id ===315 && answer[0].value === '1'){
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
                                        if(item.id === 317 &&  answer[2].value === '1'){
                                            return(
                                                <View style={Styles.borderContainer} key={item.id}>
                                                <View style={styles.cQuestion}>
                                                    {/* <Text style={styles.tQuestion}>¿Ha fumado 30 o más paquetes de productos derivados del tabaco? </Text> */}
                                                    <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', width: '100%', }}>

                                                        <View>
                                                            <TextInputs
                                                                label={'Digite Antigeno Prostático Específico'}
                                                                placeholder={'2.5'}
                                                                keyboardType='numeric'
                                                                dimension='all'
                                                                onChangeText={(value) => setspa(value)}
                                                                value={spa}
                                                            />
                                                            {(error) ?
                                                                (error.spa === '') ? null :
                                                                    <Text style={styles.textValid}>{error.spa}</Text> : null
                                                            }
                                                        </View>
                                                    </View>

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
                                onPress={()=>handleTest()} 
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
