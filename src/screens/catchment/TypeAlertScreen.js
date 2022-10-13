import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Styles } from '../../theme/GlobalStyle';
import { Fonts } from '../../theme/Fonts';
import { Colors } from '../../theme/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonImage } from '../../components/ButtonImage';
import http from '../../services/http';
import { Endpoint } from '../../environment/Api';

const TypeAlertScreen = (props) => {
  const data= props.route.params.data
  const token= props.route.params.token
  const navigator = useNavigation()
  const [dataPeople,setDataPeople]=useState()
  
  useEffect(() => {
    if(data){
      findPeople()
    }
  }, [])
  console.log('enviodata',data)
  const findPeople=async()=>{

    const datos={
        "token":token,
        "dni":data.numIdentificacion,
        "dni_type":data.idTipoIdentificacion
    }
    console.log({datos})
    try {
        const resp= await http('post',Endpoint.findPeople,datos)
        console.log('resp',resp)
        setDataPeople(resp.data)
        
    } catch (error) {
        console.log('error',error)
    }
}
  

  return (
    <View style={style.container}>
      {(data.edad>44)?
        <ButtonImage
        nameImage='heartbeat'
        text='Cardiovascular'
        size={30}
        btnFunction={()=>navigator.navigate('TestCardiovascularScreen',{data:dataPeople,edad:data.edad})}
      />
      :null
      }
      {(data.edad<8)?
        <ButtonImage
        nameImage='child'
        text='Asma'
        size={30}
        btnFunction={()=>navigator.navigate('TestAsthmaScreen',{data:dataPeople,edad:data.edad})}
      />
      :null
      }
      {(data.edad>39)?
        <ButtonImage
        nameImage='medkit'
        text='Epoc'
        size={30}
        btnFunction={()=>navigator.navigate('TestEpocScreen',{data:dataPeople,edad:data.edad})}
      />
      :null
      }
      
    </View>
  )
}
export default TypeAlertScreen

const style=StyleSheet.create({
  container:{
    marginHorizontal:20,
    marginVertical:20
  },
  cBtn:{
    justifyContent:'center',
    alignItems:'center'
  },
  tBtn:{
    fontFamily:Fonts.BOLD,
    fontSize:18,
    color:Colors.FONT_COLOR
  }
})
