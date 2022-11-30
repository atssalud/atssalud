import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useForm } from '../../hooks/useForm'
import TextInputs from '../../components/TextInput'
import { Colors } from '../../theme/Colors'
import { Fonts } from '../../theme/Fonts'
import { Styles } from '../../theme/GlobalStyle'
import ListOptions from '../../components/ListOptions'
import Button from '../../components/Button'
import http from '../../services/http'
import { Endpoint } from '../../environment/Api'
import { useNavigation } from '@react-navigation/native'
import ViewAlertSkeletonScreen from '../skeleton/ViewAlertSkeletonScreen'
import { AuthContext } from '../../context/AuthContext'

const TestCardiovascularScreen = (props) => {

    const navigator = useNavigation()
    const data = props.route.params.data
    const datos = props.route.params.datos
    const {logOut} = useContext(AuthContext)

    const siNo=[{'id':'0','item':'No'},{'id':'1','item':'Si'}]
    
    const [token,setToken]=useState()
    const [error, setError] = useState()
    const [isSearchResult, setIsSearchResult] = useState(false)

    useEffect(() => {
        getToken()
    }, [])

    const getToken =async()=>{
        const userToken = await AsyncStorage.getItem('token')
        setToken(userToken)
    }

    const {gender,age,id,total_cholesterol,hdl,systolic_pressure,smoking,tratamiento,onChange} = useForm({
        gender:data.gender,
        age:datos.edad,
        total_cholesterol:'',
        hdl:'',
        systolic_pressure:'',
        smoking:'',
        tratamiento:'',
        id:data.dni
    })

    const send =async()=>{
        setIsSearchResult(true)
        const user = await AsyncStorage.getItem('user');
        const userJson =  JSON.parse(user);
        const data={
            "dni":String(id),
            "author_id":String(userJson.id),
            "gender":String(gender),
            "age":String(age),
            "total_cholesterol":String(total_cholesterol),
            "hdl_cholesterol":String(hdl),
            "systolic_pressure":String(systolic_pressure),
            "smoking":String(smoking),
            "blood_pressure_treatment":String(tratamiento),

        }
        console.log({data})
        try {
            const resp = await http('post',Endpoint.sendTestCardiovascular,data)
            if(resp.message==='token no válido'){
                logOut()
            }
            console.log(resp)
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Riesgo Cardivascular'})
                setIsSearchResult(false)
            }
            
            
        } catch (error) {
            console.log('error',error)
        }
    }

    const smokingSelect=(key,value)=>{
        console.log(key,value)
        onChange(key,'smoking')
    }
    const tratamientoSelect=(key,value)=>{
        console.log(key,value)
        onChange(key,'tratamiento')
    }
  return (
    <>
        {(isSearchResult)?
            <ViewAlertSkeletonScreen/>
            :
            <View style={[Styles.borderContainer,styles.container]}>
                <View style={{flexDirection:'row',}}>
                    <View style={[styles.cText,{marginRight:40}]}>
                        <Text style={styles.text}>Genero:</Text>
                        <Text style={styles.subtitle}>{gender}</Text>
                    </View>  
                    <View style={styles.cText}>
                        <Text style={styles.text}>Edad:</Text>
                        <Text style={styles.subtitle}>{age}</Text>
                    </View>  
                </View>
                <View style={{flexDirection:'row',}}>
                    <View>
                    <TextInputs
                        label='Colesterol Total'
                        placeholder="150"
                        onChangeText= { (value) => onChange(value,'total_cholesterol') }
                        value={total_cholesterol}
                        dimension='middle'
                    />
                    {(error)?
                        (error.total_cholesterol==='')?null:
                        <Text style={styles.textValid}>{error.total_cholesterol}</Text>: null
                    }
                    </View>
                    <View>
                    <TextInputs
                        label='HDL'
                        placeholder="45"
                        onChangeText= { (value) => onChange(value,'hdl') }
                        value={hdl}
                        dimension='middle'
                    />
                    {(error)?
                        (error.hdl==='')?null:
                        <Text style={styles.textValid}>{error.hdl}</Text>: null
                    }
                    </View>
                </View>
                <View style={{flexDirection:'row',}}>
                    <View>
                    <TextInputs
                        label='P.Sistólica'
                        placeholder="120"
                        onChangeText= { (value) => onChange(value,'systolic_pressure') }
                        value={systolic_pressure}
                        dimension='middle'
                    />
                    {(error)?
                        (error.systolic_pressure==='')?null:
                        <Text style={styles.textValid}>{error.systolic_pressure}</Text>: null
                    }
                    </View>
                    <View style={{marginTop:2}}>
                    <ListOptions
                        label='Fumador'
                        options={siNo}
                        itemSelect={smokingSelect}
                        dimension='middle'
                        placeholder={'No'}
                        />
                    {(error)?
                        (error.smoking==='')?null:
                        <Text style={styles.textValid}>{error.smoking}</Text>: null
                    }
                    </View>
                </View>
                <View style={{flexDirection:'row',}}>
                <View>
                    <ListOptions
                        label='¿ Tiene tratamiento ?'
                        options={siNo}
                        itemSelect={tratamientoSelect}
                        dimension='middle'
                        placeholder={'No'}
                        />
                    {(error)?
                        (error.tratamiento==='')?null:
                        <Text style={styles.textValid}>{error.tratamiento}</Text>: null
                    }
                    </View>
                </View>
                <View style={styles.cButton}>  
                    <Button
                        title="Calcular"
                        onPress={()=>send()} 
                        fill='solid'
                    /> 
                </View>
            </View>
        }
    </>
  )
}
export default TestCardiovascularScreen

const Width=Dimensions.get('window').width

const styles=StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20
    },
    text:{
        fontFamily:Fonts.BOLD,
        fontSize:15,
        color:Colors.FONT_COLOR
    },
    subtitle:{
        fontFamily:Fonts.REGULAR,
        fontSize:15,
        color:Colors.FONT_COLOR,
        marginTop:10,
        marginBottom:15
    },
    cText:{
        borderBottomWidth:2,
        borderColor:Colors.GREY_LIGHT,
        marginBottom:15,
        width:Width/3

    },
    textValid:{
        fontSize: 11,
        fontFamily:Fonts.BOLD,
        color:"#ff5d2f",
        marginLeft:4,
        marginTop:-10,
        marginBottom:5
    },
})
