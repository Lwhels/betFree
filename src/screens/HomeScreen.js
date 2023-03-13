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
              source={AppIcon.images.menu}
              style={styles.cardImage}></Image>
            <Text style={styles.cardText}>Place Bets</Text>
          </View>
        </TouchableOpacity>
        <View style={{flexGrow: 1}}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Current Bets')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.menu}
              style={styles.cardImage}></Image>
            <Text style={styles.cardText}>My Bets</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.rowOfCards}>
        <TouchableOpacity
          onPress={() => navigation.navigate('News')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.menu}
              style={styles.cardImage}></Image>
            <Text style={styles.cardText}>News</Text>
          </View>
        </TouchableOpacity>
        <View style={{flexGrow: 1}}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Leaderboard')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.menu}
              style={styles.cardImage}></Image>
            <Text style={styles.cardText}>Leaderboard</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.rowOfCards}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Scores')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.menu}
              style={styles.cardImage}></Image>
            <Text style={styles.cardText}>Scores</Text>
          </View>
        </TouchableOpacity>
        <View style={{flexGrow: 1}}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.card}>
          <View style={styles.insideCard}>
            <Image
              source={AppIcon.images.menu}
              style={styles.cardImage}></Image>
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
  rowOfCards: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10%',
    marginTop: '10%',
  },
  card: {
    borderWidth: 2,
    flexGrow: 2,
    height: '100%',
  },
  insideCard: {flexDirection: 'column', alignItems: 'center'},
  cardImage: {marginBottom: '10%', marginTop: '10%'},
  cardText: {marginBottom: '3%'},
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);
