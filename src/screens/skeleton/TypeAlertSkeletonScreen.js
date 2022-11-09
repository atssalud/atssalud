import React from 'react'
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../components/Skeleton';
import {Colors} from '../../theme/Colors'

const TypeAlertSkeletonScreen = () => {
    return (
        <View style={{flex:1}}>
            <View style={[styles.container,{marginTop:40}]}>
                <Skeleton height={60} width={'90%'} color={Colors.GREY}/>
            </View>
            <View style={[styles.container,{marginTop:30}]}>
                <Skeleton height={60} width={'90%'} color={Colors.GREY}/>
            </View>
            <View style={[styles.container,{marginTop:30}]}>
                <Skeleton height={60} width={'90%'} color={Colors.GREY}/>
            </View>
            <View style={[styles.container,{marginTop:30}]}>
                <Skeleton height={60} width={'90%'} color={Colors.GREY}/>
            </View>
            <View style={[styles.container,styles.btn]}>
                <Skeleton height={50} width={'70%'} color={Colors.GREY}/>
            </View>
        </View>
    )
}
export default TypeAlertSkeletonScreen

const styles = StyleSheet.create({
    container:{
         alignItems:'center',
         justifyContent:'center',
    },
    btn:{
        flex:1,bottom: 20,
        left: 0,
        right: 0,
        position:'absolute'
    }
    
 })
