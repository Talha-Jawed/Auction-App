import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from '../confiq/Firebase'
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux'
import { current_User, fb_Action, Google_Action } from '../Store/actions/authAction'
import Icon from 'react-native-vector-icons/FontAwesome';

class LogIn extends React.Component {

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                const currentUser = user
                this.props.user(currentUser)

                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Dashboard' }),
                    ]
                })
                this.props.navigation.dispatch(resetAction)
            }
        })
    }

    async logInFB() {
        const {
            type,
            token,
            expires,
            permissions,
            declinedPermissions,
        } = await Expo.Facebook.logInWithReadPermissionsAsync('394092077990012', {
            permissions: ['public_profile'],
        });
        this.props.fb_User(type, token)
    }

    async logInGoogle() {
        const result = await Expo.Google.logInAsync({
            androidClientId: '685560939023-13vjrsnrf94t556ui6ldjte53n9mnm4o.apps.googleusercontent.com',
            iosClientId: '685560939023-arelt8uso2lih4a48jt3q13lpsq7gr9k.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
            this.props.profilePic = result.photoUrl
            this.props.profileName = result.givenName
            const { idToken, accessToken } = result;
            const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
            firebase
                .auth()
                .signInAndRetrieveDataWithCredential(credential)
                .then(success => {
                    // user res, create your user, do whatever you want
                    var currentUID = success.user.uid
                    var obj = {
                        Name: success.user.displayName,
                        UID: success.user.uid,
                        image: success.user.photoURL,
                    }
                    firebase.database().ref('/UserData/' + currentUID).update(obj);
                    this.props.Google_auth(currentUID, obj)
                    this.props.user(currentUID)
                })
                .catch(error => {
                    console.log("firebase cred err:", error);
                });
            return result.accessToken;

        } else {
            console.log('/////');
            return { cancelled: true };
        }
    }

    static navigationOptions = { header: null }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginBottom: 30, }}>
                    <Text style={styles.btnfb} onPress={() => this.logInFB()} ><Icon name='facebook-square' size={22} color='white' />{' Log-In with Facebook'}</Text>
                </View>
                <View>
                    <Text style={styles.btngoogle} onPress={() => this.logInGoogle()}><Icon name='google' size={22} color='white' />{'  Log-In with Google '}</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    buton: {
        alignItems: 'center',
        backgroundColor: '#3498db',
        paddingVertical: 10,
        marginBottom: 20,
    },
    ButtonText: {
        fontWeight: 'bold',
        color: "#ffff",
        fontSize: 20
    },
    container: {
        flex: 1,
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnfb: {
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 26,
        paddingVertical: 12,
        borderRadius: 4,
        backgroundColor: '#4267b2',
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    },
    btngoogle: {
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 4,
        backgroundColor: '#DD4B39',
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
    }
})

function mapStateToProps(states) {
    return ({
        send: states.authReducers.SENDREQUEST,
        profileName: states.authReducers.PROFILENAME,
        CurrentUser: states.authReducers.USER,
        alluser: states.authReducers.ALLUSER,
    })
}

function mapDispatchToProps(dispatch) {
    return ({
        user: (currentUser) => {
            dispatch(current_User(currentUser))
        },
        fb_User: (type, token) => {
            dispatch(fb_Action(type, token))
        },
        Google_auth: (currentUID, obj) => {
            dispatch(Google_Action(currentUID, obj))
        },
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);