import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { _logOut } from '../Store/actions/authAction'
import { Header } from 'react-native-elements';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
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
        const { UID, CurrentUser } = props
        console.log('prpraaaa', UID, CurrentUser);

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
                    {/* <MenuItem onPress={() => this.LogOut()}><Text style={styles.logOutBtn}>Log Out</Text></MenuItem> */}
                </Menu>
                <Text onPress={() => this.LogOut()}>Logout</Text>
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
        userLogOut: () => {
            dispatch(_logOut())
        }
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);