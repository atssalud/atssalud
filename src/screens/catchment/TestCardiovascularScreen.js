import React, { useEffect, useState } from 'react'
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

const TestCardiovascularScreen = (props) => {

    const navigator = useNavigation()
    const data = props.route.params.data
    const edad = props.route.params.edad

    const siNo=[{'id':'0','item':'No'},{'id':'1','item':'Si'}]
    
    const [token,setToken]=useState()
    const [error, setError] = useState()

    useEffect(() => {
        getToken()
    }, [])

    const getToken =async()=>{
        const userToken = await AsyncStorage.getItem('token')
        setToken(userToken)
    }

    const {gender,age,id,total_cholesterol,hdl,systolic_pressure,smoking,diabetes,onChange} = useForm({
        gender:data.gender,
        age:edad,
        total_cholesterol:'',
        hdl:'',
        systolic_pressure:'',
        smoking:'',
        diabetes:'',
        id:data.id
    })

    const send =async()=>{
        const data={
            "token":token,
            "people_id":id,
            "gender":gender,
            "age":age,
            "total_cholesterol":total_cholesterol,
            "hdl":hdl,
            "systolic_pressure":systolic_pressure,
            "smoking":smoking,
            "diabetes":diabetes
        }
        console.log({data})
        try {
            const resp = await http('post',Endpoint.testCardiovascular,data)
            console.log(resp)
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data})
            }
            
            
        } catch (error) {
            console.log('error',error)
        }
    }

    const smokingSelect=(key,value)=>{
        console.log(key,value)
        onChange(key,'smoking')
    }
    const diabeteSelect=(key,value)=>{
        console.log(key,value)
        onChange(key,'diabetes')
    }
  return (
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
                label='Diabético'
                options={siNo}
                itemSelect={diabeteSelect}
                dimension='middle'
                placeholder={'No'}
                />
            {(error)?
                (error.diabetes==='')?null:
                <Text style={styles.textValid}>{error.diabetes}</Text>: null
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
