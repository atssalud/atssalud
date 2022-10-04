import React,{useState,useEffect} from 'react'
import {View, Text,ScrollView,TouchableOpacity,Dimensions,TextInput,StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import API,{ Endpoint } from '../environment/Api';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import http from '../services/http';
import { Fonts } from '../theme/Fonts';
import { Styles } from '../theme/GlobalStyle';


const WIDTH= Dimensions.get('window').width
const HEIGHT=Dimensions.get('window').height


const ModalPicker = (props) => {

    const nameList= props.name
    const [textValue,setTextValue] = useState('')
    const [listOption,setListOption] = useState(props.options)
    const [itemToRender,setItemToRender]= useState(20)

    console.log('listOption',listOption)
    const debouncedValue = useDebouncedValue(textValue)

    useEffect(() => {
      console.log({debouncedValue})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue])
    

    // const listOption=props.options
    const id = props.id
    const values= props.value
    const typeVehicle = props.type

    const onPressItem= (key,value)=>{
        props.changeModalVisibility(false)
        props.setData(String(key),value)
    }

    const option = listOption.map((item,index)=>{
        let value = item.item
        let key = item.id

        return (
            <TouchableOpacity
                style={styles.option}
                key={item.id}
                onPress={()=> onPressItem(key,value)}
            >
                <Text style={styles.text}>{value}</Text>
            </TouchableOpacity>
        )
    })
  return (
    <TouchableOpacity
        onPress={()=>props.changeModalVisibility(false)}
        style={styles.container}
    >
        <View style={[Styles.borderContainer, {width:WIDTH -50, height:(nameList)?HEIGHT/2.5:HEIGHT/1.5}]}>
            <ScrollView>
                {option}
            </ScrollView>
            
        </View>   
           
    </TouchableOpacity>
  )
}
export {ModalPicker}

const styles = StyleSheet.create({
    container: {
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      
    },
    text: {
        fontSize: 15,
        opacity:0.7,
        color:'black',
        paddingVertical:10,
        fontFamily:Fonts.REGULAR
    },
    option:{
        alignItems:'flex-start',
        borderBottomWidth:1,
        borderBottomColor:"#CACFD2",
        marginLeft:25,
        marginRight:25,
        paddingVertical:-10,
        
        
    },
    textInput:{
        flex:1,
        fontSize:16,
    },
    cTextInput:{
        backgroundColor:'#F3F1F3',
        height:40,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
    }
  });