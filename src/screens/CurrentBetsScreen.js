import React, {useLayoutEffect, useEffect, useState} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import firestore from '@react-native-firebase/firestore';
import '../global.js';

/* /////////////////////////////////////////////   UPDATE AND CHECK BETS    //////////////////////////////////////////// */

function homeWin(game) {
  return game['scores']['home']['total'] > game['scores']['away']['total'];
}

async function moveBet(currentdoc, game) {
  console.log('Moving bet to past bets.');
  var betWon = false;
  var moneyWon = 0;
  //If bet was correctly made
  if (homeWin(game) && currentdoc.teamBetOn == game['teams']['home']['name']) {
    console.log('Won the bet!');
    betWon = true;
    moneyWon = currentdoc.moneyToBePaid;
    let balanceUpdate = 0;
    let betWins = 0;
    await firestore()
      .collection('users')
      .doc(global.currentuid)
      .get()
      .then((users) => {
        var data = users.data();
        balanceUpdate = data.balance + Number(currentdoc.moneyToBePaid);
        betWins = data.betWins + 1;
        firestore()
          .collection('users')
          .doc(global.currentuid)
          .set({balance: balanceUpdate, betWins: betWins}, {merge: true});
      })
      .catch((error) => {
        console.error('Error retrieving user values: ', error);
      });
  }
  // always store bet
  let data = {
    betAmount: currentdoc.betAmount,
    dateOfGame: currentdoc.dateOfGame,
    gameID: currentdoc.gameID,
    teamBetOn: currentdoc.teamBetOn,
    moneyWon: moneyWon,
    dateTimeID: currentdoc.dateTimeID,
    betWon: betWon,
  };
  await firestore()
    .collection('users')
    .doc(global.currentuid)
    .collection('pastbets')
    .doc(currentdoc.dateTimeID)
    .set(data, {merge: true}); // set data in past bets
  await firestore()
    .collection('users')
    .doc(global.currentuid)
    .collection('activebets')
    .doc(currentdoc.dateTimeID)
    .delete() // delete data from active bets
    .then(() => {
      console.log('Document successfully deleted!');
    })
    .catch((error) => {
      console.error('Error removing document: ', error);
    });
}

async function checkBets(games) {
  console.log('Update bets.');
  const markers = [];
  await firestore()
    .collection('users')
    .doc(global.currentuid)
    .collection('activebets')
    .get()
    .then((querySnapshot) => {
      console.log('Loading up markers.');
      querySnapshot.docs.forEach((doc) => {
        markers.push(doc.data());
      });
    })
    .catch((error) => {
      console.error('Error retrieving active bets: ', error);
    });
  if (markers.length > 0) {
    for (let i = 0; i < markers.length; i++) {
      for (let j = 0; j < games.length; j++) {
        if (
          (games[j]['status']['short'] == 'FT' &&
            games[j]['id'] == markers[i].gameID) ||
          (games[j]['status']['short'] == 'AOT' &&
            games[j]['id'] == markers[i].gameID)
        ) {
          moveBet(markers[i], games[j]);
        }
      }
    }
  }
}
/*****************************************************************************************************************************************/

export default function CurrentBets({navigation}) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://v1.basketball.api-sports.io/games?league=12&season=2022-2023',
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'v1.basketball.api-sports.io',
            'x-rapidapi-key': '28fac37d23a94d5717f67963c07baa3f',
          },
        },
      );
      const data = await response.json();
      setGames(data['response']);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchBets();
  }, []);
  checkBets(games);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Current Bets',
    });
  }, []);
  if (loading) {
    return (
      <ActivityIndicator
        style={{marginTop: 30}}
        size="large"
        animating={loading}
        color={AppStyles.color.tint}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> My Bets Page </Text>
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
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
  },
});
