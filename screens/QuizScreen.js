import React from 'react';
import { Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';

export default function QuizScreen({ route, navigation }) {
  const [isLoading, setLoading] = React.useState(true);
  const [quiz, setQuiz] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [clicked, setClicked] = React.useState(false);
  const [points, setPoints] = React.useState(0);
  const [timer, setTimer] = React.useState(-1);
  const [timeInterval, setTimeInterval] = React.useState();

  const getTests = async () => {
    try {
      const response = await fetch(`https://tgryl.pl/quiz/test/${route.params.id}`);
      const json = await response.json();
      setQuiz(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    getTests();
  }, [route.params.id]);

  React.useEffect(() => {
    if (quiz !== null) {
      setTimer(quiz.tasks[index].duration);

      let interval = setInterval(() => {
        setTimer(prev => {
          if (prev > 1) return prev - 1;
          clearInterval(interval);
          return prev - 1;
        })
      }, 1000);
      setTimeInterval(interval)
      return () => clearInterval(interval)
    }
  }, [quiz, index]);

  React.useEffect(() => {
    if (timer === 0) {
      setClicked(true)
      setTimeout(() => {
        setClicked(false);
        if (index + 1 === quiz.tasks.length) {
          fetch('http://tgryl.pl/quiz/result', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nick: 'Bartek',
              score: points,
              total: quiz.tasks.length,
              type: quiz.tags.join(', ')
            })
          }).then(() => {
            navigation.navigate('Results');
          });
        } else {
          setIndex(index + 1);
        }
      }, 500);
    }
  }, [quiz, timer]);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ScrollView
        style={{ width: '100%' }}
      >
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <View style={{ backgroundColor: 'lightgray', borderBottom: '1px solid black', padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              <Text style={{ flexShrink: 1, fontWeight: 'bold' }}>
                ({index + 1}/{quiz.tasks.length}) {quiz.tasks[index].question}
              </Text>
            </View>
            <View>
              {quiz.tasks[index].answers.map((item, key) => {
                return (
                  <Pressable key={key} onPress={() => {
                    setClicked(true);
                    if (item.isCorrect) {
                      setPoints(points + 1);
                    }

                    setTimeout(() => {
                      setClicked(false);
                      if (index + 1 === quiz.tasks.length) {
                        fetch('http://tgryl.pl/quiz/result', {
                          method: 'POST',
                          headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            nick: 'Bartek',
                            score: points,
                            total: quiz.tasks.length,
                            type: quiz.tags.join(', ')
                          })
                        }).then(() => {
                          navigation.navigate('Results');
                        });
                      } else {
                        setIndex(index + 1);
                      }
                    }, 500);
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      padding: 8,
                      marginBottom: 16,
                      border: '1px dashed black',
                      backgroundColor: clicked ? item.isCorrect ? 'green' : 'red' : 'white',
                    }}>
                      <Text style={{ flexShrink: 1, }}>{key + 1}. {item.content}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 'light', fontSize: 10, textTransform: 'uppercase' }}>
                Punkty: {points} / {quiz.tasks.length}
              </Text>
              <Text style={{ fontWeight: 'light', fontSize: 10, textTransform: 'uppercase' }}>
                {timer}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
