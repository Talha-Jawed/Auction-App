import React from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, TextInput, Image } from 'react-native';
import { ImagePicker, Permissions } from 'expo'
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import { connect } from 'react-redux';
// import { _logOut } from '../Store/actions/authAction'
import { Header } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import uuid from 'uuid';

var services = [{
    value: 'Mobile Phone',
}, {
    value: 'Refrigerator',
}, {
    value: 'Washing Machine',
}, {
    value: 'LCD',
    // }, {
    //     value: 'Home',
    // }, {
    //     value: 'Fumigation',
}];

async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            // console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
    const ref = firebase.storage().ref().child(uuid.v4());
    const snapshot = await ref.put(blob);
    // We're done with the blob, close and release it
    blob.close();
    return await snapshot.ref.getDownloadURL();
}


class createPost extends React.Component {
    constructor() {
        super()
        this.state = {
            category: '',
            describtion: '',
            Price: '',
            image: null,
            isDatePickerVisible: false,
            isDateTimePickerVisible: false,
        }
    }
    componentDidMount() {
        const { UID, CurrentUser } = this.props
        console.log('didid', UID, CurrentUser);

    }

    componentWillReceiveProps(props) {
        const { UID, CurrentUser } = props
        console.log('prpraaaa', UID, CurrentUser);

    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    }

    _handleTime = (time) => {
        console.log('A time1 has been picked: ', time);
        this._hideTimePicker();
        this.setState({ time: moment(time).format('LLL') })
    };

    _showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });

    _hideTimePicker2 = () => {
        this.setState({ isDateTimePickerVisible2: false });
    }

    _handleTime2 = (time2) => {
        console.log('A time1 has been picked: ', time2);
        this._hideTimePicker2();
        this.setState({ time2: moment(time2).format('LLL') })
    };

    _pickImage = async () => {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
        });
        this._handleImagePicked(uri, cancelled);
    };

    _handleImagePicked = async (uri, cancelled) => {
        try {
            if (!cancelled) {
                uploadUrl = await uploadImageAsync(uri);
                this.setState({ image: uploadUrl });
            }
        } catch (e) {
            alert('Image Upload failed!');
        }
    }

    submit() {
        const { image, time, time2, describtion, category, Price } = this.state
        const { UID } = this.props

        if (!image) {
            alert('Please Select Image')
        } else if (!category) {
            alert('Please select Category')
        } else if (describtion.length < 10) {
            alert('Describtion atlest 10 work')
        } else if (moment(time) <= moment(Date.now())) {
            alert('select atlest 5 mint to the current time')
        } else if (!time2) {
            alert('Please Select Over Time')
        } else if (time2 <= time) {
            alert('Please select Correct Time Date')
        } else if (!Price) {
            alert('Please Add Price')
        } else {
            alert('ok')
            const obj = {
                image,
                UID,
                describtion,
                StartTime: time,
                EndTime: time2,
                category,
                Price
            }
            firebase.database().ref('/Post/' + UID).push(obj)
        }
    }

    Back() {
        this.props.navigation.navigate('Dashboard')
    }

    static navigationOptions = { header: null }

    render() {
        const { time, time2, describtion, image, Price } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="center"
                    // rightComponent={{ icon: 'search', color: 'white'}}
                    centerComponent={{ text: 'Create Post', style: { color: '#fff' } }}
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.Back() }}
                />
                <ScrollView>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior='position' enabled>
                        <View style={{ flex: 1, alignItems: 'center', marginTop: 16 }}>
                            <TouchableOpacity onPress={this._pickImage}>
                                <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 6 }}>Upload Image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._pickImage}>
                                {image ?
                                    <Image style={{ height: 120, width: 120, borderRadius: 10 }} source={{ uri: image }} /> :
                                    <Image style={{ height: 120, width: 120, borderRadius: 10 }} source={require("../../../assets/upload.png")} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dropDown}>
                            <Dropdown
                                label='Select a Service'
                                data={services}
                                onChangeText={e => this.setState({ category: e })}
                                itemCount={3}
                            />
                        </View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(e) => this.setState({ describtion: e })}
                                value={describtion}
                                placeholder={'Describtion'}
                                placeholderTextColor='rgba(255,255,255,0.7)'
                                multiline={true}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: "center" }}>
                            <TouchableOpacity style={styles.dateTime} onPress={this._showDateTimePicker}>
                                <Text style={styles.text}><Icon name='clock-o' size={22} color='#ffffff' /> Start Bid Time {time}</Text>
                                {/* <Text> <Icon name='clock-o' size={20} color='#2ad808' /> Start Bid Time </Text> */}
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this._handleTime}
                                onCancel={this._hideTimePicker}
                                is24Hour={true}
                                mode={'datetime'}
                                titleIOS={'Open Time'}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: "center" }}>
                            <TouchableOpacity style={styles.dateTime} onPress={this._showDateTimePicker2}>
                                <Text style={styles.text}><Icon name='clock-o' size={22} color='#ffffff' /> Over Bid Time {time2}</Text>
                                {/* <Text> <Icon name='clock-o' size={20} color='#2ad808' /> Start Bid Time </Text> */}
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerVisible2}
                                onConfirm={this._handleTime2}
                                onCancel={this._hideTimePicker2}
                                is24Hour={true}
                                mode={'datetime'}
                                titleIOS={'Open Time'}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 6 }}>Starting Price: </Text>
                            <TextInput
                                style={styles.inputPrice}
                                onChangeText={(e) => this.setState({ Price: e })}
                                value={Price}
                                placeholder={'Price'}
                                placeholderTextColor='rgba(255,255,255,0.7)'
                                keyboardType='numeric'
                            />
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                            <Text style={styles.btn} onPress={() => this.submit()}>SUBMIT</Text>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropDown: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    text: {
        marginTop: 8,
        fontSize: 18,
        color: '#ffff',
        fontWeight: '500'
    },
    input: {
        backgroundColor: 'rgba(99, 172, 221,0.5)',
        marginBottom: 20,
        marginTop: 20,
        color: '#fff',
        minHeight: 34,
        maxHeight: 100,
        width: '95%',
        paddingHorizontal: 10,
        // paddingVertical: 16,
        justifyContent: 'center',
        fontSize: 18,
        borderRadius: 10,
        overflow: 'hidden'
    },
    dateTime: {
        backgroundColor: 'rgba(99, 172, 221,0.5)',
        marginBottom: 20,
        color: '#fff',
        height: 40,
        width: '95%',
        paddingHorizontal: 10,
        fontSize: 18,
        borderRadius: 10
    },
    btn: {
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: '#3498db',
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    inputPrice: {
        backgroundColor: 'rgba(99, 172, 221,0.5)',
        color: '#fff',
        height: 34,
        width: 70,
        paddingHorizontal: 10,
        // paddingVertical: 16,
        justifyContent: 'center',
        fontSize: 18,
        borderRadius: 10,
        overflow: 'hidden'
    }
});

function mapStateToProps(states) {
    return ({
        UID: states.authReducers.UID,
        CurrentUser: states.authReducers.USER,
        alluser: states.authReducers.ALLUSER,
        flag: states.authReducers.FLAG,
    })
}

function mapDispatchToProps(dispatch) {
    return ({

    })
}

export default connect(mapStateToProps, mapDispatchToProps)(createPost);