import React from 'react'
import { Text, View } from 'react-native'

const ViewAlertScreen = (props) => {
    const data = props.route.params.data
  return (
    <View>
        <Text>{data.risk_percentage}</Text>
        <Text>{data.risk_level}</Text>
    </View>
  )
}
export default ViewAlertScreen
