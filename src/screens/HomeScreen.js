import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import BasicButton from '../components/BasicButton';
import '../global.js';
import {set} from 'react-native-reanimated';

function HomeScreen({navigation}) {
  const auth = useSelector((state) => state.auth);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
    });
  }, []);
  const [odds, setOdds] = useState([]);

  useEffect(() => {
    const fetchBets = async () => {
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
    };
    fetchBets();
  }, []);

  global.fetched_odds = odds;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome, {auth.user?.fullname ?? 'User'}!
      </Text>
      <BasicButton
        onPress={() => navigation.navigate('Betting Page')}
        title="Make Bets Here!"
      />
      <BasicButton
        onPress={() => navigation.navigate('Current Bets')}
        title="My Bets"
      />
      <BasicButton onPress={() => navigation.navigate('News')} title="News" />
      <BasicButton
        onPress={() => navigation.navigate('Leaderboard')}
        title="Leaderboard"
      />
      <BasicButton
        onPress={() => navigation.navigate('Scores')}
        title="Scores"
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

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);
