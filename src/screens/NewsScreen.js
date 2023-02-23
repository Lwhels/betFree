import React, {useLayoutEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect, useSelector} from 'react-redux';
import { AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';


export default function NewsScreen({navigation}){
    
    useLayoutEffect(() => {
        navigation.setOptions({
          title: 'News',
        });
      }, []);

    return (
        <View style={styles.container}>
          <Text style={styles.title}> News Page </Text>
        </View>
      );
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: Configuration.home.listing_item.offset,
  },
  title: {
    fontWeight: 'bold',
    color: AppStyles.color.title,
    fontSize: 25,
    textAlign: "center"
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
  },
});