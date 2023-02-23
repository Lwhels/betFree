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
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';



//
function textOdds(data){
  var odds = data['bookmakers'][0]['bets'][1]['values'];
  var homeOdds = odds['0']['odd'];
  var awayOdds = odds['1']['odd'];
  homeOdds = convertOdds(homeOdds);
  awayOdds = convertOdds(awayOdds);
  return awayOdds + "                                " + homeOdds;
}

//convert odds from decimal to american moneyline
function convertOdds(odds){
  if (odds < 2){
      return (Math.round(-100 / (odds -1))).toFixed(0);
  } else {
      return "+" + (Math.round(100 * (odds -1))).toFixed(0);
  }
}

export default function PlaceBetScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  var currentBet =[];

  function openModal(item){
    currentBet = item;
    setModalVisible(!modalVisible);
    console.log(currentBet);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Betting Page',
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Betting Page </Text>
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
            <Text style={styles.modalText}>Hello World!</Text>

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={global.fetched_odds}
        renderItem={({item}) => (
          <View>
            <View>
            <TouchableOpacity onPress={() => openModal(item)}>
            <Text>
            <Image source={{uri: item['game']['teams']['away']['logo']}} style={styles.userPhoto}/>
            <Text>{textOdds(item)}</Text>
            <Image source={{uri: item['game']['teams']['home']['logo']}} style={styles.userPhoto}/>
            </Text>
            <Text>
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
        style= {styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  },
  btnStyle: {
    justifyContent: 'center',
    width: '85%',
    height: '8%',
    marginTop: 30,
    borderRadius: 15,
    backgroundColor: 'green',
  },
  list: {
    width: '85%',
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
});
