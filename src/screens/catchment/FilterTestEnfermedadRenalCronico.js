import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import Checkbox from '../../components/CheckBox';
import WindowAlert from '../../components/WindowAlert';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { Styles } from '../../theme/GlobalStyle';


const FilterTestEnfermedadRenalCronico = (props) => {

    const navigator = useNavigation()

    const data = props.route.params.data
    const datos = props.route.params.datos

    const [diagnostico,setdiagnostico]=useState(false)
    const [reporte,setreporte]=useState(false)
    const [alert,setAlert]= useState(false)

    const validarTest=()=>{
        if(diagnostico=== true && reporte===true){
            navigator.replace('TestEnfermedadRenalCronica',{data:data,datos:datos,})
            
        }else{
            setAlert(true)
        }
    }

    const contentAlert=
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/modal-alert-Icon.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.titleAlert}>Notificación</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>El paciente no aplica para el tamizaje Enfermedad Renal Crónica</Text>
        </View>
    </View>

    const close=()=>{
        navigator.replace('TypeAlertScreen', { data: datos,})
    }

    
  return (
    <View style={styles.container}>
        <View style={Styles.borderContainer}>
            <View style={styles.cQuestion}>
                <Text style={styles.tQuestion}>¿El paciente cuenta con un con diagnóstico confirmado de Hipertensión Arterial y/o Diabetes mellitus.?</Text>
            </View>
            <View style={styles.cCheckBox}>
                <Checkbox
                    text={'Si'}
                    value={diagnostico}
                    disabled={false}
                    onValueChange={(newValue) => setdiagnostico(newValue)}
                />
                <Checkbox
                    text={'No'}
                    value={!diagnostico}
                    disabled={false}
                    onValueChange={(newValue) => setdiagnostico(!newValue)}
                />
            </View>
        </View>
        <View style={Styles.borderContainer}>
            <View style={styles.cQuestion}>
            <Text style={styles.tQuestion}>¿Cuenta con un con reporte de Creatinina sérica del ultimo año.?</Text>
            </View>
            <View style={styles.cCheckBox}>
                <Checkbox
                    text={'Si'}
                    value={reporte}
                    disabled={false}
                    onValueChange={(newValue) => setreporte(newValue)}
                />
                <Checkbox
                    text={'No'}
                    value={!reporte}
                    disabled={false}
                    onValueChange={(newValue) => setreporte(!newValue)}
                />
            </View>
        </View>
        <View style={styles.cButton}>
        <Button
          title="Aplicar Test"
          onPress={() => validarTest()}
          color='secondary'
          fill='solid'
        />
        </View>
        {
            (alert) ?
                <WindowAlert
                bool={true}
                closeAlert={setAlert}
                content={contentAlert}
                width={50}
                height={3}
                btnText={'Aceptar'}
                btnFunction={close}
                btnClose={'yes'}
                />
            : null
        }

    </View>
  )
}


export default FilterTestEnfermedadRenalCronico;

const styles= StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:'20%',
        flex:1
    },
    cCheckBox:{
        flexDirection:'row',
        justifyContent:'space-around'
    },
    cQuestion:{
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10
    },
    tQuestion:{
        fontFamily:Fonts.BOLD,
        fontSize:16,
        color:Colors.FONT_COLOR
    },
    cButton:{
        marginBottom:10,
        marginTop:20,
        flex:1,
        bottom: 0,
        left: 0,
        right: 0,
        position:'absolute',
    },
    textAlert:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.REGULAR,
        fontSize:16
    },
    ctextAlert:{
        marginTop:10,
        alignItems: 'center',
        justifyContent:'center'
    },
    imageAlert:{
        width:55,
        height:55,
        bottom:20,
        marginTop:15
    },
    cAlert:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:-15
    },
    titleAlert:{
        color:Colors.FONT_COLOR,
        fontSize:16,
        fontFamily:Fonts.BOLD
    },
    title:{
        color:Colors.BLUE_GREY,
        fontSize:16,
        fontFamily:Fonts.REGULAR
    },

})


