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
import IsConnectedScreen from '../IsConnectedScreen';

const TypeRiskScreen2 = (props) => {
  const {logOut,isConnected} = useContext(AuthContext)
  const navigator = useNavigation()

  const data= props.route.params.data
  
  const [dataPeople,setDataPeople]=useState()
  const [debouncedValue,setDebouncedValue] = useState(false);
  const [ netInfo,setNetInfo]=useState(false)


  useEffect(() => {
      const unsubscribe = isConnected(setNetInfo)
      if(data){
        findPeople()
      }
      const timeout = setTimeout(() => {
        setDebouncedValue(true);
      },3000);
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

    return () => {
      unsubscribe
      clearTimeout(timeout);
    };
  }, [])

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
        'SOSPECHA DE EMBARAZO',
        'POBLACIÓN EN RIESGO O PRESENCIA DE ALTERACIONES NUTRICIONALES',
        'CANCER DE MAMA',
        'ARTRITIS REUMATOIDEA',
        'EZQUIZOFRENIA',
        'ASSIST',
        'DEMENCIA',
        'ALTO RIESGO REPRODUCTIVO',
        'SALUD MENTAL - RQC',
        'SALUD MENTAL - SRQ',
        'ASMA EN NIÑOS',
        'ANEMIA'
      ];
      let brandsToEvaluate = [
          'DIABETES MELLITUS',
          'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)',
          'ENFERMEDAD CEREBROVASCULAR',
          'RIESGO DE ASMA EN NIÑOS',
          'HIPERTENSIÓN ARTERIAL',
          'ENFERMEDAD CEREBROVASCULAR',
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
          'INFECCIONES TRANSMISION SEXUAL',
          'POBLACION CON RIESGO O TRASTORNOS DEGENERATIVOS,NEUROPATIAS Y AUTOINMUNES',
          'POBLACION EN RIESGO O PRESENCIA DE ALTERACIONES NUTRICIONALES',
          'ANEMIA',
          'ARTRITIS REUMATOIDEA',
          'DESNUTRICION'

      ];
      console.log(brandsToEvaluate.sort())
      console.log(testsToEvaluate.sort())

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

      console.log({testsToApplicate});

      if(brandsToApplicate.length !==0){
        brandsToApplicate.map(item=>{
          console.log('item',item)
          nameBrandToApplicate.push(item.test_name)
        }
        )
      }else{
        nameBrandToApplicate.push('Sin marcas')
      }
      if(testsToApplicate.length !==0){
        testsToApplicate.map(item=>{
          console.log('item2',item)
          nameTestToApplicate.push(item.test_name)
        }
        )
      }else{
        nameTestToApplicate.push('Sin test')
      }
      
}

    
  
  //Preguntar si la persona fuma o si estuvo expuesto a humo de leña, biomasa
  return (
    <>
      {
          (netInfo=== false)? <IsConnectedScreen/>:
          <View style={style.container}>
            {(debouncedValue)?
              <>
              {(nameBrandToApplicate.length !== 0)?
                  <ScrollView>
                    {(((data.edad>=0 && data.edad<=5 )|| (data.edad>=10 && data.edad<=17)) &&!nameBrandToApplicate.includes('ANEMIA') && !nameTestToApplicate.includes('ANEMIA'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='ANEMIA'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 37, data: data, title: 'ANEMIA' })}
                  />
                  :
                  ((data.edad>=0 && data.edad<=5 )|| (data.edad>=10 && data.edad<=17))?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='ANEMIA'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>11 && !nameBrandToApplicate.includes('CONSUMIDOR DE SUSTANCIAS PSICOACTIVAS'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='CONSUMIDOR DE SUSTACIAS PSICOACTIVAS'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 20, data: data, title: 'CONSUMIDOR DE SUSTANCIAS PSICOACTIVAS' })}
                  />
                  :
                  (data.edad>11)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='CONSUMIDOR DE SUSTACIAS PSICOACTIVAS'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>59 && !nameBrandToApplicate.includes('DEMENCIA'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='DEMENCIA'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 17, data: data, title: 'DEMENCIA' })}
                  />
                  :
                  (data.edad>59)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='DEMENCIA'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>5 && !nameBrandToApplicate.includes('DEPRESIÓN'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='DEPRESIÓN'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 16, data: data, title: 'DEPRESIÓN' })}
                  />
                  :
                  (data.edad>5)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='DEPRESIÓN'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>=0 && data.edad<5 && !nameBrandToApplicate.includes('DESNUTRICION'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='DESNUTRICION'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 43, data: data, title: 'DESNUTRICION' })}
                  />
                  :
                  (data.edad>=0 && data.edad<5)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='DESNUTRICION'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
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
                  {(data.edad>12 && !nameBrandToApplicate.includes('ESQUIZOFRENIA'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='ESQUIZOFRENIA'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 18, data: data, title: 'ESQUIZOFRENIA' })}
                  />
                  :
                  (data.edad>12)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='ESQUIZOFRENIA'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
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
                  {(data.edad>=0 && !nameBrandToApplicate.includes('INFECCIONESS TRANSMISION SEXUAL'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='INFECCIONES'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskInfecciontvScreen', { id: 35, data: data, title: 'INFECCIONES' })}
                  />
                  :
                  (data.edad>=0)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='INFECCIONES'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>5 && !nameBrandToApplicate.includes('INTENTO SUICIDA'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='INTENTO SUICIDA'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 19, data: data, title: 'INTENTO SUICIDA' })}
                  />
                  :
                  (data.edad>5)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='INTENTO SUICIDA'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>17 && !nameBrandToApplicate.includes('POBLACION CON RIESGO O TRASTORNOS DEGENERATIVOS,NEUROPATIAS Y AUTOINMUNES'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='POBLACION TRASTORNOS DEGENERATIVOS,NEUROPATIAS Y AUTOINMUNES'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 36, data: data, title: 'POBLACION CON RIESGO O TRASTORNOS DEGENERATIVOS,NEUROPATIAS Y AUTOINMUNES' })}
                  />
                  :
                  (data.edad>=0)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='POBLACION CON TRASTORNOS DEGENERATIVOS,NEUROPATIAS Y AUTOINMUNES'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>=0 && !nameBrandToApplicate.includes('POBLACIÓN CON RIESGO O ALTERACIONESS EN SALUD BUCAL'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='POBLACIÓN CON ALTERACIONES EN SALUD BUCAL'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 12, data: data, title: 'POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL' })}
                  />
                  :
                  (data.edad>=0)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='POBLACIÓN CON ALTERACIONES EN SALUD BUCAL'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>=0 && !nameBrandToApplicate.includes('POBLACIÓN CON RIESGO O PRESENCIAA DE CÁNCER'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='POBLACIÓN CON PRESENCIA DE CÁNCER'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskCancerScreen', { id: 14, data: data, title: 'POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER' })}
                  />
                  :
                  (data.edad>=0)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='POBLACIÓN CON PRESENCIA DE CÁNCER'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>=0 && !nameBrandToApplicate.includes('POBLACIÓN CON RIESGO O TRANSTORNOSS VISUALES Y AUDITIVOS'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='POBLACIÓN CON TRANSTORNOS VISUALES Y AUDITIVOS'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 15, data: data, title: 'POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS' })}
                  />
                  :
                  (data.edad>=0)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='POBLACIÓN CON TRANSTORNOS VISUALES Y AUDITIVOS'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>13 && data.edad<50 &&  !nameTestToApplicate.includes('POBLACION EN CONDICION MATERNO - PERINATAL') && data.genero==='F')?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='POBLACION EN CONDICION MATERNO - PERINATAL'
                    size={25}
                    btnFunction={()=>navigator.replace('RiskMaternoPerinatal',{data:data})}
                  />
                  :
                  (data.edad>13 && data.edad<50 && data.genero==='F')?
                  <ButtonImage
                    nameImage='check-circle'
                    text='POBLACION EN CONDICION MATERNO - PERINATAL'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>=0 && !nameBrandToApplicate.includes('VICTIMA DE VIOLENCIA DE GENERO'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='VICTIMA DE VIOLENCIA DE GENERO'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 22, data: data, title: 'VICTIMA DE VIOLENCIA DE GENERO' })}
                  />
                  :
                  (data.edad>=0)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='VICTIMA DE VIOLENCIA DE GENERO'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>=0 && !nameBrandToApplicate.includes('VICTIMA DEL CONFLICTO ARMADO'))?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='VICTIMA DEL CONFLICTO ARMADO'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 21, data: data, title: 'VICTIMA DEL CONFLICTO ARMADO' })}
                  />
                  :
                  (data.edad>= 0)?
                  <ButtonImage
                  fontSize={14}
                    nameImage='check-circle'
                    text='VICTIMA DEL CONFLICTO ARMADO'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  </ScrollView>
                 
              :null
            //   <ScrollView>
            //   {(data.edad>17)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='DIABETES MELLITUS'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 6, data: data, title: 'DIABETES MELLITUS' })}
                
            //   /> 
            //   : null
            //   }
            //   {(data.edad>17)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='HIPERTENSIÓN ARTERIAL'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 25, data: data, title: 'HIPERTENSIÓN ARTERIAL' })}
            //   />
            //   :null
            //   }
              
            //   {(data.edad>39)?
            //   <ButtonImage
            //   fontSize={14}
            //   nameImage='check-circle'
            //   text='ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'
            //   size={25}
            //   btnFunction={()=>navigator.replace('TestRiskScreen', { id: 8, data: data, title: 'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)' })}
            // />
            //   :null
            //   }
            //   {(data.edad>17)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='ENFERMEDAD CEREBROVASCULAR'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 9, data: data, title: 'ENFERMEDAD CEREBROVASCULAR' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>18)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='ENFERMEDAD RENAL CRÓNICA'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 26, data: data, title: 'ENFERMEDAD RENAL CRÓNICA' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>=0)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 12, data: data, title: 'POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>=0)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='ENFERMEDADES RARAS'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 13, data: data, title: 'ENFERMEDADES RARAS' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>=0)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskCancerScreen', { id: 14, data: data, title: 'POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>=0)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 15, data: data, title: 'POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>5)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='DEPRESIÓN'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 16, data: data, title: 'DEPRESIÓN' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>59)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='DEMENCIA'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 17, data: data, title: 'DEMENCIA' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>12)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='ESQUIZOFRENIA'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 18, data: data, title: 'ESQUIZOFRENIA' })}/>
            //   :null
            //   }
            //   {(data.edad>5)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='INTENTO SUICIDA'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 19, data: data, title: 'INTENTO SUICIDA' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>11)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='CONSUMIDOR DE SUSTACIAS PSICOACTIVAS'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 20, data: data, title: 'CONSUMIDOR DE SUSTACIAS PSICOACTIVAS' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>=0)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='VICTIMA DEL CONFLICTO ARMADO'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 21, data: data, title: 'VICTIMA DEL CONFLICTO ARMADO' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>=0)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='VICTIMA DE VIOLENCIA DE GENERO'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 22, data: data, title: 'VICTIMA DE VIOLENCIA DE GENERO' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>=0)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='INFECCIONES TV'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskInfecciontvScreen', { id: 35, data: data, title: 'INFECCIONES TV' })}
            //   />
            //   :null
            //   }
            //   {((data.edad>=0 && data.edad<=5 )|| (data.edad>=10 && data.edad<=17))?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='ANEMIA'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 37, data: data, title: 'ANEMIA' })}
            //   />
            //   :null
            //   }
            //   {(data.edad>17)?
            //     <ButtonImage
            //     fontSize={14}
            //     nameImage='check-circle'
            //     text='POBLACION CON RIESGO O TRASTORNOS DEGENERATIVOS,NEUROPATIAS Y AUTOINMUNES'
            //     size={25}
            //     btnFunction={()=>navigator.replace('TestRiskScreen', { id: 36, data: data, title: 'POBLACION CON RIESGO O TRASTORNOS DEGENERATIVOS,NEUROPATIAS Y AUTOINMUNES' })}
            //   />
            //   :null
            //   }
            //   </ScrollView>
            }

              </>
            :<TypeAlertSkeletonScreen/>
            }
          </View>
      }
      
    </>
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