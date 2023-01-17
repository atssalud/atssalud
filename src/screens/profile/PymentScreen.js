import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import InputDate from '../../components/InputDate'
import ListOptions from '../../components/ListOptions'
import { AuthContext } from '../../context/AuthContext'
import { Endpoint } from '../../environment/Api'
import http from '../../services/http'
import { Colors } from '../../theme/Colors'
import { Fonts } from '../../theme/Fonts'
import { Styles } from '../../theme/GlobalStyle'
import IsConnectedScreen from '../IsConnectedScreen'
import LoadingScreen from '../LoadingScreen'

const PymentScreen = () => {
    const {logOut,isConnected} = useContext(AuthContext)

    const date=new Date()
    const mes=date.getMonth()
    const año=date.getFullYear()

    const months=[{'id':'01', 'item':'Enero'},{'id':'02', 'item':'Febrero'},{'id':'03', 'item':'Marzo'},{'id':'04', 'item':'Abril'},
                  {'id':'05', 'item':'Mayo'},{'id':'06', 'item':'Junio'},{'id':'07', 'item':'Julio'},{'id':'08', 'item':'Agosto'},
                  {'id':'09', 'item':'Septiembre'},{'id':'10', 'item':'Octubre'},{'id':'11', 'item':'Noviembre'},{'id':'12', 'item':'Diciembre'}]
    
    const [month, setMonth] = useState(months[mes].item)
    const [monthId, setMonthId] = useState(months[mes].id)
    const [year, setYear] = useState(año)
    const [mesAnterior, setmesAnterior] = useState(months[mes].id)
    const [añoAnterior, setañoAnterior] = useState(año)
    const [historyRisk, setHistoryRisk] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState()
    const [ netInfo,setNetInfo]=useState(false)

    useEffect(() => {
        const unsubscribe = isConnected(setNetInfo)
        getHistorial()
        return()=>{
            unsubscribe
        }
      
    }, [currentPage,monthId])
    

    const getHistorial=async()=>{

        const user = await AsyncStorage.getItem('user');
        const { id } =  JSON.parse(user);

        if(añoAnterior !== year || mesAnterior!== monthId){
                setCurrentPage(1)
            try {
                console.log('uno',Endpoint.historial(id,'1',monthId,year))
                const resp = await http('get',Endpoint.historial(id,1,monthId,year))
                if(resp.message==='token no válido'){
                    logOut()
                }

                setHistoryRisk([...resp.data])
                setTotal(resp.total)
            } catch (error) {
                console.log('error',error)
            }
        }else{
            try {
                console.log('dos',Endpoint.historial(id,currentPage,monthId,year))
                const resp = await http('get',Endpoint.historial(id,currentPage,monthId,year))
                if(resp.message==='token no válido'){
                    logOut()
                }
                setHistoryRisk([...historyRisk, ...resp.data])
                setTotal(resp.total)
            } catch (error) {
                console.log('error',error)
            }
        }
    }

    const filterSelect=(date)=>{
        console.log(date)
        const data=date.split('-')
        setañoAnterior(year)
        setmesAnterior(monthId)
        setYear(data[0])
        setMonth(months[data[1]-1].item)
        setMonthId(months[data[1]-1].id) 
    }

    const loadMoreItem=()=>{
        setCurrentPage(currentPage+1)
    }

    const renderLoader=()=>{
        return(
            <>
                {
                    (Object.keys(historyRisk).length<11)?
                    <View style={{marginTop:10}}></View>
                    :
                    <View style={styles.loader}>
                        <ActivityIndicator size={'large'} color={Colors.PRIMARY_COLOR}/>
                    </View>
                }
            </>
        )
    }

    const renderItem=({item})=>{
        return(
            <View style={styles.container}>
                <View style={Styles.borderContainer}>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Identificación:  </Text>
                        <Text>{item.affiliate_dni}</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Nombre:  </Text>
                        <Text>{item.full_name}</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Estado:   </Text>
                        <Text>{item.test_status}</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Valor:   </Text>
                        <Text>{item.bonus}</Text>
                    </View>
                </View>
            </View>
        )
        
    }

  return (
    <>
        {
            (netInfo=== false)? <IsConnectedScreen/>:
            <>
        <View style={styles.btnPagos}>
            <View style={{justifyContent:'center',alignItems:'center',marginTop:35,}}>
            <InputDate
                label='Filtro mes y año'
                dateSelect={filterSelect}
                type={'date'}
                text={`${month}-${year}`}
                dimension='middle'
                monthYear='yes'
            />
            </View>
            <View>
                <View style={Styles.borderContainer}>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={styles.title}>Total Mes: </Text>
                        <Text style={styles.valor} >${(total)?total:0}</Text>
                    </View>
                </View>
            </View>
        </View>

        {
                (Object.keys(historyRisk).length === 0)?
                <View style={styles.cTest}>
                    <Text style={styles.title2}>No ha realizado ningún registro</Text>
                    <Text style={styles.title2}>de pacientes</Text>
                </View>
            :
                <FlatList
                        data={historyRisk}
                        renderItem={renderItem}
                        keyExtractor={(item,id)=> id}
                        ListFooterComponent={renderLoader}
                        onEndReached={loadMoreItem}
                        onEndReachedThreshold={0}
                />
            

            
        }
        
            </>
        }
    </>
    

  )
}
export default PymentScreen;

const styles=StyleSheet.create({
    container:{
        marginHorizontal:20,
    },
    cTable:{
        flexDirection:'row',
        marginHorizontal:10
    },
    title:{
        fontFamily:Fonts.BOLD,
    },
    title2:{
        fontFamily:Fonts.BOLD,
        fontSize:20
    },
    loader:{
        marginVertical:16,
        alignItems:'center'
    },
    cTest:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
    btnPagos:{
        justifyContent:'space-around',
        // paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:5,
        flexDirection:'row',
        alignItems:'center',
        marginHorizontal:40,
      },
    valor:{
        fontSize:18,
        fontFamily:Fonts.BOLD,
        color:Colors.PRIMARY_COLOR
    },
    cValor:{
        flexDirection:'row',
        marginHorizontal:10,
        alignItems:'center'
    },

})

