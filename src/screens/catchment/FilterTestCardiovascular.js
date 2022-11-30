import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import Checkbox from '../../components/CheckBox';
import WindowAlert from '../../components/WindowAlert';
import { Endpoint } from '../../environment/Api';
import http from '../../services/http';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { Styles } from '../../theme/GlobalStyle';
import ViewAlertSkeletonScreen from '../skeleton/ViewAlertSkeletonScreen';


const FilterTestCardiovascular = (props) => {

    const navigator = useNavigation()

    const data = props.route.params.data
    const datos = props.route.params.datos

    const [antecedente,setAntecedente]=useState(false)
    const [examenes,setExamenes]=useState(true)
    const [alert,setAlert]= useState(false)
    const [token,setToken]= useState('')
    const [isSearchResult, setIsSearchResult] = useState(false)


    useEffect(() => {
        getToken()
      }, [])
      
      const getToken =async()=>{
          const userToken = await AsyncStorage.getItem('token')
          setToken(userToken)
      
      }

    const validarTest=async()=>{
        if(antecedente=== true){
            setIsSearchResult(true)
            const user = await AsyncStorage.getItem('user');
            const userJson =  JSON.parse(user)

            const send={
                'dni':String(data.dni),
                'author_id':String(userJson.id)
            }
            console.log({send})

            try {
                const resp= await http('post',Endpoint.sendValidationTestCardiovascular,send)
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Riesgo Cardivascular'})
                setIsSearchResult(false)
            } catch (error) {
                console.log('error',error)
            }
            // setAlert(true)
        }else{
            if(examenes===true){
                navigator.replace('TestCardiovascularScreen',{data:data,datos:datos,})
            }else{
                setAlert(true)
            }
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
            <Text style={styles.textAlert}>Muy pronto estará habilitado</Text>
        </View>
    </View>

    const close=()=>{
        navigator.replace('TypeAlertScreen', { data: datos, token: token })
    }

    
  return (
    <>
        {
        (isSearchResult)?
            <ViewAlertSkeletonScreen/>
        :
        <View style={styles.container}>
        <View style={Styles.borderContainer}>
            <View style={styles.cQuestion}>
                <Text style={styles.tQuestion}>¿Cuenta con alguno de los antecedentes verificados por historia clínica?</Text>
                <Text style={styles.tOption}>- Infarto agudo de miocardio previo. </Text>
                <Text style={styles.tOption}>- Enfermedad cerebrocascular previa.</Text>
                <Text style={styles.tOption}>- Aneurisma de cualquier origen. </Text>
                <Text style={styles.tOption}>- Enfermedad arterial periférica previa. </Text>
            </View>
            <View style={styles.cCheckBox}>
                <Checkbox
                    text={'Si'}
                    value={antecedente}
                    onValueChange={(newValue) => setAntecedente(newValue)}
                />
                <Checkbox
                    text={'No'}
                    value={!antecedente}
                    onValueChange={(newValue) => setAntecedente(!newValue)}
                />
            </View>
        </View>
        {
            (antecedente===true)?null:
            <View style={Styles.borderContainer}>
            <View style={styles.cQuestion}>
                <Text style={styles.tQuestion}>¿Cuenta con  resultados de Colesterol Total y Colesterol HDL del ultimo año?</Text>
            </View>
            <View style={styles.cCheckBox}>
                <Checkbox
                    text={'Si'}
                    value={examenes}
                    disabled={false}
                    onValueChange={(newValue) => setExamenes(newValue)}
                />
                <Checkbox
                    text={'No'}
                    value={!examenes}
                    disabled={false}
                    onValueChange={(newValue) => setExamenes(!newValue)}
                />
            </View>
        </View>
        }
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
                />
            : null
        }

    </View>
        }
    
    </>
  )
}


export default FilterTestCardiovascular;

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
    tOption:{
        fontFamily:Fonts.REGULAR,
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
        alignItems: 'center'
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
        marginTop:5
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