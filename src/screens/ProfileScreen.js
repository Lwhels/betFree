import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {AppIcon, AppStyles} from '../AppStyles'; 
import { Image } from 'react-native';
import { Alert } from 'react-native';
import '../global.js'


function ProfileScreen({navigation}) {
  const [balance, setBalance]  = useState(0) 
  const [email, setEmail]  = useState('')
  const [username, setUsername] = useState('')
  const [image, setImage] = useState('')

  const [profilePhotoID, setProfilePhotoID] = useState(1) 

  // const image = require("../../assets/images/hoopProfilePic.png");


  firestore() 
      .collection('users')
      .doc(global.currentuid)
      .get()
      .then((users) => {
        data = users.data();
        setUsername(data.fullname)
        setBalance(data.balance)
        setEmail(data.email)
        setProfilePhotoID(data.profilePhotoNum)
        if (profilePhotoID ==1 ){
          setImage (require("../../assets/images/basketballProfilePic.png"))
        } else if (profilePhotoID ==2){
          setImage (require ("../../assets/images/hoopProfilePic.png"))
        } else if (profilePhotoID ==3){
          setImage (require ("../../assets/images/jerseyProfilePic.png"))
        }else if (profilePhotoID ==4){
          setImage (require ("../../assets/images/shoeProfilePic.png"))
        }else if (profilePhotoID ==5){
          setImage (require ("../../assets/images/timerProfilePic.png"))
        }else if (profilePhotoID ==5){
          setImage (require ("../../assets/images/whistleProfilePic.png"))
        }
      });

  // function getProfilePhotoID (profilePhotoID) {
  //   switch (profilePhotoID) {
  //     case 1:
  //       setImage (require("../../assets/images/basketballProfilePic.png"))
  //       break;
  //     case 2:
  //       setImage (require ("../../assets/images/hoopProfilePic.png"))
  //       break;
  //     case 3:
  //       setImage (require ("../../assets/images/jerseyProfilePic.png"))
  //       break;
  //     case 4:
  //       setImage (require ("../../assets/images/shoeProfilePic.png"))
  //       break;
  //     case 5:
  //       setImage (require ("../../assets/images/timerProfilePic.png"))
  //       break;
  //     case 6:
  //       setImage (require ("../../assets/images/whistleProfilePic.png"))
  //       break;
  //     default:
  //       setImage (require ("../../assets/icons/profile.png"))
  //       break;
  //   }
  // }
    
  // const removefromfirebase = () => {
  //   console.log ("you have reached this function")
  //   firestore().collection('users').doc(global.currentuid).delete(
  //     {recursive: true, yes: true}
  //   );
  //   navigation.navigate('LoginStack');
  // }
  // const deleteAccount = () => {
  //   Alert.alert('Are you sure?', 'This action cannot be undone.', [
  //     {
  //       text: 'Cancel',
  //       onPress: () => console.log('Cancel Pressed'),
  //       style: 'cancel',
  //     },
  //     {
  //       text: 'OK', onPress: () =>  {removefromfirebase()},
  //     },
  //   ]);
  // }

  return (
    <View >
      <Image style = {styles.userImg} source={image}/> 
      <Text style = {styles.username}> {username} </Text>
      <Text style = {styles.balance}> Your balance: ${balance}</Text>
      <Text style = {styles.fieldTitles}> Email </Text>
      <Text style = {styles.fields} > {email} </Text>
      <Text style = {styles.fieldTitles}> Your referral code: </Text>
      <Text style = {styles.fields} > ur mom 420  </Text>
      {/* <TouchableOpacity onPress={deleteAccount}>
        <Text style = {{
          textAlign: 'center',
          color: 'red',
        }}> delte acc</Text>
        </TouchableOpacity> */}
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
