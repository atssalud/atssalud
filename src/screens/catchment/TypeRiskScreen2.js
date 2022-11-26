import React, { useContext, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Styles } from '../../theme/GlobalStyle';
import { Fonts } from '../../theme/Fonts';
import { Colors } from '../../theme/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonImage } from '../../components/ButtonImage';
import http from '../../services/http';
import { Endpoint } from '../../environment/Api';
import Button from '../../components/Button';
import LoadingScreen from '../LoadingScreen'
import TypeAlertSkeletonScreen from '../skeleton/TypeAlertSkeletonScreen';
import { AuthContext } from '../../context/AuthContext';

const TypeRiskScreen2 = (props) => {
  const {logOut} = useContext(AuthContext)

  const data= props.route.params.data
  const navigator = useNavigation()
  const [dataPeople,setDataPeople]=useState()
  const [debouncedValue,setDebouncedValue] = useState(false);

  
  useEffect(() => {

    if(data){
      findPeople()
    }
    const timeout = setTimeout(() => {
      setDebouncedValue(true);
    },3000);

  return () => {
    clearTimeout(timeout);
  };
  }, [])
  console.log('enviodata',data)

  const findPeople=async()=>{

    const send={
        "dni":data.numIdentificacion,
        "dni_type":data.idTipoIdentificacion
    }
    console.log({send})
    try {
        const resp= await http('post',Endpoint.findPeople,send)
        if(resp.message==='token no válido'){
          logOut()
        }
        console.log('resp',resp.data)
        setDataPeople(resp.data)
        
    } catch (error) {
        console.log('error',error)
    }
  }
  let testsToApplicate = []
  let nameTestToApplicate=[]

  

    if(dataPeople){
      
        console.log('data',dataPeople.risks)
        let testsPeople = dataPeople.risks;
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
        if(testsToApplicate.length !==0){
          testsToApplicate.map(item=>{
            nameTestToApplicate.push(item.risk_name)
          }
          )
          
        console.log('name',nameTestToApplicate.includes('RIESGO DE ASMA EN NIÑOS'))
      }
    }

  
  //Preguntar si la persona fuma o si estuvo expuesto a humo de leña, biomasa
  return (
    <ScrollView>
    <View style={style.container}>
      {(debouncedValue)?
     <>
      {(nameTestToApplicate.length !== 0)?
          <>
          {(data.edad>17 && !nameTestToApplicate.includes('DIABETES MELLITUS'))?
            <ButtonImage
            nameImage='check-circle'
            text='DIABETES MELLITUS'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 6, data: data, title: 'DIABETES MELLITUS' })}
            
          /> 
          : (data.edad>17)?
          <ButtonImage
            nameImage='check-circle'
            text='DIABETES MELLITUS'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          /> :null
          }
          {(data.edad>17 && !nameTestToApplicate.includes('IPERTENSIÓN ARTERIAL'))?
            <ButtonImage
            nameImage='check-circle'
            text='IPERTENSIÓN ARTERIAL'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 7, data: data, title: 'IPERTENSIÓN ARTERIAL' })}
          />
          :(data.edad>17)?
          <ButtonImage
            nameImage='check-circle'
            text='IPERTENSIÓN ARTERIAL'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          
          {(data.edad>39 && !nameTestToApplicate.includes('ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'))?
            <ButtonImage
            nameImage='check-circle'
            text='ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 8, data: data, title: 'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)' })}
          />
          :(data.edad>39)?
          <ButtonImage
            nameImage='check-circle'
            text='ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>17 && !nameTestToApplicate.includes('ENFERMEDAD CEREBROVASCULAR'))?
            <ButtonImage
            nameImage='check-circle'
            text='ENFERMEDAD CEREBROVASCULAR'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 9, data: data, title: 'ENFERMEDAD CEREBROVASCULAR' })}
          />
          :
          (data.edad>17)?
          <ButtonImage
            nameImage='check-circle'
            text='ENFERMEDAD CEREBROVASCULAR'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameTestToApplicate.includes('OBESIDAD'))?
            <ButtonImage
            nameImage='check-circle'
            text='OBESIDAD'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 10, data: data, title: 'OBESIDAD' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
            nameImage='check-circle'
            text='OBESIDAD'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>18 && !nameTestToApplicate.includes('ENFERMEDAD RENAL CRÓNICA'))?
            <ButtonImage
            nameImage='check-circle'
            text='ENFERMEDAD RENAL CRÓNICA'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 11, data: data, title: 'ENFERMEDAD RENAL CRÓNICA' })}
          />
          :
          (data.edad>18)?
          <ButtonImage
            nameImage='check-circle'
            text='ENFERMEDAD RENAL CRÓNICA'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameTestToApplicate.includes('POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL'))?
            <ButtonImage
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 12, data: data, title: 'POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameTestToApplicate.includes('ENFERMEDADES RARAS'))?
            <ButtonImage
            nameImage='check-circle'
            text='ENFERMEDADES RARAS'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 13, data: data, title: 'ENFERMEDADES RARAS' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
            nameImage='check-circle'
            text='ENFERMEDADES RARAS'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameTestToApplicate.includes('POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER'))?
            <ButtonImage
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 14, data: data, title: 'POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameTestToApplicate.includes('POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS'))?
            <ButtonImage
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS'
            size={30}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 15, data: data, title: 'POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          </>
          ///////////////////////////////////////////////////////////////////////////////////////
      :
      <>
      {(data.edad>17)?
        <ButtonImage
        nameImage='check-circle'
        text='DIABETES MELLITUS'
        size={30}
        btnFunction={()=>navigator.replace('TestRiskScreen', { id: 6, data: data, title: 'DIABETES MELLITUS' })}
        
      /> 
      : null
      }
      {(data.edad>17)?
        <ButtonImage
        nameImage='check-circle'
        text='IPERTENSIÓN ARTERIAL'
        size={30}
        btnFunction={()=>navigator.replace('TestRiskScreen', { id: 7, data: data, title: 'IPERTENSIÓN ARTERIAL' })}
      />
      :null
      }
      
      {(data.edad>39)?
       <ButtonImage
       nameImage='check-circle'
       text='ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'
       size={30}
       btnFunction={()=>navigator.replace('TestRiskScreen', { id: 8, data: data, title: 'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)' })}
     />
      :null
      }
      {(data.edad>17)?
        <ButtonImage
        nameImage='check-circle'
        text='ENFERMEDAD CEREBROVASCULAR'
        size={30}
        btnFunction={()=>navigator.replace('TestRiskScreen', { id: 9, data: data, title: 'ENFERMEDAD CEREBROVASCULAR' })}
      />
      :null
      }
      {(data.edad>=0)?
         <ButtonImage
         nameImage='check-circle'
         text='OBESIDAD'
         size={30}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 10, data: data, title: 'OBESIDAD' })}
       />
      :null
      }
      {(data.edad>18)?
         <ButtonImage
         nameImage='check-circle'
         text='ENFERMEDAD RENAL CRÓNICA'
         size={30}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 11, data: data, title: 'ENFERMEDAD RENAL CRÓNICA' })}
       />
      :null
      }
      {(data.edad>=0)?
         <ButtonImage
         nameImage='check-circle'
         text='POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL'
         size={30}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 12, data: data, title: 'POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL' })}
       />
      :null
      }
      {(data.edad>=0)?
         <ButtonImage
         nameImage='check-circle'
         text='ENFERMEDADES RARAS'
         size={30}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 13, data: data, title: 'ENFERMEDADES RARAS' })}
       />
      :null
      }
      {(data.edad>=0)?
         <ButtonImage
         nameImage='check-circle'
         text='POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER'
         size={30}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 14, data: data, title: 'POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER' })}
       />
      :null
      }
      {(data.edad>=0)?
        <ButtonImage
        nameImage='check-circle'
        text='POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS'
        size={30}
        btnFunction={()=>navigator.replace('TestRiskScreen', { id: 15, data: data, title: 'POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS' })}
      />
      :null
      }
      </>
    }

      </>
      :<TypeAlertSkeletonScreen/>
    }
    </View>
    </ScrollView>
  )
}
export default TypeRiskScreen2

const style=StyleSheet.create({
  container:{
    marginHorizontal:20,
    marginVertical:20,
    flex:1
  },
  cBtn:{
    justifyContent:'center',
    alignItems:'center'
  },
  tBtn:{
    fontFamily:Fonts.BOLD,
    fontSize:18,
    color:Colors.FONT_COLOR
  },
  btnEvaluarPaciente:{
    flex:1,
    bottom: 0,
    left: 0,
    right: 0,
    position:'absolute'}

})