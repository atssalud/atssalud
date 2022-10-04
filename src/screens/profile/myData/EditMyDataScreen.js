import React,{useState,useEffect} from 'react'
import {View,Text,Image,TouchableOpacity,StyleSheet,Alert,ScrollView} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { InputText } from '../components/InputText';
import { useForm } from '../../../hooks/useForm';
import InputDate from '../../../components/InputDate';
import ListOptions from '../../../components/ListOptions';
import dataCities from '../../../services/Cities.json'
import http from '../../../services/http';
import { Endpoint } from '../../../constants/API';
import WindowPhoto from '../../../components/WindowPhoto';
import { Colors } from '../../../theme/Colors';
import { Fonts } from '../../../theme/Fonts';

const EditMyDataScreen = (props) => {

    // Cuando la ciudad_id venga null y la ciudad si venga se debe
    //colocar como obligatorio el campo de ciudad de nacimiento para
    // que deje realizar los cambios

    const data = props.route.params.data
    const photos = props.route.params.photo
    console.log('data3', data)
    const navigator= useNavigation()
    const [cities, setCities] = useState(dataCities)
    const [idCity, setIdCity] = useState(data.ciudad_id)
    const [city, setCity] = useState(data.ciudad)
    const [dateBirthday, setBirthday] = useState(data.birthday)
    const [changePhoto, setCahngePhoto] = useState()
    const [type, setType] = useState()
    const [expedicionDni, setExpedicionDni] = useState()
    const [idExpedicionDni, setIdExpedicionDni] = useState()
    
    const {nombres,apellidos,identificacion,direccion,celular,email,birthday,ciudad,ciudad_id,expedicion_id,expedicion,onChange} = useForm({
        nombres:data.nombres,
        apellidos:data.apellidos,
        identificacion:data.identificacion,
        direccion:data.direccion,
        celular:data.celular,
        email:data.email,
        birthday:dateBirthday,
        ciudad:city,
        ciudad_id:idCity,
        expedicion:expedicionDni,
        expedicion_id:idExpedicionDni
    })

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

    },[type,navigator,saveData,nombres,apellidos,direccion,celular,email,dateBirthday,idCity])

    

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

        const update={
            'direccion':direccion,
            'celular':celular,
            'email':email,
            'birthday':dateBirthday,
            'ciudad_id':idCity,
        }

        console.log(update)

        try {
            const res = await http('put',Endpoint.ownerDetails(data.identificacion),update);
            saveDocuments(type)
            console.log('respuesta',res)
            Alert.alert(
                'Actualizando Datos',
                'Se ha actualizado de forma exitosa',
                [
                    { text: 'OK',
                    onPress: () => navigator.replace('MyDataScreen',{item:data.identificacion,photo:(changePhoto)?changePhoto.uri:(photos)? photos:null})},
                ]
            )
        } catch (error) {
            console.error('error',error)
        }

    }

    const onChangeText=(value,text)=>{
        onChange(value,text)
    };

    const cityBirth=(key,value,key2,value2)=>{
        console.log(key,value,key2,value2)
        setCity(value)
        setIdCity(key)
    }
    const selectBirthday=(value)=>{
        console.log('valuee',value)
        setBirthday(value)
    }

    const title=
    <View style={styles.cText}>
        <Text style={styles.title}>Click Para Subir Tu</Text>
        <Text style={styles.title}>Foto</Text>
    </View>

    const lugarExpedicion=(key,value)=>{
        console.log(key,value)
        setExpedicionDni(value)
        setIdExpedicionDni(key)
    }

  return (

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
            <InputText
                title="Nombres"
                value={nombres}
                name='nombres'
                onChangeText={onChangeText}
                width='all'
            />
            <InputText
                title="Apellidos"
                value={apellidos}
                name='apellidos'
                onChangeText={onChangeText}
                width='all'
            />

            <View>
                <Text style={[styles.tLabel,{color:Colors.FONT_COLOR}]}>Lugar expedición Documento:</Text>
                <ListOptions
                options={cities}
                itemSelect={lugarExpedicion}
                id={'id'}
                value={'nombre'}
                text={expedicion_id}
            />
            </View>

            <View>
                <Text style={styles.tLabel}>Cédula:</Text>
                <Text style={styles.text}>{identificacion}</Text>
            </View>

            <InputText
                title="Dirección"
                value={direccion}
                name='direccion'
                onChangeText={onChangeText}
                width='all'
            />
            <InputText
                title="Celular"
                value={celular}
                name='celular'
                onChangeText={onChangeText}
                width='all'
            />
            <InputText
                title="Correo"
                value={email}
                name='email'
                onChangeText={onChangeText}
                width='all'
            />

            <View style={styles.cData}>
                <Text style={[styles.tLabel,{color:Colors.FONT_COLOR}]}>Fecha de nacimiento:</Text>
                <InputDate
                    text={birthday}
                    type={'date'}
                    dateSelect={selectBirthday}
                />
            </View>
            
            <View style={styles.cData}>
                <Text style={[styles.tLabel,{color:Colors.FONT_COLOR}]}>Ciudad de nacimiento:</Text>
                <ListOptions
                    options={cities}
                    itemSelect={cityBirth}
                    id={'id'}
                    value={'nombre'}
                    text={ciudad}
                />
            </View>
        </View>
    </ScrollView>
  )
}
export default EditMyDataScreen
const styles = StyleSheet.create({
    container:{
        marginHorizontal:10,
        marginVertical:10
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
        width: 100,
        height: 100,
        borderRadius:100,
        borderWidth:4,
        borderColor:Colors.PRIMARY_COLOR,
        marginLeft:10,
        marginRight:10
    },
    cImageText:{
        flexDirection:'row',
        alignItems: 'center',
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
    }
})
