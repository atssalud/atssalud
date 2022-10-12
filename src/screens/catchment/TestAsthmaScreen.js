import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CheckBox from '../../components/CheckBox';
import { Styles } from '../../theme/GlobalStyle';
import {Fonts} from '../../theme/Fonts'
import { Colors } from '../../theme/Colors';
import Button from '../../components/Button';

const TestAsthmaScreen = () => {
    const [answer,setAnswer]=useState()
    const [change,setChange]=useState()

    const questions=[
        {'id':'1', 'name':'Pregunta 1', 'options':[{'value':'0','name':'No'},{'value':'2','name':'Si'}]},
        {'id':'2', 'name':'Pregunta 2', 'options':[{'value':'0','name':'No'},{'value':'3','name':'Si'}]},
        {'id':'3', 'name':'Pregunta 3', 'options':[{'value':'0','name':'No'},{'value':'2','name':'Si'}]}
    ]

    useEffect(() => {
        listadoPreguntas()
    }, [])
    

    const listadoPreguntas=()=>{
        const lista=[]
        questions.map(i=>{
            var question=i.name
            var answer=i.options[1].value

            lista.push({question,answer})
        })
        setAnswer(lista)
    }
   

    const itemCheckboxSelected = (id, value)=>{
        console.log(id,value)
        answer[id].answer=value
        console.log(answer)
        if(change===false){
            setChange(true)
        }else{
            setChange(false)
        }
    }


  return (
    <ScrollView>
        {(answer)?
            <View style={styles.container}>
            {questions.map((item,id)=>{

                return(
                    <View style={Styles.borderContainer} key={id}>
                        <View style={styles.cQuestion}>
                            <Text style={styles.tQuestion}>{item.name}</Text>
                        </View>
                        <View style={styles.cCheckBox}>
                            <CheckBox
                                text={item.options[0].name}
                                value={(answer[id].answer=== '0')?true:false}
                                disabled={false}
                                onValueChange={(newValue) => itemCheckboxSelected(id,'0')}
                            />
                            <CheckBox
                                text={item.options[1].name}
                                value={(answer[id].answer !== '0')?true:false}
                                disabled={false}
                                onValueChange={(newValue) => itemCheckboxSelected(id,String(item.options[1].value))}
                            />
                        </View>
                    </View>
                )
            })
            }
            
            <View style={styles.cButton}>  
                <Button 
                    title={"Calcular"}
                    onPress={()=>register()} 
                    fill='solid'
                /> 
            </View>
        </View>
        :null}
        
    </ScrollView>
  )
}
export default TestAsthmaScreen;

const styles= StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20
    },
    cCheckBox:{
        flexDirection:'row',
        justifyContent:'space-around'
    },
    cQuestion:{
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10
    },
    tQuestion:{
        fontFamily:Fonts.BOLD,
        fontSize:16,
        color:Colors.FONT_COLOR
    },
    cButton:{
        marginBottom:10,
        marginTop:20
    }
})
