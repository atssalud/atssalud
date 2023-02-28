import React from 'react'
import { StyleSheet,Text,TextInput, View,Dimensions } from 'react-native';
import { Colors } from '../theme/Colors';
import { Fonts} from '../theme/Fonts'
 
const TextInputs = ({
    label,
    placeholder,
    placeholderTextColor=Colors.GREY_PLACEHOLDER,
    keyboardType='text',
    selectionColor="#CACFD2",
    autoCapitalize='none',
    onChangeText,
    value,
    onSubmitEditing=null,
    secureTextEntry=false,
    line='grey',
    dimension='all'
}) => {
  return (
    <View style={[(line==='grey')?styles.line:styles.line2,(dimension==='all')?null:styles.dimension,27]}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            placeholder= {placeholder}
            placeholderTextColor={placeholderTextColor}
            keyboardType={keyboardType}
            selectionColor={selectionColor}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            onChangeText= {onChangeText}
            value={value}
            onSubmitEditing={onSubmitEditing}
            secureTextEntry={secureTextEntry}
            style={styles.text}
        />
    </View>
  )
}

export default TextInputs;

const Width=Dimensions.get('window').width

const styles=StyleSheet.create({
  label:{
    fontFamily:Fonts.BOLD,
    fontSize:15,
    color:Colors.FONT_COLOR
  },
  text:{
    fontFamily:Fonts.LIGHT,
    fontSize:16,
    color:Colors.FONT_COLOR,
    
  },
  line:{
    borderBottomWidth:2,
    marginBottom:15,
    borderColor:Colors.GREY_LIGHT
  },
  line2:{
    borderBottomWidth:2,
    marginBottom:15,
    borderColor:Colors.BLUE_GREY
  },
  dimension:{
    width:Width/3,
    marginRight:40,
  }
})
