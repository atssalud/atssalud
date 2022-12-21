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

const TypeAlertScreen = (props) => {
  const {logOut} = useContext(AuthContext)

  const data= props.route.params.data
  console.log('dataaaa1',data)
  const navigator = useNavigation()
  const [dataPeople,setDataPeople]=useState()
  const [debouncedValue,setDebouncedValue] = useState(false);

  
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
    if(data){
      findPeople()
    }
    const timeout = setTimeout(() => {
      setDebouncedValue(true);
    },5000);

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
      console.log('data',data.tamizajes)
      let testsPeople = dataPeople.tamizajes;
      let brandsPeople = dataPeople.marcas;
      //Condicion previa caracterización.
      let testsToEvaluate = [
          // 'DIABETES FINDRISC',
          'EPOC',
          'CARDIOVASCULAR',
          'RIESGO DE ASMA EN NIÑOS',
          'HIPERTENSIÓN ARTERIAL',
          'ENFERMEDAD RENAL CRÓNICA',
          'RIESGO CARDIOVASCULAR OMS',
          'SOSPECHA DE EMBARAZO',
          // 'POBLACIÓN EN RIESGO O PRESENCIA DE ALTERACIONES NUTRICIONALES'
      ];
      let brandsToEvaluate = [
          // 'DIABETES MELLITUS',
          'ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)',
          'ENFERMEDAD CEREBROVASCULAR',
          'RIESGO DE ASMA EN NIÑOS',
          'HIPERTENSIÓN ARTERIAL',
          'ENFERMEDAD RENAL CRÓNICA',
          'POBLACIÓN CON RIESGO O ALTERACIONES EN SALUD BUCAL',
          'ENFERMEDADES RARAS',
          'POBLACIÓN CON RIESGO O PRESENCIA DE CÁNCER',
          'POBLACIÓN CON RIESGO O TRANSTORNOS VISUALES Y AUDITIVOS',
          'DEPRESIÓN',
          'DEMENCIA',
          'ESQUIZOFRENIA',
          'INTENTO SUICIDA',
          'CONSUMIDOR DE SUSTACIAS PSICOACTIVAS',
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
      {(nameTestToApplicate.length !== 0)?
          <ScrollView>
          {(data.edad>17 && data.edad<71 && !nameTestToApplicate.includes('CARDIOVASCULAR') && !nameTestToApplicate.includes('RIESGO CARDIOVASCULAR OMS'))?
            <ButtonImage
            nameImage='check-circle'
            text='Cardiovascular'
            size={25}
            btnFunction={()=>navigator.replace('FilterTestCardiovascular',{data:dataPeople,datos:data,})}
            
          /> 
          : (data.edad>17 && data.edad<71)?
          <ButtonImage
            nameImage='check-circle'
            text='Cardiovascular'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          /> :null
          }
          {(data.edad>0 && data.edad<8 && !nameTestToApplicate.includes('RIESGO DE ASMA EN NIÑOS'))?
            <ButtonImage
            nameImage='check-circle'
            text='Asma'
            size={25}
            btnFunction={()=>navigator.replace('TestAsthmaScreen',{data:dataPeople,datos:data,})}
          />
          :(data.edad>0 && data.edad<8)?
          <ButtonImage
            nameImage='check-circle'
            text='Asma'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          
          {(data.edad>39 && !nameTestToApplicate.includes('EPOC') && !nameBrandToApplicate.includes('ENFERMEDAD PULMONAR OBSTRUCTIVA CRÓNICA (EPOC)'))?
            <ButtonImage
            nameImage='check-circle'
            text='EPOC'
            size={25}
            btnFunction={()=>navigator.replace('FilterTestEpocScreen',{data:dataPeople,datos:data,})}
          />
          :(data.edad>39)?
          <ButtonImage
            nameImage='check-circle'
            text='EPOC'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>=5 && !nameTestToApplicate.includes('SALUD MENTAL'))?
            <ButtonImage
            nameImage='check-circle'
            text='Salud Mental'
            size={25}
            btnFunction={()=> (data.edad<12)?navigator.navigate('TestRQC',{data:data,datos:datos,}):navigator.replace('FilterMentalHealth',{data:dataPeople,datos:data,})}
          />
          :
          (data.edad>=5)?
          <ButtonImage
            nameImage='check-circle'
            text='Salud Mental'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>13 && !nameTestToApplicate.includes('DIABETES FINDRISC')&& !nameBrandToApplicate.includes('DIABETES MELLITUS'))?
            <ButtonImage
            nameImage='check-circle'
            text='Diabetes'
            size={25}
            btnFunction={()=>navigator.replace('TestDiabetesScreen',{data:dataPeople,datos:data,})}
          />
          :
          (data.edad>13)?
          <ButtonImage
            nameImage='check-circle'
            text='Diabetes'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>17 && !nameTestToApplicate.includes('HIPERTENSIÓN ARTERIAL')&& !nameBrandToApplicate.includes('HIPERTENSIÓN ARTERIAL'))?
            <ButtonImage
            nameImage='check-circle'
            text='Hipertensión Arterial'
            size={25}
            btnFunction={()=>navigator.replace('TestHipertensionArterial',{data:dataPeople,datos:data,})}
          />
          :
          (data.edad>17)?
          <ButtonImage
            nameImage='check-circle'
            text='Hipertensión Arterial'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>18 && !nameTestToApplicate.includes('ENFERMEDAD RENAL CRÓNICA') && !nameBrandToApplicate.includes('ENFERMEDAD RENAL CRÓNICA'))?
            <ButtonImage
            nameImage='check-circle'
            text='Enfermedad Renal Crónica'
            size={25}
            btnFunction={()=>navigator.replace('FilterTestEnfermedadRenalCronico',{data:dataPeople,datos:data,})}
          />
          :
          (data.edad>18)?
          <ButtonImage
            nameImage='check-circle'
            text='Enfermedad Renal Crónica'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>17 && !nameTestToApplicate.includes('POBLACIÓN EN RIESGO O PRESENCIA DE ALTERACIONES NUTRICIONALES')&& !nameBrandToApplicate.includes('POBLACIÓN EN RIESGO O PRESENCIA DE ALTERACIONES NUTRICIONALES'))?
            <ButtonImage
            nameImage='check-circle'
            text='Población en riesgo o presencia de alteraciones nutricionales'
            size={25}
            btnFunction={()=>navigator.replace('TestPoblacionRiesgo',{data:dataPeople,datos:data,})}
          />
          :
          (data.edad>17)?
          <ButtonImage
            nameImage='check-circle'
            text='Población en riesgo o presencia de alteraciones nutricionales'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>13 && data.edad<50 &&  !nameTestToApplicate.includes('SOSPECHA DE EMBARAZO') && data.genero==='F')?
            <ButtonImage
            nameImage='check-circle'
            text='Materno Perinatal'
            size={25}
            btnFunction={()=>navigator.replace('FilterItemTestMaternoPerinatal',{data:dataPeople,datos:data,})}
          />
          :
          (data.edad>13  && data.edad<50 && data.genero==='F')?
          <ButtonImage
            nameImage='check-circle'
            text='Materno Perinatal'
            size={25}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }

      <View style={style.btnEvaluarPaciente}>
        <Button
          title="Evaluar otro paciente"
          onPress={() => navigator.replace('Tabs', { screen: 'CatchmentScreen' })}
          color='secondary'
          fill='solid'
        />
      </View>
          </ScrollView>
          
      :
      <ScrollView>
      {(data.edad>17 && data.edad<71)?
        <ButtonImage
        nameImage='check-circle'
        text='Cardiovascular'
        size={25}
        btnFunction={()=>navigator.replace('FilterTestCardiovascular',{data:dataPeople,datos:data,})}
        
      /> 
      : null
      }
      {(data.edad>0 && data.edad<8)?
        <ButtonImage
        nameImage='check-circle'
        text='Asma'
        size={25}
        btnFunction={()=>navigator.replace('TestAsthmaScreen',{data:dataPeople,datos:data,})}
      />
      :null
      }
      
      {(data.edad>39)?
        <ButtonImage
        nameImage='check-circle'
        text='EPOC'
        size={25}
        btnFunction={()=>navigator.replace('FilterTestEpocScreen',{data:dataPeople,datos:data,})}
      />
      :null
      }
      {(data.edad>=5)?
        <ButtonImage
        nameImage='check-circle'
        text='Salud Mental'
        size={25}
        btnFunction={()=> (data.edad<12)?navigator.navigate('TestRQC',{data:dataPeople,datos:data,}):navigator.replace('FilterMentalHealth',{data:dataPeople,datos:data,})}
      />
      :null
      }
      {(data.edad>13)?
        <ButtonImage
        nameImage='check-circle'
        text='Diabetes'
        size={25}
        btnFunction={()=>navigator.replace('TestDiabetesScreen',{data:dataPeople,datos:data,})}
      />
      :null
      }
      {(data.edad>17)?
       <ButtonImage
       nameImage='check-circle'
       text='Hipertensión Arterial'
       size={25}
       btnFunction={()=>navigator.replace('TestHipertensionArterial',{data:dataPeople,datos:data,})}
     />
      :null
      }
      {(data.edad>18)?
       <ButtonImage
       nameImage='check-circle'
       text='Enfermedad Renal Crónica'
       size={25}
       btnFunction={()=>navigator.replace('FilterTestEnfermedadRenalCronico',{data:dataPeople,datos:data,})}
     />
      :null
      }
      {(data.edad>17)?
       <ButtonImage
       nameImage='check-circle'
       text='Población en riesgo o presencia de alteraciones nutricionales'
       size={25}
       btnFunction={()=>navigator.replace('TestPoblacionRiesgo',{data:dataPeople,datos:data,})}
     />
      :null
      }
      {(data.edad>13 && data.edad<50 && data.genero==='F')?
       <ButtonImage
       nameImage='check-circle'
       text='Materno Perinatal'
       size={25}
       btnFunction={()=>navigator.replace('FilterItemTestMaternoPerinatal',{data:dataPeople,datos:data,})}
      />
      :null
      }
      <View style={style.btnEvaluarPaciente}>
        <Button
          title="Evaluar otro paciente"
          onPress={() => navigator.replace('Tabs', { screen: 'CatchmentScreen'})}
          color='secondary'
          fill='solid'
        />
      </View>
      </ScrollView>
    }
      
      </>
      :<TypeAlertSkeletonScreen/>
    }
    
    </View>
  )
}
export default TypeAlertScreen

const style=StyleSheet.create({
  container:{
    marginHorizontal:25,
    marginVertical:25,
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

})
