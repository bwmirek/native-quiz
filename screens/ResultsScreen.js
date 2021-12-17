import React from 'react';
import { FlatList, Text, View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';

const results = [
  {
    nick: 'Marek',
    score: 18,
    total: 20,
    type: 'historia',
    date: '2018-11-22',
  },
  {
    nick: 'Adam',
    score: 8,
    total: 20,
    type: 'j. polski',
    date: '2018-11-25',
  },
  {
    nick: 'Magda',
    score: 20,
    total: 20,
    type: 'biologia',
    date: '2018-11-28',
  },
];

const Item = (props) => {
  return (
    <View>
      <Text>{props.nick}</Text>
      <Text>{props.score} / {props.total}</Text>
      <Text>{props.type}</Text>
      <Text>{props.date}</Text>
    </View>
  );
};

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function ResultsScreen() {
  const renderItem = (props) => <Item {...props.item}/>;
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Text>Result Screen</Text>
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={item => item.nick}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
