import React, { useEffect, Suspense, lazy } from "react";
import { Image, SafeAreaView, View, Share, ToastAndroid, Platform, PermissionsAndroid, Alert, CameraRoll } from "react-native";
import styles from "./styles";
import Title from "../../components/Title";
import Button from "../../components/Button";
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Clipboard from '@react-native-clipboard/clipboard';
// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/analytics';


const RecipeDetails = ({ route }) => {

    const { item } = route?.params || {};

    // Theo dõi lượt vào trang Details
    useEffect(() => {
        firebase.analytics().logEvent('screen_Details', {
            screen_name: 'Details',
        })
    }, [])

    const generateLink = async () => {
        try {
            const uri = `https://deeplinkdemoapp0123.page.link/qL6j?data=${encodeURIComponent(JSON.stringify(item))}`;
            const link = await dynamicLinks().buildShortLink({
                link: uri,
                social: {
                    title: item?.name,
                    descriptionText: item?.address,
                    imageUrl: item.images[0],
                },
                domainUriPrefix: 'https://appdlcvn.page.link',
                android: {
                    packageName: 'com.deeplink',
                },
            }, dynamicLinks.ShortLinkType.DEFAULT);
            console.log('Link:', link);
            return link;
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const shareProduct = async () => {
        try {
            const getLink = await generateLink();

            // Kiểm tra xem có đủ dữ liệu để chia sẻ hay không
            if (getLink) {
                // Theo dõi lượt Share Link Product
                firebase.analytics().logEvent('Share_Link_Product', {
                    link: getLink,
                });
                // Share qua các ứng dụng khác
                await Share.share({
                    message: getLink,
                });

            } else {
                ToastAndroid.show('Không có đường link để chia sẻ', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('Share Error:', error);
        }
    };

    const coppyLink = async () => {
        try {
            const getLink = await generateLink();
            // Kiểm tra xem có đủ dữ liệu để chia sẻ hay không
            if (getLink) {
                // Theo dõi lượt Copy Link Product
                firebase.analytics().logEvent('Coppy_Link_Product', {
                    link: getLink,
                });

                Clipboard.setString(getLink); // Sao chép Link
                ToastAndroid.show('Sao chép đường link thành công', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Không có đường link để Coppy', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.log('Coppy Error:', error);
        }
    }

    function Loading() {
        return (
            Alert.alert('Vui lòng chờ quá trình tải ảnh ...')
        );
    }

    const SaveToGalleryComponent = lazy(() => saveToGallery());

    // Kiểm tra cấp quyền lưu trữ
    const checkPermission = async () => {

        // Function to check the platform
        // If iOS then start downloading
        // If Android then ask for permission

        if (Platform.OS === 'ios') {
            // downloadImage();
            saveToGallery();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                            'App needs access to your storage to download Photos',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Khi người dùng cấp quyền bắt đầu tải xuống
                    console.log('Đã cấp quyền lưu trữ');
                    // downloadImage();

                    <Suspense fallback={<Loading />} >
                        <SaveToGalleryComponent />
                    </Suspense>
                } else {
                    // Nếu quyền bị từ chối thì log
                    console.log('Quyền lưu trữ không được cấp');
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    // const downloadImage = () => {
    //     // Chức năng chính để tải hình ảnh

    //     // Để thêm hậu tố thời gian vào tên tệp
    //     let date = new Date();

    //     // URL hình ảnh muốn tải xuống
    //     let image_URL = item?.images[0];
    //     // Lấy phần mở rộng của tập tin
    //     let ext = getExtention(image_URL);
    //     ext = '.' + ext[0];
    //     // Nhận cấu hình và fs từ RNFetchBlob
    //     // config: Để vượt qua các tùy chọn liên quan đến tải xuống
    //     // fs: Đường dẫn thư mục nơi chúng tôi muốn hình ảnh của mình tải xuống
    //     const { config, fs } = RNFetchBlob;
    //     // nơi lưu ảnh
    //     let PictureDir = fs.dirs.PictureDir;
    //     let options = {
    //         fileCache: true,
    //         addAndroidDownloads: {
    //             // Chỉ liên quan đến Android
    //             useDownloadManager: true,
    //             // thông báo quá trình đang tải ảnh
    //             notification: true,
    //             // đường dẫn và tên ảnh
    //             path:
    //                 PictureDir +
    //                 '/image_' +
    //                 Math.random().toString(36).substring(7) +
    //                 ext,
    //             description: 'Image',
    //         },
    //     };
    //     config(options)
    //         .fetch('GET', image_URL)
    //         .then(res => {
    //             // Showing alert after successful downloading
    //             console.log('res -> ', JSON.stringify(res));
    //             Alert.alert('Thông báo', 'Đã lưu ảnh về máy');
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             Alert.alert('Lỗi', 'Không thể tải xuống ảnh');
    //         })
    // };

    // const getExtention = filename => {
    //     // Để có được phần mở rộng tập tin
    //     return /[.]/.exec(filename) ?
    //         /[^.]+$/.exec(filename) : undefined;
    // };

    let imgUrl = item?.images[0]

    let newImgUri = imgUrl.lastIndexOf('/');
    let imageName = imgUrl.substring(newImgUri);

    let dirs = RNFetchBlob.fs.dirs;
    let path = Platform.OS === 'ios' ? dirs['MainBundleDir'] + imageName : dirs.PictureDir + imageName;

    const saveToGallery = () => {
        if (Platform.OS == 'android') {

            RNFetchBlob.config({
                fileCache: true,
                appendExt: 'png',
                indicator: true,
                IOSBackgroundTask: true,
                path: path,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: path,
                    description: 'Image'
                },

            }).fetch("GET", imgUrl).then(res => {
                console.log(JSON.stringify(res), 'end downloaded')
                Alert.alert('Thông báo', 'Đã lưu ảnh về máy');
            });
        } else {
            CameraRoll.saveToCameraRoll(imgUrl);
        }
    }



    // const SaveToGalleryComponent = () => {
    //     useEffect(() => {
    //         saveToGallery();
    //     }, []);

    //     return null;
    // };

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.image} resizeMode="stretch" source={{ uri: item?.images[0] }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    children='Chia sẻ'
                    img={require('../../../assets/share.png')}
                    onPress={shareProduct}
                />
                <Button
                    children='Copy Link'
                    img={require('../../../assets/copy.png')}
                    onPress={coppyLink}
                />
                <Button
                    children='Tải hình'
                    img={require('../../../assets/download.png')}
                    onPress={checkPermission}
                />
            </View>

            <Title style={{ marginTop: 16, fontSize: 22 }} text={item?.name} />
            <Title style={{ marginTop: 16, fontSize: 26, fontWeight: '500', }} text={item?.entry_price} />
            <Title style={{ marginTop: 22, fontSize: 16, fontWeight: 'normal', color: 'grey' }} text={item?.address} />


        </SafeAreaView>
    );
};

export default React.memo(RecipeDetails);
