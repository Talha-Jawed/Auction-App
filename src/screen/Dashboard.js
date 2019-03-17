import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
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
        const { UID, CurrentUser, post, allPost } = props
        // console.log('post===>>', post);
        console.log('allPost===>>', allPost);
        var liveBid = [];
        var upcoming = [];
        if (allPost) {
            setTimeout(() => {

                allPost.map(item => {
                    if (moment(item.data.StartTime) <= moment(Date.now())
                        &&
                        moment(item.data.EndTime) >= moment(Date.now())) {
                        liveBid.push(item)
                    }
                    if (moment(item.data.StartTime) > moment(Date.now())) {
                        upcoming.push(item)
                        console.log('pppp', item.StartTime);
                    }
                    console.log(item);
                })
                if (liveBid.length) {
                    this.setState({ liveBid })
                }
                if (upcoming.length) {
                    this.setState({ upcomingBid: upcoming })
                }
            }, 100)
        }
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
                    <MenuItem >Profile</MenuItem>
                    <MenuItem >Notifications</MenuItem>
                    <MenuItem >Inbox</MenuItem>
                    <MenuDivider />
                    <MenuItem onPress={() => this.LogOut()}><Text style={styles.logOutBtn}>Log Out</Text></MenuItem>
                </Menu>

                <ScrollView >
                    <Text style={styles.heading}>Upcoming Bidding! </Text>
                    <ScrollView horizontal>
                        {
                            upcomingBid
                            &&
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
                        }
                    </ScrollView>
                    <Text style={styles.heading}>Live Bidding! </Text>
                    {
                        liveBid &&
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