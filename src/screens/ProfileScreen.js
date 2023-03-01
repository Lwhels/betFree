import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {AppStyles} from '../AppStyles'; 
import { Image } from 'react-native';

function ProfileScreen({navigation}) {
  return (
    <View >
      <Image> </Image>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default ProfileScreen;
