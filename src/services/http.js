import AsyncStorage from '@react-native-async-storage/async-storage';

const http = async (method, url, data, contentType='json')=>{

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


    return new Promise((resolve, reject) => {
        console.log(headers)
        fetch(url, {
            method,
            headers,
            body
        }).then(
            response => resolve(response.json()),
            err => reject(err),
        )
    });
}
export default http;