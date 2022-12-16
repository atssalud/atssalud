import React,{useState,useEffect, useContext} from 'react'
import {View,Text,Image,TouchableOpacity,StyleSheet,Alert,ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from '../../../hooks/useForm'
import ListOptions from '../../../components/ListOptions';
import http from '../../../services/http';
import { Endpoint } from '../../../environment/Api';
import { Colors } from '../../../theme/Colors';
import { Fonts } from '../../../theme/Fonts';
import TextInputs from '../../../components/TextInput';
import Button from '../../../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../../../context/AuthContext';

const EditbankDataScreen = (props) => {

    const {logOut} = useContext(AuthContext)
    const data = props.route.params.dataUser
    console.log('dataaaa', data)
    const navigator= useNavigation()
    const [bank, setBank] = useState(data.bank_name)
    const [idBank, setIdBank] = useState(data.bank)
    const [accountType, setAccountType] = useState(data.type_account_name)
    const [idAccountType, setIdAccountType] = useState(data.type_account)
    const [nameBank, setNameBank] = useState()
    const [typeAccount, setTypeAccount] = useState()
    const [error, setError] = useState()
    const token =data.token

    useEffect(() => {
        getTypeAccount()
        getNameBank()
        navigator.setOptions({
            headerLeft:()=>(
                <TouchableOpacity
                    onPress={()=> navigator.replace('BankDataScreen',{dataUser:data})}
                >
                    <Icon
                        name="chevron-left"
                        color= {'white'}
                        size={24}
                    />
                </TouchableOpacity>
            ),
    
        })
    }, [])
    
    const getTypeAccount = async()=>{
        try {
          const res = await http('get',Endpoint.typeAccount)
          if(res.message==='token no válido'){
            logOut()
          }
          setTypeAccount(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getNameBank = async()=>{
        try {
          const res = await http('get',Endpoint.banks)
          if(res.message==='token no válido'){
            logOut()
          }
          setNameBank(res)
        } catch (error) {
          console.log('error',error)
        }
    }

    const {banco,cuenta,tipo_cuenta,idTipoCuenta,idBanco,dni,dni_type,first_name,profession,last_name,movil,company,state,city,address,onChange} = useForm({
        banco:(bank)?bank:'',
        cuenta:(data.bank_account)?data.bank_account:'',
        tipo_cuenta:(accountType)?accountType:'',
        idBanco:(idBank)?idBank:'',
        idTipoCuenta:(idAccountType)?idAccountType:'',
        address:data.address,
        city:data.city,
        state:data.state,
        movil:data.phone,
        company:data.company,
        dni:data.dni,
        dni_type:data.dni_type,
        first_name:data.first_name,
        last_name:data.last_name,
        profession:data.profession,
    })
    const saveData = async ()=>{

    
        const update={
        "dni":dni, 
        "dni_type":dni_type, 
        "first_name":first_name,
        "last_name":last_name, 
        "address":address, 
        "city":city, 
        "state":state, 
        "movil":movil,
        "profession":profession,
        'bank':idBanco,
        'bank_account':cuenta,
        'type_account':idTipoCuenta,
        }

        console.log('dataa',update)
        // console.log('data',data.identificacion)

        try {
            const resp = await http('put',Endpoint.editDataBankUser,update);
            if(resp.message==='token no válido'){
                logOut()
              }
            console.log('respuesta',resp)
            if(resp.errors){
                setError(resp.errors)
            }else{
                
                Alert.alert(
                    'Actualizando Datos',
                    'Se ha actualizado de forma exitosa',
                    [
                        { text: 'OK',
                        onPress: () => getUser()},
                    ]
                )
            }
        } catch (error) {
            console.error('error',error)
        }
        
    }
    const getUser = async()=>{
    
        try { 
          const data={
            'token':token
          }
          const res = await http('post',Endpoint.dataUser,data)
          if(res.message==='token no válido'){
            logOut()
          }
          console.log('res',res)
          navigator.replace('Tabs', { screen: 'PerfilScreen' })
          
        } catch (error) {
            console.log('error',error);
            }
      }

    const onChangeText=(value,text)=>{
        onChange(value,text)
    };

    const selectBank=(id,value)=>{
        console.log('valuee',value)
        onChange(id,'idBanco')
    }
    const selectAccount=(id,value)=>{
        console.log('valuee',value,id)
        onChange(id,'idTipoCuenta')
    }

  return (

    <View style={styles.container}>
        <View style={styles.cTextInput}>
            <TextInputs
                label='Número de cuenta'
                placeholder="1234567890"
                onChangeText= {(value)=>onChangeText(value,'cuenta')}
                value={cuenta}
            />
            {(error)?
                (error.bank_account==='')?null:
                <Text style={styles.textValid}>{error.bank_account}</Text>: null
            }
            <ListOptions
                label='Tipo de cuenta:'
                options={typeAccount}
                itemSelect={selectAccount}
                placeholder={tipo_cuenta}
                isSelect={true}
            />
            <ListOptions
                label='Banco:'
                options={nameBank}
                itemSelect={selectBank}
                placeholder={banco}
                isSelect={true}
            />
            <Button
                title="Guardar"
                onPress={()=> saveData()} 
                fill='solid'
            />
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
    },
    textValid:{
        fontSize: 14,
        fontFamily:Fonts.BOLD,
        color:"#ff5d2f",
        marginLeft:4,
        marginTop:-10,
        marginBottom:5
    },
})

