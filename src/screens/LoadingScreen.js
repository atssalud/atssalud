import React from 'react';
import {View,ActivityIndicator} from 'react-native';
import { Colors } from '../theme/Colors';


const LoadingScreen = () => {
  return (
    <View style = {{ flex: 1,justifyContent: 'center',alignItems: 'center',}}>
      <ActivityIndicator
        size={50}
        color={Colors.PRIMARY_COLOR}
      />
    </View>
  )
}
export default LoadingScreen;

