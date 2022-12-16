import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import ListOptions from '../../components/ListOptions'
import { AuthContext } from '../../context/AuthContext'
import { Endpoint } from '../../environment/Api'
import http from '../../services/http'
import { Colors } from '../../theme/Colors'
import { Fonts } from '../../theme/Fonts'
import { Styles } from '../../theme/GlobalStyle'

const PymentScreen = (props) => {
    const {logOut} = useContext(AuthContext)
    const token=props.route.params.token
    console.log('token',token)

    const months=[{'id':'1', 'item':'Enero'},{'id':'2', 'item':'Febrero'},{'id':'3', 'item':'Marzo'},{'id':'4', 'item':'Abril'},
                  {'id':'5', 'item':'Mayo'},{'id':'6', 'item':'Junio'},{'id':'7', 'item':'Julio'},{'id':'8', 'item':'Agosto'},
                  {'id':'9', 'item':'Septiembre'},{'id':'10', 'item':'Octubre'},{'id':'11', 'item':'Noviembre'},{'id':'12', 'item':'Diciembre'}]

    const [historyRisk, setHistoryRisk] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [month, setMonth] = useState()

    useEffect(() => {
      getHistorial()
    }, [currentPage])
    

    const getHistorial=async()=>{
        const data={
            'token':token,
            "page":currentPage,
            "per_page":"10"
        }
        try {
            const resp = await http('post',Endpoint.historial,data)
            if(resp.message==='token no válido'){
                logOut()
              }
            console.log('resp',resp.data)
            // setHistoryRisk(resp.data)
            setHistoryRisk([...historyRisk, ...resp.data])

        } catch (error) {
            console.log('error',error)
        }
    }

    const monthSelect=(key,value)=>{
        console.log(key,value)
        setMonth({...userRegister, dni_type:key}) 
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
                        <Text>{item.patient.dni}</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Nombre:  </Text>
                        <Text>{item.patient.first_name} {item.patient.last_name}</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Riesgo:   </Text>
                        <Text>{item.risk_name}</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Porcentaje:   </Text>
                        <Text>{item.risk_percentage}</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Nivel:   </Text>
                        <Text>{item.level}</Text>
                    </View>
                </View>
            </View>
        )
        
    }

  return (
    <ScrollView>
        {/* {
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
        } */}
        <View style={styles.btnPagos}>
                <View style={Styles.borderContainer}>
                    <ListOptions
                        placeholder='Diciembre'
                        options={months}
                        itemSelect={monthSelect}
                    />
                </View>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={styles.btnPagos}>
                    <View style={Styles.borderContainer}>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.title}>Total Mes: </Text>
                            <Text style={styles.valor} >$18.000</Text>
                        </View>
                    </View>
            </View>
            <View style={styles.btnPagos}>
                    <View style={Styles.borderContainer}>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.title}>Cancelado: </Text>
                            <Text style={styles.valor} >$12.000</Text>
                        </View>
                    </View>
            </View>
            
            <View style={styles.btnPagos}>
                    <View style={Styles.borderContainer}>
                        <View style={{justifyContent:'center',alignItems:'center'}}> 
                            <Text style={styles.title}>Pendiente: </Text>
                            <Text style={styles.valor} >$6.000</Text>
                        </View>
                    </View>
            </View>
        </View>
        <View style={styles.container}>
                <View style={Styles.borderContainer}>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Nombre: </Text>
                        <Text>Ana Sofia Martinez Perez</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Identificación: </Text>
                        <Text>27742094</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Riesgo:   </Text>
                        <Text>Test Diabetes</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Estado: </Text>
                        <Text>Confirmado</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Valor: </Text>
                        <Text>$6.000</Text>
                    </View>
                </View>
            </View>
        <View style={styles.container}>
                <View style={Styles.borderContainer}>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Nombre: </Text>
                        <Text>Ana Sofia Martinez Perez</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Identificación: </Text>
                        <Text>27742094</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Riesgo:   </Text>
                        <Text>Test Epoc</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Estado: </Text>
                        <Text>Sin Verificar</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Valor: </Text>
                        <Text>$6.000</Text>
                    </View>
                </View>
            </View>
        <View style={styles.container}>
                <View style={Styles.borderContainer}>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Nombre: </Text>
                        <Text>Ana Sofia Martinez Perez</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Identificación: </Text>
                        <Text>27742094</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Riesgo:   </Text>
                        <Text>Test Cardiovascular</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Estado: </Text>
                        <Text>Confirmado</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Valor: </Text>
                        <Text>$6.000</Text>
                    </View>
                </View>
            </View>
        <View style={styles.container}>
                <View style={Styles.borderContainer}>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Nombre: </Text>
                        <Text>Ana Sofia Martinez Perez</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Identificación: </Text>
                        <Text>27742094</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Riesgo:   </Text>
                        <Text>Test Diabetes</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Estado: </Text>
                        <Text>Descartado</Text>
                    </View>
                    <View style={styles.cTable}>
                        <Text style={styles.title}>Valor: </Text>
                        <Text>$6.000</Text>
                    </View>
                </View>
            </View>
    </ScrollView>

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
        flex:1
    },
    btnPagos:{
        justifyContent:'center',
        // paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:5,
        flexDirection:'row',
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

