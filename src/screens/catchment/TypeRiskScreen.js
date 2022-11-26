import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native';
import { ButtonImage } from '../../components/ButtonImage';
import { Colors } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';

const TypeRiskScreen = (props) => {

    const list = props.route.params.list
    const data = props.route.params.data
    const navigator = useNavigation()

    return (
        <ScrollView>
            <View style={style.container}>
                {
                    list.map(risk => {
                        return (
                            <ButtonImage
                                key={risk.id}
                                nameImage='check-circle'
                                text={risk.name}
                                size={28}
                                fontSize={13}
                                btnFunction={() => navigator.replace('TestRiskScreen', { id: risk.id, data: data, title: risk.name })}

                            />
                        )
                    })
                }

            </View>
        </ScrollView>
    )
}
export default TypeRiskScreen;

const style = StyleSheet.create({
    container: {
        marginHorizontal: 31,
        marginVertical: 10,
        flex: 1
    },
    cBtn: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontFamily: Fonts.BOLD,
        fontSize: 18,
        color: Colors.FONT_COLOR
    },
})
