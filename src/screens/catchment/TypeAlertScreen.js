import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Styles } from '../../theme/GlobalStyle';
import { Fonts } from '../../theme/Fonts';
import { Colors } from '../../theme/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonImage } from '../../components/ButtonImage';

const TypeAlertScreen = (props) => {
  const data= props.route.params.data
  console.log('dataa',data)
  const navigator = useNavigation()
  return (
    <View style={style.container}>
      {(data.edad>17)?
        <ButtonImage
        nameImage='heartbeat'
        text='Cardiovascular'
        size={30}
        btnFunction={()=>navigator.navigate('TestCardiovascularScreen',{data:data})}
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
