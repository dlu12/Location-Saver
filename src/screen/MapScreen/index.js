import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

export default function MapScreen({
  route,
  savedLocations,
  setSavedLocations,
}) {
  const [region, setRegion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        handleLocationError(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (isFocused && route.params?.location) {
      const { latitude, longitude } = route.params.location;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [isFocused, route.params?.location]);

  const handleLocationError = (error) => {
    if (error.message.includes("Location services are disabled")) {
      Alert.alert(
        "Location Services Disabled",
        "Please enable location services in your device settings."
      );
    } else if (error.message.includes("Location request timed out")) {
      Alert.alert(
        "Location Request Timed Out",
        "Please try again later or move to an area with better reception."
      );
    } else {
      Alert.alert("Error getting location", error.message);
    }
    console.error(error);
  };

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      return response.data.display_name;
    } catch (error) {
      Alert.alert("Error fetching address", error.message);
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

  const cancel = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} region={region} onPress={handleMapPress}>
          {savedLocations.map((loc, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              title={loc.address}
            />
          ))}
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
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
          <View style={{ flexDirection: "row", margin: 10 }}>
            <View style={{ marginRight: 5 }}>
              <Button title="Cancel" onPress={cancel} color={"#E0E0E0"} />
            </View>
            <Button
              title="Save Location"
              onPress={saveLocation}
              color={"#87f5a4"}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
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
    fontSize: 20,
    fontWeight: "800",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 8,
    width: "80%",
  },
});
