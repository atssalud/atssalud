import React, { createContext,useState,useEffect } from 'react';
import {AppState,Platform} from 'react-native'
import { check, PERMISSIONS, request, openSettings } from 'react-native-permissions';

export const permisionInitState={
    locationStatus:'unavailable'
}

export const PermissionsContext = createContext({});

export const PermissionProvider = ({children}) =>{

    const [permissions, setPermissions] = useState(permisionInitState);

    useEffect(() => {
        checkLocationPermission();
      
          AppState.addEventListener('change', state=>{
          if ( state !== 'active') return;

          checkLocationPermission();
      })
    },[])
    

    const askLocationPermission = async  () =>{
        let permissionsStatus;

        if(Platform.OS ==='ios') {
            permissionsStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        }else{
            permissionsStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        }

        if (permissionsStatus === 'blocked'){
            openSettings();
        }

        setPermissions({
            ...permissions,
            locationStatus:permissionsStatus,
        })
    }
    const checkLocationPermission = async () =>{
        let permissionsStatus;

        if(Platform.OS ==='ios') {
            permissionsStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        }else{
            permissionsStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        }

        setPermissions({
            ...permissions,
            locationStatus:permissionsStatus,
        })
    }

    return (
    <PermissionsContext.Provider value={{
        permissions,
        askLocationPermission,
        checkLocationPermission,
    }}>
        {children}
    </PermissionsContext.Provider>
    )
}