import React, {useState} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

export default function BasicButton(props){
    return(
         <TouchableHighlight
            style={styles.btnStyle}
            onPress={props.onPress}>
            <View>
                <Text style={styles.btnTxt}>{props.title}</Text>
            </View>
       </TouchableHighlight> 
    )
}


const styles = StyleSheet.create({
    centered:{
        justifyContent: 'center',
        alignContent: 'center',
    },
    btnStyle:{
        justifyContent: 'center',
        width: '85%',
        height: '8%',
        marginTop: 30,
        borderRadius: 15,
        backgroundColor: 'green',
    },
    btnTxt:{
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
});