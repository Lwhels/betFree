import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import firestore from '@react-native-firebase/firestore';
import '../global.js';

function expectedReturn(selectedTeam, currentBet, betAmount) {
  var converted = 0;
  var odds;
  if (selectedTeam == 'No Team' || betAmount == 0) {
    return betAmount;
  }
  if (selectedTeam == currentBet['game']['teams']['home']['name']) {
    odds = convertOdds(
      currentBet['bookmakers'][0]['bets'][1]['values'][0]['odd'],
    );
  } else if (selectedTeam == currentBet['game']['teams']['away']['name']) {
    odds = convertOdds(
      currentBet['bookmakers'][0]['bets'][1]['values'][1]['odd'],
    );
  } else {
    return NaN;
  }
  if (odds[0] == '+') {
    odds = odds.substring(1, odds.length);
    odds = Number(odds);
    odds = odds / 100;
    converted = betAmount * odds;
    return Number(Number(converted).toFixed(2));
  } else if (odds[0] == '-') {
    odds = odds.substring(1, odds.length);
    odds = Number(odds);
    odds = 100 / odds;
    converted = betAmount * odds;
  } else {
    return NaN;
  }
  return Number((Number(betAmount) + Number(converted)).toFixed(2));
}
//convert odds from decimal to american moneyline
function convertOdds(odds) {
  if (odds < 2) {
    return Math.round(-100 / (odds - 1)).toFixed(0);
  } else {
    return '+' + Math.round(100 * (odds - 1)).toFixed(0);
  }
}

function textOdds(data, index) {
  if (index != 0 && index != 1) {
    return;
  }
  var bookmaker = data['bookmakers'][0]['bets'];
  if (bookmaker.length < 2) {
    return ' ';
  }
  var line = bookmaker[1]['values'];
  var odds = line[index]['odd'];
  return convertOdds(odds);
}

