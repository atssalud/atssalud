import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import {Colors} from '../theme/Colors'
import {Fonts} from '../theme/Fonts'

let _COLOR,_SIZE;

const Button = ({ 
    fill="outline", 
    color="secondary",    
    size="default",  
    title, 
    onPress 
}) => {
   
    _COLOR = color;
    console.log('color',_COLOR)
    _SIZE = size;
    return (
        <View style={ styles.buttonWrapper } >
            <TouchableOpacity
                activeOpacity={0.82}
                onPress={ onPress }
                style={[
                    styles.Button,
                    fill === "clear" ? 
                         null : 
                            fill ==="outline"? 
                                styles.outline : styles.solid,
                    size === "small" ?
                        styles.sizeSmall : styles.sizeDefault
                    
                ]}
            >
                <Text
                    style={[
                        styles.Text,
                        fill === "clear" ? 
                            null : 
                                fill ==="outline"? 
                                    styles.textOutline : styles.textDefault
                    ]}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
 
export default Button;

const Width = Dimensions.get('screen').width
const Height = Dimensions.get('screen').height

const styles = StyleSheet.create({
    buttonWrapper: {
        borderRadius: 4,
        alignItems: "center",
        marginBottom:20,
    },
    Button: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderWidth: 0
    },
    solid:{
        backgroundColor: _COLOR === "secondary"? Colors.GREEN : Colors.PRIMARY_COLOR,
        borderRadius:10
        
    },
    outline:{
        borderColor: _COLOR === "secondary"? Colors.GREEN : Colors.PRIMARY_COLOR,
        borderWidth: 1
    },
    Text: {
        fontSize: 18,
        fontFamily: Fonts.REGULAR,
    },
    textDefault:{
        color: Colors.WHITE,
        fontFamily:Fonts.BOLD
    },
    textOutline:{
        color: _COLOR === "secundary"? Colors.GREEN : Colors.PRIMARY_COLOR,
    },
    sizeDefault:{
        width: Width * 0.6,
        height: Height * 0.05
    },
    sizeSmall:{
        width:  Width * 0.4, 
        height: Height * 0.07
    },
    /*Button: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.PRIMARY_COLOR,
        height: Proportions.height * 0.07,
        width: Proportions.width * 0.8,
        borderRadius: 4,
        borderColor: Colors.PRIMARY_COLOR,
        borderWidth: 0
    },*/
    
});