import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Endpoint } from '../environment/Api';



const http = async (method, url, data, contentType='json',timeout = 10000)=>{
    
    const token = await AsyncStorage.getItem('token');
    const headers = {};
    let body;

    if(contentType === 'form-data'){
        body = data;
    }else{
        headers["Accept"] = "application/json";
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(data);
    }

    
    
    if (token) {
        headers["Authorization"] =`Bearer ${ token }`;
    }

    return Promise.race([
        new Promise((resolve, reject) => {
                fetch(url, {
                    method,
                    headers,
                    body
                }).then(
                    response => resolve(response.json()),
                    err => reject(err),
                )}),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
    ]);
    // return new Promise((resolve, reject) => {
    //     fetch(url, {
    //         method,
    //         headers,
    //         body
    //     }).then(
    //         response => resolve(response.json()),
    //         err => reject(err),
    //     )
    // });
}
export default http;
