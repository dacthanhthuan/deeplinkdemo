import React, { useEffect, useState, useCallback } from "react";
import { FlatList, SafeAreaView, ToastAndroid, View, Image, Linking, Share, Platform } from "react-native";
import styles from "./styles";
import Input from "../../components/Input";
import Title from "../../components/Title";
import Categories from "../../components/Categories";
import Card from "../../components/Card";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import queryString from "query-string";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "../../components/Button";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/analytics';

const Home = ({ navigation }) => {

    const All = 'All';
    const Another = 'Another';


    const [selectedTag, setSelectedTag] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [attractions, setAttractions] = useState([]);

    // CALL API CATEGORI
    const getCategories = () => {
        const apiURL = "https://categories-30am.onrender.com/categories";
        fetch(apiURL)
            .then((res) => res.json())
            .then((resJson) => {
                setCategories([All, ...resJson, Another])
            }).catch((error) => {
                console.log("Error: ", error);
            }).finally(() => setIsLoading(false))
    }

    // CALL API ATTRACTION
    const getAttractions = () => {
        const apiURL = "https://categories-30am.onrender.com/attractions";
        fetch(apiURL)
            .then((res) => res.json())
            .then((resJson) => {
                setAttractions(resJson)
            }).catch((error) => {
                console.log("Error: ", error);
            }).finally(() => setIsLoading(false))
    }

    useEffect(() => {
        getCategories();
        getAttractions();
    }, [])

    // Đường dẫn tới tệp cấu hình Firebase
    const firebaseConfig = require('../../../android/app/google-services.json');
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Theo dõi lượt vào trang Home
    useEffect(() => {
        firebase.analytics().logEvent('screen_Home', {
            screen_name: 'Home',
        });
    }, []);

    //  Foreground events
    const handleDynamicLink = link => {
        if (link && link.url) {
            // const linkURL = link.url.replace(/\+/g, ' ').trim();
            const linkURL = link.url.trim();
            // Sử dụng thư viện queryString để lấy ra tham số của URL
            const urlParams = queryString.parseUrl(linkURL);
            let data = urlParams.query.data;

            // Giải mã chuỗi đã được mã hóa
            if (data) {
                data = JSON.parse(decodeURIComponent(data))
            }

            // Hiển thị giá trị trên giao diện người dùng
            console.log('link.url :>> ', linkURL);
            console.log('data :>>', data);

            if (data && typeof data === 'object') {
                // Chuyển màn hình và truyền dữ liệu qua qua props
                navigation.navigate('RecipeDetails', { item: data });
                ToastAndroid.show('Foreground Success', ToastAndroid.SHORT);
            } else {
                navigation.navigate('Home');
                ToastAndroid.show('Foreground APP', ToastAndroid.SHORT);
            }
        } else {
            console.log('Link is null or does not have a URL');
        }
    };


    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
        // When the component is unmounted, remove the listener
        return () => unsubscribe();
    }, []);

    //  Background/Quit events
    useEffect(() => {
        dynamicLinks()
            .getInitialLink()
            .then(link => {
                if (link && link.url) {
                    const linkURL = link.url.trim();
                    // Sử dụng thư viện queryString để lấy ra tham số của URL
                    const urlParams = queryString.parseUrl(linkURL);
                    let data = urlParams.query.data;

                    // Giải mã chuỗi đã được mã hóa
                    if (data) {
                        data = JSON.parse(decodeURIComponent(data));
                    }

                    // Hiển thị giá trị trên giao diện người dùng
                    console.log('link.url :>> ', linkURL);
                    console.log('data :>> ', typeof data);

                    if (data && typeof data === 'object') {
                        // Chuyển màn hình và truyền dữ liệu qua qua props
                        navigation.navigate('RecipeDetails', { item: data });
                        ToastAndroid.show('Background Success', ToastAndroid.SHORT);
                    } else {
                        navigation.navigate('Home');
                        ToastAndroid.show('Background APP', ToastAndroid.SHORT);

                    }
                }
            })
            .catch(error => {
                console.log('Error:', error);
            });
    }, []);

    const buildLink = async () => {
        try {
            const uri = 'https://deeplinkdemoapp0123.page.link/qL6j';
            const link = await dynamicLinks().buildShortLink({
                link: uri,
                domainUriPrefix: 'https://appdlcvn.page.link',
                android: {
                    packageName: 'com.deeplink',
                },
                social: {
                    title: 'APP DLCONE',
                    imageUrl: 'https://ctydlcvn.com/wp-content/uploads/2022/08/af0e6610ccf30ead57e2-removebg-preview.png',
                    descriptionText: 'Tầm nhìn quốc tế lợi thế địa phương'
                }
            }, dynamicLinks.ShortLinkType.DEFAULT);
            console.log('Link:', link);
            return link;
        } catch (error) {
            console.log('Error:', error);
        }
    };


    // SHARE APP
    const shareApp = async () => {
        try {
            const appLink = await buildLink(); // Gọi buildLink để nhận link
            // Kiểm tra xem có đủ dữ liệu để chia sẻ hay không
            if (appLink) {
                // Theo dõi lượt Share
                firebase.analytics().logEvent('Share_App', {
                    link: appLink,
                });
                // Chia sẻ ứng dụng
                Share.share({
                    message: appLink,
                });
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };


    // LINKING
    const number = '0888190357'
    const message = "Bạn muốn gửi gì ?"

    const sendTextMessage = useCallback(async (phNumber, message) => {
        const separator = Platform.OS === 'ios' ? '&' : '?'
        const url = `sms:${phNumber}${separator}body=${message}`
        await Linking.openURL(url)
    }, [])

    const openEmailClient = useCallback(async () => {
        const link = 'mailto:hotro@vinateks.vn';
        const url = `${link}?subject=Hello&body=${message}`;

        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                ToastAndroid.show(`Không truy cập được đến: ${link}`, ToastAndroid.LONG);
            }
        } catch (error) {
            console.log('Lỗi khi mở ứng dụng email:', error);
        }
    }, [message]);

    return (
        <SafeAreaView style={styles.container} >

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Button
                    children={'Chia sẻ App'}
                    img={require('../../../assets/share.png')}
                    onPress={() => { shareApp() }}
                    style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => {
                    Linking.openURL(`tel:${number}`)
                }}>
                    <Image style={styles.image} source={require('../../../assets/phonecall.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={openEmailClient}>
                    <Image style={styles.image} source={require('../../../assets/gmail.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    sendTextMessage(number, message)
                }}>
                    <Image style={styles.image} source={require('../../../assets/sms.png')} />
                </TouchableOpacity>

            </View>

            <Input pressable onPress={() => navigation.navigate('Search', { item: attractions })} />

            <Title text='Healthy Recipes' style={{ marginTop: 16 }} />

            <Categories categories={categories} selectedCategory={selectedTag} onCategoryPress={setSelectedTag} />

            <FlatList
                horizontal
                data={attractions}
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -24 }}
                keyExtractor={item => String(item?.id)}
                renderItem={({ item, index }) =>
                (
                    <Card
                        onPress={() => navigation.navigate('RecipeDetails', { item })}
                        style={index === 0 ? { marginLeft: 24 } : {}}
                        title={item?.name}
                        image={item.images?.length ? item.images[0] : null}
                    />
                )
                }
            />

        </SafeAreaView>
    )
};

export default React.memo(Home);