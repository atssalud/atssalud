import React from 'react'
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../components/Skeleton';
import {Colors} from '../../theme/Colors'

const DataPatientSkeletonScreen = () => {
    
    return (
        <View style={{felex:1,justifyContent:'center',marginTop:30}}>
        <View style={styles.container}>
            <Skeleton/>
        </View>
        <View style={[styles.container,{marginTop:-500}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:50}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:50}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:50}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:50}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:50}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:50}]}>
            <Skeleton height={5} width={'80%'} color={Colors.GREY}/>
        </View>
        <View style={[styles.container,{marginTop:70}]}>
            <Skeleton height={50} width={'50%'} color={Colors.GREY}/>
        </View>
        
        </View>
    )
}

export default DataPatientSkeletonScreen;

const styles = StyleSheet.create({
   container:{
        alignItems:'center',
        justifyContent:'center',
   },
   
})
