import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './src/navigation/navigator';
import { AuthProvider } from './src/context/AuthContext';
import { navigationRef } from './src/navigation/RootNavigation';

const AppState= ({children}) =>{
  return(
    <>
      <AuthProvider>
        {children}
      </AuthProvider>
    </>
  )
}


const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppState>
        <Navigator/>
      </AppState>
    </NavigationContainer>
  )
};


export default App;
