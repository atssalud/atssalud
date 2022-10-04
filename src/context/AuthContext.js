import React, { createContext,useReducer,useEffect } from 'react';
import Api, { Endpoint } from '../environment/Api';
import { AuthReducer } from './AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'
import http from '../services/http'



const authInitialState={
    status:"checking",
    token:null,
    errorMessage:"",
    user:""
}


export const AuthContext = createContext({});

export const AuthProvider = ({children})=>{

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async()=>{

        const token = await AsyncStorage.getItem('token');
        console.log('token',token)
        // No token , no autenticado
        if (!token) return dispatch({type:'notAuthenticated'})
            dispatch({
                type:'signUp',
                payload:{
                    token:token,
                    user:{},
                }
            })

    };

    const [state, dispatch] = useReducer(AuthReducer, authInitialState )

    const signIn = async (email,password,isSelected)=>{

       
        const data={
            "email":email,
            "password":password
        }

        try {
            const resp = await http('post',Endpoint.login,data)
            console.log('resp',resp)
            if (resp.errors){
                dispatch({
                    type:'addError',
                    payload:error.errors|| 'Usuario o Contraseña incorrecta',
                })
            }else{
                AsyncStorage.setItem('token',resp.token)
                dispatch({
                    type:'signUp',
                    payload:{
                        token:resp.token,
                        user:resp.user,
                    }
                })
                if (isSelected === true){
                    
                    AsyncStorage.setItem('email', email)
                    AsyncStorage.setItem('password',password)
                    AsyncStorage.setItem('isSelected',String(isSelected))
                    
                }else{
                    const cedula= await AsyncStorage.getItem('usuario')
                    const password = await AsyncStorage.getItem('password')
                    if(cedula && password){
                        AsyncStorage.removeItem('usuario')
                        AsyncStorage.removeItem('password')
                        AsyncStorage.setItem('isSelected',String(isSelected))
                    }
                }
    
                AsyncStorage.setItem('token',resp.token)
            }
            
            

        } catch (error) {
            console.log(error)
            dispatch({
                type:'addError',
                payload:error.errors|| 'Usuario o Contraseña incorrecta',
            })
        }
    }


    const signUp = ()=>{}

    const logOut = ()=>{
        AsyncStorage.removeItem('token')
        AsyncStorage.removeItem('user')
        AsyncStorage.removeItem('tokenFirebase')
        AsyncStorage.removeItem('availability_status')
        AsyncStorage.removeItem('availability_vehicle')
        AsyncStorage.removeItem('vehiculo_id')
        AsyncStorage.setItem('alert','false');
        dispatch({type:'logout'})
    }


    const removeError = ()=>{
        dispatch({
            type:'removeError'
        })
    }


    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,
        }}>
            { children }
        </AuthContext.Provider>
    )
}