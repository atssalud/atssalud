import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
        <View style={styles.box}>
            <Text style={styles.title}>Número de alertas generadas</Text>
            <Text style={styles.number}>54</Text>
            <Text style={styles.text}>Pacientes</Text>
        </View>
        <View style={styles.box}>
            <Text style={styles.title}>Número de alertas confirmadas</Text>
            <Text style={styles.number}>54</Text>
            <Text style={styles.text}>Pacientes</Text>
        </View>
        
    </View>
  )
}
export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20,
        alignItems:'center'
    },
    box:{
        backgroundColor:Colors.DARK_BLUE,
        width:352,
        height:209,
        borderRadius:20,
        padding:20,
        alignItems:'center',
        marginTop:20
    },
    title:{
        fontFamily:Fonts.BOLD,
        fontSize:20,
        color:Colors.WHITE
    },
    number:{
        fontFamily:Fonts.BOLD,
        fontSize:64,
        color:Colors.WHITE,
        marginTop:20
    },
    text:{
        fontFamily:Fonts.REGULAR,
        fontSize:15,
        color:Colors.WHITE,
        marginTop:-10
    }
})