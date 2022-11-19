import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {View,ActivityIndicator, Image, Animated, Text} from 'react-native';
import { Icon } from 'react-native-vector-icons/Icon';
import Button from '../../components/Button';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';


const FailedService = () => {

  const navigator = useNavigation()

  return (
    <View style={{flex: 1,justifyContent:'center',alignItems:'center',}}>
        <Image
            source={require('../../assets/images/logo.jpeg')}
            style={{width:250.0,height:60.0}}
        />
        <Text style={{fontSize:18,marginTop:30,fontFamily:Fonts.REGULAR,color:Colors.FONT_COLOR}}>
            ¡Ups ha ocurrido un error de conexión</Text>
        <Text style={{fontSize:18,fontFamily:Fonts.REGULAR,color:Colors.FONT_COLOR,marginBottom:30}}>
            vuelva a intentar!</Text>
        <Button
          title={'Captación'}
          fill={true}
          onPress={()=>navigator.replace('Tabs', { screen: 'CatchmentScreen' })}
        />
    </View>
  )
}
export default FailedService;
