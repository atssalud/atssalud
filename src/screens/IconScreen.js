import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { iconos } from '../assets/iconos'
import Icon from 'react-native-vector-icons/FontAwesome';

export const IconScreen = () => {
    return (
        <ScrollView>
            {
                iconos.map((name,id)=>{
                    return(
                        <TouchableOpacity
                            onPress={()=>console.log('name',name)}
                            key={id}
                        >
                            <Icon
                            name={name}
                            color= {'black'}
                            size={40}
                            />
                        </TouchableOpacity>
                    )
                })
            }
        </ScrollView>
    )
}
