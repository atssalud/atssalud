import AsyncStorage from '@react-native-async-storage/async-storage';

const http = async (method, url, data, contentType='json')=>{


    const headers = {};
    let body;

    if(contentType === 'form-data'){
        body = data;
    }else{
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
    }

    const token = await AsyncStorage.getItem('token');
    
    if (token) {
        headers['Authorization'] = `bearer ${ token } `;
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            headers,
            method,
            body
        }).then(
            response => resolve(response.json()),
            err => reject(err),
        )
    });
}
export default http;