import React, {useLayoutEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect, useSelector} from 'react-redux';
import { AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import firestore from '@react-native-firebase/firestore';
import 'firebase/compat/firestore';

/* ///////////////////////////////////////////   CREATE LEADERBOARD BACKEND   //////////////////////////////////////////////// */

var balanceLeaders = [];
var betWinLeaders = [];

async function createBetWinLeaders(){
  await firestore().collection("users").orderBy('betWins', 'desc').limit(20).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        // doc.data() is never undefined for query doc snapshots
        betWinLeaders.push({
          betWins: data.betWins,
          name: data.fullname,
        });
        //console.log(doc.balance, " => ", doc.data());
      });
    });
    // [END get_multiple_all]
}

async function createBalanceLeaders(){
  await firestore().collection("users").orderBy('balance', 'desc').limit(20).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        // doc.data() is never undefined for query doc snapshots
        balanceLeaders.push({
          balance: data.balance,
          name: data.fullname,
        });
        //console.log(doc.balance, " => ", doc.data());
      });
    });
    // [END get_multiple_all]
}

async function leaderboard(){
  await createBalanceLeaders();
  for (let i = 0; i < balanceLeaders.length; i++){
    console.log('Rank ' + (i + 1) + ' in balance: ' + balanceLeaders[i].name + ' with $' + balanceLeaders[i].balance);
  }
  console.log('\n\n');
  await createBetWinLeaders();
  for (let i = 0; i < betWinLeaders.length; i++){
    console.log('Rank ' + (i + 1) + ' in correct bets: ' + betWinLeaders[i].name + ' with ' + betWinLeaders[i].betWins + ' correct bets.');
  }
}

/* ///////////////////////////////////////////   END CREATE LEADERBOARD BACKEND   //////////////////////////////////////////////// */

export default function LeaderboardScreen({navigation}){
    
    useLayoutEffect(() => {
        leaderboard();
        navigation.setOptions({
          title: 'Leaderboard',
        });
      }, []);

    return (
        <View style={styles.container}>
          <Text style={styles.title}> Leaderboard Page </Text>
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