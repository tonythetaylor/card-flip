// import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';
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
    StatusBar
} from 'react-native';
import FlipCard from 'react-native-flip-card';
import useCardFeatures from './useCardFeatures';
import DATA from './data'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 0.25 * Dimensions.get('window').width;

export default function App() {
    // passing deck array as initial data
    const [data, _panResponder, animation, scale, opacity] = useCardFeatures(DATA);
    const [rightCounter, setRightCounter] = useState(0)
    const [leftCounter, setLeftCounter] = useState(0)
  
  const renderFront = (item, i) => {
    // console.log('FRONT CARD: ', item.text)
    return (
      <View key={item.id} style={styles.frontStyle}>
        <Text style={{fontSize: 25, color: '#fff'}}>{item.text}</Text>
      </View>
    );
  };
  
  const renderBack = (item, i) => {
    // console.log('BACK CARD: ', item.id)
    return (
      <View key={item.id}  style={styles.backStyle}>
          <View style={styles.card}>
            <Image
              style={styles.image}
              source={item.uri}
            />
          </View>
      </View>
    );
  };

  const currentCard = (data) => {
    console.log(data)
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
  }, [])

  return (
    <>
    <StatusBar barStyle={"light-content"} />
    <View style={styles.container}>
    {/* <Header 
      backgroundColor="#000" 
      centerComponent={{ 
        text: 'Watchu Tryna Say', 
        style: [styles.text, { color: '#fff' } ]}} 
        /> */}
    <View style={styles.container}>
      {data
        .slice(0, 2)
        .reverse()
        .map((item, index, items) => {
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
    height: SCREEN_HEIGHT,
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