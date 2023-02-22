import React, {useState} from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

export default function BasicButton(props){
    return(
        //<View style={styles.centered}>
         <TouchableHighlight
            style={styles.btnStyle}
            onPress={props.onPress}>
            <View>
                <Text style={styles.btnTxt}>{props.title}</Text>
            </View>
       </TouchableHighlight> 
      // </View>
           

    )
}


const styles = StyleSheet.create({
    centered:{
        justifyContent: 'center',
        alignContent: 'center',
    },
    btnStyle:{
        justifyContent: 'center',
        width: '82%',
        height: '8%',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'green',
    },
    btnTxt:{
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
});