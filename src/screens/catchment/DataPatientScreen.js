import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { Styles } from '../../theme/GlobalStyle';

const DataPatientScreen = (props) => {

    const navigator = useNavigation()
    const today= new Date()
    const data=props.route.params.data
    const edad=(data.birthday)?today.getFullYear()-data.birthday.split('-')[0]:''

  return (
    <View style={styles.container}>
    {
        (edad)?
        <View style={Styles.borderContainer}>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Nombre: </Text>
                <Text style={styles.textData}>{data.first_name} {data.last_name}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Tipo Identificación: </Text>
                <Text style={styles.textData}>{data.dni_type_name}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Número de Identificación: </Text>
                <Text style={styles.textData}>{data.dni}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Fecha de Nacimiento: </Text>
                <Text style={styles.textData}>{data.birthday}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Edad: </Text>
                <Text style={styles.textData}>{edad}</Text>
            </View>
            <View style={styles.cData2}>
                <Text style={styles.textCampo}>Genero: </Text>
                <Text style={styles.textData}>{data.gender}</Text>
            </View>
            <Button
                title="Siguiente"
                onPress={()=> navigator.navigate('UpdateDataPatientScreen',{data:data})} 
                fill='solid'
            />
        </View>
        :null
    }
    </View>
  )
}
export default DataPatientScreen;

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20
    },
    cData:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor: '#CFD2CF',
        paddingVertical:20
    },
    cData2:{
        flexDirection:'row',
        paddingVertical:20,
        marginBottom:20
    },
    textData:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.REGULAR,
        fontSize:15
    },
    textCampo:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.BOLD,
        fontSize:16
    },
    btnHeader:{
        paddingHorizontal:5,
        paddingVertical:3,
        borderWidth:1,
        borderColor: 'white',
        borderRadius:3
    },
    textHeader:{
        color:Colors.WHITE,
        fontSize:13,
        fontFamily:Fonts.REGULAR
    },
})
