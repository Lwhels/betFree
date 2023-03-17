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
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import '../global.js';
import {AppIcon} from '../AppStyles';

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
  const teams = [
    'All',
    'Atlanta Hawks',
    'Boston Celtics',
    'Brooklyn Nets',
    'Charlotte Hornets',
    'Chicago Bulls',
    'Cleveland Cavaliers',
    'Dallas Mavericks',
    'Denver Nuggets',
    'Detroit Pistons',
    'Golden State Warriors',
    'Houston Rockets',
    'Indiana Pacers',
    'Los Angeles Clippers',
    'Los Angeles Lakers',
    'Memphis Grizzlies',
    'Miami Heat',
    'Milwaukee Bucks',
    'Minnesota Timberwolves',
    'New Orleans Pelicans',
    'New York Knicks',
    'Oklahoma City Thunder',
    'Orlando Magic',
    'Philadelphia 76ers',
    'Phoenix Suns',
    'Portland Trail Blazers',
    'Sacramento Kings',
    'San Antonio Spurs',
    'Toronto Raptors',
    'Utah Jazz',
    'Washington Wizards',
  ];
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState([]);
  const [team, setTeam] = useState(teams[0]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

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
  var gamesToDisplay = [];
  for (let i = 0; i < allGames.length; i++) {
    if (
      allGames[i]['status']['short'] != 'NS' &&
      allGames[i]['status']['short'] != 'CANC'
    ) {
      if (
        team == 'All' ||
        team == allGames[i]['teams']['home']['name'] ||
        team == allGames[i]['teams']['away']['name']
      ) {
        gamesToDisplay.push(allGames[i]);
      }
    }
  }

  function displayDate(date) {
    var localDate = new Date(date);
    localDate = String(localDate);
    var shortDate = localDate.substring(0, 10);
    shortDate = shortDate.substring(0, 3) + ',' + shortDate.substring(3, 10);
    return shortDate;
  }
  function homeWin(game) {
    return game['scores']['home']['total'] > game['scores']['away']['total'];
  }
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateVisible(false);
    setDate(currentDate);
  };
  function closeModal() {
    setModalVisible(!modalVisible);
  }
  function openFilters() {
    setModalVisible(!modalVisible);
    //setDate(date);
    setTeam(teams[0]);
  }

  gamesToDisplay.reverse();
  gamesToDisplay = gamesToDisplay.splice(0, 50);
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView} >
              <Text>Team:</Text>
              <SelectDropdown
                data={teams}
                onSelect={(selectedItem, index) => {
                  setTeam(selectedItem);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
                }}
                defaultValue={team}
              />

              <TouchableOpacity
                style={[styles.button, styles.buttonOpen, {marginTop: '3%'}]}
                onPress={() => closeModal()}>
                <Text style={styles.textStyle}>close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={styles.title}> Scores Page </Text>
        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonFilter,
            {marginBottom: '3%', marginTop: '2%'},
          ]}
          onPress={() => openFilters()}>
          <Image
            source={AppIcon.images.filter}
            style={{width: 24, height: 24}}></Image>
        </TouchableOpacity>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchGames} />
          }
          data={gamesToDisplay}
          renderItem={({item}) => (
            <View style={styles.previewContainer}>
              <View
                style={[
                  styles.box,
                  {
                    flexBasis: 55,
                    flexGrow: 0,
                    flexShrink: 1,
                    //backgroundColor: 'powderblue',
                    justifyContent: 'space-around',
                  },
                ]}>
                <Image
                  source={{uri: item['teams']['away']['logo']}}
                  style={styles.userPhoto}
                />
                <Image
                  source={{uri: item['teams']['home']['logo']}}
                  style={styles.userPhoto}
                />
              </View>
              <View
                style={[
                  styles.box,
                  {
                    flexBasis: 100,
                    flexGrow: 1,
                    flexShrink: 0,
                    //backgroundColor: 'skyblue',
                    justifyContent: 'space-around',
                  },
                ]}>
                <Text style={styles.textColor}>
                  {item['teams']['away']['name']}
                </Text>
                <Text style={styles.textColor}>
                  {item['teams']['home']['name']}
                </Text>
              </View>
              <View
                style={[
                  styles.box,
                  {
                    flexBasis: 60,
                    flexGrow: 0,
                    flexShrink: 1,
                    //backgroundColor: 'powderblue',
                    justifyContent: 'space-around',
                    paddingLeft: 10,
                    //alignItems: 'center',
                  },
                ]}>
                <Text style={styles.textColor}>
                  {item['scores']['away']['total']}{' '}
                  {!homeWin(item) ? (
                    <View style={[styles.triangle, styles.arrowLeft]} />
                  ) : null}
                </Text>

                <Text style={styles.textColor}>
                  {item['scores']['home']['total']}{' '}
                  {homeWin(item) ? (
                    <View style={[styles.triangle, styles.arrowLeft]} />
                  ) : null}
                </Text>
              </View>
              <View
                style={[
                  styles.box,
                  {
                    flexBasis: 1,
                    flexGrow: 0,
                    flexShrink: 1,
                    //backgroundColor: 'steelblue',
                    justifyContent: 'space-around',
                    paddingLeft: 0,
                  },
                ]}>
                <View style={styles.verticleLine}></View>
              </View>
              <View
                style={[
                  styles.box,
                  {
                    flexBasis: 100,
                    flexGrow: 0,
                    flexShrink: 1,
                    //backgroundColor: 'steelblue',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    paddingLeft: 10,
                  },
                ]}>
                <Text style={styles.textColor}>{gameStatus(item)}</Text>
                <Text style={styles.textColor}>
                  {displayDate(item['date'])}
                </Text>
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

const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    flexDirection: 'column',
  },
  previewContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2c6f99',
    shadowColor: '#000',
    shadowColor: 'rgb(0, 0, 0)',
            shadowOffset: {
              width: 3,
              height: 3,
            },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 2,
    marginBottom: 20,
    borderRadius: 15,
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
  box: {
    flex: 1,
    height: 100,
    width: 100,
  },
  userPhoto: {
    width: 30,
    height: 30,
    alignItems: 'center',
    //borderRadius: 10,
    marginLeft: 10,
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
    borderRadius: 15,
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
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 2,
    backgroundColor: 'white',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 75,
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonOpen: {
    backgroundColor: 'tomato',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: '400',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonFilter: {
    backgroundColor: 'tomato',
  },
  listSpacing: {
    marginTop: '3%',
    marginBottom: '3%',
  },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  matchSelectDropdownButton: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    width: width / 2,
    height: 50,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  matchSelectDropdownText: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  textColor: {
    color: 'white',
  },
});
