import React,{useState,useEffect} from 'react'
import {View,Text,Image,TouchableOpacity,StyleSheet,Alert} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import http from '../../../services/http';
import { Endpoint } from '../../../environment/Api';
import LoadingScreen from '../../../screens/LoadingScreen'
import { Colors } from '../../../theme/Colors';
import { Fonts } from '../../../theme/Fonts';
import { Styles } from '../../../theme/GlobalStyle';
import Button from '../../../components/Button';

const MyDataScreen = (props) => {

    const navigator= useNavigation()
    const [data, setData] = useState(props.route.params.dataUser);
    console.log('data2', data)
    

    useEffect(() => {
        navigator.setOptions({
            headerLeft:()=>(
                <TouchableOpacity
                    onPress={()=>navigation('atras')}
                >
                    <Icon
                        name="chevron-left"
                        color= {'white'}
                        size={24}
                    />
                </TouchableOpacity>
            ),
    
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[navigator])

    const navigation = async(rute)=>{
        // if(rute === 'atras'){
        //     navigator.replace('Tabs', { screen: 'PerfilScreen' })}
        if (rute === 'atras'){navigator.navigate('PerfilScreen')}
        else{
        navigator.replace('EditMyDataScreen',{dataUser:data})}
    }
    if(data){
        var nombre=data.first_name.split(' ')
        // nombre=nombre[0][0].toUpperCase()+nombre[0].substring(1).toLowerCase()
        nombre=nombre.map(n=>n[0].toUpperCase()+n.substring(1).toLowerCase()+' ')
        nombre.join('')

        var apellido=data.last_name.split(' ')
        // apellido=apellido[0][0].toUpperCase()+apellido[0].substring(1).toLowerCase()
        apellido=apellido.map(n=>n[0].toUpperCase()+n.substring(1).toLowerCase()+' ')
        apellido.join('')
        
        
    }
  
   
    return (
      <>
        {(data)?
        <View style={styles.container}>
        <View style={styles.containerData}>
            <View style={styles.cImageText}>
            {(data.avatar)?
            <Image
            source={{uri:photo}}
            style={styles.image}
            />
            :
            <Image
                style={styles.image}
                source={require("../../../assets/images/avatarDefault.png")}
                />
                }
                
                <View style={styles.cText}>
                <Text style={styles.title}>{nombre} {apellido}</Text>
                <Text style={styles.title}>{data.profession_name}</Text>
                <View style={styles.state}>
                    <Text style={styles.subtitle}>Cédula: </Text>
                    <Text style={styles.title}>{data.dni}</Text>
                </View>
                </View>
            </View>
        </View>
        <View style={Styles.borderContainer}>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Departamento: </Text>
                <Text style={styles.textData}>{data.state_name}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Ciudad: </Text>
                <Text style={styles.textData}>{data.city_name}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Dirección: </Text>
                <Text style={styles.textData}>{data.address}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Celular: </Text>
                <Text style={styles.textData}>{data.phone}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Eps: </Text>
                <Text style={styles.textData}>{data.company_name}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Correo: </Text>
                <Text style={styles.textData}>{data.email}</Text>
            </View>
            <View style={styles.cData2}>
                <Text style={styles.textCampo}>Contraseña: </Text>
                <TouchableOpacity>
                    <Text style={styles.tcambiarContraseña}>Cambiar contraseña</Text>
                </TouchableOpacity>
            </View>
            <Button
                title="Editar"
                onPress={()=> navigation()} 
                fill='solid'
            />
        </View>
        </View>
        :<LoadingScreen/>
         } 
        </>
    )
}
export default MyDataScreen
const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20
    },
    containerData:{
        marginTop: 20,
        justifyContent:'center',
        alignItems:'center'
    },
    image:{
        width: 120,
        height: 120,
        borderRadius:100,
        borderWidth:4,
        borderColor:Colors.PRIMARY_COLOR,
        marginLeft:10
    },
    cImageText:{
        flexDirection:'row',
        alignItems: 'center',
        marginLeft:20
    },
    cText:{
        marginLeft:20
    },
    title:{
        color:Colors.BLUE_GREY,
        fontFamily:Fonts.BOLD,
        fontSize:17,
    },
    subtitle:{
        color:Colors.BLUE_GREY,
        fontFamily:Fonts.REGULAR,
        fontSize:17
    },
    state:{
        flexDirection:'row',
        alignItems: 'center'
    },
    imageVerified:{
        width:15,
        height:15,
        top:1,
    },
    cStar:{
        flexDirection:'row',
    },
    star:{
        paddingRight:5
    },
    btnHeader:{
        paddingHorizontal:5,
        paddingVertical:3,
        borderWidth:1,
        borderColor: 'white',
        borderRadius:3,
        
    },
    textHeader:{
        color:'white',
        fontSize:14,
        fontFamily:Fonts.REGULAR
    },
    cData:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor: '#CFD2CF',
        paddingVertical:20
    },
    cData2:{
        flexDirection:'row',
        paddingVertical:20
    },
    textData:{
        color:Colors.BLUE_GREY,
        fontFamily:Fonts.SEMIBOLD,
        fontSize:15
    },
    textCampo:{
        color:Colors.BLUE_GREY,
        fontFamily:Fonts.BOLD,
        fontSize:16
    },
    tcambiarContraseña:{
        fontFamily:Fonts.REGULAR,
        fontSize:16,
        color:Colors.PRIMARY_COLOR,
        marginTop:1
    }
})
