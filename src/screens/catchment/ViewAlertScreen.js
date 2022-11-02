import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import Button from '../../components/Button'
import { Colors } from '../../theme/Colors'
import { Fonts } from '../../theme/Fonts'
import { Styles } from '../../theme/GlobalStyle'

const ViewAlertScreen = (props) => {
  const navigator = useNavigation()
  const data = props.route.params.data
  const datos = props.route.params.datos
  const nameRisk = props.route.params.nameRisk

  const [token, setToken] = useState()


  useEffect(() => {
    getToken()

  }, [])

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('token')
    setToken(userToken)
  }
  return (
    <View style={styles.container}>

      <View style={[Styles.borderContainer,{marginBottom:30}]}>
      
      <View style={styles.cText}>
        <Text style={styles.text}>{nameRisk}</Text>
      </View>


      {
        (data.risk_level === "" || data.risk_level === 'BAJO') ?
          <Image
            source={require("../../assets/images/bajo.png")}
            style={styles.image}
          /> : null
      }
      {
        (data.risk_level === 'MODERADO') ?
          <Image
            source={require("../../assets/images/medio.png")}
            style={styles.image}
          /> : null
      }
      {
        (data.risk_level === 'MUY ALTO' || data.risk_level === 'ALTO') ?
          <Image
            source={require("../../assets/images/alto.png")}
            style={styles.image}
          /> : null
      }
      <View style={styles.cText}>
        <Text style={styles.text}>{(data.risk_percentage) ? data.risk_percentage + '%' : data.risk_message}</Text>
      </View>
      {
        (data.risk_anxiety) ?
          <View style={styles.cText}>
            {
              (data.risk_level === "NORMAL" || data.risk_level === 'ALTERACION LEVE') ?
                <Image
                  source={require("../../assets/images/bajo.png")}
                  style={styles.image}
                /> : null
            }
            {
              (data.risk_level === 'ALTERACION GRAVE') ?
                <Image
                  source={require("../../assets/images/alto.png")}
                  style={styles.image}
                /> : null
            }
            {
              (data.risk_level === 'ALTERACION MODERADA') ?
                <Image
                  source={require("../../assets/images/medio.png")}
                  style={styles.image}
                /> : null
            }
            <View style={styles.cRTest}>
              <Text style={styles.text}>Riesgo de ansiedad: </Text>
              <Text style={styles.text2}>{data.risk_anxiety}</Text>
            </View>
            <View style={styles.cRTest}>
              <Text style={styles.text}>Riesgo de depresión: </Text>
              <Text style={styles.text2}>{data.risk_depression}</Text>
            </View>
            <View>
              <Text style={styles.text}>Nivel de Riesgo: </Text>
              <Text style={styles.text2}>{data.risk_level}</Text>
            </View>
            <View style={styles.cRTest}>
              <Text style={styles.text}>Scrore: </Text>
              <Text style={styles.text2}>{data.risk_score}</Text>
            </View>
          </View> : null
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
          onPress={() => navigator.navigate('CatchmentScreen')}
          color='secondary'
          fill='solid'
        />
      </View>
    </View>
  )
}
export default ViewAlertScreen

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
    alignItems: 'center'
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
    marginTop:-40
  },
  cRTest: {
    flexDirection: 'row'
  }
})
