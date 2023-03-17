import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Modal,
  TurboModuleRegistry,
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
import firestore from '@react-native-firebase/firestore';
import {set} from 'react-native-reanimated';
import {AppIcon} from '../AppStyles';

console.disableYellowBox = true;


function HomeScreen({navigation}) {
  const auth = useSelector((state) => state.auth);
  const [code, setCode] = useState(''); 
  const [modalVisible, setModalVisible] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Home',
    });
  }, []);

  async function updateReferralUse(){
    await firestore() 
      .collection('users')
      .doc(global.currentuid)
      .update({referralused: true})
    console.log('updateRef');
  }

  async function checkCode(ref){
    idOfOther = '';
    let go = false;
    await firestore().collection("validReferralCodes").doc(ref).get()
    .then((users) => {
      console.log('USERS', users)
      if (!users['_exists']){
        Alert.alert('Invalid code');
        setModalVisible(true);
        return false;
      }
      else {
        let data = users.data();
        idOfOther = data.id;
        go = true;
      }
    });
    
    if (go){
      await firestore().collection('users').doc(global.currentuid).get().then((users) => {
        let data = users.data();
        if(data.referralused){
          Alert.alert('Referral used');
          setModalVisible(true);
          return false;
        }
        else {
          firestore().collection('users').doc(idOfOther).get().then((users) => {
            let data = users.data();
            let balance = data.balance;
            firestore().collection('users').doc(idOfOther).update({balance: balance + 10000})
          });
          firestore().collection('users').doc(global.currentuid).get().then((users) => {
            let data = users.data();
            let balance = data.balance;
            firestore().collection('users').doc(global.currentuid).update({balance: balance + 10000}).then(() => {
              updateReferralUse();
              console.log('updateReferral');
            });
          });
          setModalVisible(!modalVisible);
          return true;
        }
      });
    }
    
  }

    const onPress = () => {  
      checkCode(code); 
    }

    const onClose = () => {
      setModalVisible(!modalVisible)
    }
  if (global.first_time_logged){
    return (
      <View style={styles.container}>
        <Modal 
        visible={modalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose= {()=> {setModalVisible(!modalVisible)}}
        
        >
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text style = {{fontWeight: '400', fontSize: 22}}>
            It's your first time logging in! 
          </Text>
          <Text style = {{fontWeight: '300', fontSize: 20, marginTop: 10, marginBottom: 15}}>
            Add a friend's referral code for some extra "cash". 
          </Text>
        <TextInput
          style = {{
            marginTop: 5,
            borderColor: '#000000',
            borderWidth: 1,
            padding: '2%',
            borderRadius: 10,
            marginBottom: 10,
            width: 180,
            height: 30,
          }}
          placeholder=" Referral Code "
          placeholderTextColor={AppStyles.color.grey}
          onChangeText = {code => setCode(code)}
          ></TextInput>
          <View 
          style = {{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <TouchableOpacity
            style = {{
              marginTop: 10, 
              marginRight: 10,
            }}
            onPress={onPress}>
            <Text
                style = {{
                 color: 'green',
                 fontWeight: '500',
                 fontSize: 18,
                 }}
             >Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style = {{
              marginTop: 10, 
              marginLeft: 10
            }}
            onPress={onClose}>
            <Text
            style = {{
              color: 'maroon',
              fontWeight: '500',
              fontSize: 18,
            }}
            >Close</Text>
          </TouchableOpacity>
          </View>
          
          </View>
          </View>
        </Modal>
        
          
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
              source={AppIcon.images.basketball2}
              style={[styles.cardImage, {height: 55, width: 55}]}></Image>
            <Text style={styles.cardText}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
      </View>
    );
  }
  else {
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
            source={AppIcon.images.basketball2}
            style={[styles.cardImage, {height: 55, width: 55}]}></Image>
          <Text style={styles.cardText}>Profile</Text>
        </View>
      </TouchableOpacity>
    </View>
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
    fontWeight: '300',
    color: AppStyles.color.title,
    fontSize: 25,
    textAlign: 'center',
    marginBottom: '7%',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
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
  },
  rowOfCards: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    marginBottom: '10%',
    height: '17%',
    marginTop: '10%',
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
    fontWeight: '600',
    fontSize: 18,
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);
