import React, {useLayoutEffect, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, Pressable, Button, Image, TouchableHighlight} from 'react-native';
import {connect, useSelector} from 'react-redux';
import { AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import firestore from '@react-native-firebase/firestore';
import 'firebase/compat/firestore';
import {AppIcon} from '../AppStyles';

/* ///////////////////////////////////////////   CREATE LEADERBOARD BACKEND   //////////////////////////////////////////////// */

var balanceLeaders = [];
var betWinLeaders = [];

async function createBetWinLeaders(){
  await firestore().collection("users").orderBy('betWins', 'desc').limit(10).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        // doc.data() is never undefined for query doc snapshots
        betWinLeaders.push({
          betWins: data.betWins,
          name: data.fullname,
          id: data.id,
        });
        //console.log(doc.balance, " => ", doc.data());
      });
    });
    // [END get_multiple_all]
}

async function createBalanceLeaders(){
  await firestore().collection("users").orderBy('balance', 'desc').limit(10).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        // doc.data() is never undefined for query doc snapshots
        balanceLeaders.push({
          balance: data.balance,
          name: data.fullname,
          id: data.id,
        });
        //console.log(doc.balance, " => ", doc.data());
      });
    });
    // [END get_multiple_all]
}

/* ///////////////////////////////////////////   END CREATE LEADERBOARD BACKEND   //////////////////////////////////////////////// */

export default function LeaderboardScreen({navigation}){
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(true);
    const [show, setShow] = useState(false);

    async function leaderboard(){
      setLoading(true);
      balanceLeaders = [];
      betWinLeaders = [];
      await createBalanceLeaders();
      for (let i = 0; i < balanceLeaders.length; i++){
        console.log('Rank ' + (i + 1) + ' in balance: ' + balanceLeaders[i].name + ' with $' + balanceLeaders[i].balance);
      }
      console.log('\n\n');
      await createBetWinLeaders();
      for (let i = 0; i < betWinLeaders.length; i++){
        console.log('Rank ' + (i + 1) + ' in correct bets: ' + betWinLeaders[i].name + ' with ' + betWinLeaders[i].betWins + ' correct bets.');
      }
      setLoading(false);
      setRefreshing(false);
    }

    function renderButton(show){
      if(show){
        return (
        <TouchableHighlight
          style = {styles.toggleButton}
          onPress={() => setShow(!show)}
        >
          <Text>Bet Wins</Text>
        </TouchableHighlight>
        )}
      else {
        return (
        <TouchableHighlight
          style = {styles.toggleButton}
          onPress={() => setShow(!show)}
        >
        <Text>Highest Balance</Text>
        </TouchableHighlight>

      )};
    }

    function renderTitle(show){
      if(show){
        return(
          <Text>Account Balance</Text>
        )
      }
      else {
        return(
        <Text>Total Bets Won</Text>
        )
      };
    }

    useLayoutEffect(() => {
        navigation.setOptions({
          title: 'Leaderboard',
        });
      }, []);
    
    useEffect(() => {
      leaderboard();
    }, []);

    if (loading){
      return(<ActivityIndicator
        style={{marginTop: 30}}
        size="large"
        animating={loading}
        color={AppStyles.color.tint}
      />);
    }
    else {
    return (
        <View style={styles.container}>
          <Image source = {AppIcon.images.trophy}
            style = {{width: 150, height: 150, marginTop: 10}}
             />
            <Text style={styles.title}> {renderTitle(show)} </Text>
          <Text style = {{marginTop: 15, fontSize: 20, fontWeight:'300'}}> Sort by: </Text>
          {renderButton(show)} 
          <Text> {'\n'} </Text>
          {show === true ?   
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={leaderboard} />
            }
            data={balanceLeaders}
            renderItem={({item}) => 
            <View style = {styles.previewContainer}>
            <View
                style={[
                styles.box,
                {
                  flexBasis: 50,
                  flexGrow: 0,
                  flexShrink: 1,
                  paddingLeft: 20,
                  //backgroundColor: 'powderblue',
                  justifyContent: "space-around",
                },
                ]}>

              <Image 
                source={AppIcon.images.medal}
                style={{width: 45, height: 48}}
               />
              </View>
               <View
                style={[
                styles.box,
                {
                  flexBasis: 200,
                  flexGrow: 1,
                  flexShrink: 0,
                  paddingLeft: 50,
                  //backgroundColor: 'powderblue',
                  justifyContent: 'center',
                  justifyContent: 'space-evenly',
                },
                ]}>

              <Text style = {styles.nameText}> {item.name} </Text> 
              <Text>${item.balance.toFixed(2)} </Text> 
              </View>

        
            </View>
            }
            keyExtractor={item => item.id}
          />
          :
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={leaderboard} />
            }
            data={betWinLeaders}
            renderItem={({item}) => 
            <View style = {styles.previewContainer}>
            <View
                style={[
                styles.box,
                {
                  flexBasis: 50,
                  flexGrow: 0,
                  flexShrink: 1,
                  paddingLeft: 20,
                  //backgroundColor: 'powderblue',
                  justifyContent: "space-around",
                },
                ]}>

              <Image 
                source={AppIcon.images.medal}
                style={{width: 45, height: 48}}
               />
              </View>
               <View
                style={[
                styles.box,
                {
                  flexBasis: 200,
                  flexGrow: 1,
                  flexShrink: 0,
                  paddingLeft: 50,
                  //backgroundColor: 'powderblue',
                  justifyContent: 'center',
                  justifyContent: 'space-evenly',
                },
                ]}>

              <Text style = {styles.nameText}> {item.name} </Text> 
              <Text>Total Wins: {item.betWins} </Text> 
              </View>

        
            </View>
            }
            keyExtractor={item => item.id}
          />
          }
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: Configuration.home.listing_item.offset,
  },
  nameText:{
    fontWeight: '600',
  },
  toggleButton:{
    backgroundColor: 'aliceblue',
    borderRadius: 30,
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
  },
  previewContainer:{
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'aliceblue',
    marginBottom: 45,
    borderWidth: 1,
    borderRadius: 15,
  },
  title: {
    fontWeight: 'bold',
    color: AppStyles.color.title,
    fontSize: 25,
    textAlign: 'center',
    paddingBottom: 10,
    marginTop:20,
  },
  body: {
    fontSize: 13,
  },
  box: {
    flex: 1,
    height: 100,
  },
  userPhoto: {
    width: 30,
    height: 30,
    borderRadius: 10,
    marginRight: 5,
  },
  flexCol: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRight: {
    paddingLeft: '5%',
    fontSize: 13,
  },
  verticleLine: {
    height: '80%',
    width: 1.5,
    backgroundColor: '#909090',
    marginLeft: '4%',
  },
  outerView: {
    borderWidth: 1,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dateStatus: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: '3%',
  },
  logoTeam: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  arrowLeft: {
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: 'tomato',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    paddingLeft: '3%',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
});