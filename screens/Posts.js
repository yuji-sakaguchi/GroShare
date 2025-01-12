import { Text, FlatList, TouchableOpacity, View, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { React, useState, useEffect } from 'react';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native'
import { collection, query, where, getDocs, getFirestore, orderBy } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export default function Posts({navigation}) {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  // const items = [
  //   {
  //     id: 1,
  //     sender: 'user',
  //     title: 'test',
  //     school: 'UC Santa Barbara',
  //     time: 'May 10th',
  //     desc: 'food'
  //   },
  //   {
  //     id: 2,
  //     sender: 'user2',
  //     title: 'test2',
  //     school: 'SBCC',
  //     time: 'May 10th',
  //     desc: 'personal stuff'
  //   }
  // ];
  const nav = useNavigation();
  useEffect(() => {
    if (auth){
      getPosts();
    }
      nav.setOptions({
        headerRight: () => <TouchableOpacity
        style={styles.buttonFacebookStyle}
        activeOpacity={0.5}
        onPress={() => {navigation.navigate('Create Post');}}>
        <Image
          source={{
            uri:
              'https://img.icons8.com/?size=50&id=GlTdJzFYfVzw&format=png',
          }}
          style={styles.buttonImageIconStyle}
        />
      </TouchableOpacity>
      });
  
  },[])
  const [search, setSearch] = useState('');
  const auth = getAuth()
  const renderItem = ({item}) => {
    return(
        <TouchableOpacity>
        <View style={styles.post}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg' }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.title}</Text>
          <Text style={styles.date}>{item.timestamp.toDate().toString().slice(0,-12)}</Text>
          <Text style={styles.date}>{item.school}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.desc}</Text>
      {item.img && <Image source={{ uri: item.img }} style={{ height: 200, width: '100%' }} />}
      <View style={styles.actions}>
      </View>
    </View>
    </TouchableOpacity>
    )
}
  if (auth){
    const db = getFirestore();
    function getPosts(){
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      getDocs(q)
      .then(
        (querySnapshot) =>{
          var list = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            list.push(doc.data())
          });
          setItems(list);
        }
      )
    }
  }
    return(
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getPosts} />
        }>
            <SearchBar
                placeholder="What are you looking for?"
                onChangeText={(text) => {setSearch(text)}}
                value={search}
                //lightTheme={true}
            />
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    buttonFacebookStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderWidth: 0.5,
      borderColor: '#fff',
      height: 40,
      borderRadius: 5,
      margin: 5,
    },
    buttonImageIconStyle: {
      padding: 10,
      margin: 5,
      height: 25,
      width: 25,
      resizeMode: 'stretch',
    },
    post: {
        marginHorizontal:10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom:20,
        borderBottomWidth:0.5,
        borderBottomColor:'#808080',
        padding:10,
      },
      avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
      },
      date: {
        fontSize: 14,
        color: 'gray',
        marginLeft: 10,
      },
      description: {
        marginBottom: 10,
      },
      actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
      },
      actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      actionText: {
        fontSize: 18,
        color: '#3b5998',
      },
      actionCount: {
        fontSize: 18,
        marginLeft: 5,
      },
  });