import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import '../global.js';

function gameStatus(item) {
  var apiStatus;
  var ret = '';
  apiStatus = item['status']['short'];
  switch (apiStatus) {
    case 'AOT':
      ret = 'Final/OT';
      break;
    case 'FT':
      ret = 'Final';
      break;
    case 'NS':
      ret = item['date'];
      break;
    default:
      ret = apiStatus;
      break;
  }
  return ret;
}
export default function ScoresScreen({navigation}) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Scores',
    });
  }, []);
  const [games, setGames] = useState([]);
  useEffect(() => {
    fetchGames();
  }, []);
  const fetchGames = async () => {
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
    setRefreshing(false);
  };
  var allGames = [];
  var allGames = games;
  console.log(typeof allGames);
  console.log(typeof games);
  allGames.reverse();
  var gamesToDisplay = [];

  for (let i = 0; i < allGames.length; i++) {
    if (
      allGames[i]['status']['short'] != 'NS' &&
      allGames[i]['status']['short'] != 'CANC'
    ) {
      gamesToDisplay.push(allGames[i]);
    }
  }
  gamesToDisplay = gamesToDisplay.splice(0, 50);

  function displayDate(date) {
    var shortDate = date.substring(5, 10);
    shortDate = shortDate.replace('-', '/');
    return shortDate;
  }
  function homeWin(game) {
    return game['scores']['home']['total'] > game['scores']['away']['total'];
  }
  allGames.reverse();
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
        <Text style={styles.title}> Scores Page </Text>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchGames} />
          }
          data={gamesToDisplay}
          renderItem={({item}) => (
            <View style={styles.flexCol}>
              <Text> {'\n'}</Text>
              <View style={styles.outerView}>
                <View style={styles.flexCol}>
                  <View style={styles.logoTeam}>
                    <Image
                      source={{uri: item['teams']['away']['logo']}}
                      style={styles.userPhoto}
                    />
                    <Text style={styles.body}>
                      {item['teams']['away']['name']}{' '}
                    </Text>
                    <Text style={styles.flexRight}>
                      {' '}
                      {item['scores']['away']['total']}
                    </Text>
                    {!homeWin(item) ? (
                      <View style={[styles.triangle, styles.arrowLeft]} />
                    ) : null}
                  </View>
                  <View style={styles.logoTeam}>
                    <Image
                      source={{uri: item['teams']['home']['logo']}}
                      style={styles.userPhoto}
                    />
                    <Text style={styles.body}>
                      {item['teams']['home']['name']}{' '}
                    </Text>
                    <Text style={styles.flexRight}>
                      {item['scores']['home']['total']}
                    </Text>
                    {homeWin(item) ? (
                      <View style={[styles.triangle, styles.arrowLeft]} />
                    ) : null}
                  </View>
                </View>
                <View style={styles.verticleLine}></View>
                <View style={styles.dateStatus}>
                  <Text>{gameStatus(item)}</Text>
                  <Text>{displayDate(item['date'])}</Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item['id']}
          style={styles.list}
        />
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
