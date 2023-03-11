import React, {useLayoutEffect, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, Pressable, Button} from 'react-native';
import {connect, useSelector} from 'react-redux';
import { AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import firestore from '@react-native-firebase/firestore';
import 'firebase/compat/firestore';

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
        <Button
          title="Correct bets leaderboard"
          color="#f194ff"
          onPress={() => setShow(!show)}
        />
        )}
      else {
        return (
        <Button
          title="Top balance leaderboard"
          color="#f194ff"
          onPress={() => setShow(!show)}
        />
      )};
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
          <Text style={styles.title}> Leaderboard Page </Text>
          <Text> {'\n'} </Text>
          {renderButton(show)} 
          <Text> {'\n'} </Text>
          {show === true ?   
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={leaderboard} />
            }
            data={balanceLeaders}
            renderItem={({item}) => 
            <View>
              <Text> {item.name} {item.balance}</Text> 
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
            <View>
              <Text> {item.name} {item.betWins}</Text> 
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
  title: {
    fontWeight: 'bold',
    color: AppStyles.color.title,
    fontSize: 25,
    textAlign: 'center',
  },
  body: {
    fontSize: 13,
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