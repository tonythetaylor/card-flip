import React, {useRef, useState, useEffect } from 'react';
import {  StyleSheet,
    View,
    Animated,
    PanResponder,
    Text,
    Platform,
    Dimensions,
    Image,
    StatusBar,
    TouchableOpacity } from 'react-native';
import { List, Divider } from 'react-native-paper';
import {auth, db, database} from '../firebase';
import {doc, getDoc, collection, onSnapshot, addDoc, query, orderBy, deleteDoc, setDoc, getDocs, FieldPath} from "firebase/firestore";
import { ref, onValue, set} from "firebase/database";

import FlipCard from 'react-native-flip-card';
import { GiftedChat } from 'react-native-gifted-chat';
import clamp from 'clamp';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * Dimensions.get('window').width;

export default function HomeScreen({ navigation }) {
  const [threads, setThreads] = useState([{
    _id: "",
    createdAt:{},
    nam: "",
    text: "CARDS LOADING...",
  }]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const animation = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  console.log('Threads: --------------->>>>>>>', threads)


  const renderFront = (item, i) => {
    console.log('FRONT CARD: ', item._id)
    return (
      <View key={item._id} style={styles.frontStyle}>
        <Text style={{fontSize: 25, color: '#fff'}}>{item.text}</Text>
      </View>
    );
  };
  
  const renderBack = (item, i) => {
    console.log('BACK CARD: ', item._id)
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

  const transitionNext = function () {
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
      setThreads((threads) => {
        return threads.slice(1)
      });
    });
  };

  /**
   * Fetch threads from Firestore
   */
   useEffect(() => {
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
    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
    
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
          }).start();
        }
      },
    })
  ).current;

//   useEffect(() => {
//     console.log('i get executed whenever a changes')
    
//  }, [threads]) 

useEffect(() => {
    scale.setValue(0.9);
    opacity.setValue(1);
    animation.setValue({ x: 0, y: 0 });
   }, [threads]);

  return (
    <>
  <View style={styles.container}>
  {/* { console.log('DATA: ', data)} */}
{threads
  .slice(0,2)
  .reverse()
  .map((item, index, items) => {
      console.log('ITEMS', item[index] === items.length - 2)
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
    key={item._id}
    >
  <FlipCard
    key={item._id}
    style={styles.card}
    friction={6}
    perspective={1000}
    flipHorizontal={true}
    flipVertical={false}
    flip={false}
    clickable={true}
    onFlipEnd={(isFlipEnd)=>{console.log('isFlipEnd', isFlipEnd)}}
  >
    {renderFront(item, item._id)}
    {renderBack(item, item._id)}
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