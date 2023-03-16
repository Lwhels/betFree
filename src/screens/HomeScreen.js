import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import BasicButton from '../components/BasicButton';
import Card from 'react-native-elements';
import '../global.js';
import {set} from 'react-native-reanimated';
import {AppIcon} from '../AppStyles';
//import '@fontsource/montserrat';

function HomeScreen({navigation}) {
  const auth = useSelector((state) => state.auth);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome, {auth.user?.fullname ?? 'User'}!
      </Text>
      <View style={styles.rowOfCards}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Betting Page')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.makebets}
              style={[styles.cardImage, {height: 55, width: 55}]}></Image>
            <Text style={styles.cardText}>Place Bets</Text>
          </View>
        </TouchableOpacity>
        <View style={{width: '15%'}}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Current Bets')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.mybets}
              style={[styles.cardImage, {height: 60, width: 43}]}></Image>
            <Text style={[styles.cardText, {marginTop: -5}]}>My Bets</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.rowOfCards}>
        <TouchableOpacity
          onPress={() => navigation.navigate('News')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.news}
              style={[styles.cardImage, {height: 55, width: 55}]}></Image>
            <Text style={styles.cardText}>News</Text>
          </View>
        </TouchableOpacity>
        <View style={{width: '15%'}}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Leaderboard')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.leaderboard}
              style={[
                styles.cardImage,
                {height: 60, width: 45, marginLeft: 7},
              ]}></Image>
            <Text style={[styles.cardText, {marginTop: -5}]}>Leaderboard</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.rowOfCards}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Scores')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.scores}
              style={[styles.cardImage, {height: 55, width: 60}]}></Image>
            <Text style={styles.cardText}>Scores</Text>
          </View>
        </TouchableOpacity>
        <View style={{width: '15%'}}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile Page')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.basketball}
              style={[styles.cardImage, {height: 55, width: 55}]}></Image>
            <Text style={styles.cardText}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    fontWeight: '300',
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
  rowOfCards: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginBottom: '11%',
    height: '17%',
    marginTop: '11%',
  },
  card: {
    height: '100%',
    width: '42.5%',
    borderRadius: 10,
    backgroundColor: '#2c6f99',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 8,
  },
  insideCard: {flexDirection: 'column', alignItems: 'center'},
  cardImage: {
    marginBottom: '10%',
    marginTop: '10%',
  },
  cardText: {
    marginBottom: '3%',
    color: 'white',
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 18,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);
