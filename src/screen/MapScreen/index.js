import React, { useEffect, useState } from "react";
import { View, Text, Modal, TextInput, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const MapScreen = ({ savedLocations, setSavedLocations }) => {
  const [region, setRegion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState("");

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      return response.data.display_name;
    } catch (error) {
      console.error(error);
    }
  };

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const address = await getAddressFromCoords(latitude, longitude);
    setSelectedLocation({ latitude, longitude, address });
    setLocationName(address);
    setModalVisible(true);
  };

  const saveLocation = () => {
    setSavedLocations([...savedLocations, selectedLocation]);
    setModalVisible(false);
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView style={styles.map} region={region} onPress={handleMapPress}>
          {savedLocations.map((loc, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              title={loc.address}
            />
          ))}
        </MapView>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Save Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={locationName}
            onChangeText={setLocationName}
          />
          <Text>{selectedLocation?.address}</Text>
          <Button title="Save Location" onPress={saveLocation} />
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 8,
    width: "80%",
  },
});
