import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
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
import { Card, Header, Button } from 'react-native-elements';
import { List, Divider } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import { signOut } from 'firebase/auth';
import { auth, db, database, getMessages } from '../firebase';
import { doc, getDoc, collection, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc, getDocs, FieldPath, collectionGroup } from "firebase/firestore";
import { ref, onValue, set } from "firebase/database";

import FlipCard from 'react-native-flip-card';
import { GiftedChat } from 'react-native-gifted-chat';
import clamp from 'clamp';

import { v4 as uuidv4 } from 'uuid';

import Loading from '../helpers/Loading';

import rqhData from '../rqhData';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  //   const [threads, setThreads] = useState([{
  //     _id: "",
  //     createdAt:{},
  //     nam: "",
  //     text: "CARDS LOADING...",
  //   }]);
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState([])
  const [currentCard, setCurrentCard] = useState()
  const [flipEnd, setFlipEnd] = useState(false)

  const animation = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6646ee' />
      </View>
    );
  }

  const renderFront = (item, index) => {
    // if(threads !== undefined) {
    //   console.log('FRONT CARD: ', threads.map((item, idx) => item, idx))
    // }
    console.log('FRONT CARD: ', item.roomId)
    return (
      <View key={index} style={styles.frontStyle}>
        <Text style={{ fontSize: 25, color: '#fff' }}>{item.roomId}</Text>
      </View>
    );
  };

  const renderBack = (item, index) => {
    console.log('BACK CARD: ', roomId,index)
    // navigation.navigate('Cards', { thread: item.roomId })
    // for(const th in threads) {
    //   if(threads[th].roomId === roomId) {
    // const q = query(collection(db, 'chat-rooms', roomId, 'messages'), orderBy('createdAt', 'desc'));
    // onSnapshot(q, (snapshot) => setMessages(
    //     snapshot.docs.map(doc => ({
    //         _id: doc.data()._id,
    //         createdAt: doc.data().createdAt.toDate(),
    //         text: doc.data().text,
    //         user: doc.data().user,
    //     }))
    // ));
    //   }
    // }
   
      return (
      <View style={styles.backStyle}>
        <View style={styles.card}>
          {/* <Image
                    style={styles.image}
                  //   source={item.uri}
                  /> */}
          <GiftedChat
            messages={roomId ? messages : []}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
              _id: auth?.currentUser?.email,
              name: auth?.currentUser?.displayName,
              avatar: auth?.currentUser?.photoURL,
            }}
          />
        </View>
      </View>
    ) 
  };

  const renderNoMoreCards = () => {
    return (
      <View style={styles.noMoreCardsContainer}>
        <Text style={[styles.text, styles.noMoreCardsText]}>All Done!</Text>
        <Button onPress={resetDeck} color='#5f9ea0' title="Again!" titleStyle={styles.text} />
      </View>
    );
  }

  const resetDeck = () => {
    getData()
    console.log('RESET ME!')
  }

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

    // if (threads.length !== 0) {
    if (roomId.length !== 0) {
      for (const th in threads) {
        if (threads[th].roomId === roomId) {
          const q = query(collection(db, 'chat-rooms', roomId, 'messages'), orderBy('createdAt', 'desc'));
          const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
            snapshot.docs.map(doc => ({
              _id: doc.data()._id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              user: doc.data().user,
            }))
          ));

        if (loading) {
          setLoading(false);
        }

          return () => unsubscribe();
        }
      }
    }
    //   }

  }, [navigation, roomId]);

  const onSend = useCallback((messages = []) => { 
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
   
    const { _id, createdAt, text, user } = messages[0]

    addDoc(collection(db, 'chat-rooms', roomId, 'messages'), { _id, createdAt, text, user });

  }, [messages]);

  const transitionNext = function () {
    setFlipEnd(true)
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setMessages([])
      setThreads((threads) => {
        //   console.log('length', threads.length)
        return threads.slice(1)
      });
    });
  };

  /**
   * Fetch threads from Firestore
   */
  useEffect(() => {

    setThreads(rqhData)

    // setThreads(rqhData)

    // getData(threads)

    setLoading(false)
    if(roomId.length !== 0) {
          renderBack(roomId)
    }


    /**
     * unsubscribe listener
     */
    return () => renderBack();

  }, [])

  const _panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        animation.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (e, { dx, dy, vx, vy }) => {
        let velocity;
        if (vx >= 0) {
          velocity = clamp(vx, 4, 5);
        } else if (vx < 0) {
          velocity = clamp(Math.abs(vx), 4, 5) * -1;
        }
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          // setFlipEnd(false)
          Animated.parallel([
            Animated.decay(animation, {
              velocity: { x: velocity, y: vy },
              deceleration: 0.99,
              useNativeDriver: false,
            }),
            Animated.spring(scale, {
              toValue: 1,
              friction: 4,
              useNativeDriver: false,
            }),
          ]).start(transitionNext);
          if (velocity > 0) {
            // handleRightDecay();
          } else {
            // handleLeftDecay();
          }
        } else {
          Animated.spring(animation, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
            flip: false
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    scale.setValue(0.9);
    opacity.setValue(1);
    animation.setValue({ x: 0, y: 0 });
  }, [threads, messages]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <View style={styles.container}>
        {/* add reset functionality here */}
        {threads.length !== 0 ? undefined : renderNoMoreCards()}

        {/* { console.log('DATA: ', data)} */}
        {threads
          .slice(0, 2)
          .reverse()
          .map((item, index, items) => {
            const isLastItem = index === items.length - 1;
            console.log('isLastItem', isLastItem)
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
                key={index}
              >
                {items.length ? (
                  <FlipCard
                    key={items[index]}
                    style={styles.card}
                    friction={6}
                    perspective={1000}
                    flipHorizontal={true}
                    flipVertical={false}
                    flip={!flipEnd}
                    clickable={true}
                    onFlipStart={(isFlipEnd) => { setFlipEnd(isFlipEnd), setRoomId(item.roomId), console.log(isFlipEnd)}}
                    // onFlipEnd={(isFlipEnd) => { setFlipEnd(!flipEnd), setRoomId(item.roomId), console.log(isFlipEnd)}}
                  >
                    {renderFront(item)}
                    <>
                    {renderBack(item, items)}
                    </>
                    
                    
                  </FlipCard>
                ) : console.log(items.length)}
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
    backgroundColor: 'purple',
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