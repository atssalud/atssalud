import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

const TypeAlertScreen = (props) => {
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
    <View style={style.container}>
      {(debouncedValue)?
     <>
      {(nameTestToApplicate.length !== 0)?
          <>
          {(data.edad>44 && !nameTestToApplicate.includes('RIESGO CARDIOVASCULAR'))?
            <ButtonImage
            nameImage='heartbeat'
            text='Cardiovascular'
            size={30}
            btnFunction={()=>navigator.navigate('TestCardiovascularScreen',{data:dataPeople,datos:data,})}
            
          /> 
          : (data.edad>44)?
          <ButtonImage
            nameImage='heartbeat'
            text='Cardiovascular'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          /> :null
          }
          {(data.edad>0 && data.edad<8 && !nameTestToApplicate.includes('RIESGO DE ASMA EN NIÑOS'))?
            <ButtonImage
            nameImage='child'
            text='Asma'
            size={30}
            btnFunction={()=>navigator.navigate('TestAsthmaScreen',{data:dataPeople,datos:data,})}
          />
          :(data.edad>0 && data.edad<8)?
          <ButtonImage
            nameImage='child'
            text='Asma'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          
          {(data.edad>39 && !nameTestToApplicate.includes('RIESGO EPOC'))?
            <ButtonImage
            nameImage='medkit'
            text='EPOC'
            size={30}
            btnFunction={()=>navigator.navigate('TestEpocScreen',{data:dataPeople,datos:data,})}
          />
          :(data.edad>39)?
          <ButtonImage
            nameImage='medkit'
            text='EPOC'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          {(data.edad>13 && !nameTestToApplicate.includes('SALUD MENTAL'))?
            <ButtonImage
            nameImage='medkit'
            text='Salud Mental'
            size={30}
            btnFunction={()=>navigator.navigate('TestMentalHealthScreen',{data:dataPeople,datos:data,})}
          />
          :
          (data.edad>13)?
          <ButtonImage
            nameImage='medkit'
            text='Salud Mental'
            size={30}
            disabled={true}
            color={Colors.GREY_LIGHT}
          />:null
          }
          </>
          
      :
      <>
      {(data.edad>44)?
        <ButtonImage
        nameImage='heartbeat'
        text='Cardiovascular'
        size={30}
        btnFunction={()=>navigator.navigate('TestCardiovascularScreen',{data:dataPeople,datos:data,})}
        
      /> 
      : null
      }
      {(data.edad>0 && data.edad<8)?
        <ButtonImage
        nameImage='child'
        text='Asma'
        size={30}
        btnFunction={()=>navigator.navigate('TestAsthmaScreen',{data:dataPeople,datos:data,})}
      />
      :null
      }
      
      {(data.edad>39)?
        <ButtonImage
        nameImage='medkit'
        text='EPOC'
        size={30}
        btnFunction={()=>navigator.navigate('TestEpocScreen',{data:dataPeople,datos:data,})}
      />
      :null
      }
      {(data.edad>13)?
        <ButtonImage
        nameImage='medkit'
        text='Salud Mental'
        size={30}
        btnFunction={()=>navigator.navigate('TestMentalHealthScreen',{data:dataPeople,datos:data,})}
      />
      :null
      }
      </>
    }
      <View style={style.btnEvaluarPaciente}>
        <Button
          title="Evaluar otro paciente"
          onPress={() => navigator.navigate('CatchmentScreen')}
          color='secondary'
          fill='solid'
        />
      </View>
      </>
      :<LoadingScreen/>
    }
    </View>
  )
}
export default TypeAlertScreen

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
