import React, { useContext, useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import CheckBox from '../../components/CheckBox';
import { Styles } from '../../theme/GlobalStyle';
import {Fonts} from '../../theme/Fonts'
import { Colors } from '../../theme/Colors';
import Button from '../../components/Button';
import { Endpoint } from '../../environment/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from '../../services/http';
import { useNavigation } from '@react-navigation/native';
import TestSkeletonScreen from '../skeleton/TestSkeletonScreen';
import ViewAlertSkeletonScreen from '../skeleton/ViewAlertSkeletonScreen';
import { AuthContext } from '../../context/AuthContext';
import WindowAlert from '../../components/WindowAlert';
import TextInputs from '../../components/TextInput';

const TestEnfermedadRenalCronica = (props) => {

    const {logOut} = useContext(AuthContext)
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [alert, setAlert] = useState(false)

    const [peso, setpeso] = useState('')
    const [creatinina, setcreatinina] = useState('')
    
    const [error, setError] = useState({
        peso: '',
        creatinina: ''
    })

    const data = props.route.params.data
    console.log('daaataaa',data)
    const datos = props.route.params.datos

    const navigator=useNavigation()

    const sendValidator=()=>{
        setAlert(true)
    }
    const close = () => {
        send()
    }
    const contentAlert =
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/modal-alert-Icon.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.title}>Alerta</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>¿ Desea proceder a Tamizar Paciente ?</Text>
        </View>
    </View>

    const send=async()=>{
        setIsSearchResult(true)
        const user = await AsyncStorage.getItem('user');
        const { id } =  JSON.parse(user);
        console.log(user);

        const answer=[
          {
            "question_id": "43",
            "value": data.age
          },
          {
              "question_id": "44",
              "value": peso
          },
          {
              "question_id": "45",
              "value": creatinina
          },
          {
              "question_id": "46",
              "value": data.gender
          }
        ]
        const send={
            "dni":String(data.dni),
            "author_id":String(id),
            "test":answer
        }
        console.log(JSON.stringify(send));
        try {
            console.log('entro')
            const resp= await http('post',Endpoint.sendTestEnfermedadRenalCronica,send)
            console.log({resp})
            if(resp.errors){
                setError(resp.errors)
            }else{
                navigator.replace('ViewAlertScreen',{data:resp.data,datos:datos,nameRisk:'Tamizaje Enfermedad Renal Crónica'})
                setIsSearchResult(false)
            }
            
        } catch (error) {
            console.log('error',error)
        }
    }

    


    const handleTest = () => {

        const error = []
        
        if (peso.trim().length === 0) {
            error.peso = 'Campo Obligatorio'
        }
        if (creatinina.trim().length === 0) {
            error.creatinina = 'Campo Obligatorio'
        }

        const vpeso = peso.includes(',')
        const vcreatinina = creatinina.includes(',')

        if (vpeso) {
            error.peso = 'Use punto'
        }
        if (vcreatinina) {
            error.creatinina = 'Use punto'
        }
        if (peso.trim().length>0 && creatinina.trim().length>0 && (vpeso=== false) && (vcreatinina === false)) {
          sendValidator()
        }

        setError(error)
    }



  return (

    <>
    {
        (isSearchResult)?
        <ViewAlertSkeletonScreen/>:
        <ScrollView>
        <View style={styles.container}>
                <View style={Styles.borderContainer}>
                <View style={styles.cQuestion}>
                    <Text style={styles.tQuestion}>Digite los siguientes valores:</Text>
                    <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', width: '100%', marginLeft: 50 }}>
                      <View>
                          <TextInputs
                              label={'Peso'}
                              placeholder={'Ej: 70'}
                              keyboardType='numeric'
                              dimension='middle'
                              onChangeText={(value) => setpeso(value)}
                              value={peso}
                          />
                          {(error) ?
                              (error.peso === '') ? null :
                                  <Text style={styles.textValid}>{error.peso}</Text> : null
                          }
                      </View>
                      <View>
                          <TextInputs
                              label={'Creatinina Sérica'}
                              placeholder={'Ej: 0.7'}
                              keyboardType='numeric'
                              dimension='middle'
                              onChangeText={(value) => setcreatinina(value)}
                              value={creatinina}
                          />
                          {(error) ?
                              (error.creatinina === '') ? null :
                                  <Text style={styles.textValid}>{error.creatinina}</Text> : null
                          }
                      </View>
                    </View>

                </View>
            </View>
            
            <View style={styles.cButton}>  
                <Button 
                    title={"Calcular"}
                    onPress={()=>handleTest()} 
                    fill='solid'
                /> 
            </View>
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
        
        </ScrollView>
    }
    </>
    
  )
}
export default TestEnfermedadRenalCronica;

const styles= StyleSheet.create({
    container:{
        marginHorizontal:10,
        marginVertical:20
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
        marginTop:20
    },
    imageAlert: {
        width: 60,
        height: 60,
        bottom: 20,
        marginTop: 15
    },
    cAlert: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAlertError: {
        color: 'black',
        marginTop: 10,
        marginBottom: 20
    },
    textAlert: {
        color: 'black',
    },
    ctextAlert: {
        marginTop: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        color: 'black'
    },
    textValid: {
        fontSize: 14,
        fontFamily: Fonts.BOLD,
        color: "#ff5d2f",
        marginBottom: 10
    },
})
