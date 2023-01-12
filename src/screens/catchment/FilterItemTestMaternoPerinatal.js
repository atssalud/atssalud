import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { StyleSheet, View } from 'react-native';
import { ButtonImage } from '../../components/ButtonImage';

const FilterItemTestMaternoPerinatal = (props) => {
    
  const navigator=useNavigation()
    const data = props.route.params.data
    const datos = props.route.params.datos

  return (
    <View style={styles.container}>
        <View style={styles.cBtn}>
          <ButtonImage
            nameImage='check-circle'
            text='Sospecha de Embarazo'
            size={30}
            btnFunction={()=>navigator.navigate('TestSuspectedPregnancy',{data:data,datos:datos,})}
          />
          <ButtonImage
            nameImage='check-circle'
            text='Alto riesgo reproductivo'
            size={30}
            btnFunction={()=>navigator.navigate('TestHighReproductiveRisk',{data:data,datos:datos,})}
          />
        </View>
    </View>
  )
}
export default FilterItemTestMaternoPerinatal;

const styles=StyleSheet.create({
    container:{
        marginHorizontal:25,
        marginVertical:25,
        flex:1
      },

})

