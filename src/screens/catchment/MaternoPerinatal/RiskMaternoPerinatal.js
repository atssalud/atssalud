import React, { useContext, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet,TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../../../theme/Fonts';
import { Colors } from '../../../theme/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonImage } from '../../../components/ButtonImage';
import http from '../../../services/http';
import { Endpoint } from '../../../environment/Api';
import TypeAlertSkeletonScreen from '../../skeleton/TypeAlertSkeletonScreen';
import { AuthContext } from '../../../context/AuthContext';
import IsConnectedScreen from '../../IsConnectedScreen';

const RiskMaternoPerinatal = (props) => {
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
      },1500);
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
        'SOSPECHA DE EMBARAZO',
        
      ];
      let brandsToEvaluate = [
          'EMBARAZO',
          'PREECLAMPSIA',
          'BAJO PESO AL NACER - PREMATUREZ',
          'ENFERMEDAD CONGENITA',

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
                    
                  {(data.edad>13 && data.edad<50 &&  !nameTestToApplicate.includes('BAJO PESO AL NACER - PREMATUREZ') &&  !nameBrandToApplicate.includes('BAJO PESO AL NACER - PREMATUREZ') && data.genero==='F')?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='BAJO PESO AL NACER - PREMATUREZ'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 46, data: data, title: 'BAJO PESO AL NACER - PREMATUREZ' })}
                  />
                  :
                  (data.edad>13 && data.edad<50 && data.genero==='F')?
                  <ButtonImage
                    nameImage='check-circle'
                    text='BAJO PESO AL NACER - PREMATUREZ'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>13 && data.edad<50 &&  !nameTestToApplicate.includes('ENFERMEDAD CONGENITA') && data.genero==='F')?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='ENFERMEDAD CONGENITA'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 48, data: data, title: 'ENFERMEDAD CONGENITA' })}
                  />
                  :
                  (data.edad>13 && data.edad<50 && data.genero==='F')?
                  <ButtonImage
                    nameImage='check-circle'
                    text='ENFERMEDAD CONGENITA'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>13 && data.edad<50 &&  !nameTestToApplicate.includes('EMBARAZO') && data.genero==='F')?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='EMBARAZO'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 44, data: data, title: 'EMBARAZO' })}
                  />
                  :
                  (data.edad>13 && data.edad<50 && data.genero==='F')?
                  <ButtonImage
                    nameImage='check-circle'
                    text='EMBARAZO'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }
                  {(data.edad>13 && data.edad<50 &&  !nameTestToApplicate.includes('PREECLAMPSIA') && data.genero==='F')?
                    <ButtonImage
                    fontSize={14}
                    nameImage='check-circle'
                    text='PREECLAMPSIA'
                    size={25}
                    btnFunction={()=>navigator.replace('TestRiskScreen', { id: 45, data: data, title: 'PREECLAMPSIA' })}
                  />
                  :
                  (data.edad>13 && data.edad<50 && data.genero==='F')?
                  <ButtonImage
                    nameImage='check-circle'
                    text='PREECLAMPSIA'
                    size={25}
                    disabled={true}
                    color={Colors.GREY_LIGHT}
                  />:null
                  }



                  </ScrollView>
                 
              :null
            }

              </>
            :<TypeAlertSkeletonScreen/>
            }
          </View>
      }
      
    </>
  )
}
export default RiskMaternoPerinatal

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