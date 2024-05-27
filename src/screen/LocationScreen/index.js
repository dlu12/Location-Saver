import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function LocationScreen({ navigation, savedLocations }) {
  const handleLocationPress = (location) => {
    navigation.navigate("Map", { location });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedLocations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleLocationPress(item)}>
            <View style={styles.item}>
              <Text style={styles.title}>{item.address}</Text>
              <Text>{`Lat: ${item.latitude}, Lon: ${item.longitude}`}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
