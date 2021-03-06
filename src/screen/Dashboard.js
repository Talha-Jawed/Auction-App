import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { _logOut } from '../Store/actions/authAction'
import { Header } from 'react-native-elements';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome';

class Dashboard extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }
    componentDidMount() {
        const { UID, CurrentUser } = this.props
        console.log('didid', UID, CurrentUser);

    }

    componentWillReceiveProps(props) {
        const { allPost } = props
        if (allPost) {
            setTimeout(() => {

                var liveBid = [];
                var upcoming = [];
                var sellOut = [];
                allPost.map(item => {
                    if (moment(item.data.StartTime) <= moment(Date.now())
                        &&
                        moment(item.data.EndTime) >= moment(Date.now())) {
                        liveBid.push(item)
                    } else if (moment(item.data.StartTime) > moment(Date.now())) {
                        upcoming.push(item)
                    } else if (moment(item.data.EndTime) <= moment(Date.now())) {
                        sellOut.push(item)
                    }
                })
                if (liveBid.length) {
                    this.setState({ liveBid })
                }
                if (upcoming.length) {
                    this.setState({ upcomingBid: upcoming })
                }
                if (sellOut.length) {
                    this.sellOut(sellOut)
                }
            }, 100)
            setInterval(() => {
                var liveBid = [];
                var upcoming = [];
                var sellOut = [];
                console.log('interval*****');
                allPost.map(item => {
                    if (moment(item.data.StartTime) <= moment(Date.now())
                        &&
                        moment(item.data.EndTime) >= moment(Date.now())) {
                        liveBid.push(item)
                    } else if (moment(item.data.StartTime) > moment(Date.now())) {
                        upcoming.push(item)
                    } else if (moment(item.data.EndTime) <= moment(Date.now())) {
                        sellOut.push(item)
                    }
                })
                if (liveBid.length) {
                    this.setState({ liveBid })
                }
                if (upcoming.length) {
                    this.setState({ upcomingBid: upcoming })
                }
                if (sellOut.length) {
                    this.sellOut(sellOut)
                }
            }, 20000)
        }
    }

    sellOut = (sellOut) => {
        // console.log(sellOut, 'item');
        if (sellOut) {
            sellOut.map(item => {

                var bids = item.data.bid
                var key = item.key
                var auctionUID = item.data.UID
                var max = bids.reduce(function (prev, current) {
                    return (prev.amount > current.amount) ? prev : current
                });
                var obj = {
                    sellOut: 'SALEOUT',
                    buyerUID: max.buyerUID
                }
                firebase.database().ref('/Post/' + '/' + auctionUID + '/' + key).update(obj)
            })
        }
    }

    componentWillUnmount() {
        console.log('unmount***');

    }

    view(item) {
        this.props.navigation.navigate('ViewAuction', { item })
    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };
    createPost() {
        this._menu.hide();
        this.props.navigation.navigate('createPost')

    }

    inbox() {
        this._menu.hide();
        this.props.navigation.navigate('Inbox')
    }

    auction() {
        this._menu.hide();
        this.props.navigation.navigate('MyAuction')
    }

    LogOut() {
        this.props.userLogOut()
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'LogIn' }),
            ]
        })
        this.props.navigation.dispatch(resetAction)
    }

    static navigationOptions = { header: null }

    render() {
        const { liveBid, upcomingBid } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="left"
                    rightComponent={{ icon: 'search', color: 'white', onPress: () => this.startSearch() }}
                    centerComponent={{ text: 'Home', style: { color: '#fff' } }}
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.showMenu() }}
                />
                <Menu
                    ref={this.setMenuRef}
                    button={<Text></Text>}
                >
                    <MenuItem onPress={() => this.createPost()}>Add Services</MenuItem>
                    <MenuItem onPress={() => this.auction()}>Auction</MenuItem>
                    <MenuItem >Notifications</MenuItem>
                    <MenuItem onPress={() => this.inbox()} >Inbox</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={() => this.LogOut()}><Text style={styles.logOutBtn}>Log Out</Text></MenuItem>
                </Menu>

                <ScrollView >
                    <Text style={styles.heading}>Upcoming Bidding! </Text>
                    <ScrollView horizontal>
                        {
                            upcomingBid
                                ?
                                upcomingBid.map((item, index) => {
                                    return (
                                        <View key={index} style={{ flexDirection: 'row' }} >
                                            <View style={{ height: 255, width: 170, borderWidth: 2, flex: 1, borderColor: '#e1e9f4', margin: 15, backgroundColor: '#cce6ff', borderRadius: 10, }}>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={styles.cardTitle}>{item.data.category}</Text>
                                                </View>
                                                <View>
                                                    <Image style={styles.imgUpcoming} source={{ uri: item.data.image }} />
                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={styles.titleName}>Price: {item.data.Price} Pkr</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 16, color: '#3498db', paddingBottom: 8, paddingTop: 3 }}>{moment(new Date(item.data.StartTime)).fromNow()}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                })
                                :
                                <ActivityIndicator size="large" color="#0000ff" />
                        }
                    </ScrollView>
                    <Text style={styles.heading}>Live Bidding! </Text>
                    {
                        liveBid ?
                            liveBid.map((item, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row' }} >
                                        <View style={{ height: 320, width: '95%', borderWidth: 2, flex: 1, borderColor: '#e1e9f4', margin: 15, backgroundColor: '#cce6ff', borderRadius: 10, }}>
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={styles.cardTitle}>{item.data.category}</Text>
                                            </View>
                                            <View>
                                                <Image style={styles.img} source={{ uri: item.data.image }} />
                                            </View>
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={styles.titleName}>Price: {item.data.Price} Pkr</Text>
                                            </View>
                                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Text onPress={() => this.view(item)} style={{ fontSize: 16, color: '#3498db', paddingBottom: 8, paddingTop: 3 }}>VIEW NOW</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                            :
                            <ActivityIndicator size="large" color="#0000ff" />
                    }
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
    logOutBtn: {
        color: 'red'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 8,
        paddingBottom: 2,
        paddingTop: 2,
        textDecorationLine: 'underline'
    },
    img: {
        height: 220,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgUpcoming: {
        height: 160,
        width: 165,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#424c59'
    },
    titleName: {
        paddingTop: 6,
        paddingBottom: 3,
        fontSize: 14,
        fontWeight: '600',
    }
});

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
        userLogOut: () => {
            dispatch(_logOut())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);