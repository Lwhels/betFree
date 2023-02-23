import React, {useLayoutEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';


export default function PlaceBetScreen({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Betting Page',
    });
  }, []);
  // <Image source={{uri: names[1]}} style={{width: 100, height: 100}} />
  /*
  var buttonsListArr = [];

 for (let i = 0; i < global.fetched_odds.length; i++) {
    var game = global.fetched_odds[i]['game'];
    var teams = game['teams'];
    var score = game['scores'];
    var timeRemaining = game['status']['long'];
    var home = teams['home'];
    var away = teams['away'];

    buttonsListArr.push(
      <TouchableHighlight style={styles.btnStyle}>
        <Image source={{uri: home['logo']}} style={{width: 40, height: 40}} />
        <Text> {home['name']} </Text>
      </TouchableHighlight>
    );
  }
*/
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Betting Page </Text>
      <FlatList
        data={global.fetched_odds}
        renderItem={({item}) => (
          <View>
            <View>
            <TouchableOpacity>
            <Text>
            <Image source={{uri: item['game']['teams']['home']['logo']}} style={{width: 20, height: 20}}/>
            <Text>                                                                   </Text>
            <Image source={{uri: item['game']['teams']['away']['logo']}} style={{width: 20, height: 20}}/>
            </Text>
            <Text>
            <Text>{item['game']['teams']['home']['name']}</Text>
            <Text> Vs. </Text>
            <Text>{item['game']['teams']['away']['name']} </Text>
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
    borderRadius: 20,
    marginLeft: 5,
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
});
