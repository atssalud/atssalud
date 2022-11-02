import React from 'react'
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../components/Skeleton';
import {Colors} from '../../theme/Colors'

const UpdateDataSkeletonScreen = () => {
    
    return (
        <View style={{flex:1,justifyContent:'center'}}>
        <View style={styles.container}>
            <Skeleton/>
        </View>
        <View style={[styles.container,{marginTop:-550}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:20}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:20}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:20}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:20}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:20}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:20}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container]}>
            <Skeleton height={50} width={'50%'} color={Colors.GREY}/>
        </View>
        
        </View>
    )
}

export default UpdateDataSkeletonScreen;

const styles = StyleSheet.create({
   container:{
        alignItems:'center',
        justifyContent:'center',
   },
   
})
