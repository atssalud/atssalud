import React from 'react'
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../components/Skeleton';
import {Colors} from '../../theme/Colors'

const TypeAlertSkeletonScreen = () => {
    return (
        <View>
            <View style={[styles.container]}>
                <Skeleton height={65} width={'110%'} color={Colors.GREY}/>
            </View>
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
        </View>
    )
}
export default TypeAlertSkeletonScreen

const styles = StyleSheet.create({
    container:{
         alignItems:'center',
         justifyContent:'center',
    },
    
 })
