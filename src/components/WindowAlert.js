import React,{useState,useEffect} from 'react'
import {View, Text,TouchableOpacity,StyleSheet,Modal,SafeAreaView,Dimensions,} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Fonts } from '../theme/Fonts';
import { Colors } from '../theme/Colors';



const WindowAlert = (props) => {
    const WIDTH= Dimensions.get('window').width
    const HEIGHT=Dimensions.get('window').height
    
    console.log('prueba imagen',props.content)
    useEffect(() => {
        console.log('image',image)
    })


    var image= props.image
    const width= WIDTH -props.width
    const height= HEIGHT/props.height

    const [isModalVisible, setIsModalVisible] = useState(props.bool)
    
    const changeModalVisibility = (bool)=>{
        setIsModalVisible(bool)
        props.closeAlert(false)
        props.btnFunction()
    }


  return (
    <SafeAreaView style={styles.container}>
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
            <View style={[styles.modal, {width:width, height:height}]}>
                
                {
                    (props.btnClose === 'yes')?
                    <View style={styles.btnClose}>
                        <TouchableOpacity
                            onPress={()=>(props.turn === 'yes')?changeModalVisibility(false):props.closeAlert(false)}
                        >
                            <Icon
                                name="times"
                                size={30}
                                color={'grey'}
                            />
                        </TouchableOpacity>
                    </View>:null
                }
                {props.content}
                {
                    (props.messageError)?
                    <View style={styles.cTextAlert}>
                        <Text style={styles.textAlert}>{props.messageError}</Text>
                    </View>
                    :null
                }

                <View style={styles.cBtnAlert}>
                    <TouchableOpacity
                        onPress={()=>changeModalVisibility(false)}
                        style={(props.color === 'primary') ? styles.btnPrimary : (props.type === 'fill') ? null: styles.btnAlert}
                    >
                        <Text style={(props.type === 'fill')?styles.btnTextFill:styles.btnText}>{props.btnText}</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
    </TouchableOpacity>
        </Modal>
    </SafeAreaView>
  )
}
export default WindowAlert

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
        fontWeight:'bold',
    },
    tOption:{
        fontSize:18
    },
    btnClose:{
        alignItems:'flex-end',
    },
    cBtnAlert:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:20,
    },
    btnAlert:{
        backgroundColor:'green',
        paddingVertical:10,
        paddingHorizontal:20,
        borderRadius:5
    },
    btnPrimary:{
        paddingVertical:10,
        paddingHorizontal:20,
        borderRadius:5
    },
    btnText:{
        color:'white',
        fontSize:16,
        fontFamily:Fonts.BOLD
    },
    btnTextFill:{
        color:Colors.PRIMARY_COLOR,
        fontSize:16,
        fontFamily:Fonts.BOLD
    },
    cTextAlert:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:20,
        marginBottom:20
    },
    textAlert:{
        color:Colors.FONT_COLOR,
        fontFamily:Fonts.REGULAR,
        fontSize:16
        
    },
  });