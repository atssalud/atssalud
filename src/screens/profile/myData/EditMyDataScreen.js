import React,{useState,useEffect, useContext} from 'react'
import {View,Text,Image,TouchableOpacity,StyleSheet,Alert,ScrollView} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useForm } from '../../../hooks/useForm';
import ListOptions from '../../../components/ListOptions';
import Icon from 'react-native-vector-icons/FontAwesome';
import http from '../../../services/http';
import { Endpoint } from '../../../environment/Api';
import WindowPhoto from '../../../components/WindowPhoto';
import { Colors } from '../../../theme/Colors';
import { Fonts } from '../../../theme/Fonts';
import TextInputs from '../../../components/TextInput';
import Button from '../../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../context/AuthContext';
import IsConnectedScreen from '../../IsConnectedScreen';

const EditMyDataScreen = (props) => {

    // Cuando la ciudad_id venga null y la ciudad si venga se debe
    //colocar como obligatorio el campo de ciudad de nacimiento para
    // que deje realizar los cambios

    const {logOut,isConnected} = useContext(AuthContext)
    const navigator= useNavigation()

    const data = props.route.params.dataUser
    const photos = data.avatar
    const initialDepartament=data.state

    const [cities, setCities] = useState()
    const [departaments, setDepartaments] = useState()
    const [eps,setEps]= useState()
    const [id_eps, setIdEps] = useState(data.company)
    const [id_departament, setIdDepartament] = useState(data.state)
    const [id_city, setIdCity] = useState(data.city)
    const [changePhoto, setCahngePhoto] = useState()
    const [type, setType] = useState()
    const [token,setToken]=useState()
    const [error, setError] = useState()
    const {last_name,first_name,profession,dni,dni_type,address,city,idCity,bank_account,bank,type_account,state,idState,movil,idCompany,company,onChange} = useForm({
        idState:id_departament,
        address:data.address,
        city:'',
        idCity:'',
        state:data.state_name,
        movil:data.movil,
        company:data.company_name,
        idCompany:id_eps,
        dni:data.dni,
        dni_type:data.dni_type,
        first_name:data.first_name,
        last_name:data.last_name,
        profession:data.profession,
        bank_account:data.bank_account,
        bank:data.bank,
        type_account:data.type_account,
    })
    const [ netInfo,setNetInfo]=useState(false)

    useEffect(() => {
        const unsubscribe = isConnected(setNetInfo)
        getToken()
        getDepartaments()
        getEps()
        if (idState){
            getCities()
        }
        navigator.setOptions({
            headerLeft:()=>(
                <TouchableOpacity
                    onPress={()=> navigator.replace('MyDataScreen',{dataUser:data})}
                >
                    <Icon
                        name="chevron-left"
                        color= {'white'}
                        size={24}
                    />
                </TouchableOpacity>
            ),
    
        })
        return()=>{
            unsubscribe
        }
    }, [idState])

    const getToken =async()=>{
        const userToken = await AsyncStorage.getItem('token')
        setToken(userToken)
    
    }
    const getDepartaments = async()=>{
        try {
          const res = await http('get',Endpoint.departaments)
          if(res.message==='token no válido'){
            logOut()
          }
          setDepartaments(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getEps = async()=>{
        try {
          const res = await http('get',Endpoint.eps)
          if(res.message==='token no válido'){
            logOut()
          }
          setEps(res)
        } catch (error) {
          console.log('error',error)
        }
    }
    const getCities = async(id)=>{
        console.log({idState})
        try {
          const res = await http('get',Endpoint.cities(idState))
          if(res.message==='token no válido'){
            logOut()
          }
          console.log('cities',res)
          setCities(res)
        } catch (error) {
          console.log('error',error)
        }
    }

    const saveDocuments = async(tipo)=>{
        if(tipo){

            let file;

            if(tipo === '1'){
                file= changePhoto
            }

            console.log('file',file)

            const form = new FormData();
                form.append('file',file);
                form.append('type',Number(tipo));
            
            console.log('form',form)

            try { 
                const res = await http('post',Endpoint.getDocumentPerson(data.identificacion), form ,'form-data')
                console.log('res',res)

            } catch (error) {
                console.log('error',error);
                if(tipo === '1'){
                    setCahngePhoto()
                }  
            }
        }
    }
    const saveData = async ()=>{

        const userStr = await AsyncStorage.getItem('user');
        const { id } = JSON.parse(userStr);
        const update={
            "dni":dni,
            "dni_type":String(dni_type),
            "first_name":first_name,
            "last_name":last_name,
            "address":address,
            "city":idCity,
            "state":idState,
            "movil":movil,
            "profession":String(profession),
            "company":String(idCompany),
            "bank":String(bank),
            "bank_account":bank_account,
            "type_account":String(type_account),
        }

        console.log(update)
        console.log(id)

        try {
            const resp = await http('put',Endpoint.editDataUser(id),update);
            if(resp.message ==='token no válido'){
                logOut()
              }
            saveDocuments(type)
            console.log('respuesta',resp)
            if(resp.errors){
                setError(resp.errors)
            }else{
                if(resp.success===false){
                    Alert.alert(
                        'Notificación',
                        'Ha ocurrido un error, no se puedo actualizar los datos',
                        [
                            { text: 'OK',
                            onPress: () => getUser(id)},
                        ]
                    )
                }else{
                    Alert.alert(
                        'Actualizando Datos',
                        'Se ha actualizado de forma exitosa',
                        [
                            { text: 'OK',
                            onPress: () => getUser(id)},
                        ]
                    )
                }
                
                
            }
        } catch (error) {
            console.error('error',error)
        }

    }

    const getUser = async(id)=>{
    
        try { 
          
          const res = await http('get',Endpoint.dataUser(id))
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
    const selectEps=(id,value)=>{
        console.log('valuee',value)
        onChange(id,'idCompany')
    }
    const selectDepartament=(id,value)=>{
        console.log('id',id)
        onChange(id,'idState')
    }
    const selectCity=(id,value)=>{
        console.log('valuee',value)
        onChange(id,'idCity')
    }

    const title=
    <View style={styles.cText}>
        <Text style={styles.title}>Cambiar foto</Text>
    </View>

  return (
    <>
        {
            (netInfo=== false)? <IsConnectedScreen/>:
            <ScrollView style={styles.container}>
        <View style={styles.cImageText}
        >
            <View style={styles.cPhoto}>
            {(changePhoto)?
                <Image
                source={{uri:changePhoto.uri}}
                style={styles.image}
                />
                :(photos)?
                <Image
                    source={{uri:photos}}
                    style={styles.image}
                />
                :
                <Image
                    style={styles.image}
                    source={require("../../../assets/images/avatarDefault.png")}
                />
                }
                
                
            </View>
            <WindowPhoto
                photo={setCahngePhoto}
                type={setType}
                number='1'
                text={title}
                />
            

        </View>
        
        <View style={styles.cTextInput}>
            <ListOptions
                label='Departamento:'
                options={departaments}
                itemSelect={selectDepartament}
                placeholder={state}
                isSelect={true}
            />
            {(error)?
                (error.state==='')?null:
                <Text style={styles.textValid}>{error.state}</Text>: null
            }
            <ListOptions
                label='Ciudad:'
                options={cities}
                itemSelect={selectCity}
                placeholder={city}
            />
            {(error)?
                (error.city==='')?null:
                <Text style={styles.textValid}>{error.city}</Text>: null
            }
            
            <TextInputs
                label='Direccion'
                placeholder="cra 48 # 31-54"
                onChangeText= {(value)=>onChangeText(value,'address')}
                value={address}
            />
            {(error)?
                (error.address==='')?null:
                <Text style={styles.textValid}>{error.address}</Text>: null
            }
            <TextInputs
                label='Celular'
                placeholder="3014567890"
                onChangeText= {(value)=>onChangeText(value,'movil')}
                value={movil}
            />
            {(error)?
                (error.movil==='')?null:
                <Text style={styles.textValid}>{error.movil}</Text>: null
            }
            <ListOptions
                label='Eps:'
                options={eps}
                itemSelect={selectEps}
                placeholder={company}
                isSelect={true}
            />
            {(error)?
                (error.company==='')?null:
                <Text style={styles.textValid}>{error.company}</Text>: null
            }
            <Button
                title="Guardar"
                onPress={()=> saveData()} 
                fill='solid'
            />
        </View>
            </ScrollView>
        }
    </>
    
  )
}
export default EditMyDataScreen
const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20
    },
    cTextInput:{
        marginHorizontal:5,
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
            height: 3
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
        width: 120,
        height: 120,
        borderRadius:100,
        borderWidth:4,
        borderColor:Colors.PRIMARY_COLOR,
        marginLeft:10,
        marginRight:10
    },
    cImageText:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'center'
    },
    cText:{
        marginLeft:20
    },
    tLabel:{
        color: Colors.GREY_LIGHT,
        fontSize: 15,
        fontFamily: Fonts.BOLD,
        marginBottom: 10.0,
    },
    text:{
        marginTop: 20,
        borderBottomWidth:2,
        borderBottomColor: '#CFD2CF',
        marginBottom:20,
        color: Colors.GREY_LIGHT,
        fontSize: 18,
        fontFamily: Fonts.REGULAR,
        padding: 0,
        margin: 0,
        marginTop: 3,
        marginBottom:10,
        paddingBottom:10
    },
    cData:{
        marginBottom:20
    },
    cPhoto:{
        alignItems:'center',
    },
    title:{
        fontFamily:Fonts.BOLD
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
