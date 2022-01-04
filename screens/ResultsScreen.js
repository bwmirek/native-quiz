import React from 'react';
import { FlatList, Text, View, ScrollView, SafeAreaView, RefreshControl } from 'react-native';

const Item = (props) => {
  return (
    <View style={{ backgroundColor: 'lightgray', borderBottom: '1px solid black', padding: 16, marginBottom: 16 }}>
      <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold' }}>{props.nick}</Text>
        <Text>{props.score} / {props.total}</Text>
      </View>
      <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'light', fontSize: 10, textTransform: 'uppercase' }}>{props.type}</Text>
        <Text>{props.createdOn}</Text>
      </View>
    </View>
  );
};

export default function ResultsScreen() {
  const renderItem = (props) => <Item {...props.item}/>;

  const [isLoading, setLoading] = React.useState(true);
  const [results, setResults] = React.useState([]);

  const onRefresh = React.useCallback(() => {
    setLoading(true);
    getResults();
  }, []);

  const getResults = async () => {
    try {
      const response = await fetch('https://tgryl.pl/quiz/results');
      const json = await response.json();
      setResults(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getResults();
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
        style={{width: '100%'}}
      >
        <Text>Result Screen</Text>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={results.reverse().slice(0, 20)}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
