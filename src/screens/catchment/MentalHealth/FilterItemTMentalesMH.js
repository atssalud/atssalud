import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { StyleSheet, View } from 'react-native';
import { ButtonImage } from '../../../components/ButtonImage';

const FilterItemTMentalesMH = (props) => {
    const navigator=useNavigation()

    const data = props.route.params.data
    const datos = props.route.params.datos

  return (
    <View>
        <View style={styles.cBtn}>
          <ButtonImage
            nameImage='check-circle'
            text='Consumo de sustancias psicoactivas'
            size={30}
            btnFunction={()=>navigator.navigate('FilterItemTMentalesMH',{data:data,datos:datos,})}
          />
        </View>
    </View>
  )
}
export default FilterItemTMentalesMH;

const styles=StyleSheet.create({

})

