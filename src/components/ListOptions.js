import React,{useState} from 'react'
import {View, Text,ScrollView,TouchableOpacity,Modal,SafeAreaView,StyleSheet, Dimensions } from 'react-native'
import { Colors } from '../theme/Colors'
import { Fonts } from '../theme/Fonts'
import {ModalPicker} from './ModalPicker'
import Icon from 'react-native-vector-icons/FontAwesome';

const ListOptions = (props) => {
    const text=props.text
    const line=(props.line)?props.line:'grey'
    const placeholder = props.placeholder
    const dimension=props.dimension


    const [chooseData, setChooseData] = useState((placeholder) ? placeholder: 'Seleccionar')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isSelect, setIsSelect] = useState((props.isSelect)?props.isSelect:false)

    const changeModalVisibility = (bool)=>{
        setIsModalVisible(bool)
        
    }

    const setData = (key,value)=>{
        setChooseData(value)
        props.itemSelect(key,value)
        setIsSelect(true)
    }

  return (
    <SafeAreaView style={[(line==='grey')?styles.line:styles.line2,(dimension ==='middle')?styles.dimension:null]}>
        {   (props.label)?
            <Text style={styles.label}>{props.label}</Text>
            :null
        }
        <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={()=>changeModalVisibility(true)}
        >
            <Text style={(!isSelect) ? styles.text : styles.text2}>{chooseData}</Text>
            <Icon
            name='chevron-down'
            color={Colors.GREY}
            size={20}
            style={{marginRight:10}}
          />
        </TouchableOpacity>
        <Modal
            transparent={true}
            animationType='fade'
            visible = {isModalVisible}
            nRequestClose={()=> changeModalVisibility(false)}
        >
            <ModalPicker
                changeModalVisibility={changeModalVisibility}
                setData ={setData}
                options={props.options}
            />
        </Modal>
    </SafeAreaView>
  )
}

export default ListOptions

const Width= Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
      borderBottomWidth:2,
      borderBottomColor:Colors.BLUE_GREY,
      marginTop:5,
      marginBottom:10
    },
    container2: {
        borderBottomWidth:2,
        borderBottomColor:"#CFD2CF",
        marginTop:5,
        marginBottom:10

      },
    text: {
        fontSize: 16,
        fontFamily:Fonts.REGULAR,
        color:Colors.GREY_LIGHT,
        paddingBottom:15,
        flex:1
    },
    text2:{
        fontSize: 16,
        paddingBottom:15,
        fontFamily:Fonts.REGULAR,
        color:Colors.FONT_COLOR,
        flex:1
        
    },
    touchableOpacity:{
        justifyContent:'space-between',
        flexDirection:'row'
    },
    label:{
        fontFamily:Fonts.BOLD,
        fontSize:15,
        color:Colors.FONT_COLOR,
        marginBottom:10
    },
    line:{
        borderBottomWidth:2,
        marginBottom:15,
        borderColor:Colors.GREY_LIGHT
      },
      line2:{
        borderBottomWidth:2,
        marginBottom:15,
        borderColor:Colors.BLUE_GREY
      },
      dimension:{
        width:Width/3,
        marginRight:40
      }
  });