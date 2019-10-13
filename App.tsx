import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MusicAppLikeSemiModalView, {
  ModalState
} from "./MusicAppLikeSemiModalView";

export default function App() {
  const [modalState, setModalState] = useState<ModalState>("full");

  return (
    <View style={styles.container}>
      <View style={styles.groundwork}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalState("full")}
          >
            <Text>Full</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            disabled
            style={styles.button}
            onPress={() => setModalState("half")}
          >
            <Text>Half</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalState("mini")}
          >
            <Text>Mini</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.state}>{modalState}</Text>
      </View>

      <MusicAppLikeSemiModalView
        modalState={modalState}
        setModalState={setModalState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  groundwork: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 64,
    alignItems: "center",
    backgroundColor: "#eee"
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 16
  },
  button: {
    backgroundColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginHorizontal: 8
  },
  state: {
    fontWeight: "bold"
  }
});
