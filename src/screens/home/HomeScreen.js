import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import ListOptions from '../../components/ListOptions';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { Styles } from '../../theme/GlobalStyle';

export const HomeScreen = () => {

    const [month, setMonth] = useState()
    const [week, setWeek] = useState()
    const [filtro, setFiltro] = useState()

    const filter=[{'id':'1', 'item':'Hoy'},{'id':'2', 'item':'Mensual'},{'id':'3', 'item':'Semanal'}]
    
    const weeks=[{'id':'1', 'item':'Semana 1'},{'id':'2', 'item':'Semana 2'},{'id':'3', 'item':'Semana 3'},{'id':'4', 'item':'Semana 4'},{'id':'5', 'item':'Todas'}]
    
    const months=[{'id':'1', 'item':'Enero'},{'id':'2', 'item':'Febrero'},{'id':'3', 'item':'Marzo'},{'id':'4', 'item':'Abril'},
                  {'id':'5', 'item':'Mayo'},{'id':'6', 'item':'Junio'},{'id':'7', 'item':'Julio'},{'id':'8', 'item':'Agosto'},
                  {'id':'9', 'item':'Septiembre'},{'id':'10', 'item':'Octubre'},{'id':'11', 'item':'Noviembre'},{'id':'12', 'item':'Diciembre'}]
    
    const monthSelect=(key,value)=>{
        console.log(key,value)
        setMonth(key) 
    }
    const weekSelect=(key,value)=>{
        console.log(key,value)
        setWeek(key) 
    }
    const filtroSelect=(key,value)=>{
        console.log(key,value)
        setFiltro(key)
        if(key==='1'){
            setMonth('')
            setWeek('')
        }
    }

  return (
    <ScrollView >
        <View style={{justifyContent:'center',marginHorizontal:10,alignItems:'center'}}>
            <View style={{flexDirection:'row'}}>
                <View style={styles.btnPagos}>
                        <View style={Styles.borderContainer}>
                            <ListOptions
                                placeholder='Hoy'
                                options={filter}
                                itemSelect={filtroSelect}
                            />
                        </View>
                </View>
                {
                    (filtro==='2')?
                    <View style={styles.btnPagos}>
                        <View style={Styles.borderContainer}>
                            <ListOptions
                                placeholder='Diciembre'
                                options={months}
                                itemSelect={monthSelect}
                            />
                        </View>
                    </View>
                    :null
                }
                {
                    (filtro ==='3' || month)?
                        <View style={styles.btnPagos}>
                                <View style={Styles.borderContainer}>
                                    <ListOptions
                                        placeholder='Todas'
                                        options={weeks}
                                        itemSelect={weekSelect}
                                    />
                                </View>
                        </View>
                        :null
                }
            </View>

            <View style={styles.container}>
                <View style={styles.box}>
                    <Text style={styles.title}>Número de tamizajes generados</Text>
                    <Text style={styles.number}>54</Text>
                    <Text style={styles.text}>Pacientes</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.title}>Número de tamizajes confirmados</Text>
                    <Text style={styles.number}>28</Text>
                    <Text style={styles.text}>Pacientes</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.title}>Número de tamizajes Descartados</Text>
                    <Text style={styles.number}>14</Text>
                    <Text style={styles.text}>Pacientes</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.title}>Número de tamizajes No verificados</Text>
                    <Text style={styles.number}>12</Text>
                    <Text style={styles.text}>Pacientes</Text>
                </View>
            </View>
        </View>
    </ScrollView>
  )
}
export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        marginVertical:20,
        alignItems:'center'
    },
    box:{
        backgroundColor:Colors.DARK_BLUE,
        width:352,
        height:209,
        borderRadius:20,
        padding:20,
        alignItems:'center',
        marginTop:20
    },
    title:{
        fontFamily:Fonts.BOLD,
        fontSize:20,
        color:Colors.WHITE
    },
    number:{
        fontFamily:Fonts.BOLD,
        fontSize:64,
        color:Colors.WHITE,
        marginTop:20
    },
    text:{
        fontFamily:Fonts.REGULAR,
        fontSize:15,
        color:Colors.WHITE,
        marginTop:-10
    },
    btnPagos:{
        justifyContent:'center',
        paddingHorizontal:5,
        paddingVertical:5,
        borderRadius:5,
        flexDirection:'row',
      },
})