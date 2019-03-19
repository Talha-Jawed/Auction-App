import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Header } from 'react-native-elements';
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome';

class MyAuction extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }

    componentDidMount() {
        const { post } = this.props
        if (post) {
            this.setState({ post })
            this.myPost(post)
        }
    }

    myPost(post) {
        var liveBid = [];
        var upcoming = [];
        var sellOut = []
        if (post) {
            post.map(item => {
                if (moment(item.data.StartTime) <= moment(Date.now())
                    &&
                    moment(item.data.EndTime) >= moment(Date.now())) {
                    liveBid.push(item)
                }
                if (moment(item.data.StartTime) > moment(Date.now())) {
                    upcoming.push(item)
                    // console.log('pppp', item.StartTime);
                }
                if (moment(item.data.EndTime) <= moment(Date.now())) {
                    // sellOut.push(item)
                }
                // console.log(item);
            })
            if (liveBid.length) {
                this.setState({ liveBid: liveBid })
                this.sellOut(liveBid)
            }
            if (upcoming.length) {
                this.setState({ upcomingBid: upcoming })
            }
        }
    }

    sellOut = (liveBid) => {
        const { alluser } = this.props;
        // const { liveBid } = this.state
        // const bids = liveBid.data.bid
        var arr = []
        if (liveBid) {
            liveBid.map(item => {
                // console.log(item, 'item');

                var bids = item.data.bid
                // console.log(bids, '--***')
                this.setState({ bids })
                if (bids) {

                    bids.map(item => {
                        var obj = item.amount
                        arr.push(obj)

                    })
                }
                // }
            })
            if (arr.length) {
                const abc = arr.sort(function (a, b) { return a - b });
                var xy = abc.pop()
                this.bigAmount(xy, liveBid)
            }
        }
    }

    bigAmount = (xy, liveBid) => {
        const { alluser } = this.props
        if (xy && liveBid) {
            liveBid.map(items => {
                var bids = items.data.bid
                if (bids) {
                    bids.map(item => {
                        if (item.amount === xy) {
                            alluser.map(i => {
                                if (item.buyerUID === i.UID) {
                                    var obj = {
                                        Name: i.Name,
                                        userPhoto: i.image,
                                        price: item.amount,
                                        img: items.data.image,
                                        catag: items.data.category
                                    }
                                    this.setState({ sale: obj, _sale: true })
                                    console.log(obj, '==--');
                                }
                            })
                        }

                    })
                }
            })
        }

    }

    view(item) {
        this.props.navigation.navigate('ViewMyAuction', { item })
    }

    Back() {
        this.props.navigation.navigate('Dashboard')
    }

    static navigationOptions = { header: null }

    render() {
        const { post, liveBid, upcomingBid } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Header
                    placement="center"
                    // rightComponent={{ icon: 'search', color: 'white', onPress: () => this.startSearch() }}
                    centerComponent={{ text: 'Auction', style: { color: '#fff' } }}
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: () => this.Back() }}
                />

                {post ?
                    <ScrollView>

                        <Text style={styles.heading}>live Bidding! </Text>
                        {liveBid ?
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
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text style={styles.heading}>No Any Live Auction </Text>
                            </View>
                        }
                        <Text style={styles.heading}>Upcoming Bidding! </Text>
                        {upcomingBid ?
                            upcomingBid.map((item, index) => {
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
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text style={styles.heading}>No Any Upcoming Auction </Text>
                            </View>
                        }
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={styles.heading}>No Any Auction </Text>
                    </View>
                }
            </View>

        )
    }
}

const styles = StyleSheet.create({
    img: {
        height: 220,
        width: '100%',
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
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 8,
        paddingBottom: 2,
        paddingTop: 2,
        textDecorationLine: 'underline'
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(MyAuction);