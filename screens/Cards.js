// import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { Card, Header, Button } from 'react-native-elements';
import {
    StyleSheet,
    View,
    Animated,
    PanResponder,
    Text,
    Platform,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import FlipCard from 'react-native-flip-card';
import useCardFeatures from '../useCardFeatures';
import DATA from '../data'

import { Avatar } from 'react-native-elements';
import { signOut } from 'firebase/auth';
import {auth, db, database} from '../firebase';
import {doc, getDoc, collection, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc, getDocs, FieldPath} from "firebase/firestore";
import { ref, onValue, set} from "firebase/database";
import { isEmpty } from '@firebase/util';

import { GiftedChat } from 'react-native-gifted-chat';

import DataService from "../services/relationshipService";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * Dimensions.get('window').width;

// let starCountRef = ref(database, 'relationships/');
var initialState = {fetchData : {
    id: 0,
    text: 'NO CARDS',
    uri: ''
}};

export default function CardsScreen({navigation}) {
    // passing deck array as initial data
    const [fetch, setData] = useState([initialState])
    const [data, _panResponder, animation, scale, opacity] = useCardFeatures(DATA);
    const [messages, setMessages] = useState([]);

    const [rightCounter, setRightCounter] = useState(0)
    const [leftCounter, setLeftCounter] = useState(0)
    const [loading, setLoading] = useState(false);

    const [threads, setThreads] = useState([]);

    const signOutNow = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigation.replace('Login');
        }).catch((error) => {
            // An error happened.
        });
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Avatar
                        rounded
                        source={{
                            uri: auth?.currentUser?.photoURL,
                        }}
                    />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{
                    marginRight: 10
                }}
                    onPress={signOutNow}
                >
                    <Text>logout</Text>
                </TouchableOpacity>
            )
        })

        const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                _id: doc.data()._id,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().user,
            }))
        ));

        return () => {
          unsubscribe();
        };

    }, [navigation]);

    const onSend = useCallback((messages = []) => {
        const { _id, createdAt, text, user,} = messages[0]

        addDoc(collection(db, 'chats'), { _id, createdAt,  text, user });
    }, []);

    // console.log('CARDS: --------------->>>>>>>', fetch[1] !== null, Object.assign({}, fetch[1]))
    console.log('Threads: --------------->>>>>>>', threads)
    const renderFront = (item, i) => {
    console.log('FRONT CARD: ', item.id)
    return (
      <View key={i} style={styles.frontStyle}>
        <Text style={{fontSize: 25, color: '#fff'}}>{item.text}</Text>
      </View>
    );
  };
  
  const renderBack = (item, i) => {
    console.log('BACK CARD: ', item.id)
    return (
      <View key={item._id}  style={styles.backStyle}>
          <View style={styles.card}>
            {/* <Image
              style={styles.image}
            //   source={item.uri}
            /> */}
            <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name: auth?.currentUser?.displayName,
                avatar: auth?.currentUser?.photoURL
            }}
        />
          </View>
      </View>
    );
  };

  const currentCard = (data) => {
    return data.map((item, itemIndex) => {
        return (
           <FlipCard
            key={itemIndex}
            style={styles.card}
            friction={6}
            perspective={1000}
            flipHorizontal={true}
            flipVertical={false}
            flip={false}
            clickable={true}
            onFlipEnd={(isFlipEnd)=>{console.log('isFlipEnd', isFlipEnd)}}
          >
            {renderFront(item, itemIndex)}
            {renderBack(item, itemIndex)}
          </FlipCard>
                )
            })
          }

  useEffect(() => {
    // let _db = ref(database, 'relationships/');

    // const unregisterFunction = onValue(_db, (snapshot) => {
    //     const fetchData = []
    //     snapshot.forEach(element => {
    //         fetchData.push(element)
    //     });

    //     setData(Object.assign({}, snapshot.val()))
    //   });

    //      //cleanup function for when component is removed
    // function cleanup() {
    //     unregisterFunction(); //call the unregister function
    //   }
    //   return () => {
    //     cleanup();
    //   };


    //   const unsubscribe = firestore()
      const threads = query(collection(db, 'THREADS'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(threads, (snapshot) => setThreads(
        snapshot.docs.map(doc => ({
            _id: doc.id,
            // give defaults
            text: doc.text,
            name: '',
            ...doc.data()
        }))
    ));


    //   .collection('THREADS')
    //   // .orderBy('latestMessage.createdAt', 'desc')
    //   .onSnapshot(querySnapshot => {
    //     const threads = querySnapshot.docs.map(documentSnapshot => {
    //       return {
    //         _id: documentSnapshot.id,
    //         // give defaults
    //         name: '',
    //         ...documentSnapshot.data()
    //       };
    //     });

    //     setThreads(threads);

    //     if (loading) {
    //       setLoading(false);
    //     }
    //   });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, [])

  return (
    <>
    <StatusBar barStyle={"light-content"} />
    {/* <Header 
      backgroundColor="#000" 
      centerComponent={{ 
        text: 'Watchu Tryna Say', 
        style: [styles.text, { color: '#fff' } ]}} 
        /> */}
    <View style={styles.container}>
        {/* { console.log('DATA: ', data)} */}
      {threads
        // .slice(0, 2)
        // .reverse()
        .map((item, index, items) => {
            // console.log('ITEMS', item)
          const isLastItem = index === items.length - 1;
          const panHandlers = isLastItem ? { ..._panResponder.panHandlers } : {};
          const isSecondToLast = index === items.length - 2;
          const rotate = animation.x.interpolate({
            inputRange: [-200, 0, 200],
            outputRange: ['-30deg', '0deg', '30deg'],
            extrapolate: 'clamp',
          });

          const animatedCardStyles = {
            transform: [{ rotate }, ...animation.getTranslateTransform()],
            opacity,
          };

          const cardStyle = isLastItem ? animatedCardStyles : undefined;
          const nextStyle = isSecondToLast
            ? { transform: [{ scale: scale }], borderRadius: 20 }
            : undefined;

          return (
         <Animated.View
            {...panHandlers}
            style={[styles.card, cardStyle, nextStyle]}
            key={item.id}
            >
          <FlipCard
            key={item.id}
            style={styles.card}
            friction={6}
            perspective={1000}
            flipHorizontal={true}
            flipVertical={false}
            flip={false}
            clickable={true}
            onFlipEnd={(isFlipEnd)=>{console.log('isFlipEnd', isFlipEnd)}}
          >
            {renderFront(item, index)}
            {renderBack(item, index)}
          </FlipCard>
         </Animated.View>
       );
    })}
  </View>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  deckView: {
    height: 500,
    zIndex: 1
  },
  frontStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    padding: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  backStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 225,
    padding: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  card: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#f4f4f4',
    position: 'absolute',
    borderRadius: 20,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      web: {
        boxShadow: '0 3px 5px rgba(0,0,0,0.10), 1px 2px 5px rgba(0,0,0,0.10)',
      },
    }),
    borderWidth: 0,
    borderColor: '#FFF',
  },
  imageContainer: {
    flex: 1
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    borderRadius: 20
  },
  textContainer: {
    padding: 10
  },
  nameText: {
    fontSize: 16,
  },
  animalText: {
    fontSize: 14,
    color: '#757575',
    paddingTop: 5
  }
});