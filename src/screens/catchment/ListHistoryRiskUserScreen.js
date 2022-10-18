import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Endpoint } from '../../environment/Api'
import http from '../../services/http'
import { Colors } from '../../theme/Colors'
import { Fonts } from '../../theme/Fonts'
import { Styles } from '../../theme/GlobalStyle'

const ListHistoryRiskUserScreen = (props) => {
    const token=props.route.params.token
    console.log('token',token)

    const [historyRisk, setHistoryRisk] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

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
            console.log('resp',resp.data)
            // setHistoryRisk(resp.data)
            setHistoryRisk([...historyRisk, ...resp.data])

        } catch (error) {
            console.log('error',error)
        }
    }

    const loadMoreItem=()=>{
        setCurrentPage(currentPage+1)
    }

    const renderLoader=()=>{
        return(
            <View style={styles.loader}>
                <ActivityIndicator size={'large'} color={Colors.PRIMARY_COLOR}/>
            </View>
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
    <FlatList
        data={historyRisk}
        renderItem={renderItem}
        keyExtractor={(item,id)=> id}
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreItem}
        onEndReachedThreshold={0}
    />

  )
}
export default ListHistoryRiskUserScreen;

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
    loader:{
        marginVertical:16,
        alignItems:'center'
    }
})
