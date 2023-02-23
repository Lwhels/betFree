import React, {useLayoutEffect} from 'react';
import {ScrollView, View, StyleSheet, Text, TouchableHighlight} from 'react-native';
import {connect, useSelector} from 'react-redux';
import { AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import BasicButton from '../components/BasicButton';

function HomeScreen({navigation}) {
  const auth = useSelector((state) => state.auth);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {auth.user?.fullname ?? 'User'}</Text>
      <BasicButton
        onPress = {() => navigation.navigate('Betting Page')}
        title = "Make Bets Here!"
      />
      <BasicButton
        onPress = {() => navigation.navigate('Current Bets')}
        title = "My Bets"
      />
      <BasicButton
        onPress = {() => navigation.navigate('News')}
        title = "News"
      />
      <BasicButton
        onPress = {() => navigation.navigate('Leaderboard')}
        title = "Leaderboard"
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
    textAlign: "center"
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
