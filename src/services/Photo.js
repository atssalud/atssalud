import { launchCamera, launchImageLibrary } from "react-native-image-picker";


export const tomarFoto = (setPhoto,tipo,number)=>{
    
    launchCamera({
    mediaType:'photo',
    quality:0.5,
  },(resp)=>{
    if(resp.didCancel) return;
    const {uri,fileName,type} = resp.assets[0];
    if (!uri) return;
    console.log('resp',resp);

    const data ={
      uri: uri,
      name: fileName,
      type: type
    }

    console.log('data',resp);
    setPhoto(data)
    if (tipo){
      tipo(number)
    }

    return setPhoto,tipo
    // console.log(resp.assets[0].uri);
  });
};

export const galeriaFoto = (setPhoto)=>{
    launchImageLibrary({
    mediaType:'photo',
    quality:0.5,
  },(resp)=>{
    if (resp.didCancel) return;
    const {uri,fileName,type} = resp.assets[0];
    if (!uri) return;
    console.log(uri);
    const data ={
      uri: uri,
      name: fileName,
      type: type
    }
    setPhoto(data)
    return setPhoto
    // data(uri);
  });
};