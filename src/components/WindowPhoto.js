import React,{useState} from 'react'
import {View, Text,TouchableOpacity,StyleSheet,Modal,SafeAreaView,Dimensions } from 'react-native'
import { galeriaFoto, tomarFoto } from '../services/Photo';
import { Colors } from '../theme/Colors';
import { Fonts } from '../theme/Fonts';

const WindowPhoto = (props) => {
    const WIDTH= Dimensions.get('window').width
    const HEIGHT=Dimensions.get('window').height

    

    const [chooseData, setChooseData] = useState((props.text)?props.text:'subir')
    const [isModalVisible, setIsModalVisible] = useState(false)
    
    const changeModalVisibility = (bool)=>{
        setIsModalVisible(bool)
        
    }

    const openCamera =()=>{
        console.log('prueba')
        tomarFoto(props.photo, props.type,props.number)
        changeModalVisibility(false)
    }
    const openGalery =()=>{
        console.log('prueba')
        galeriaFoto(props.photo)
        changeModalVisibility(false)
    }
   


  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity
            onPress={()=>changeModalVisibility(true)}
        >
            <Text style={(props.text)?null:styles.text}>{chooseData}</Text>
        </TouchableOpacity>
        <Modal
            transparent={true}
            animationType='fade'
            visible = {isModalVisible}
            nRequestClose={()=> changeModalVisibility(false)}
        >
            <TouchableOpacity
            style={styles.container2}
            activeOpacity={1.0}
             >
            <View style={[styles.modal, {width:WIDTH -20, height:HEIGHT/3}]}>
                <View style={styles.cTitle}>
                    <Text style={styles.title}>Añade una nueva foto</Text>
                </View>
                <TouchableOpacity
                    onPress={openCamera}
                    style={styles.option}
                >
                    <Text style={styles.tOption}>Usar la cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={openGalery}
                    style={styles.option}
                >
                    <Text style={styles.tOption}>Escoger de la galerÍa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={()=>changeModalVisibility(false)}
                    style={styles.close}
                >
                    <Text style={styles.tClose}>CANCELAR</Text>
                </TouchableOpacity>
                
            </View>
    </TouchableOpacity>
        </Modal>
    </SafeAreaView>
  )
}
export default WindowPhoto

const styles = StyleSheet.create({
    close:{
        position:'absolute',
        // left:0,
        bottom:50,
        right:30,
        // top:0,
        zIndex:10
    },
    container2: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        
    },
    modal:{
        backgroundColor:'white',
        borderRadius:10,
        elevation: 3,
        paddingHorizontal:20,
        paddingVertical:20
    },
    option:{
       marginTop:20
    },
    title:{
        fontSize:20,
        fontFamily:Fonts.BOLD
    },
    tOption:{
        fontSize:18,
        fontFamily:Fonts.REGULAR
    },
    tClose:{
        fontSize:15,
        color:'blue'
    },
    text:{
        fontFamily:Fonts.REGULAR,
        color:Colors.DARK_BLUE,
        borderBottomWidth:1,
        borderBottomColor:Colors.DARK_BLUE
    }
  });