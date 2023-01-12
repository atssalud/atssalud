


import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import SelectDocument from '../services/SelectDocument'
import { Colors } from '../theme/Colors'
import { Fonts } from '../theme/Fonts'
import Icon from 'react-native-vector-icons/FontAwesome';

export const UploadDocument = (props) => {

    const [file,setFile]=useState()
    
    const upload=(document)=>{
        setFile(document)
        props.document(document)
    }
  return (
    <View>
        <Text style={{fontFamily:Fonts.BOLD,fontSize:16,color:Colors.FONT_COLOR,marginBottom:10}}>{`${props.title}:`}</Text>
            <TouchableOpacity
                onPress={()=>SelectDocument(upload)}
            >
                
                    <View style={{flexDirection:'row',justifyContent:'space-between',borderBottomWidth:2,borderBottomWidth:2,marginBottom:15,borderColor:Colors.GREY_LIGHT}}>
                        
                        {
                            (file)?
                                <>
                                    <Text style={{fontFamily:Fonts.REGULAR,fontSize:16,color:Colors.FONT_COLOR,marginBottom:10}}>{file[0].name}</Text>
                                    <Icon
                                        name='check'
                                        color={Colors.GREEN}
                                        size={20}
                                        style={{marginRight:10}}
                                    />
                                </>
                                :
                                <Text style={{fontFamily:Fonts.REGULAR,fontSize:16,color:Colors.GREY,marginBottom:10}}>Seleccione Documento</Text>
                        }
                    </View>
                    
                
            </TouchableOpacity>
    </View>
  )
}
