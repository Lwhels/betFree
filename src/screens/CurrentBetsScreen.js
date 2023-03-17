import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableHighlight,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles, AppIcon} from '../AppStyles';
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

async function loadArrays() {
  const activebets = [];
  const pastbets = [];
  await firestore()
    .collection('users')
    .doc(global.currentuid)
    .collection('activebets')
    .get()
    .then((querySnapshot) => {
      console.log('Loading up activebets.');
      querySnapshot.docs.forEach((doc) => {
        activebets.push(doc.data());
      });
    })
    .catch((error) => {
      console.error('Error retrieving active bets: ', error);
    });

  await firestore()
    .collection('users')
    .doc(global.currentuid)
    .collection('pastbets')
    .get()
    .then((querySnapshot) => {
      console.log('Loading up pastbets.');
      querySnapshot.docs.forEach((doc) => {
        pastbets.push(doc.data());
      });
    })
    .catch((error) => {
      console.error('Error retrieving past bets: ', error);
    });

  return [activebets, pastbets];
}
/*****************************************************************************************************************************************/

export default function CurrentBets({navigation}) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activebets, setActiveBets] = useState([]);
  const [pastbets, setPastBets] = useState([]);

  const [refreshing, setRefreshing] = useState(true);
  const [show, setShow] = useState(false);
  const imageDict = {
    'Atlanta Hawks': 'https://media-1.api-sports.io/basketball/teams/132.png',
    'Boston Celtics': 'https://media-2.api-sports.io/basketball/teams/133.png',
    'Brooklyn Nets': 'https://media-2.api-sports.io/basketball/teams/134.png',
    'Charlotte Hornets':
      'https://media-1.api-sports.io/basketball/teams/135.png',
    'Chicago Bulls': 'https://media-1.api-sports.io/basketball/teams/136.png',
    'Cleveland Cavaliers':
      'https://media-2.api-sports.io/basketball/teams/137.png',
    'Dallas Mavericks':
      'https://media-2.api-sports.io/basketball/teams/138.png',
    'Denver Nuggets': 'https://media-1.api-sports.io/basketball/teams/139.png',
    'Detroit Pistons': 'https://media-2.api-sports.io/basketball/teams/140.png',
    'Golden State Warriors':
      'https://media-1.api-sports.io/basketball/teams/141.png',
    'Houston Rockets': 'https://media.api-sports.io/basketball/teams/142.png',
    'Indiana Pacers': 'https://media-1.api-sports.io/basketball/teams/143.png',
    'Los Angeles Clippers':
      'https://media-2.api-sports.io/basketball/teams/144.png',
    'Los Angeles Lakers':
      'https://media.api-sports.io/basketball/teams/145.png',
    'Memphis Grizzlies':
      'https://media-2.api-sports.io/basketball/teams/146.png',
    'Miami Heat': 'https://media-2.api-sports.io/basketball/teams/147.png',
    'Milwaukee Bucks': 'https://media-1.api-sports.io/basketball/teams/148.png',
    'Minnesota Timberwolves':
      'https://media-1.api-sports.io/basketball/teams/149.png',
    'New Orleans Pelicans':
      'https://media-1.api-sports.io/basketball/teams/150.png',
    'New York Knicks': 'https://media.api-sports.io/basketball/teams/151.png',
    'Oklahoma City Thunder':
      'https://media.api-sports.io/basketball/teams/152.png',
    'Orlando Magic': 'https://media-1.api-sports.io/basketball/teams/153.png',
    'Philadelphia 76ers':
      'https://media.api-sports.io/basketball/teams/154.png',
    'Phoenix Suns': 'https://media.api-sports.io/basketball/teams/155.png',
    'Portland Trail Blazers':
      'https://media.api-sports.io/basketball/teams/156.png',
    'Sacramento Kings':
      'https://media-1.api-sports.io/basketball/teams/157.png',
    'San Antonio Spurs': 'https://media.api-sports.io/basketball/teams/158.png',
    'Toronto Raptors': 'https://media-2.api-sports.io/basketball/teams/159.png',
    'Utah Jazz': 'https://media-2.api-sports.io/basketball/teams/160.png',
    'Washington Wizards':
      'https://media-1.api-sports.io/basketball/teams/161.png',
  };

  function output(item) {
    if (item.moneyWon > 0) {
      return 'Amount Won: $' + item.moneyWon.toFixed(2);
    } else {
      return 'Amount Lost: $' + item.betAmount.toFixed(2);
    }
  }

  // FIELDS IN ACTIVE BETS = betAmount, dateOfGame, dateTimeID, gameID, moneyToBePaid, teamBetOn
  // FIELDS IN PAST BETS = betAmount, betWon (bool), dateOfGame, dateTimeID, gameID, moneyWon, teamBetOn
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
    loadTools();
    console.log(imageDict);
    setLoading(false);
    setRefreshing(false);
  };
  const loadTools = async () => {
    setLoading(true);
    await checkBets(games);
    var temp = await loadArrays();
    setActiveBets(temp[0]);
    setPastBets(temp[1]);
    setLoading(false);
  };
  // console.log('ACTIVE BETS', activebets);
  // console.log('PAST BETS', pastbets);

  /*     END LOAD ARRAY MATERIALS FOR FRONTEND      */
  function renderButton(show) {
    if (!show) {
      return (
        <TouchableHighlight
          style={styles.toggleButton}
          onPress={() => setShow(!show)}>
          <Text style={styles.toggleText}>Active Bets</Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          style={styles.toggleButton}
          onPress={() => setShow(!show)}>
          <Text style={styles.toggleText}>Past Bets</Text>
        </TouchableHighlight>
      );
    }
  }

  function renderTitle(show) {
    if (show) {
      return <Text>Active Bets</Text>;
    } else {
      return <Text>Past Bets</Text>;
    }
  }

  useEffect(() => {
    fetchBets();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'User Bets',
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
        <Image
          source={AppIcon.images.stocks}
          style={{width: 155, height: 165, marginTop: 5}}
        />
        <Text style={styles.title}> {renderTitle(show)} </Text>
        <Text style={{marginTop: 15, fontSize: 20, fontWeight: '300'}}>
          {' '}
          Sort by:{' '}
        </Text>
        {renderButton(show)}
        <Text> {'\n'} </Text>
        {show === true ? (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchBets} />
            }
            data={activebets}
            renderItem={({item}) => (
              <View style={styles.previewContainer}>
              <View
                style={[
                  styles.box,
                  {
                    flexBasis: 50,
                    flexGrow: 0,
                    flexShrink: 1,
                    //backgroundColor: 'aliceblue',
                    justifyContent: 'space-around',
                  },
                ]}>
                    <Image
                      source={{
                        uri: imageDict[item.teamBetOn],
                      }}
                      style={[
                        styles.userPhoto,
                        {marginRight: 15, marginLeft: 10},
                      ]}
                    />
              </View>
                <View
                  style={[
                    styles.box,
                    {
                      flexBasis: 200,
                      flexGrow: 1,
                      flexShrink: 0,
                      //backgroundColor: 'powderblue',
                      justifyContent: 'space-evenly',
                    },
                  ]}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginLeft: 8,
                    }}>

                    <View style={{flexDirection: 'column'}}>
                      <Text style={styles.betOn}>
                        {'Team Bet On: \n' + item.teamBetOn}
                      </Text>
                      <Text style={styles.betAmount}>
                        {'Amount Bet: $' + item.betAmount.toFixed(2)}{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchBets} />
            }
            data={pastbets}
            renderItem={({item}) => (
              <View style={styles.previewContainer}>
              <View
                style={[
                  styles.box,
                  {
                    flexBasis: 50,
                    flexGrow: 0,
                    flexShrink: 1,
                    //backgroundColor: 'aliceblue',
                    justifyContent: 'space-around',
                  },
                ]}>
                    <Image
                      source={{
                        uri: imageDict[item.teamBetOn],
                      }}
                      style={[
                        styles.userPhoto,
                        {marginRight: 15, marginLeft: 10},
                      ]}
                    />
              </View>
                <View
                  style={[
                    styles.box,
                    {
                      flexBasis: 200,
                      flexGrow: 1,
                      flexShrink: 0,
                      //backgroundColor: 'powderblue',
                      justifyContent: 'space-evenly',
                    },
                  ]}>
                   <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}>
                      <Text style={styles.betOn}>
                        {'Team Bet On: \n' + item.teamBetOn}
                      </Text>
                      <View style={{height: '5%'}}></View>
                      <Text style={[styles.betAmount]}>{output(item)} </Text>
                    </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
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
  nameText: {
    alignItems: 'baseline',
    fontWeight: '600',
    color: 'white',
  },
  betOn: {
    alignItems: 'baseline',
    fontWeight: '600',
    color: 'white',
  },
  betAmount: {
    fontWeight: '600',
    color: 'white',
    marginRight: 10,
  },
  winText: {
    color: 'white',
  },
  toggleButton: {
    backgroundColor: '#2c6f99',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    borderRadius: 30,
    padding: 10,
    marginTop: 10,
  },
  toggleText: {
    color: 'white',
  },
  previewContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2c6f99',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 7,
    marginBottom: 45,
    borderRadius: 15,
  },
  title: {
    fontWeight: 'bold',
    color: AppStyles.color.title,
    fontSize: 25,
    textAlign: 'center',
    paddingBottom: 10,
    marginTop: 20,
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
