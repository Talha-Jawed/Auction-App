import React from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase'
import { connect } from 'react-redux'
import { Header, Avatar, Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

class ViewMyAuction extends React.Component {
    constructor() {
        super()
        this.state = {
            item: null,
            priceInput: false,
            add: false,
        }
    }
    componentWillMount() {
        const { navigation } = this.props;
        const item = navigation.getParam('item')
        if (item) {
            this.auction(item)
        }
    }

    auction = (item) => {
        const { UID, alluser } = this.props;
        const auctionUID = item.data.UID
        var bidArr = []
        this.setState({ item, UID })
        if (alluser) {
            alluser.map(user => {
                if (auctionUID === user.UID) {
                    this.setState({ auctionUser: user })
                }
            })
        }
        firebase.database().ref('/Post/' + auctionUID).on("child_added", snapShot => {
            if (snapShot.key === item.key) {
                var bids = snapShot.val().bid
                if (bids) {
                    bids.map(item => {
                        if (item.buyerUID === UID) {
                            bidArr.push(item)
                        }
                    })
                    this.setState({ _BIDS: bids })
                    this.allBids(bids)
                }
            }
            if (bidArr.length) {
                this.setState({ bidArr })
            }
        })


        firebase.database().ref('/Post/' + auctionUID).on('child_changed', snapShot => {
            if (snapShot.key === item.key) {
                var bids = snapShot.val().bid
                if (bids) {
                    bids.map(item => {
                        if (item.buyerUID === UID) {
                            bidArr.push(item)
                        }
                    })
                    this.setState({ _BIDS: bids })
                    this.allBids(bids)
                }
            }
            if (bidArr.length) {
                this.setState({ bidArr })
            }
        })
    }

    allBids = (bids) => {
        const { alluser } = this.props;
        console.log('allbids');
        const allUserBids = [];
        bids.map(item => {
            alluser.map(i => {
                if (item.buyerUID === i.UID) {
                    var obj = {
                        Photo: i.image,
                        Name: i.Name,
                        bidAmount: item.amount
                    }
                    allUserBids.push(obj)
                }
            })
            if (allUserBids.length) {
                this.setState({ allUserBids })
            }
        })
    }

    Back() {
        this.props.navigation.navigate('MyAuction')
    }

    static navigationOptions = { header: null }

    render() {
        const { item, add, priceInput, bidArr, allUserBids } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="center"
                    // rightComponent={{ icon: 'chat', color: 'white', onPress: () => this.chat() }}
                    centerComponent={{ text: item.data.category, style: { color: '#fff', fontWeight: '400', fontSize: 18 } }}
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.Back() }}
                />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
                    <ScrollView>

                        <View style={{ flex: 1, alignItems: "center" }}>
                            <Image style={{ height: 320, width: '96%', borderRadius: 10 }} source={{ uri: item.data.image }} />
                        </View>

                        <Text style={styles.heading}>Describtion</Text>
                        <Text style={styles.category} >{item.data.describtion}</Text>
                        <Text style={styles.info}> <Icon name='rupee' size={25} color='gray' />{' Price: ' + item.data.Price + ' Pkr'} </Text>
                        <Text style={styles.info}> <Icon name='clock-o' size={25} color='gray' />{' Bid Start Time: ' + moment(item.data.StartTime).format('LLL')} </Text>
                        <Text style={styles.info}> <Icon name='clock-o' size={25} color='gray' />{' Bid Over Time: ' + moment(item.data.EndTime).format('LLL')} </Text>
                        {/* <Text style={styles.info}> <Icon name='describtion' size={25} color='gray' />{item.describtion} </Text> */}

                        {allUserBids &&
                            allUserBids.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <View style={styles.view}>
                                            <View>
                                                <Avatar
                                                    size='medium'
                                                    rounded
                                                    title="RR"
                                                    activeOpacity={0.7}
                                                    source={{ uri: item.Photo }}
                                                />
                                            </View>
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={styles.bidUser}> {item.Name}</Text>
                                                <Text style={[styles.bidUser, { paddingRight: 8 }]}><Icon name='rupee' size={22} color='#30e836' /> {item.bidAmount}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
    heading: {
        fontSize: 16,
        fontWeight: '700',
        paddingLeft: 10,
        paddingBottom: 6,
        paddingTop: 12,
    },
    category: {
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 12,
        marginBottom: 12,
        marginTop: 2,
        color: '#404954',
    },
    info: {
        paddingLeft: 12,
        paddingBottom: 10,
        paddingTop: 8,
        color: '#424c59',
        fontSize: 15,
        borderWidth: .3,
        borderColor: '#ced9e0'
    },
    input: {
        backgroundColor: 'rgba(99, 172, 221,0.5)',
        color: '#fff',
        height: 34,
        width: 70,
        paddingHorizontal: 10,
        justifyContent: 'center',
        fontSize: 18,
        borderRadius: 10,
        overflow: 'hidden'
    },
    view: {
        paddingLeft: 6,
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#eff1f2',
        borderWidth: 1,
        borderColor: 'white'
    },
    bidUser: {
        fontSize: 16,
        fontWeight: "700",
        paddingLeft: 8
    }
})

function mapStateToProps(states) {
    return ({
        UID: states.authReducers.UID,
        CurrentUser: states.authReducers.USER,
        alluser: states.authReducers.ALLUSER,
        allPost: states.authReducers.ALLPOST,
        post: states.authReducers.POST
    })
}

function mapDispatchToProps(dispatch) {
    return ({

    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewMyAuction);