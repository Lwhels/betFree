import React, {useLayoutEffect, useState} from 'react';
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
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import firestore from '@react-native-firebase/firestore';
import '../global.js'

//
function textOdds(data) {
  var odds = data['bookmakers'][0]['bets'][1]['values'];
  var homeOdds = odds['0']['odd'];
  var awayOdds = odds['1']['odd'];
  homeOdds = convertOdds(homeOdds);
  awayOdds = convertOdds(awayOdds);
  return awayOdds + '                                             ' + homeOdds;
}

//convert odds from decimal to american moneyline
function convertOdds(odds) {
  if (odds < 2) {
    return Math.round(-100 / (odds - 1)).toFixed(0);
  } else {
    return '+' + Math.round(100 * (odds - 1)).toFixed(0);
  }
}

export default function PlaceBetScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBet, setCurrentBet] = useState(global.fetched_odds[0]);
  const [selectedTeam, setSelectedTeam] = useState('No Team');
  const [betAmount, setBetAmount] = useState(0);

  function openModal(item) {
    if (item['game']['status']['short'] == 'FT' || item['game']['status']['short'] == 'AOT'){
      Alert.alert('Game has already ended');
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
      Alert.alert('please select a team');
      return;
    }
    if (betAmount <= 0) {
      Alert.alert('please enter a valid bet amount');
      return;
    }
    firestore().collection('users').doc(global.currentuid).get().then((users) => {
      var data = users.data();
      if (data.balance < betAmount) { 
        Alert.alert('insufficient funds');
        return;
      } 
      let gameID = currentBet['game']['id'];
      let stringID = gameID.toString();
      let dataToSend = {
        balance: data.balance - betAmount,
      }
      let bets = {
        teamBetOn: selectedTeam,
        dateOfGame: currentBet['game']['date'].substring(5, 10),
        gameID: gameID,
        betAmount: betAmount,
      }
      firestore().collection('users').doc(global.currentuid).update(dataToSend);
      firestore().collection('users').doc(global.currentuid).collection('activebets').doc(stringID).set(bets, { merge: true });
    });
    setModalVisible(!modalVisible);
    console.log('bet placed: ' + betAmount);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Place Bets Here! </Text>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Selected Team: {selectedTeam}</Text>
            <Text>
              <TouchableOpacity
                onPress={() =>
                  selectTeam(currentBet['game']['teams']['away']['name'])
                }>
                <Image
                  source={{uri: currentBet['game']['teams']['away']['logo']}}
                  style={styles.userPhoto}
                />
              </TouchableOpacity>
              <Text> {textOdds(currentBet)} </Text>
              <TouchableOpacity
                onPress={() =>
                  selectTeam(currentBet['game']['teams']['home']['name'])
                }>
                <Image
                  source={{uri: currentBet['game']['teams']['home']['logo']}}
                  style={styles.userPhoto}
                />
              </TouchableOpacity>
            </Text>
            <TextInput
              style={styles.body}
              placeholder="Amount"
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
              onChangeText={setBetAmount}
              value={betAmount}
            />
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
                <Text style={styles.textStyle}>close</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </Modal>
      <FlatList
        data={global.fetched_odds}
        renderItem={({item}) => (
          <View>
            <View>
              <TouchableOpacity
                onPress={() => openModal(item)}
                style={styles.touchable}>
                <Text>
                  <Image
                    source={{uri: item['game']['teams']['away']['logo']}}
                    style={styles.userPhoto}
                  />
                  <Text>{textOdds(item)}</Text>
                  <Image
                    source={{uri: item['game']['teams']['home']['logo']}}
                    style={styles.userPhoto}
                  />
                </Text>
                <Text style={styles.textStyle}>
                  <Text>{item['game']['teams']['away']['name']} </Text>
                  <Text> @ </Text>
                  <Text>{item['game']['teams']['home']['name']}</Text>
                </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  userPhoto: {
    width: 40,
    height: 40,
    alignSelf: 'flex-start',
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
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  touchable: {
    justifyContent: 'center',
    alignContent: 'center',
    width: 320,
    height: 80,
    borderWidth: 1,
    borderRadius: 7,

    //flexDirection: 'column',
  },
});
