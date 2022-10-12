import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Colors} from '../theme/Colors'

const Checkbox = ({text,disabled,value,onValueChange}) => {
  return (
    <View style={styles.container}>
        <CheckBox
            disabled={disabled}
            value={value}
            tintColors={{'true':Colors.PRIMARY_COLOR}}
            onValueChange={onValueChange}
            // style={styles.checkbox}
        />
        <Text>{text}</Text>
    </View>
  )
}
export default Checkbox;

const styles=StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center'
    }
})