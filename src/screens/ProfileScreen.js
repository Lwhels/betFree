import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {StyleSheet, Text, View} from 'react-native';
import {Image} from 'react-native';
import '../global.js';
import {AppStyles} from '../AppStyles.js';

function ProfileScreen({navigation}) {
<<<<<<< HEAD
  const [balance, setBalance]  = useState(0) 
  const [email, setEmail]  = useState('')
  const [username, setUsername] = useState('')
  const [image, setImage] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [profilePhotoID, setProfilePhotoID] = useState(1) 



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
        setReferralCode(data.id.slice(0, 8))
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
=======
  const [balance, setBalance] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');

  const [profilePhotoID, setProfilePhotoID] = useState(1);
>>>>>>> main

  firestore()
    .collection('users')
    .doc(global.currentuid)
    .get()
    .then((users) => {
      data = users.data();
      setUsername(data.fullname);
      setBalance(data.balance);
      setEmail(data.email);
      setProfilePhotoID(data.profilePhotoNum);
      if (profilePhotoID == 1) {
        setImage(require('../../assets/images/basketballProfilePic.png'));
      } else if (profilePhotoID == 2) {
        setImage(require('../../assets/images/hoopProfilePic.png'));
      } else if (profilePhotoID == 3) {
        setImage(require('../../assets/images/jerseyProfilePic.png'));
      } else if (profilePhotoID == 4) {
        setImage(require('../../assets/images/shoeProfilePic.png'));
      } else if (profilePhotoID == 5) {
        setImage(require('../../assets/images/timerProfilePic.png'));
      } else if (profilePhotoID == 5) {
        setImage(require('../../assets/images/whistleProfilePic.png'));
      }
    });

  return (
<<<<<<< HEAD
    <View >
      <Image style = {styles.userImg} source={image}/> 
      <Text style = {styles.username}> {username} </Text>
      <Text style = {styles.balance}> Your balance: ${balance}</Text>
      <Text style = {styles.fieldTitles}> Email </Text>
      <Text style = {styles.fields} > {email} </Text>
      <Text style = {styles.fieldTitles}> Your referral code: </Text>
      <Text style = {styles.fields} > {referralCode} </Text>
=======
    <View>
      <Image style={styles.userImg} source={image} />
      <Text style={styles.username}> {username} </Text>
      <Text style={styles.balance}> Your balance: ${balance}</Text>
      <Text style={styles.fieldTitles}> Email </Text>
      <Text style={styles.fields}> {email} </Text>
      <Text style={styles.fieldTitles}> Your referral code: </Text>
      <Text style={styles.fields}> ur mom 420 </Text>
>>>>>>> main
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
    color: AppStyles.color.tint,
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
  },
});

export default ProfileScreen;
