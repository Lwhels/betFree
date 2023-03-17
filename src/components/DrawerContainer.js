import React from 'react';
import { StyleSheet, View} from 'react-native';
import MenuButton from '../components/MenuButton';
import {AppIcon} from '../AppStyles';
import auther from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';
import {logout} from '../reducers';
import '../global.js'

export default function DrawerContainer({navigation}) {
  const dispatch = useDispatch();
  return (
    <View style={styles.content}>
      <View style={styles.container}>
      <MenuButton
          title="MY PROFILE"
          source={AppIcon.images.profile}
          onPress={()=>
          //   () => {
          //   auther()
          //     .signOut()
          //     .then(() => {
          //       dispatch(logout());
          //       navigation.navigate('LoginStack');
          //     }); //logout on redux
  
          // }
          navigation.navigate('Profile Page')}
        />
        <MenuButton
          title="LOG OUT"
          source={AppIcon.images.logout}
          onPress={() => {
            auther()
              .signOut()
              .then(() => {
                dispatch(logout());
                navigation.navigate('LoginStack');
                global.first_time_logged = false;
              }); //logout on redux
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
});
