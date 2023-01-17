import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { ButtonImage } from '../../components/ButtonImage'
import { Endpoint } from '../../environment/Api'
import http from '../../services/http'
import { Fonts } from '../../theme/Fonts'
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../../context/AuthContext'
import IsConnectedScreen from '../IsConnectedScreen'

const CatchmentOptionsScreen = (props) => {
    const navigator = useNavigation()
    const data = props.route.params.data
    
    const {isConnected} = useContext(AuthContext)
    const [ netInfo,setNetInfo]=useState(false)

    useEffect(()=> {

        const unsubscribe = isConnected(setNetInfo)
        return()=>{
            unsubscribe
        }
        
    }, [])

    // {
    //     (netInfo=== false)? <IsConnectedScreen/>:
    // }

    const searchListTest = async (option) => {
        if (option === 'tamizaje') {
            try {
                // const resp = await http('get',Endpoint.listTamizaje)
                navigator.navigate('TypeAlertScreen', { data: data })


            } catch (error) {
                console.log('error', error)
            }

        } else {
            console.log('entro')
            try {
                const resp = await http('get', Endpoint.listRiesgo)
                console.log('reso',resp)
                navigator.navigate('TypeRiskScreen2', { data: data, list: resp })


            } catch (error) {
                console.log('error', error)
            }
        }

    }


    return (
        <>
            {
                (netInfo=== false)? <IsConnectedScreen/>:
                <ScrollView style={style.container}>
                <ButtonImage
                    nameImage='file-text-o'
                    text='Tamizaje'
                    size={30}
                    btnFunction={() => searchListTest('tamizaje')}

                />
                <ButtonImage
                    nameImage='check-square-o'
                    text='Marcación'
                    size={30}
                    btnFunction={() => searchListTest('marca')}

                />


                </ScrollView>
            }
            
        </>
    )
}
export default CatchmentOptionsScreen;

const style = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 20,
        flex: 1
    },
    cBtn: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontFamily: Fonts.BOLD,
        fontSize: 18,
        color: Colors.FONT_COLOR
    },
})
