import React from 'react'
import {View,Text,TextInput,StyleSheet,Dimensions} from 'react-native'
import { Colors } from '../../../theme/Colors'
import { Fonts } from '../../../theme/Fonts'

export const InputText = ({title,value,onChangeText,name,keyboardType = "default",width="middle",placeholder=''}) => {

    const onChange =(value) => {
        return onChangeText(value,name)
    }
  return (
    <View style={styles.line}>
        <Text style={styles.title}>{title}</Text>
            <TextInput
                    selectionColor={Colors.OPAQUE_ORANGE}
                    autoCapitalize="none"
                    keyboardType={keyboardType}
                    autoCorrect={false}
                    onChangeText= { (text) => onChange(text) }
                    value={value}
                    style={(width === 'middle') ? styles.textInput : styles.textInput2}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.GREY_PLACEHOLDER}
                    
                    
                />
    </View>
  )
}
const WIDTH= Dimensions.get('window').width
const styles = StyleSheet.create({
    line:{
        borderBottomWidth:2,
        marginBottom:10,
        borderBottomColor:Colors.BLUE_GREY
    },
    title:{
        color: Colors.FONT_COLOR,
        fontSize: 15,
        fontFamily: Fonts.BOLD,
        marginBottom: 10.0,
    },
    textInput:{
        width:WIDTH/2.4
    },
    textInput2:{
        width:WIDTH,
        marginBottom:30,
        color: Colors.FONT_COLOR,
        fontSize: 18,
        fontFamily: Fonts.REGULAR,
        padding: 0,
        margin: 0,
        marginTop: 3,
        marginBottom:10
    }
})

