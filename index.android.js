import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';
import Api from './src/api';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class AppWeather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      city: '',
      temperature: '',
      description: '',
    };
  }

  watchID = undefined;

  componentDidMount() {
    console.log('??????');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.setState({
          pin: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
        }, () => {
          this.onRegionChangeComplete(this.state.pin);
        });
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 200000,
        maximumAge: 0,
      }
    );

    this.watchID = navigator.geolocation.watchPosition(position => {
      const newRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }

      this.onRegionChangeComplete(newRegion);
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChangeComplete(region) {
    console.log(region);
    const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
    this.setState({
      pin: {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      },
    });

    this.callApi(latitude, longitude);
  }

  callApi(latitude, longitude) {
    Api(latitude, longitude).then(data => {
      this.setState(data);
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          onRegionChangeComplete={(region) => { this.onRegionChangeComplete(region) }}
          style={styles.map}
          region={this.state.pin}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <MapView.Marker
            coordinate={this.state.pin}
          />
        </MapView>
        <View style={styles.textWrapper}>
          <Text style={styles.text}>{this.state.city}</Text>
          <Text style={styles.text}>{this.state.temperature}°C</Text>
          <Text style={styles.text}>{this.state.description}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 2,
    marginTop: 30,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },
});

AppRegistry.registerComponent('AppWeather', () => AppWeather);
