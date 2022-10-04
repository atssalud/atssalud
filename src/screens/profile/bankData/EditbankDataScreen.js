import React,{useState,useEffect} from 'react'
import {View,Text,Image,TouchableOpacity,StyleSheet,Alert,ScrollView} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { InputText } from '../components/InputText';
import { useForm } from '../../hooks/useForm';
import InputDate from '../../components/InputDate';
import ListOptions from '../../../components/ListOptions';
import http from '../../services/http';
import { Endpoint } from '../../../constants/API';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';

const EditbankDataScreen = (props) => {
    const data = props.route.params.data
    console.log('dataaaa', data)
    const navigator= useNavigation()
    const [bank, setBank] = useState(data.banco)
    const [accountType, setAccountType] = useState(data.tipo_cuenta)

    
    const tipoCuenta=[{"id":"1", "type":"Ahorros"},{"id":"0", "type":"Corriente"}]
    const bancos=[{'id':'1','nombre':'Bancolombia'},{'id':'2','nombre':'Banco de Bogota'},{'id':'3','nombre':'Nequi'},{'id':'4','nombre':'Colpatria'},{'id':'5','nombre':'Davivienda'}]
    

    useEffect(() => {

        navigator.setOptions({
            headerRight:()=>(
                <TouchableOpacity
                    style={styles.btnHeader}
                    onPress={()=>saveData()}
                >
                    <Text style={styles.textHeader}>Guardar</Text>
                </TouchableOpacity>
            ),
    
        })

    })
    const {banco,cuenta,tipo_cuenta,onChange} = useForm({
        banco:bank,
        cuenta:data.cuenta,
        tipo_cuenta:accountType,
        
    })
    const saveData = async ()=>{

    
        const update={
            'banco':bank,
            cuenta,
            'tipo_cuenta':accountType,
        }

        console.log('dataa',update)
        console.log('data',data.identificacion)

        try {
            const res = await http('put',Endpoint.ownerDetails(data.identificacion),update);
            console.log('respuesta',res)
            Alert.alert(
                'Actualizando Datos',
                'Se ha actualizado de forma exitosa',
                [
                    { text: 'OK',
                    onPress: () => navigator.replace('BankDataScreen',{item:data.identificacion})},
                ]
            )
        } catch (error) {
            console.error('error',error)
        }
        
    }

    const onChangeText=(value,text)=>{
        onChange(value,text)
    };

    const selectBank=(id,value)=>{
        console.log('valuee',value)
        setBank(value)
    }
    const selectAccount=(id,value)=>{
        console.log('valuee',value,id)
        setAccountType(id)
    }

  return (

    <View style={styles.container}>
        <View style={styles.cTextInput}>
            <InputText
                title="Número de cuenta"
                value={cuenta}
                name='cuenta'
                onChangeText={onChangeText}
                width='all'
                placeholder='1234567890'
            />
            <View style={styles.cData}>
                <Text style={styles.text}>Tipo de cuenta:</Text>
                <ListOptions
                    options={tipoCuenta}
                    itemSelect={selectAccount}
                    id={'id'}
                    value={'type'}
                    text={(tipo_cuenta === '1') ? 'Ahorros' : 'Corriente'}
                    name='cuenta'
                />
            </View>
            <View style={styles.cData}>
                <Text style={styles.text}>Banco:</Text>
                <ListOptions
                    options={bancos}
                    itemSelect={selectBank}
                    id={'id'}
                    value={'nombre'}
                    text={banco}
                    name='cuenta'
                />
            </View>

        </View>
    </View>
  )
}
export default EditbankDataScreen
const styles = StyleSheet.create({
    container:{
        marginHorizontal:30,
        marginVertical:10,
        
    },
    cTextInput:{
        marginTop:20,
        borderRadius: 12.0,
        paddingHorizontal: 15.0,
        paddingTop: 10.0,
        paddingBottom: 15.0,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 6.0,
        shadowOpacity: 4.0,
    },
    btnHeader:{
        paddingHorizontal:5,
        paddingVertical:3,
        borderWidth:1,
        borderColor: 'white',
        borderRadius:3
    },
    textHeader:{
        color:Colors.WHITE,
        fontSize:13,
        fontFamily:Fonts.REGULAR
    },
    image:{
        width: 80,
        height: 80,
    },
    cImageText:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cText:{
        marginLeft:20
    },
    text:{
        color: Colors.FONT_COLOR,
        fontSize: 15,
        fontFamily: Fonts.BOLD,
    },
    cData:{
        marginBottom:20
    }
})

