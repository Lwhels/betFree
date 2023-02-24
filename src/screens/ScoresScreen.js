import React, {useLayoutEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import '../global.js';

export default function ScoresScreen({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Scores',
    });
  }, []);

  var allGames = [];
  var allGames = global.fetched_games;
  allGames.reverse();
  var gamesToDisplay = [];

  for (let i = 0; i < allGames.length; i++) {
    if (allGames[i]['status']['short'] != 'NS') {
      gamesToDisplay.push(allGames[i]);
    }
  }
  gamesToDisplay = gamesToDisplay.splice(0, 50);

  function displayDate(date) {
    return date.substring(5, 10);
  }

  allGames.reverse();
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Scores Page </Text>
      <FlatList
        data={gamesToDisplay}
        renderItem={({item}) => (
          <View>
            <Text>
              <Text>{displayDate(item['date'])}</Text>
              <Image
                source={{uri: item['teams']['away']['logo']}}
                style={styles.userPhoto}
              />
              <Text>
                {item['scores']['away']['total']}
                {item['status']['long']}
                {item['scores']['home']['total']}
              </Text>
              <Image
                source={{uri: item['teams']['home']['logo']}}
                style={styles.userPhoto}
              />
            </Text>
            <Text>
              <Text>{item['teams']['away']['name']} </Text>
              <Text> @ </Text>
              <Text>{item['teams']['home']['name']}</Text>
            </Text>
            <Text> {'\n'}</Text>
          </View>
        )}
        keyExtractor={(item) => item['id']}
        style={styles.list}
      />
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
    textAlign: 'center',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
  },
});
