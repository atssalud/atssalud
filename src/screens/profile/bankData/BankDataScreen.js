import React,{useEffect,useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import http from '../../../services/http';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Endpoint } from '../../../constants/API';
import LoadingScreen from '../../../screens/LoadingScreen'
import { Colors } from '../../../theme/Colors';
import { Fonts } from '../../../theme/Fonts';
import { Styles } from '../../../theme/GlobalStyle';
import Button from '../../../components/Button';

const BankDataScreen = (props) => {
    const navigator = useNavigation();
    
    const [data, setData] = useState(props.route.params.dataUser);
    
    
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
    },[navigator]);

    const navigation = async(rute)=>{
        if (rute === 'atras'){navigator.navigate('PerfilScreen')}
        else{
            navigator.navigate('EditbankDataScreen',{dataUser:data})}
    }

  return (
      <>
      {(data)?
      <View style={styles.container}>
        <View style={Styles.borderContainer}>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Número de cuenta: </Text>
                <Text style={styles.textData}>{(data.bank_account)? data.bank_account: 'No registrado'}</Text>
            </View>
            <View style={styles.cData}>
                <Text style={styles.textCampo}>Tipo de cuneta: </Text>
                <Text style={styles.textData}>{(data.type_account_name) ? data.type_account_name :'No registrado'}</Text>
            </View>
            <View style={styles.cData2}>
                <Text style={styles.textCampo}>Banco: </Text>
                <Text style={styles.textData}>{(data.bank_name)? data.bank_name: 'No registrado'}</Text>
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
export default BankDataScreen
const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20
    },
    cData:{
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor: '#CFD2CF',
        paddingVertical:20
    },
    cData2:{
        flexDirection:'row',
        paddingVertical:20,
        marginBottom:20
    },
    textData:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.REGULAR,
        fontSize:15
    },
    textCampo:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.BOLD,
        fontSize:16
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
})
