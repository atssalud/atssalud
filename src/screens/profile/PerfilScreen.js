import React,{useContext, useEffect,useState} from 'react'
import {View,Text,Image,TouchableOpacity,StyleSheet,Alert} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonImage } from '../../components/ButtonImage';
import { useNavigation } from '@react-navigation/native';
import http from '../../services/http';
import { Endpoint } from '../../environment/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { AuthContext } from '../../context/AuthContext';
import WindowAlert from '../../components/WindowAlert';
import LoadingScreen from '../LoadingScreen'
import FailedService from '../catchment/FailedService';



const PerfilScreen = () => {
  
  const navigator= useNavigation()
  const {logOut} = useContext(AuthContext)
  const [alert,setAlert]= useState(false)

  const [dataUser,setDataUser] = useState();
  const [token,setToken]=useState()
  const [failed,setFailed]=useState(false)
  

  useEffect(()=> {
    getToken()
    
  }, [])
  
  const getToken =async()=>{
    const userToken = await AsyncStorage.getItem('token');
    
    setToken(userToken)
    getUser()

  }

  const getUser = async()=>{
    const userStr = await AsyncStorage.getItem('user');
    const { id } = JSON.parse(userStr);
    try { 
      const res = await http('post',Endpoint.dataUser,{"user_id":id})
      if(res.message==='token no válido'){
        logOut()
      }
      console.log('resp',res)
      setDataUser(res.data)
      
    } catch (error) {
        console.log('error',error);
        setFailed(true)
    }
  }

  const contentAlert=
    <View style={styles.cAlert}>
        <Icon
          name='sign-out'
          color={Colors.PRIMARY_COLOR}
          size={60}
        />
        <Text style={styles.titleAlert}>Cerrar sesión</Text>
        <View style={styles.ctextAlert}>
            <Text style={styles.textAlert}>¿Estas seguro que deseas salir?</Text>
            <Text style={styles.textAlert}>Se borraran los datos de sesión.</Text>
        </View>
    </View>
  
  const close =async()=>{
    
    try {
      const data={
        'token':token
      }
      const resp = await http('post',Endpoint.logout,data)
      console.log(resp)
      if(resp.message==='token no válido'){
        logOut()
      }
      if(resp.success === true){
        logOut()
      }
    } catch (error) {
      console.log('error',error)
    }
    
  }

  // if(dataUser){
  //   var nombres=dataUser.person.nombres.split(' ')
  //   // nombre=nombre[0][0].toUpperCase()+nombre[0].substring(1).toLowerCase()
  //   nombres=nombres.map(n=>n[0].toUpperCase()+n.substring(1).toLowerCase()+' ')
  //   nombres.join('')

  //   var apellidos=dataUser.person.apellidos.split(' ')
  //   // apellido=apellido[0][0].toUpperCase()+apellido[0].substring(1).toLowerCase()
  //   apellidos=apellidos.map(n=>n[0].toUpperCase()+n.substring(1).toLowerCase()+' ')
  //   apellidos.join('')   
  // }
 
  return (
    
  <>
    {
      (dataUser)?
      <View  style={styles.container}>
        <View>
          <View style={styles.containerData}>
            <View style={styles.cImageText}>
              {(dataUser.avatar)?
              <Image
              source={{uri:dataUser.avatar}}
              style={styles.image}
              />
              :
              <Image
              style={styles.image}
              source={require("../../assets/images/avatarDefault.png")}
              />
              }
              
              <View style={styles.cText}>
                <Text style={styles.title}>{dataUser.first_name} {dataUser.last_name}</Text>
                <View style={styles.state}>
                  <Text style={styles.subtitle}>Estado: </Text>
                  { (dataUser.status === '1')?
                    <View style={styles.state}>
                      <Text style={[styles.subtitle2]}>Verificado </Text>
                      <Image
                      style={styles.imageVerified}
                      source={require("../../assets/icons/verificado.png")}
                      />
                    </View>
                    :
                    <View style={styles.state}>
                      <Text style={styles.subtitle2}> No Verificado </Text>
                      <Image
                      style={styles.imageVerified}
                      source={require("../../assets/icons/noVerificado.png")}
                      />
                    </View>
                  }
                </View>
              </View>
            </View>
            <View style={styles.cBtnData}>
              <TouchableOpacity
                style={styles.btnData}
                onPress={()=> Alert.alert('Próximamente!','Próximamente estará habilitada esta opción')}
              >
                <Icon
                  name='credit-card'
                  color={Colors.BLUE}
                  size={19}
                />
                <Text style={styles.tBtnData}>Pagos  </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnData}
                onPress={()=> Alert.alert('Próximamente!','Próximamente estará habilitada esta opción')}
              >
                <Icon
                  name='phone'
                  color={Colors.BLUE}
                  size={19}
                />
                <Text style={styles.tBtnData}>Soporte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.cBtn}>
          <ButtonImage
            nameImage='user'
            text='Mis datos'
            size={30}
            btnFunction={()=>navigator.navigate('MyDataScreen',{dataUser:dataUser})}
          />
          <ButtonImage
            nameImage='credit-card-alt'
            text='Datos bancarios'
            size={25}
            btnFunction={()=>navigator.navigate('BankDataScreen',{dataUser:dataUser})}
          />
          <ButtonImage
            nameImage='file-text-o'
            text='Historial'
            size={30}
            btnFunction={()=>navigator.navigate('ListHistoryRiskUserScreen',{token:token})}
          />
        </View>
        <View style={styles.cBtnSalir}>

          <TouchableOpacity
            style={styles.btnSalir}
            onPress={()=> setAlert(true)}
          >
            <Text style={styles.tBtnSiguiente}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
      :(failed)?<FailedService/>:
      <LoadingScreen />
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
          btnClose='yes'
          />
      : null
    }
  </>


  
)
}

