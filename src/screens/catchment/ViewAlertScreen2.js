import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Button from '../../components/Button'
import { Colors } from '../../theme/Colors'
import { Fonts } from '../../theme/Fonts'
import { Styles } from '../../theme/GlobalStyle'
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewAlertScreen2 = (props) => {
  const navigator = useNavigation()
  const data = props.route.params.data
  const datos = props.route.params.datos
  const nameRisk = props.route.params.nameRisk

  const [token, setToken] = useState()


  useEffect(() => {
    getToken()
    navigator.setOptions({
      headerLeft:()=>(
          <TouchableOpacity
              style={{padding:5}}
              onPress={() => navigator.replace('TypeAlertScreen', { data: datos, token: token })}
          >
              <Icon
                  name="medkit"
                  color= {'white'}
                  size={25}
              />
          </TouchableOpacity>
      ),
    })

  }, [])

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('token')
    setToken(userToken)
  }
  return (
    <ScrollView>
      <View style={styles.container}>

      <View style={{marginTop:20}}>
      
            <View style={styles.cText}>
                <Text style={styles.text}>{nameRisk}</Text>
            </View>
            {
                (data)?
                    data.map((item,id)=>{
                        if(item.total_points!==0){
                            return(
                                <View style={[Styles.borderContainer,{marginBottom:30}]} key={id}>
                                    <View style={styles.cSubstance}>
                                        <Text style={styles.text}>{item.substance}</Text>
                                    </View>
                                    {
                                        (item.risk_level === "" || item.risk_level === 'BAJO') ?
                                        <Image
                                            source={require("../../assets/images/bajo.png")}
                                            style={styles.image}
                                        /> : null
                                    }
                                    {
                                        (item.risk_level === 'MODERADO'|| item.risk_level === 'MEDIO') ?
                                        <Image
                                            source={require("../../assets/images/medio.png")}
                                            style={styles.image}
                                        /> : null
                                    }
                                    {
                                        (item.risk_level === 'MUY ALTO' || item.risk_level === 'ALTO') ?
                                        <Image
                                            source={require("../../assets/images/alto.png")}
                                            style={styles.image}
                                        /> : null
                                    }
                                    <View style={styles.cText}>
                                        <Text style={styles.text}>{(item.risk_percentage) ? item.risk_percentage: item.risk_message}</Text>
                                    </View>
                                    
                                    {
                                        (item.risk_anxiety) ?
                                        <View style={styles.cText}>
                                            {
                                            (item.risk_level === "NORMAL" || item.risk_level === 'ALTERACION LEVE') ?
                                                <Image
                                                source={require("../../assets/images/bajo.png")}
                                                style={styles.image}
                                                /> : null
                                            }
                                            {
                                            (item.risk_level === 'ALTERACION GRAVE') ?
                                                <Image
                                                source={require("../../assets/images/alto.png")}
                                                style={styles.image}
                                                /> : null
                                            }
                                            {
                                            (item.risk_level === 'ALTERACION MODERADA') ?
                                                <Image
                                                source={require("../../assets/images/medio.png")}
                                                style={styles.image}
                                                /> : null
                                            }
                                            <View style={styles.cRTest}>
                                            <Text style={styles.text}>Riesgo de ansiedad: </Text>
                                            <Text style={styles.text2}>{item.risk_anxiety}</Text>
                                            </View>
                                            <View style={styles.cRTest}>
                                            <Text style={styles.text}>Riesgo de depresión: </Text>
                                            <Text style={styles.text2}>{item.risk_depression}</Text>
                                            </View>
                                            <View>
                                            <Text style={styles.text}>Nivel de Riesgo: </Text>
                                            <Text style={styles.text2}>{item.risk_level}</Text>
                                            </View>
                                            <View style={styles.cRTest}>
                                            <Text style={styles.text}>Scrore: </Text>
                                            <Text style={styles.text2}>{item.risk_score}</Text>
                                            </View>
                                        </View> : null
                                    }

                                    {
                                        (item.professional_observation) ?
                                        <View style={Styles.borderContainer}>
                                        <Text style={styles.titleObservation}>Observación al profesional</Text>
                                        <Text style={styles.textObservation}>{item.professional_observation}</Text>
                                        </View>
                                        : null
                                    }
                                    {
                                        (item.affiliate_observation) ?
                                        <View style={Styles.borderContainer}>
                                        <Text style={styles.titleObservation}>Observación para el paciente</Text> 
                                        <Text style={styles.textObservation}>{item.affiliate_observation}</Text>
                                        </View>
                                        : null
                                    }
                                </View>

                            )
                        }
                    })
                :null
            }
      </View>
      <View>
        <Button
          title="Evaluar otro Riesgo"
          onPress={() => navigator.replace('TypeAlertScreen', { data: datos, token: token })}
          fill='solid'
        />
        <Button
          title="Evaluar otro paciente"
          onPress={() => navigator.replace('Tabs', { screen: 'CatchmentScreen' })}
          color='secondary'
          fill='solid'
        />
      </View>
      </View>
    </ScrollView>
  )
}
export default ViewAlertScreen2

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10
  },
  cText: {
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cSubstance: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: Fonts.BOLD,
    fontSize: 20,
    color: Colors.FONT_COLOR,

  },
  text2: {
    fontFamily: Fonts.REGULAR,
    fontSize: 19,
    color: Colors.FONT_COLOR,
  },
  image: {
    width: 300,
    height: 180,
  },
  cRTest: {
    flexDirection: 'row'
  },
  textObservation:{
    fontFamily: Fonts.REGULAR,
    fontSize: 13,
    color: Colors.FONT_COLOR,
  },
  titleObservation:{
    fontFamily: Fonts.BOLD,
    fontSize: 16,
    color: Colors.FONT_COLOR,
  }

})
