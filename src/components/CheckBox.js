import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Colors} from '../theme/Colors'
import { Fonts } from '../theme/Fonts';

const Checkbox = ({text,disabled,value,onValueChange}) => {
  return (
    <View style={styles.container}>
        <CheckBox
            disabled={disabled}
            value={value}
            tintColors={{'true':Colors.PRIMARY_COLOR}}
            onValueChange={onValueChange}
        />
        <Text style={styles.text}>{text}</Text>
        
    </View>
  )
}
export default Checkbox;

const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        flex:1,
    },
    text:{
      fontFamily:Fonts.REGULAR,
      color:Colors.FONT_COLOR,
      fontSize:13,
      flex:1,
    }
})