export default function PlaceBetScreen({navigation}) {
  const defaultOdds = [
    {
      bookmakers: [{bets: [{}, {values: [{odd: 2}, {odd: 2}]}]}],
      game: {
        status: {short: 'done'},
        id: 1,
        date: 'practice',
        teams: {
          away: {
            logo: 'https://media.api-sports.io/basketball/teams/155.png',
            name: 'Phoenix Suns',
          },
          home: {
            logo: 'https://media.api-sports.io/basketball/teams/155.png',
            name: 'Phoenix Suns',
          },
        },
      },
    },
  ];
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBet, setCurrentBet] = useState(defaultOdds[0]);
  const [selectedTeam, setSelectedTeam] = useState('No Team');
  const [betAmount, setBetAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [odds, setOdds] = useState(defaultOdds);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const fetchBets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://v1.basketball.api-sports.io/odds?league=12&season=2022-2023',
        {
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'v1.basketball.api-sports.io',
            'x-rapidapi-key': '28fac37d23a94d5717f67963c07baa3f',
          },
        },
      );
      const data = await response.json();
      setOdds(data['response']);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchBets();
  }, []);

  var oddsToDisplay = [];
  for (let i = 0; i < odds.length; i++) {
    if (
      odds[i]['game']['status']['short'] != 'FT' &&
      odds[i]['game']['status']['short'] != 'AOT' &&
      odds[i]['bookmakers'][0]['bets'].length >= 2
    ) {
      oddsToDisplay.push(odds[i]);
    }
  }

  function openModal(item) {
    if (
      item['game']['status']['short'] == 'FT' ||
      item['game']['status']['short'] == 'AOT'
    ) {
      Alert.alert('Game Has Already Ended');
      return;
    }

    setCurrentBet(item);
    setModalVisible(!modalVisible);
  }

  function selectTeam(team) {
    setSelectedTeam(team);
  }
  function placeBet() {
    if (selectedTeam == 'No Team') {
      Alert.alert('Please Select A Team');
      return;
    }
    for (let i = 0; i < betAmount.length; i++) {
      if (betAmount[i] < '0' || betAmount[i] > 9) {
        Alert.alert('Please Enter A Positive Integer Bet Amount');
        return;
      }
    }

    if (betAmount <= 0) {
      Alert.alert('Please Enter A Valid Bet Amount');
      return;
    }
    firestore() // check if the user has enough balance
      .collection('users')
      .doc(global.currentuid)
      .get()
      .then((users) => {
        var data = users.data();
        if (data.balance < betAmount) {
          Alert.alert('Insufficient Funds');
          return;
        } // if they have enough balance, allow the bet to be placed.
        let current = new Date();
        let cDate =
          current.getFullYear() +
          '-' +
          (current.getMonth() + 1) +
          '-' +
          current.getDate();
        let cTime =
          current.getHours() +
          ':' +
          current.getMinutes() +
          ':' +
          current.getSeconds();
        let dateTime = cDate + ',' + cTime; // current time used to distinguish bet
        let dataToSend = {
          balance: data.balance - betAmount,
        };
        let bets = {
          teamBetOn: selectedTeam,
          dateOfGame: currentBet['game']['date'].substring(5, 10),
          gameID: currentBet['game']['id'],
          betAmount: Number(betAmount),
          moneyToBePaid: expectedReturn(selectedTeam, currentBet, betAmount),
          dateTimeID: dateTime,
        };
        firestore()
          .collection('users')
          .doc(global.currentuid)
          .update(dataToSend);
        firestore() // store the results of the bet
          .collection('users')
          .doc(global.currentuid)
          .collection('activebets')
          .doc(dateTime)
          .set(bets, {merge: true});
      });
    setModalVisible(!modalVisible);
    Alert.alert('Bet Placed!');
    setBetAmount(0);
    setSelectedTeam('No Team');
  }
  function closeBet() {
    setModalVisible(!modalVisible);
    setBetAmount(0);
    setSelectedTeam('No Team');
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Betting Page',
    });
  }, []);

  firestore()
    .collection('users')
    .doc(global.currentuid)
    .get()
    .then((users) => {
      setBalance(users.data().balance);
    });

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
      <View style={styles.container} visible={!loading}>
        <Text style={styles.title}> Bets</Text>
        <Text style={styles.balance}> Balance: ${balance.toFixed(2)} </Text>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, {backgroundColor: 'grey'}]}>
              <View style={styles.flexCol}>
                <Text style={{color: 'white', marginBottom: 5}}>
                  Selected Team: {selectedTeam}
                </Text>
                <View style={styles.flexRow}>
                  <View
                    style={[
                      {
                        alignSelf: 'flex-start',
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() =>
                        selectTeam(currentBet['game']['teams']['away']['name'])
                      }>
                      <Image
                        source={{
                          uri: currentBet['game']['teams']['away']['logo'],
                        }}
                        style={styles.userPhoto}
                      />
                    </TouchableOpacity>
                    <Text style={{color: 'white'}}>
                      {' '}
                      {textOdds(currentBet, 1)}{' '}
                    </Text>
                  </View>
                  <Text
                    style={{color: 'white', marginLeft: 10, marginRight: 10}}>
                    {' '}
                    @{' '}
                  </Text>
                  <View
                    style={[
                      {
                        alignSelf: 'flex-end',
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() =>
                        selectTeam(currentBet['game']['teams']['home']['name'])
                      }>
                      <Image
                        source={{
                          uri: currentBet['game']['teams']['home']['logo'],
                        }}
                        style={styles.userPhoto}
                      />
                    </TouchableOpacity>
                    <Text style={{color: 'white'}}>
                      {' '}
                      {textOdds(currentBet, 0)}{' '}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <View
                  style={[
                    styles.body,
                    {
                      backgroundColor: '#D3D3D3',
                      borderRadius: 20,
                      padding: 8,
                      marginTop: 5,
                      marginBottom: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignContent: 'center',
                    },
                  ]}>
                  <Text style={{color: AppStyles.color.text, marginRight: -4}}>
                    Stake: $
                  </Text>
                  <TextInput
                    style={{
                      color: AppStyles.color.grey,
                      height: 36,
                      marginTop: 5,
                    }}
                    placeholder="0.00"
                    placeholderTextColor={AppStyles.color.text}
                    underlineColorAndroid="transparent"
                    onChangeText={setBetAmount}
                    value={betAmount}
                    keyboardType="numeric"
                  />
                </View>
                <Text
                  style={[
                    styles.body,
                    {
                      backgroundColor: '#D3D3D3',
                      borderRadius: 20,
                      alignSelf: 'center',
                      padding: 8,
                      marginTop: 5,
                      marginBottom: 5,
                      width: 110,
                    },
                  ]}>
                  Win: $
                  {(
                    expectedReturn(selectedTeam, currentBet, betAmount) -
                    betAmount
                  ).toFixed(2)}
                </Text>
              </View>
              <Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonOpen]}
                  onPress={() => placeBet()}>
                  <Text style={styles.textStyle}>Bet</Text>
                </TouchableOpacity>
                <Text> </Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => closeBet()}>
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </Modal>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchBets} />
          }
          data={oddsToDisplay}
          renderItem={({item}) => (
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => openModal(item)}
                  style={styles.touchable}>
                  <View style={styles.flexCol}>
                    <View style={styles.flexRow}>
                      <View style={styles.flexCol}>
                        <View style={styles.flexRow}>
                          <Image
                            source={{
                              uri: item['game']['teams']['away']['logo'],
                            }}
                            style={styles.userPhoto}
                          />
                          <Text style={styles.textStyle}>
                            {' '}
                            {textOdds(item, 1)}{' '}
                          </Text>
                        </View>

                        <Text style={styles.textStyle}>
                          {item['game']['teams']['away']['name']}{' '}
                        </Text>
                      </View>
                      <View style={styles.flexCol}>
                        <Text style={styles.textStyle}> @ </Text>
                      </View>
                      <View style={styles.flexCol}>
                        <View style={styles.flexRow}>
                          <Text style={styles.textStyle}>
                            {' '}
                            {textOdds(item, 0)}{' '}
                          </Text>
                          <Image
                            source={{
                              uri: item['game']['teams']['home']['logo'],
                            }}
                            style={styles.userPhoto}
                          />
                        </View>
                        <Text style={styles.textStyle}>
                          {item['game']['teams']['home']['name']}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                <Text> {'\n'}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item['game']['id']}
          contentContainerStyle={styles.list}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  userPhoto: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  btnStyle: {
    justifyContent: 'center',
    width: '100%',
    height: '8%',
    marginTop: 30,
    borderRadius: 15,
    backgroundColor: 'green',
  },
  list: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    //flexDirection: 'column',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: '400',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  body: {
    height: 36,
    color: AppStyles.color.text,
  },
  touchable: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 320,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#2c6f99',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  flexCol: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    color: '#2c6f99',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: '5%',
  },
});
