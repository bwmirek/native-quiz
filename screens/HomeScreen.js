import React from 'react';
import { FlatList, Text, View, ScrollView, SafeAreaView, RefreshControl, Pressable } from 'react-native';

const Item = (props) => {
  return (
    <Pressable onPress={() => props.navigation.navigate('Quiz', {id: props.id})}>
      <View style={{ backgroundColor: 'lightgray', borderBottom: '1px solid black', padding: 16, marginBottom: 16 }}>
        <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap' }}>
          <View>
            <Text style={{ fontWeight: 'bold' }}>{props.name}</Text>
          </View>
          <Text>{props.level}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <Text style={{ flexShrink: 1 }}>{props.description}</Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 'light', fontSize: 10, textTransform: 'uppercase' }}>
            {props.tags.join(', ')}
          </Text>
          <Text style={{ fontWeight: 'light', fontSize: 10, textTransform: 'uppercase' }}>
            Zadań: {props.numberOfTasks}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default function HomeScreen({navigation}) {
  const renderItem = (props) => <Item {...props.item} navigation={navigation}/>;

  const [isLoading, setLoading] = React.useState(true);
  const [quizzes, setQuizzes] = React.useState([]);

  const onRefresh = React.useCallback(() => {
    setLoading(true);
    getTests();
  }, []);

  const getTests = async () => {
    try {
      const response = await fetch('https://tgryl.pl/quiz/tests');
      const json = await response.json();
      setQuizzes(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getTests();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
          />
        }
        style={{ width: '100%' }}
      >
        <Text>Home Screen</Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={quizzes}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
