import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { StyleSheet, View } from 'react-native';
import { ButtonImage } from '../../../components/ButtonImage';

const FilterItemTPsicosocialesMH = (props) => {
    const navigator=useNavigation()

    const data = props.route.params.data
    const datos = props.route.params.datos

  return (
    <View>
        <View style={styles.cBtn}>
          <ButtonImage
            nameImage='check-circle'
            text='Depresión'
            size={30}
            btnFunction={()=>(data.age>=5 && data.age <=15) ? navigator.navigate('TestRQC',{data:data,datos:datos,}):navigator.navigate('FilterTestSRQ',{data:data,datos:datos,})}
          />
          <ButtonImage
            nameImage='check-circle'
            text='Demencia'
            size={30}
            btnFunction={()=>navigator.navigate('FilterItemTPsicosocialesMH',{data:data,datos:datos,})}
          />
          <ButtonImage
            nameImage='check-circle'
            text='Esquizofrenia'
            size={30}
            btnFunction={()=>navigator.navigate('FilterItemTPsicosocialesMH',{data:data,datos:datos,})}
          />
          <ButtonImage
            nameImage='check-circle'
            text='Suicidio'
            size={30}
            btnFunction={()=>navigator.navigate('FilterItemTPsicosocialesMH',{data:data,datos:datos,})}
          />
        </View>
    </View>
  )
}
export default FilterItemTPsicosocialesMH;

const styles=StyleSheet.create({

})


