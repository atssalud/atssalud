import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { Styles } from '../../theme/GlobalStyle';

const DataPatientScreen = (props) => {

    const navigator = useNavigation()
    const data=props.route.params.data

    let testsToApplicate = []

    if(data){
        console.log('data',data.risks)
        let testsPeople = data.risks;
        //Condicion previa caracterización.
        let testsToEvaluate = [
            'SALUD MENTAL',
            'RIESGO EPOC',
            'RIESGO CARDIOVASCULAR',
            'RIESGO DE ASMA EN NIÑOS'
        ];
        testsToEvaluate.map((testToEvaluate)=>{
            let tests = testsPeople.filter(testPeople=> testPeople.risk_name == testToEvaluate);
            let testsOrderByDesc = tests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            if(testsOrderByDesc[0] !== undefined){

                testsToApplicate.push(testsOrderByDesc[0]);
            }
        });

        console.log(testsToApplicate);
    }



  return (
    <ScrollView>
    <View style={styles.container}>
    {
        (data)?
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
                <Text style={styles.textData}>{data.age}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Genero: </Text>
                <Text style={styles.textData}>{data.gender}</Text>
            </View>
            {(testsToApplicate.length !== 0)?
                testsToApplicate.map((risk,id)=>{
                    
                    return(
                        <View style={styles.cData} key={id}>
                            <View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.textCampo}>T.Aplicado: </Text>
                                    <Text style={styles.textData}>{risk.risk_name}</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={styles.textCampo}>Fecha: </Text>
                                    <Text style={styles.textData}>{risk.created_at}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })
                :
                <View style={styles.cData2}>
                    <Text style={styles.textCampo}>Riesgos: </Text>
                    <Text style={styles.textData}>Sin test aplicados</Text>
                </View>
            }
            <View style={{marginTop:10}}>
                <Button
                    title="Siguiente"
                    onPress={()=> navigator.navigate('UpdateDataPatientScreen',{data:data})} 
                    fill='solid'
                />
            </View>
        </View>
        :null
    }
    </View>
    </ScrollView>
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
        fontSize:15,
        marginTop:1
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