export default PerfilScreen

const styles = StyleSheet.create({
  container:{
    marginHorizontal:30,
    flex:1
  },
  containerData:{
    marginTop: 20,
  },
  image:{
    width: 126,
    height: 126,
    borderRadius:100,
    borderWidth:4,
    borderColor:Colors.PRIMARY_COLOR,
    marginLeft:10
  },
  cImageText:{
    flexDirection:'row',
    alignItems: 'center',
  },
  cText:{
    marginLeft:20
  },
  title:{
    color:Colors.BLUE_GREY,
    fontSize:16,
    fontFamily:Fonts.REGULAR
  },
  subtitle:{
    color:Colors.BLUE_GREY,
    fontSize:18,
    fontFamily:Fonts.REGULAR
  },
  subtitle2:{
    color:Colors.BLUE_GREY,
    fontSize:18,
    fontFamily:Fonts.BOLD
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
  cBtnData:{
    flexDirection:'row',
    marginTop:30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom:40
  },
  btnData:{
    backgroundColor:Colors.GREY,
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:5,
    flexDirection:'row',
  },
  btnDataPagar:{
    borderColor:Colors.PRIMARY_COLOR,
    borderWidth:1,
    paddingHorizontal:10,
    paddingVertical:4,
    borderRadius:5,
    flexDirection:'row',
  },
  tBtnData:{
    marginLeft:10,
    color:Colors.BLUE,
    fontFamily:Fonts.BOLD
  },
  tBtnDataPagar:{
    marginLeft:10,
    color:Colors.PRIMARY_COLOR,
    fontFamily:Fonts.REGULAR
  },
  cBtnSalir:{
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
  },
  btnSalir:{
    width:200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12.0,
    paddingVertical: 15.0,
    backgroundColor: Colors.PRIMARY_COLOR,
    elevation: 2,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: {
        width: 0,
        height: 3
    },
    shadowRadius: 6.0,
    shadowOpacity: 4.0,
  },
  cBtn:{
    marginTop:10,
  },
  tBtnSiguiente:{
    color:'white',
    fontSize:17,
    fontFamily:Fonts.BOLD
  },
  textAlert:{
    color:Colors.FONT_COLOR,
    fontFamily:Fonts.REGULAR
},
ctextAlert:{
    marginTop:10,
    alignItems: 'center'
},
imageAlert:{
  width:60,
  height:60,
  bottom:20,
  marginTop:15
},
cAlert:{
  justifyContent: 'center',
  alignItems: 'center',
  marginTop:-20
},
titleAlert:{
  color:Colors.FONT_COLOR,
  fontSize:16,
  fontFamily:Fonts.BOLD
}


})