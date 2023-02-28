import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/Button';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { Styles } from '../../theme/GlobalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

const DataPatientScreen = (props) => {

    const navigator = useNavigation()
    const data=props.route.params.data
    
    useEffect(() => {
        navigator.setOptions({
            headerRight:()=>(
                <TouchableOpacity
                    style={{padding:5}}
                    onPress={() => navigator.replace('Tabs', { screen: 'CatchmentScreen' })}
                >
                    <Icon
                        name="stethoscope"
                        color= {'white'}
                        size={25}
                    />
                </TouchableOpacity>
            ),
          })
    }, [])
    
    

    let testsToApplicate = []
    let brandsToApplicate = []

    if(data){
        console.log('data',data.tamizajes)
        let testsPeople = data.tamizajes;
        let brandsPeople = data.marcas;
        //Condicion previa caracterización.
        let testsToEvaluate = [
            'DIABETES FINDRISC',
            'EPOC',
            'CARDIOVASCULAR',
            'ASMA EN NIÑOS',
            'HIPERTENSIÓN ARTERIAL',
            'ENFERMEDAD RENAL CRÓNICA',
            'RIESGO CARDIOVASCULAR OMS',
            'SOSPECHA DE EMBARAZO',
            'POBLACIÓN EN RIESGO O PRESENCIA DE ALTERACIONES NUTRICIONALES',
            'SALUD MENTAL - SRQ',
            'SALUD MENTAL - RQC',
            'ALTO RIESGO REPRODUCTIVO',
            'DEMENCIA',
            'ASSIST',
            'EZQUIZOFRENIA',
            'ARTRITIS REUMATOIDEA',
            'CANCER DE MAMA'

        ];
        let brandsToEvaluate = [
            'DIABETES MELLITUS',
            'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)',
            'ENFERMEDAD CEREBROVASCULAR',
            'ASMA EN NIÑOS',
            'HIPERTENSIÓN ARTERIAL',
            'ENFERMEDAD CEREBROVASCULAR',
            'OBESIDAD',
            'ENFERMEDAD RENAL CRÓNICA',
            'POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL',
            'ENFERMEDADES RARAS',
            'POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER',
            'POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS',
            'DEPRESIÓN',
            'DEMENCIA',
            'ESQUIZOFRENIA',
            'INTENTO SUICIDA',
            'CONSUMIDOR DE SUSTANCIAS PSICOACTIVA',
            'VICTIMA DEL CONFLICTO ARMADO',
            'VICTIMA DE VIOLENCIA DE GENERO',

        ];
        testsToEvaluate.map((testToEvaluate)=>{
            let tests = testsPeople.filter(testPeople=> testPeople.test_name == testToEvaluate);
            let testsOrderByDesc = tests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            if(testsOrderByDesc[0] !== undefined){

                testsToApplicate.push(testsOrderByDesc[0]);
            }
        });

        brandsToEvaluate.map((testToEvaluate)=>{
            let tests = brandsPeople.filter(brandPeople=> brandPeople.test_name == testToEvaluate);
            let testsOrderByDesc = tests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            if(testsOrderByDesc[0] !== undefined){

                brandsToApplicate.push(testsOrderByDesc[0]);
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
            <View style={[styles.cData]}>
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

            <View style={(testsToApplicate.length !== 0)?[styles.cData,{flexDirection:'column'}]:styles.cData}>
                <Text style={styles.textCampo}>T.Aplicados: </Text>
                {(testsToApplicate.length !== 0)?
                    testsToApplicate.map((risk,id)=>{
                        
                        return(
                            <View key={id}>
                                <Text style={styles.textData}>{risk.test_name}</Text>
                            </View>
                        )
                    })
                    :
                    <Text style={styles.textData}>SIN TEST APLICADOS</Text>
                    
                }
            </View>
            <View style={(brandsToApplicate.length !== 0)?[styles.cData,{flexDirection:'column'}]:styles.cData}>
                <Text style={styles.textCampo}>M.Aplicadas: </Text>
                {(brandsToApplicate.length !== 0)?
                    brandsToApplicate.map((risk,id)=>{
                        
                        return(
                            <View key={id}>
                                <Text style={styles.textData}>{risk.test_name}</Text>
                            </View>
                        )
                    })
                    :
                    <Text style={styles.textData}>SIN MARCAS APLICADAS</Text>
                    
                }
            </View>
            
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
        paddingVertical:20,
        // paddingHorizontal:10
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
        marginTop:1,
        flex:1
        
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
