import React, {useLayoutEffect, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import { AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';

const API_KEY = 'b9b100b8e33845dab3ba0f41512008bd';

export default function NewsScreen({navigation}){
  const [articles, setArticles] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'News',
    });
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setArticles(data.articles);
      } catch (error) {
        console.log(error);
      }
    }
    fetchNews();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {articles.map((article, index) => (
          <View key={index} style={styles.articleContainer}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.author}>{article.author}</Text>
            <Text style={styles.description}>{article.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: Configuration.home.listing_item.offset,
  },
  articleContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  author: {
    color: '#999',
    marginBottom: 5,
  },
  description: {
    color: '#666',
  },
});
