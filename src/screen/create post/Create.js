import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import { connect } from 'react-redux';
// import { _logOut } from '../Store/actions/authAction'
import { Header } from 'react-native-elements';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/FontAwesome';

class createPost extends React.Component {
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
              
                <Text >create post</Text>
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