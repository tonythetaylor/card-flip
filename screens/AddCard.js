import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import FormInput from '../helpers/FormInput';
import FormButton from '../helpers/FormButton';
import useStatsBar from '../utils/useStatusBar';

import {auth, db, database} from '../firebase';
import {doc, getDoc, collection, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc, getDocs, FieldPath} from "firebase/firestore";

export default function AddRoomScreen({ navigation }) {
    useStatsBar('dark-content');
    const [roomName, setRoomName] = useState('');
  
    /**
     * Create a new Firestore collection to save threads
     */
    function handleButtonPress() {
    //   const { _id, createdAt, name, user,} = roomName
      if (roomName.length > 0) {
        const threadRef = doc(collection(db, 'THREATS'))
        const msgRef = doc(collection(db, 'THREATS-33', roomName, 'MESSAGES'))

        setDoc(msgRef, {
            name: roomName,
            latestMessage: {
              text: `You have joined the room ${roomName}.`,
              createdAt: new Date().getTime()
            }
          })

        // db()
        //   .collection('THREADS')
        //   .add({
        //     name: roomName,
        //     latestMessage: {
        //       text: `You have joined the room ${roomName}.`,
        //       createdAt: new Date().getTime()
        //     }
        //   })
        // .then(onSnapshot(msgRef, (snapshot) => {
        //     const thread = snapshot.docs.map(doc => {
        //         return {
        //             _id: doc.data()._id,
        //             createdAt: doc.data().createdAt.toDate(),
        //             text: doc.data().text,
        //             user: doc.data().user, 
        //         }
        //     })
        //     // setMessages(thread)
        //     // setDoc(msgRef, thread)
        // }))


        // .then(msg, (snapshot) => setMessages(

        //     snapshot.docs.map(doc => ({
        //         _id: doc.data()._id,
        //         createdAt: doc.data().createdAt.toDate(),
        //         text: doc.data().text,
        //         user: doc.data().user,
        //     }))
    
        // ))
        //   .then(docRef => {
        //     docRef.collection('MESSAGES').add({
        //       text: `You have joined the room ${roomName}.`,
        //       createdAt: new Date().getTime(),
        //       system: true
        //     });
        //     navigation.navigate('Home');
        //   });
      }
    }
    return (
      <View style={styles.rootContainer}>
        <View style={styles.closeButtonContainer}>
          <IconButton
            icon='close-circle'
            size={36}
            color='#6646ee'
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.innerContainer}>
          <Title style={styles.title}>Create a new chat room</Title>
          <FormInput
            labelName='Room Name'
            value={roomName}
            onChangeText={text => setRoomName(text)}
            clearButtonMode='while-editing'
          />
          <FormButton
            title='Create'
            modeValue='contained'
            labelStyle={styles.buttonLabel}
            onPress={() => handleButtonPress()}
            disabled={roomName.length === 0}
          />
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    rootContainer: {
      flex: 1
    },
    closeButtonContainer: {
      position: 'absolute',
      top: 30,
      right: 0,
      zIndex: 1
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      fontSize: 24,
      marginBottom: 10
    },
    buttonLabel: {
      fontSize: 22
    }
  });