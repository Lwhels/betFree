import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {AppIcon, AppStyles} from '../AppStyles'; 
import { Image } from 'react-native';
import '../global.js'


function ProfileScreen({navigation}) {
  const balance = 100;

  return (
    <View >
      <Image style = {styles.userImg} source={AppIcon.images.basketball}/> 
      <Text style = {styles.username}> username </Text>
      <Text style = {styles.balance}> Your balance: ${balance}</Text>
      <Text style = {styles.fieldTitles}> name </Text>
      <Text style = {styles.fields} > name </Text>
      <Text style = {styles.fieldTitles}> email </Text>
      <Text style = {styles.fields} > email </Text>
      <Text style = {styles.fieldTitles}> referral code: </Text>
      <Text style = {styles.fields} > ur mom 420  </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  userImg: {
      borderColor: '#e6e6e6',
      borderRadius: 85, 
      borderWidth: 1, 
      height: 170, 
      width: 170, 
      marginBottom: 10,
      marginTop: 30, 
      alignSelf: 'center',
  },
  balance: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1d6e1d',
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  fieldTitles: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
    textAlign: 'left',
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  fields: {
    fontSize: 18,
    color: '#424242',
    textAlign: 'left',
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 20,
  },
  password: {
    fontSize: 18,
    color: '#424242',
    textAlign: 'left',
    marginBottom: 20,
    marginLeft: 35,
    marginRight: 20,
    width: '65%',
  },
  showPasswordButton: {
    height: 30, 
    width: 30, 
    marginBottom: 20,
    marginLeft: '20%',
  },
  container: {
    flexDirection: 'row',
  }
});

export default ProfileScreen;
