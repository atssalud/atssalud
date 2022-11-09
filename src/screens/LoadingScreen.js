import React, { useEffect, useRef } from 'react';
import {View,ActivityIndicator, Image, Animated} from 'react-native';
import { Colors } from '../theme/Colors';
import { Fonts } from '../theme/Fonts';


const LoadingScreen = () => {

  const opacity= useRef(new Animated.Value(0.3))
    useEffect(() => {
        Animated.loop(
        Animated.sequence([
            Animated.timing(opacity.current,{
                toValue:0.8,
                useNativeDriver:true,
                duration:500
            }),
            Animated.timing(opacity.current,{
                toValue:0.3,
                useNativeDriver:true,
                duration:800
            })
        ]),
        ).start()

    }, [opacity])

  return (
    // <View style = {{ flex: 1,justifyContent: 'center',alignItems: 'center',}}>
    //   <ActivityIndicator
    //     size={50}
    //     color={Colors.PRIMARY_COLOR}
    //   />
    // </View>
    <View style={{flex: 1,justifyContent:'center',alignItems:'center',}}>
        <Animated.Image
            source={require('../assets/images/logo.jpeg')}
            style={{opacity:opacity.current,width:250.0,height:60.0}}
        />
        <Animated.Text style={{opacity:opacity.current,fontSize:20,marginTop:10,fontFamily:Fonts.BOLD}}>Cargando...</Animated.Text>
    </View>
  )
}
export default LoadingScreen;

