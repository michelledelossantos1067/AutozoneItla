import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  FlatList
} from "react-native";

const { width } = Dimensions.get("window");


const data = [
  {
    id: 1,
    imagen: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    titulo: "Cuida tu vehículo 🚗"
  },
  {
    id: 2,
    imagen: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
    titulo: "Mantenimiento preventivo"
  },
  {
    id: 3,
    imagen: "https://images.unsplash.com/photo-1493238792000-8113da705763",
    titulo: "Seguridad en carretera"
  }
];

export default function CarSlider() {
  const flatListRef = useRef();

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % data.length;
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagen }} style={styles.image} />

            <View style={styles.overlay}>
              <Text style={styles.text}>{item.titulo}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: "center",
    width: "90%",
    height: 150
  },

  card: {
    width: width * 0.9,
    marginHorizontal: width * 0.04,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",


    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 }
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  },

  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,

    backgroundColor: "rgba(0,0,0,0.55)"
  },

  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  }
});