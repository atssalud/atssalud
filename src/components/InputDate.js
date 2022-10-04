import React,{useState} from 'react'
import {Text,Platform,TouchableOpacity,SafeAreaView,StyleSheet, View} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../theme/Colors';
import { Fonts } from '../theme/Fonts';

const InputDate = (props) => {
    const typeSelect=props.typeSelect
    const [date, setDate] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [text, setText] = useState((props.text) ? props.text : 'Seleccionar')
    const [textData, setTextData] = useState()
    const [textTime, setTextTime] = useState('Seleccionar')

    const onChange = (event, selectDate)=>{
        const currentDate = selectDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate)
        let fDate = tempDate.getFullYear()+'/'+ (tempDate.getMonth()+1) + '/' + tempDate.getDate()
        let fTime = tempDate.getHours() + ':' + tempDate.getMinutes()
        setTextData(fDate)
        setTextTime(fTime)
        if(props.type === 'date'){
            props.dateSelect(fDate,typeSelect)
        }else{
            props.timeSelect(fTime)
        }
        
    }

    const showMode =(currentMode)=>{
        setShow(true);
        setMode(currentMode)
    }
  return (
      <>
        <SafeAreaView style={[styles.dateContainer,{borderBottomColor:(props.error)?Colors.PRIMARY_COLOR:Colors.BLUE_GREY},]}>
            {(props.type === 'date') ?
            
            <TouchableOpacity
            onPress={()=> showMode('date')}
            style={styles.buttonDate}
            >
            <View style={styles.ctext}>
                <Text style={(!textData) ? styles.dateText : styles.dateText2}>{(textData)?textData:text}</Text>
                {/* <Icon
                name='chevron-down-outline'
                color={Colors.PRIMARY_COLOR}
                size={25}
                /> */}
            </View>
            </TouchableOpacity>
            :
            <TouchableOpacity
            onPress={()=> showMode('time')}
            style={styles.buttonDate}
            >
            
            <Text style={styles.dateText}>{textTime}</Text>
            </TouchableOpacity>
            }
        </SafeAreaView>

        
        {show && (
        <DateTimePicker
            testID='dateTimePicker'
            value={date}
            mode={mode}
            display='spinner'
            onChange={onChange}
        />
        )}

        </>
    )
}

export default  InputDate;

const styles = StyleSheet.create({

    dateContainer:{
        borderBottomWidth:2,
        marginLeft:4
    },
    buttonDate:{
        alignSelf:'stretch',
    },
    dateText:{
        fontSize: 18,
        marginVertical:10,
        fontFamily:Fonts.REGULAR,
        color:Colors.GREY_PLACEHOLDER
    },
    dateText2:{
        fontSize: 18,
        marginVertical:10,
        fontFamily:Fonts.REGULAR,
        color:Colors.BLUE_GREY
    },

});
