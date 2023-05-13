
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import Button from '../../components/Button';
import WindowAlert from '../../components/WindowAlert';
import Api, { Endpoint } from '../../environment/Api';
import { useForm } from '../../hooks/useForm';
import http from '../../services/http';
import TextInput from '../../components/TextInput';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../theme/Colors';
import { Styles } from '../../theme/GlobalStyle';
import ListOptions from '../../components/ListOptions'
import { Fonts } from '../../theme/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataPatientSkeletonScreen from '../skeleton/DataPatientSkeletonScreen';
import LoadingScreen from '../LoadingScreen';
import { AuthContext } from '../../context/AuthContext';
import FailedService from './FailedService';
import IsConnectedScreen from '../IsConnectedScreen';
import NetInfo from "@react-native-community/netinfo";

const CatchmentScreen = () => {

    AsyncStorage.removeItem('peso');
    AsyncStorage.removeItem('talla');

    const navigator = useNavigation()
    const { logOut, isConnected } = useContext(AuthContext)

    const [alert, setAlert] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    const [fieldError, setFieldError] = useState(false)
    const [dniTypes, setDniTypes] = useState()
    const [token, setToken] = useState()
    const [isSearch, setIsSearch] = useState(false)
    const [netInfo, setNetInfo] = useState(false)

    const { typeDni, idDni, numberDni, onChange } = useForm({
        typeDni: 'CC',
        idDni: '1',
        numberDni: '27742094'
    })

    const [error, setError] = useState()

    useEffect(() => {

        const unsubscribe = isConnected(setNetInfo)
        getDniTypes()
        getToken()

        return () => {
            unsubscribe
        }

    }, [])

    const getDniTypes = async () => {
        try {
            const res = await http('get', Endpoint.dniTypes)
            if (res.message === 'token no válido') {
                logOut()
            }
            setDniTypes(res)
        } catch (error) {
            console.log('error getDniTypes', error)
        }
    }

    const getToken = async () => {
        const userToken = await AsyncStorage.getItem('token')
        setToken(userToken)

    }

    const send = async () => {

        const send = {
            dni: numberDni,
            dni_type: idDni
        }
        console.log({ send })
        try {
            setIsSearch(true)
            const resp = await http('post', Endpoint.findPeople, send)

            if (resp.message === 'token no válido') {
                logOut()
            }
            console.log('resss', resp)
            if (resp === 'timeout') return <FailedService />

            if (resp.errors) {
                setError(resp.errors)
            } else {

                if (Object.keys(resp.data).length === 0) {
                    setIsSearch(false)
                    Alert.alert('Notificación', 'Usuario no registrado en la base de datos')
                } else {
                    navigator.navigate('DataPatientScreen', { data: resp.data, dni: numberDni })
                    setIsSearch(false)
                }
            }
            // if(resp.errors){
            //     setError(resp.errors)
            // }else{
            //     if(Object.keys(resp.data).length === 0){
            //         navigator.navigate('FirstDataCatchmentScreen',{data:resp.data,dni:numberDni})
            //     }else{
            //         navigator.navigate('DataPatientScreen',{data:resp.data,dni:numberDni})
            //     }
            // }

        } catch (error) {
            console.log('error', error)
            setErrorAlert(true)
        }
    }

    const contentAlert =
        <View style={styles.cAlert}>
            <Image
                source={require('../../assets/icons/checkCircle.png')}
                style={styles.imageAlert}
            />
            <Text style={styles.title}>Notificación</Text>
            <View style={styles.ctextAlert}>
                <Text style={styles.textAlert}>Este usuario ya ha sido evaluado</Text>
            </View>
        </View>


    const close = () => {
        console.log('hola')
    }

    const itemSelect = (key, value) => {
        console.log(key, value)
        onChange(key, 'idDni')
    }

    return (
        <>
            {
                (netInfo === false) ? <IsConnectedScreen /> :
                    <>
                        {
                            (isSearch) ?
                                (errorAlert) ? <FailedService /> :
                                    <LoadingScreen />
                                :
                                <View style={styles.container}>
                                    <View style={styles.cTitulo}>
                                        <Text style={styles.titulo}>Buscar Paciente</Text>
                                    </View>
                                    <View style={Styles.borderContainer}>
                                        <ListOptions
                                            label='Tipo de documento'
                                            options={dniTypes}
                                            itemSelect={itemSelect}
                                            placeholder={typeDni}
                                            isSelect={true}
                                        />
                                        <TextInput
                                            label='Número de documento'
                                            value={numberDni}
                                            name='correo'
                                            onChangeText={(value) => onChange(value, 'numberDni')}
                                            placeholder='1042143543'
                                            line='blue'
                                        />
                                        {(error) ?
                                            (error.dni === '') ? null :
                                                <Text style={styles.textValid}>{error.dni}</Text> : null
                                        }
                                        <View style={styles.cBtn}>
                                            <TouchableOpacity
                                                style={styles.Btn}
                                                onPress={() => send()}
                                            >
                                                <Text style={styles.tBtn}>Buscar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                    {
                                        (alert) ?
                                            <WindowAlert
                                                bool={true}
                                                closeAlert={setAlert}
                                                content={contentAlert}
                                                width={50}
                                                height={3}
                                                btnText={'Aceptar'}
                                                btnFunction={close}
                                            />
                                            : null
                                    }
                                </View>
                        }
                    </>
            }
        </>
    )
}

export default CatchmentScreen;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 20,
        marginTop: 150
    },
    cImagen: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 83
    },
    cTitle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: 'black'
    },
    cText: {
        marginTop: 30
    },
    text: {
        color: 'black',
        fontSize: 16
    },
    textValid: {
        fontSize: 14,
        fontFamily: Fonts.BOLD,
        color: "#ff5d2f",
        marginLeft: 4,
        marginTop: -10,
        marginBottom: 5
    },
    text: {
        color: 'black',
    },
    imageAlert: {
        width: 60,
        height: 60,
        bottom: 20,
        marginTop: 15
    },
    cAlert: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAlertError: {
        color: 'black',
        marginTop: 10,
        marginBottom: 20
    },
    textAlert: {
        color: 'black',
    },
    ctextAlert: {
        marginTop: 10,
        alignItems: 'center'
    },
    cButton: {
        marginTop: 20
    },
    cBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -20
    },
    Btn: {
        backgroundColor: Colors.PRIMARY_COLOR,
        width: 250,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        paddingVertical: 10
    },
    tBtn: {
        fontFamily: Fonts.BOLD,
        fontSize: 15,
        color: Colors.WHITE
    },
    cTitulo: {
        alignItems: 'center',
        marginBottom: 20
    },
    titulo: {
        fontSize: 20,
        color: Colors.PRIMARY_COLOR,
        fontFamily: Fonts.BOLD
    }
})