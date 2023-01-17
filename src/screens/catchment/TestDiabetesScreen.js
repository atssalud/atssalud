import React, { useContext, useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import CheckBox from '../../components/CheckBox';
import { Styles } from '../../theme/GlobalStyle';
import { Fonts } from '../../theme/Fonts'
import { Colors } from '../../theme/Colors';
import Button from '../../components/Button';
import { Endpoint } from '../../environment/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from '../../services/http';
import { useNavigation } from '@react-navigation/native';
import TestSkeletonScreen from '../skeleton/TestSkeletonScreen';
import ViewAlertSkeletonScreen from '../skeleton/ViewAlertSkeletonScreen';
import { AuthContext } from '../../context/AuthContext';
import WindowAlert from '../../components/WindowAlert';
import TextInputs from '../../components/TextInput';
import IsConnectedScreen from '../IsConnectedScreen';

const TestDiabetesScreen = (props) => {
    const navigator = useNavigation()
    const { logOut,isConnected } = useContext(AuthContext)

    const data = props.route.params.data
    const datos = props.route.params.datos

    
    const [answer, setAnswer] = useState()
    const [change, setChange] = useState()
    const [questions, setQuestions] = useState()
    const [token, setToken] = useState()
    const [isSearch, setIsSearch] = useState(true)
    const [isSearchResult, setIsSearchResult] = useState(false)
    const [alert, setAlert] = useState(false)
    const [peso, setPeso] = useState('')
    const [talla, setTalla] = useState('')
    const [error, setError] = useState({
        peso: '',
        talla: ''
    })
    const [ netInfo,setNetInfo]=useState(false)

    useEffect(()=> {

        const unsubscribe = isConnected(setNetInfo)
        getToken()
        getIMC()
        return()=>{
            unsubscribe
        }
        
    }, [])
   
    const getIMC = async () => {
        const peso = await AsyncStorage.getItem('peso')
        const talla = await AsyncStorage.getItem('talla')
        setPeso((peso)?peso:'')
        setTalla((talla?talla:''))
    }

    const calculateIMC = () => {

        const imc = peso / (talla * talla)

        console.log({ imc })

        if (imc < 25) {
            answer[1].name = 'Menor a 25 kg/m2'
            answer[1].value = '0'
        }
        if (imc >= 25 && imc <= 30) {
            answer[1].name = 'Entre 25 y 30 kg/m2'
            answer[1].value = '1'
        }
        if (imc > 30) {
            answer[1].name = 'Mayor a 30 kg/m2'
            answer[1].value = '3'
        }
        changeQAge()


    }

    const changeQAge = () => {

        const edad = data.age

        if (edad < 45) {
            answer[0].name = 'Menor a 45 años'
            answer[0].value = '0'
        }
        if (edad >= 45 && edad < 55) {
            answer[0].name = 'Entre 45 y 54 años'
            answer[0].value = '2'
        }
        if (edad >= 55 && edad < 65) {
            answer[0].name = 'Entre 55 y 64 años'
            answer[0].value = '3'
        }
        if (edad > 64) {
            answer[0].name = 'Mayor a 64 años'
            answer[0].value = '4'
        }
        sendValidator()


    }

    const handleTest = () => {
        const error = []
        if (talla.trim().length === 0) {
            error.talla = 'Talla Obligatorio'
        }
        if (peso.trim().length === 0) {
            error.peso = 'Peso Obligatorio'
        }

        const vTalla = talla.includes(',')
        const vPeso = peso.includes(',')

        console.log({ vTalla })
        if (vPeso) {
            error.peso = 'Use punto'
        }
        if (vTalla) {
            error.talla = 'Use punto'
        }
        if (talla.trim().length > 0 && peso.trim().length > 0 && (vTalla === false) && (vPeso === false)) {
            calculateIMC()
        }

        setError(error)
    }

    const getToken = async () => {
        const userToken = await AsyncStorage.getItem('token')
        getQuestion(userToken)
        setToken(userToken)

    }
    const getQuestion = async () => {

        try {
            const resp = await http('get', Endpoint.listItemDiabetes)
            if (resp.message === 'token no válido') {
                logOut()
            }
            console.log("Items:", JSON.stringify(resp));
            setQuestions(resp)
            listadoPreguntas(resp)
            setIsSearch(false)
        } catch (error) {
            console.log('error', error)
        }
    }


    const listadoPreguntas = (datas) => {
        const lista = []
        datas.map((i, item) => {
            if (data.gender === 'F' && item === 2) {
                var name = i.options[2].name
                var value = i.options[2].value
                var question_id = i.id
                lista.push({ question_id, name, value })
                console.log({ question_id, name, value })
            } else {
                var name = i.options[0].name
                var value = i.options[0].value
                var question_id = i.id
                lista.push({ question_id, name, value })
                console.log({ question_id, name, value })
            }


        })
        setAnswer(lista)
    }


    const itemCheckboxSelected = (id, value, name) => {
        console.log('asasa', id, value, name)
        answer[id].value = value
        answer[id].name = name
        console.log(answer[id])
        if (change === false) {
            setChange(true)
        } else {
            setChange(false)
        }
    }

    const sendValidator = () => {
        setAlert(true)
    }
    const close = () => {
        send()
    }
    const contentAlert =
        <View style={styles.cAlert}>
            <Image
                source={require('../../assets/icons/modal-alert-Icon.png')}
                style={styles.imageAlert}
            />
            <Text style={styles.title}>Alerta</Text>
            <View style={styles.ctextAlert}>
                <Text style={styles.textAlert}>¿ Desea proceder a Tamizar Paciente ?</Text>
            </View>
        </View>

    const send = async () => {
        setIsSearchResult(true)
        const user = await AsyncStorage.getItem('user');
        const { id } = JSON.parse(user);
        console.log(user);
        console.log('verificadooooo', answer)

        const send = {
            "dni": String(data.dni),
            "author_id": String(id),
            "test": answer
        }
        console.log(JSON.stringify(send));
        try {
            console.log('entro')
            const resp = await http('post', Endpoint.sendTestDiabetes, send)
            console.log({ resp })
            if (resp.errors) {
                setError(resp.errors)
            } else {
                AsyncStorage.setItem('peso', String(peso))
                AsyncStorage.setItem('talla', String(talla))
                navigator.replace('ViewAlertScreen', { data: resp.data, datos: datos, nameRisk: 'Tamizaje Diabetes' })
                setIsSearchResult(false)
            }

        } catch (error) {
            console.log('error', error)
        }
    }


    return (
        <>
            {
                (netInfo=== false)? <IsConnectedScreen/>:
                <>
                {
                    (isSearch) ?
                        <TestSkeletonScreen />
                        : (isSearchResult) ?
                            <ViewAlertSkeletonScreen /> :
                            <ScrollView>

                                {(answer) ?
                                    <View style={styles.container}>

                                        <View style={Styles.borderContainer}>
                                            <View style={styles.cQuestion}>
                                                <Text style={styles.tQuestion}>Índice de masa corporal IMC (Peso kg/ Talla mts2)</Text>
                                                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'center', width: '100%', marginLeft: 50 }}>

                                                    <View>
                                                        <TextInputs
                                                            label={'Peso'}
                                                            placeholder={'Ej: 35'}
                                                            keyboardType='numeric'
                                                            dimension='middle'
                                                            onChangeText={(value) => setPeso(value)}
                                                            value={peso}
                                                        />
                                                        {(error) ?
                                                            (error.peso === '') ? null :
                                                                <Text style={styles.textValid}>{error.peso}</Text> : null
                                                        }
                                                    </View>
                                                    <View>
                                                        <TextInputs
                                                            label={'Talla'}
                                                            placeholder={'Ej: 1.5'}
                                                            keyboardType='numeric'
                                                            dimension='middle'
                                                            onChangeText={(value) => setTalla(value)}
                                                            value={talla}
                                                        />
                                                        {(error) ?
                                                            (error.talla === '') ? null :
                                                                <Text style={styles.textValid}>{error.talla}</Text> : null
                                                        }
                                                    </View>
                                                </View>

                                            </View>
                                        </View>

                                        {(questions) ? questions.map((item, id) => {

                                            if (item.id !== 1 && item.id !== 2) {
                                                return (
                                                    <View style={Styles.borderContainer} key={id}>
                                                        <View style={styles.cQuestion}>
                                                            <Text style={styles.tQuestion}>{item.name}</Text>
                                                        </View>
                                                        <View>
                                                            <CheckBox
                                                                text={item.options[0].name}
                                                                value={(answer[id].name === item.options[0].name) ? true : false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id, item.options[0].value, String(item.options[0].name))}
                                                            />
                                                            <CheckBox
                                                                text={item.options[1].name}
                                                                value={(answer[id].name === item.options[1].name) ? true : false}
                                                                disabled={false}
                                                                onValueChange={(newValue) => itemCheckboxSelected(id, String(item.options[1].value), String(item.options[1].name))}
                                                            />
                                                            {
                                                                (item.options.length >= 3) ?
                                                                    <CheckBox
                                                                        text={item.options[2].name}
                                                                        value={(answer[id].name === item.options[2].name) ? true : false}
                                                                        disabled={false}
                                                                        onValueChange={(newValue) => itemCheckboxSelected(id, String(item.options[2].value), String(item.options[2].name))}
                                                                    /> : null
                                                            }
                                                            {
                                                                (item.options.length === 4) ?
                                                                    <CheckBox
                                                                        text={item.options[3].name}
                                                                        value={(answer[id].name === item.options[3].name) ? true : false}
                                                                        disabled={false}
                                                                        onValueChange={(newValue) => itemCheckboxSelected(id, String(item.options[3].value), String(item.options[3].name))}
                                                                    /> : null
                                                            }

                                                        </View>
                                                    </View>
                                                )
                                            }
                                        }) : null
                                        }

                                        <View style={styles.cButton}>
                                            <Button
                                                title={"Calcular"}
                                                onPress={() => handleTest()}
                                                fill='solid'
                                            />
                                        </View>
                                    </View>
                                    : null
                                }
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
                                            btnClose={'yes'}

                                        />
                                        : null
                                }

                            </ScrollView>
                }
                </>
            }
            
        </>

    )
}
export default TestDiabetesScreen;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 20
    },
    cCheckBox: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    cQuestion: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        flex: 1
    },
    tQuestion: {
        fontFamily: Fonts.BOLD,
        fontSize: 16,
        color: Colors.FONT_COLOR
    },
    cButton: {
        marginBottom: 10,
        marginTop: 20
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
    title: {
        fontSize: 18,
        color: 'black'
    },
    textValid: {
        fontSize: 14,
        fontFamily: Fonts.BOLD,
        color: "#ff5d2f",
        marginBottom: 10
    },
})
