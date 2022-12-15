import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { StyleSheet, View } from 'react-native';
import { ButtonImage } from '../../../components/ButtonImage';

const FilterMentalHealth = (props) => {
    const navigator=useNavigation()

    const data = props.route.params.data
    const datos = props.route.params.datos

  return (
    <View>
        <View style={styles.cBtn}>
          {
            (data.age >=5)?
              <ButtonImage
              nameImage='check-circle'
              text='Trastornos psicosociales y del comportamiento'
              size={30}
              btnFunction={()=>(data.age>11 && data.age <=15) ? navigator.navigate('TestRQC',{data:data,datos:datos,}):navigator.navigate('FilterItemTPsicosocialesMH',{data:data,datos:datos,})}
            />
            :null
          }
          {
            (data.age >=12)?
              <ButtonImage
                nameImage='check-circle'
                text='Población con riesgo o trastornos mentales y del comportamiento manifiestos debido a uso de sustancias psicoactivas y adicciones.'
                size={30}
                btnFunction={()=>navigator.navigate('TestAssist',{data:data,datos:datos,})}
              />
            :null
          }
        </View>
    </View>
  )
}
export default FilterMentalHealth;

const styles=StyleSheet.create({

})