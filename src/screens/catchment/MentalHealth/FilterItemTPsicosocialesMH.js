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
            btnFunction={()=>navigator.navigate('FilterTestSRQ',{data:data,datos:datos,})}
          />

          {/* si en depresion sale alto no se aplica demencia es decir se bloquea */}

          {/* enviar una alerta donde se le diga al medico que debe aplicar primero tanto depresion como esquizofrenia */}
          
          {/* si en esquizofrenia sale con riesgo (alto) no se aplica demencia es decir se bloquea */}
          {
            (data.age>15)?
            <ButtonImage
            nameImage='check-circle'
            text='Esquizofrenia'
            size={30}
            btnFunction={()=>navigator.navigate('FilterItemTPsicosocialesMH',{data:data,datos:datos,})}
            />
            :null
          }
          {
            (data.age>59)?
              <ButtonImage
              nameImage='check-circle'
              text='Demencia'
              size={30}
              btnFunction={()=>navigator.navigate('TestDementia',{data:data,datos:datos,})}
              />
            :null
          }
          
        </View>
    </View>
  )
}
export default FilterItemTPsicosocialesMH;

const styles=StyleSheet.create({

})


