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
  console.log({data})
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
  let brandsToApplicate = []
  let nameBrandToApplicate=[]
  let nameTestToApplicate=[]
  let testsToApplicate = []

  if(dataPeople){
      
      let testsPeople = dataPeople.tamizajes;
      let brandsPeople = dataPeople.marcas;

      //Condicion previa caracterización.
      let testsToEvaluate = [
          'DIABETES FINDRISC',
          'EPOC',
          'CARDIOVASCULAR',
          'RIESGO DE ASMA EN NIÑOS',
          'HIPERTENSIÓN ARTERIAL',
          'ENFERMEDAD RENAL CRÓNICA',
          'RIESGO CARDIOVASCULAR OMS',
      ];
      let brandsToEvaluate = [
          'DIABETES MELLITUS',
          'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)',
          'ENFERMEDAD CEREBROVASCULAR',
          'RIESGO DE ASMA EN NIÑOS',
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
          'CONSUMIDOR DE SUSTANCIAS PSICOACTIVAS',
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

      if(brandsToApplicate.length !==0){
        brandsToApplicate.map(item=>{
          console.log('item',item)
          nameBrandToApplicate.push(item.test_name)
        }
        )
      }
      if(testsToApplicate.length !==0){
        testsToApplicate.map(item=>{
          nameTestToApplicate.push(item.test_name)
        }
        )
      }
}

    
  
  //Preguntar si la persona fuma o si estuvo expuesto a humo de leña, biomasa
  return (
    <View style={style.container}>
      {(debouncedValue)?
     <>
      {(nameBrandToApplicate.length !== 0)?
          <ScrollView>
          {(data.edad>17 && !nameTestToApplicate.includes('DIABETES FINDRISC')&& !nameBrandToApplicate.includes('DIABETES MELLITUS'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='DIABETES MELLITUS'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 6, data: data, title: 'DIABETES MELLITUS' })}
            
          /> 
          : (data.edad>17)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='DIABETES MELLITUS'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          /> :null
          }
          {(data.edad>17 && !nameTestToApplicate.includes('HIPERTENSIÓN ARTERIAL')&& !nameBrandToApplicate.includes('HIPERTENSIÓN ARTERIAL'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='HIPERTENSIÓN ARTERIAL'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 25, data: data, title: 'HIPERTENSIÓN ARTERIAL' })}
          />
          :(data.edad>17)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='HIPERTENSIÓN ARTERIAL'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          
          {(data.edad>39 && !nameTestToApplicate.includes('EPOC') && !nameBrandToApplicate.includes('ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 8, data: data, title: 'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)' })}
          />
          :(data.edad>39)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>17 && !nameBrandToApplicate.includes('ENFERMEDAD CEREBROVASCULAR'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='ENFERMEDAD CEREBROVASCULAR'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 9, data: data, title: 'ENFERMEDAD CEREBROVASCULAR' })}
          />
          :
          (data.edad>17)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='ENFERMEDAD CEREBROVASCULAR'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameBrandToApplicate.includes('OBESIDAD'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='OBESIDAD'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 10, data: data, title: 'OBESIDAD' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='OBESIDAD'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>18 && !nameTestToApplicate.includes('ENFERMEDAD RENAL CRÓNICA') && !nameBrandToApplicate.includes('ENFERMEDAD RENAL CRÓNICA'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='ENFERMEDAD RENAL CRÓNICA'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 26, data: data, title: 'ENFERMEDAD RENAL CRÓNICA' })}
          />
          :
          (data.edad>18)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='ENFERMEDAD RENAL CRÓNICA'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameBrandToApplicate.includes('POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 12, data: data, title: 'POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameBrandToApplicate.includes('ENFERMEDADES RARAS'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='ENFERMEDADES RARAS'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 13, data: data, title: 'ENFERMEDADES RARAS' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='ENFERMEDADES RARAS'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameBrandToApplicate.includes('POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 14, data: data, title: 'POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=0 && !nameBrandToApplicate.includes('POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 15, data: data, title: 'POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS' })}
          />
          :
          (data.edad>=0)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=14 && !nameBrandToApplicate.includes('DEPRESIÓN'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='DEPRESIÓN'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 16, data: data, title: 'DEPRESIÓN' })}
          />
          :
          (data.edad>=14)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='DEPRESIÓN'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=14 && !nameBrandToApplicate.includes('DEMENCIA'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='DEMENCIA'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 17, data: data, title: 'DEMENCIA' })}
          />
          :
          (data.edad>=14)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='DEMENCIA'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=14 && !nameBrandToApplicate.includes('ESQUIZOFRENIA'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='ESQUIZOFRENIA'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 18, data: data, title: 'ESQUIZOFRENIA' })}
          />
          :
          (data.edad>=14)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='ESQUIZOFRENIA'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=14 && !nameBrandToApplicate.includes('INTENTO SUICIDA'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='INTENTO SUICIDA'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 19, data: data, title: 'INTENTO SUICIDA' })}
          />
          :
          (data.edad>=14)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='INTENTO SUICIDA'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=14 && !nameBrandToApplicate.includes('CONSUMIDOR DE SUSTANCIAS PSICOACTIVAS'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='CONSUMIDOR DE SUSTACIAS PSICOACTIVAS'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 20, data: data, title: 'CONSUMIDOR DE SUSTANCIAS PSICOACTIVAS' })}
          />
          :
          (data.edad>=14)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='CONSUMIDOR DE SUSTACIAS PSICOACTIVAS'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=14 && !nameBrandToApplicate.includes('VICTIMA DEL CONFLICTO ARMADO'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='VICTIMA DEL CONFLICTO ARMADO'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 21, data: data, title: 'VICTIMA DEL CONFLICTO ARMADO' })}
          />
          :
          (data.edad>=14)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='VICTIMA DEL CONFLICTO ARMADO'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=14 && !nameBrandToApplicate.includes('VICTIMA DE VIOLENCIA DE GENERO'))?
            <ButtonImage
            fontSize={14}
            nameImage='check-circle'
            text='VICTIMA DE VIOLENCIA DE GENERO'
            size={25}
            btnFunction={()=>navigator.replace('TestRiskScreen', { id: 22, data: data, title: 'VICTIMA DE VIOLENCIA DE GENERO' })}
          />
          :
          (data.edad>=14)?
          <ButtonImage
          fontSize={14}
            nameImage='check-circle'
            text='VICTIMA DE VIOLENCIA DE GENERO'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          </ScrollView>
          ///////////////////////////////////////////////////////////////////////////////////////
      :
      <ScrollView>
      {(data.edad>17)?
        <ButtonImage
        fontSize={14}
        nameImage='check-circle'
        text='DIABETES MELLITUS'
        size={25}
        btnFunction={()=>navigator.replace('TestRiskScreen', { id: 6, data: data, title: 'DIABETES MELLITUS' })}
        
      /> 
      : null
      }
      {(data.edad>17)?
        <ButtonImage
        fontSize={14}
        nameImage='check-circle'
        text='HIPERTENSIÓN ARTERIAL'
        size={25}
        btnFunction={()=>navigator.replace('TestRiskScreen', { id: 25, data: data, title: 'HIPERTENSIÓN ARTERIAL' })}
      />
      :null
      }
      
      {(data.edad>39)?
       <ButtonImage
       fontSize={14}
       nameImage='check-circle'
       text='ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'
       size={25}
       btnFunction={()=>navigator.replace('TestRiskScreen', { id: 8, data: data, title: 'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)' })}
     />
      :null
      }
      {(data.edad>17)?
        <ButtonImage
        fontSize={14}
        nameImage='check-circle'
        text='ENFERMEDAD CEREBROVASCULAR'
        size={25}
        btnFunction={()=>navigator.replace('TestRiskScreen', { id: 9, data: data, title: 'ENFERMEDAD CEREBROVASCULAR' })}
      />
      :null
      }
      {(data.edad>=0)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='OBESIDAD'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 10, data: data, title: 'OBESIDAD' })}
       />
      :null
      }
      {(data.edad>18)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='ENFERMEDAD RENAL CRÓNICA'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 26, data: data, title: 'ENFERMEDAD RENAL CRÓNICA' })}
       />
      :null
      }
      {(data.edad>=0)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 12, data: data, title: 'POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL' })}
       />
      :null
      }
      {(data.edad>=0)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='ENFERMEDADES RARAS'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 14, data: data, title: 'ENFERMEDADES RARAS' })}
       />
      :null
      }
      {(data.edad>=0)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 14, data: data, title: 'POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER' })}
       />
      :null
      }
      {(data.edad>=0)?
        <ButtonImage
        fontSize={14}
        nameImage='check-circle'
        text='POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS'
        size={25}
        btnFunction={()=>navigator.replace('TestRiskScreen', { id: 15, data: data, title: 'POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS' })}
      />
      :null
      }
      {(data.edad>14)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='DEPRESIÓN'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 16, data: data, title: 'DEPRESIÓN' })}
       />
      :null
      }
      {(data.edad>14)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='DEMENCIA'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 17, data: data, title: 'DEMENCIA' })}
       />
      :null
      }
      {(data.edad>14)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='ESQUIZOFRENIA'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 18, data: data, title: 'ESQUIZOFRENIA' })}/>
      :null
      }
      {(data.edad>14)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='INTENTO SUICIDA'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 19, data: data, title: 'INTENTO SUICIDA' })}
       />
      :null
      }
      {(data.edad>14)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='CONSUMIDOR DE SUSTACIAS PSICOACTIVAS'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 20, data: data, title: 'CONSUMIDOR DE SUSTACIAS PSICOACTIVAS' })}
       />
      :null
      }
      {(data.edad>14)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='VICTIMA DEL CONFLICTO ARMADO'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 21, data: data, title: 'VICTIMA DEL CONFLICTO ARMADO' })}
       />
      :null
      }
      {(data.edad>14)?
         <ButtonImage
         fontSize={14}
         nameImage='check-circle'
         text='VICTIMA DE VIOLENCIA DE GENERO'
         size={25}
         btnFunction={()=>navigator.replace('TestRiskScreen', { id: 22, data: data, title: 'VICTIMA DE VIOLENCIA DE GENERO' })}
       />
      :null
      }
      </ScrollView>
    }

      </>
      :<TypeAlertSkeletonScreen/>
    }
    </View>
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