import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import {Colors} from '../theme/Colors'

const Skeleton= ({width='90%',height=600,color=Colors.GREY}) => {
    const opacity= useRef(new Animated.Value(0.3))
    useEffect(() => {
        Animated.loop(
        Animated.sequence([
            Animated.timing(opacity.current,{
                toValue:0.1,
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
    <Animated.View style={[{opacity:opacity.current,width,height,backgroundColor:color},styles.skeleton]}/>
  )
}

export default Skeleton;

const styles=StyleSheet.create({
    skeleton:{
        marginHorizontal:20,
        borderRadius: 20.0,
    },

})
