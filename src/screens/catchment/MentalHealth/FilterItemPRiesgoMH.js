import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { StyleSheet, View } from 'react-native';
import { ButtonImage } from '../../../components/ButtonImage';

const FilterItemPRiesgoMH = (props) => {
    const navigator=useNavigation()

    const data = props.route.params.data
    const datos = props.route.params.datos

  return (
    <View>
        <View style={styles.cBtn}>
          <ButtonImage
            nameImage='check-circle'
            text='Violencia relacionada con el conflicto armado'
            size={30}
            btnFunction={()=>navigator.navigate('FilterItemPRiesgoMH',{data:data,datos:datos,})}
          />
          <ButtonImage
            nameImage='check-circle'
            text='Violencia de género'
            size={30}
            btnFunction={()=>navigator.navigate('FilterItemPRiesgoMH',{data:data,datos:datos,})}
          />
        </View>
    </View>
  )
}
export default FilterItemPRiesgoMH;

const styles=StyleSheet.create({

})

