import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const LocationsScreen = ({ savedLocations }) => {
  const navigation = useNavigation();

  const openLocationOnMap = (location) => {
    navigation.navigate("Map", { location });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedLocations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openLocationOnMap(item)}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.address}</Text>
              <Text>
                {item.latitude}, {item.longitude}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default LocationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
  },
});
