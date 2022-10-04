import React from 'react'
import {View,TouchableOpacity,Text,StyleSheet,Image} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../theme/Colors';
import { Fonts } from '../theme/Fonts';

export const ButtonImage = ({nameImage,size,type,text,color=Colors.PRIMARY_COLOR,btnFunction}) => {
  return (
    <View style={styles.cBtnRute}>
      <TouchableOpacity 
      style={styles.cBtnImgText}
      onPress={btnFunction}
      >
        <View
        style={styles.btnRute}
        >
          {(type === 'image')?
          <Image
          style={styles.image}
          source={nameImage}
          />
          :
          <Icon
            name={nameImage}
            color={color}
            size={size}
          />
          }
          <Text style={styles.tBtnRute}>{text}</Text>
        </View>
        <Icon
            name='chevron-right'
            color={color}
            size={20}
          />
       </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
    cBtnRute:{
        marginHorizontal:5,
        marginVertical:10,
        marginTop:20
      },
      btnRute:{
        flexDirection:'row',
        paddingHorizontal:10,
        paddingVertical:7,
        justifyContent: 'center',
        alignItems:'center'
      },
      cBtnImgText:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 12.0,
        paddingHorizontal: 10.0,
        paddingTop: 10.0,
        paddingBottom: 15.0,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 6.0,
        shadowOpacity: 4.0,
        
      },
      tBtnRute:{
        color:Colors.BLUE_GREY,
        fontSize:16,
        marginLeft:20,
        fontFamily:Fonts.BOLD
      },
      image:{
        width:17,
        height:13,
      }

})
