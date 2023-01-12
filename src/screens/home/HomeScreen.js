import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import InputDate from '../../components/InputDate';
import ListOptions from '../../components/ListOptions';
import { Endpoint } from '../../environment/Api';
import http from '../../services/http';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { Styles } from '../../theme/GlobalStyle';
import LoadingScreen from '../LoadingScreen';

export const HomeScreen = () => {

    const date=new Date()
    const mes=date.getMonth()
    const año=date.getFullYear()

    console.log(mes)
    
    
    const months=[{'id':'01', 'item':'Enero'},{'id':'02', 'item':'Febrero'},{'id':'03', 'item':'Marzo'},{'id':'04', 'item':'Abril'},
                  {'id':'05', 'item':'Mayo'},{'id':'06', 'item':'Junio'},{'id':'07', 'item':'Julio'},{'id':'08', 'item':'Agosto'},
                  {'id':'09', 'item':'Septiembre'},{'id':'10', 'item':'Octubre'},{'id':'11', 'item':'Noviembre'},{'id':'12', 'item':'Diciembre'}]
    
    const [month, setMonth] = useState(months[mes].item)
    const [monthId, setMonthId] = useState(months[mes].id)
    const [statisticMonth, setStatisticMonth] = useState()
    const [statisticTotal, setStatisticTotal] = useState()
    const [confirm, setConfirm] = useState()
    const [discarded, setDiscarded] = useState()
    const [no_verified, setNo_verified] = useState()

    const [year, setYear] = useState(año)
    const [monthYear, setMonthYear] = useState(`${month}-${year}`)




    const filterSelect=(date,type,monthYear)=>{
        console.log(date)
        const data=date.split('-')
        setYear(data[0])
        setMonth(months[data[1]-1].item)
        setMonthId(months[data[1]-1].id)
        setMonthYear(monthYear)
    }

    useEffect(() => {
        getStatisticsMonth()
        getStatisticsTotal()
    }, [monthId,year])
    

    const getStatisticsMonth=async()=>{
        const user = await AsyncStorage.getItem('user');
        const { id } =  JSON.parse(user);
        try {
            const resp=await http('get',Endpoint.getStatisticsMonth(id,monthId,year))
            console.log('getStatisticsMonth',resp)
            if(resp.data.length>0){
                setStatisticMonth(resp)
                setConfirm(resp.data[0].confirm)
                setDiscarded(resp.data[0].discarded)
                setNo_verified(resp.data[0].no_verified)
            }else{
                setConfirm('0')
                setDiscarded('0')
                setNo_verified('0')
            }
            
            
        } catch (error) {
            console.log({error})
        }
    }
    const getStatisticsTotal=async()=>{
        const user = await AsyncStorage.getItem('user');
        const { id } =  JSON.parse(user);
        
        try {
            const resp=await http('get',Endpoint.getStatisticsTotal(id,year))
            console.log('getStatisticsTotal',resp)
    
            if(resp.data.length>0){
                setStatisticTotal(resp.data[0].confirm+resp.data[0].discarded+resp.data[0].no_verified)
            }else{
                setStatisticTotal('0')
            }
            
        } catch (error) {
            console.log({error})
        }
    }

  return (

    <>
        <View style={[Styles.borderContainer,{justifyContent:'center',alignItems:'center',marginTop:35,marginBottom:10,marginHorizontal:20}]}>
            <InputDate
                label='Filtro mes y año'
                dateSelect={filterSelect}
                type={'date'}
                text={monthYear}
                monthYear='yes'
                
            />
        </View>
    {
        (statisticMonth && statisticTotal)?
        <ScrollView >
            <View style={{justifyContent:'center',marginHorizontal:10,alignItems:'center'}}>
               
            <View style={styles.container}>
                <View style={styles.box}>
                    <Text style={styles.title}>Acumulado Total</Text>
                    <Text style={styles.number}>{statisticTotal}</Text>
                    <Text style={styles.text}>Tamizajes</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.title}>Confirmados</Text>
                    <Text style={styles.number}>{confirm}</Text>
                    <Text style={styles.text}>Tamizajes</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.title}>Descartados</Text>
                    <Text style={styles.number}>{discarded}</Text>
                    <Text style={styles.text}>Tamizajes</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.title}>No verificados</Text>
                    <Text style={styles.number}>{no_verified}</Text>
                    <Text style={styles.text}>Tamizajes</Text>
                </View>
            </View>
            </View>
        </ScrollView>
    :
        <LoadingScreen/>
    }
    </>
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