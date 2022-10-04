import React from 'react';
import {View,ActivityIndicator} from 'react-native';


const LoadingScreen = () => {
  return (
    <View style = {{ flex: 1,justifyContent: 'center',alignItems: 'center',}}>
      <ActivityIndicator
        size={50}
        color="#ff5d2f"
      />
    </View>
  )
}
export default LoadingScreen;

