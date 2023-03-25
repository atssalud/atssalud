import React,{useState} from 'react'
import {Text,Platform,TouchableOpacity,SafeAreaView,StyleSheet, View, Dimensions} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../theme/Colors';
import { Fonts } from '../theme/Fonts';
import Icon from 'react-native-vector-icons/FontAwesome';

const InputDate = (props) => {
    const typeSelect=props.typeSelect
    const [date, setDate] = useState(new Date())
    const [mode, setMode] = useState('date')
    const [show, setShow] = useState(false)
    const [text, setText] = useState((props.text) ? props.text : 'Seleccionar')
    const [textData, setTextData] = useState()
    const [textTime, setTextTime] = useState('Seleccionar')
    const dimension=props.dimension

    const months=[{'id':'01', 'item':'Enero'},{'id':'02', 'item':'Febrero'},{'id':'03', 'item':'Marzo'},{'id':'04', 'item':'Abril'},
                  {'id':'05', 'item':'Mayo'},{'id':'06', 'item':'Junio'},{'id':'07', 'item':'Julio'},{'id':'08', 'item':'Agosto'},
                  {'id':'09', 'item':'Septiembre'},{'id':'10', 'item':'Octubre'},{'id':'11', 'item':'Noviembre'},{'id':'12', 'item':'Diciembre'}]

    const onChange = (event, selectDate)=>{
        const currentDate = selectDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate)
        let fDate = tempDate.getFullYear()+'-'+ (tempDate.getMonth()+1) + '-' + tempDate.getDate()
        let fTime = tempDate.getHours() + ':' + tempDate.getMinutes()

        const data=fDate.split('-')
        let month=months[data[1]-1].item
        let year =data[0]
        let monthYear=`${month}-${year}`

        var completeData=fDate.split('-')
        completeData=completeData.map((n,index)=>(index===1 || index===2)?(n<10)?`0${n}`:n:n)

        if(props.monthYear){
            setTextData(monthYear)
        }else{
            setTextData(completeData.join('-'))
        }

        
        setTextTime(fTime)
        if(props.type === 'date'){
            var date=fDate.split('-')
            
            props.dateSelect(completeData.join('-'),typeSelect,monthYear)
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
        <SafeAreaView style={[(dimension ==='middle')?styles.dimension:{width:'80%'}]}>
            {(props.type === 'date') ?

            <View>
                {   (props.label)?
                    <Text style={styles.label}>{props.label}</Text>
                    :null
                }

                <TouchableOpacity
                onPress={()=> showMode('date')}
                style={styles.buttonDate}
                >
                
                    <Text style={(!textData) ? (text !== 'Seleccionar')?styles.dateText2 :styles.dateText : styles.dateText2}>{(textData)?textData:text}</Text>
                    <Icon
                        name='chevron-down'
                        color={Colors.GREY}
                        size={20}
                        style={{marginRight:10,marginTop:12}}
                    />
                
                </TouchableOpacity>
            </View>
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

const Width= Dimensions.get('window').width

const styles = StyleSheet.create({

    
    buttonDate:{
        justifyContent:'space-between',
        borderBottomWidth:2,
        borderBottomColor:Colors.GREY_LIGHT,
        flexDirection:'row',
        marginBottom:15
    },
    dateText:{
        fontSize: 16,
        marginVertical:12,
        fontFamily:Fonts.REGULAR,
        color:Colors.GREY_PLACEHOLDER,
        marginBottom:15
    },
    dateText2:{
        fontSize: 16,
        marginVertical:12,
        fontFamily:Fonts.REGULAR,
        color:Colors.BLUE_GREY,
        marginBottom:15
    },
    dimension:{
        width:Width/2,
        marginRight:40
    },
    label:{
        fontFamily:Fonts.BOLD,
        fontSize:15,
        color:Colors.FONT_COLOR,
    },

});
