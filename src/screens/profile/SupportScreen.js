import React,{useEffect,useState} from 'react'
import {View,Text,Image,TouchableOpacity,StyleSheet,TextInput} from 'react-native'
import { colores } from '../../theme/appTheme'
import http from '../../services/http';
import { Endpoint } from '../../constants/Api';
import { useForm } from '../../hooks/useForm';
import ListOptions from '../../components/ListOptions';
import WindowAlert from '../../components/WindowAlert';

export const SupportScreen = () => {

    const [type, setType]= useState('Petición')
    const [typeId, setTypeId]= useState('1')
    const [company, setCompany]= useState()
    const [companies, setCompanies]= useState()
    const [alert,setAlert]= useState(false)
    const [errorAlert,setErrorAlert]= useState(false)


    const solicitud=[{"id":"1", "type":"Petición"},{"id":"2", "type":"Queja"},{"id":"3", "type":"Reclamo"}]

    const {description, onChange} = useForm({
        description:'',
    })

    useEffect(() => {
        listCompanies()
    }, [])

    
    const onChangeText=(value,text)=>{
        onChange(value,text)
    };
    const selectType=(id,value)=>{
        console.log('valuee',value)
        setTypeId(id)
    }
    const selectCompany=(id,value)=>{
        console.log('valuee',value)
        setCompany(id)
    }

    const listCompanies= async()=>{
        let arrayCompanies=[]
        try {
            const list = await http('get',Endpoint.listcompanies)
            console.log('companies',list)
            list.map(item=>{
                let company ={'instancia':item.instancia,'instancia_id':item.instancia_id}
                arrayCompanies.push(company)
            })
            console.log('array',arrayCompanies)
            setCompanies(arrayCompanies)
        } catch (error) {
        }
    }

    const send = async ()=>{
        console.log('send',typeId,company,description)
        if (typeId && company && description){
            const data={
                "descripcion":description,
                "tipo_pqrs_id":typeId,
                "instancia_id":company
            }
            
            try {
                const res = await http('post', Endpoint.pqrs, data)
                console.log('pqrs',res)
                setAlert(true)
            } catch (error) {
                console.log('error',error)
                setErrorAlert(true)
            }
            
        }else{
            console.log('error')
            setErrorAlert(true)
        }
    }

    const close=()=>{
        console.log('hola')
    }

    const contentErrorAlert=
        <View style={styles.cAlert}>
            <Image
                source={require('../../assets/icons/modal-alert-Icon.png')}
                style={styles.imageAlert}
            />
            <Text style={styles.title}>Notificación</Text>
            <Text style={styles.textAlertError}>Por favor completa los campos.</Text>
        </View>

    const contentAlert=
    <View style={styles.cAlert}>
        <Image
            source={require('../../assets/icons/checkCircle.png')}
            style={styles.imageAlert}
        />
        <Text style={styles.title}>Notificación</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>Tu solicitud ha sido enviada</Text>
            <Text style={styles.textAlert}>satisfactoriamente.</Text>
        </View>
    </View>

  return (
    <View style={styles.container}>
        <View>
            <View style={styles.cpImageText}>
                <View style={styles.cImageText}>
                    <Image
                        source={require('../../assets/images/girl-callcenter.png')}
                        style={styles.image}
                    />
                    <View>
                        <Text style={styles.title}>Hola,David</Text>
                        <Text>Bienvenido al soporte GOCARGO</Text>
                    </View>
                </View>
            </View>
            <View style={styles.cData}>
                <Text style={styles.text}>Escoge el tipo de caso</Text>
                <ListOptions
                    options={solicitud}
                    itemSelect={selectType}
                    id={'id'}
                    value={'type'}
                    text={type}
                    name='cuenta'
                />
            </View>
            <View style={styles.cData}>
                <Text style={styles.text}>A qué empresa va dirigida</Text>
                <ListOptions
                    options={companies}
                    itemSelect={selectCompany}
                    id={'instancia_id'}
                    value={'instancia'}
                    name='cuenta'
                />
            </View>
            <View style={styles.cData}>
                <Text style={styles.text}>Describa su motivo:</Text>
                <TextInput
                        selectionColor="#CACFD2"
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText= { (text) => onChangeText(text,'description') }
                        value={description}
                        style={styles.textBox}
                        multiline={true}
                    />
            </View>
        </View>
        <View style={styles.cbtn}>
            <TouchableOpacity
                style={styles.btnEnviar}
                onPress={() => send()}
            >
                <Text style={styles.btnText}> Enviar</Text>
            </TouchableOpacity>
        </View>
        {
            (errorAlert) ?
                <WindowAlert
                bool={true}
                closeAlert={setErrorAlert}
                content={contentErrorAlert}
                width={50}
                height={3}
                btnText={'Aceptar'}
                btnFunction={close}
                />
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
                />
            : null
        }

    </View>
  )
}
const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20,
        flex:1,
    },
    cData:{
        marginBottom:20
    },
    cpImageText:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:30
    },
    cImageText:{
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:1,
        borderRadius:5,
        borderColor:'#CFD2CF',
        paddingVertical:10,
        width:'90%',
    },
    image:{
        width:60,
        height: 60,
        borderRadius:100,
        marginRight:10
    },
    title:{
        fontWeight:'bold',
        color:'black'
    },
    textBox:{
        borderWidth:1,
        borderColor:'#CFD2CF',
        width:'100%',
        height:80,
        borderRadius:5,
        marginTop:10
    },
    cbtn:{
        flex:1,
        alignItems: 'center'
        
    },
    btnEnviar:{
        top:'80%',
        backgroundColor:colores.primary,
        alignItems: 'center',
        width:'100%',
        borderRadius:5
    },
    btnText:{
        marginVertical:10,
        color:'white',
        fontSize:16
    },
    text:{
        color:'black',
    },
    imageAlert:{
        width:60,
        height:60,
        bottom:20,
        marginTop:15
    },
    cAlert:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAlertError:{
        color:'black',
        marginTop:10,
        marginBottom:20
    },
    textAlert:{
        color:'black',
    },
    ctextAlert:{
        marginTop:10,
        alignItems: 'center'
    }
})
