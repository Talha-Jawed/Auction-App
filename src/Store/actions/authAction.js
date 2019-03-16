import actionTypes from '../Constant/Constant'
import firebase from '../../confiq/Firebase'


// Fb LogIn
export function fb_Action(type, token) {
    return dispatch => {
        if (type === 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token)

            firebase.auth().signInAndRetrieveDataWithCredential(credential).then((success) => {
                console.log(success.additionalUserInfo.profile.name, 'success******');
                var currentUID = success.user.uid
                var obj = {
                    Name: success.additionalUserInfo.profile.name,
                    UID: success.user.uid,
                    image: success.user.photoURL,
                }
                firebase.database().ref('/UserData/' + currentUID).update(obj);

            })
                .catch((error) => {
                    console.log(error, '********');
                    alert(error)
                })
        } else {
            type === 'cancel'
        }
    }
}


// Google LogIn
export function Google_Action(currentUID, obj) {
    return dispatch => {
        dispatch(
            { type: actionTypes.UID, payload: currentUID }
        )
        dispatch(
            { type: actionTypes.USER, payload: obj }
        )
    }
}


// current User
export function current_User(currentUser) {
    return dispatch => {
        const UID = currentUser.uid
        var arr = [];
        var currentUserPost = [];
        var PostArray = [];
        dispatch(
            { type: actionTypes.UID, payload: UID }
        )

        // USERS
        firebase.database().ref('/UserData/').on('child_added', snapShot => {
            const UserData = snapShot.val();
            if (snapShot.key === currentUser.uid) {
                dispatch(
                    { type: actionTypes.USER, payload: snapShot.val() }
                )
            }
            else {
                arr.push(snapShot.val())
                dispatch(
                    { type: actionTypes.ALLUSER, payload: arr }
                )
            }
        })

        firebase.database().ref('/Post/').on("child_added", snapShot => {
            for (var key in snapShot.val()) {
                var val = snapShot.val()[key]
                if (snapShot.key === UID) {
                    currentUserPost.push(val)
                    dispatch(
                        { type: actionTypes.POST, payload: currentUserPost }
                    )
                    // console.log('======>>>', currentUserPost);
                } else {
                    PostArray.push(val)
                    dispatch(
                        { type: actionTypes.ALLPOST, payload: PostArray }
                    )
                    // console.log(PostArray, '------');
                }
            }

        })

        // MESSAGES
        // var arr = [];
        // var flag
        // var chatMessages = []
        // firebase.database().ref('/Messages/').on('child_added', snapShot => {
        //     const Messages = snapShot.val();
        //     flag = !flag
        //     if (Messages.senderUid === UID || Messages.reciverUid === UID) {
        //         // console.log("user", snapShot.val())
        //         chatMessages.push(Messages)
        //         dispatch(
        //             { type: actionTypes.CHAT, payload: chatMessages }
        //         )
        //     }
        //     dispatch(
        //         { type: actionTypes.FLAG, payload: flag }
        //     )
        // })
    }
}


// LOG OUT
export function _logOut() {
    console.log('logOut****');

    return dispatch => {
        firebase.auth().signOut().then(() => {
            dispatch(
                { type: actionTypes.UID, payload: null }
            )
            dispatch(
                { type: actionTypes.USER, payload: null }
            )
            dispatch(
                { type: actionTypes.ALLUSER, payload: null }
            )
            dispatch(
                { type: actionTypes.CHAT, payload: null }
            )
            dispatch(
                { type: actionTypes.ALLPOST, payload: null }
            )
            dispatch(
                { type: actionTypes.POST, payload: null }
            )
        })
    }
}
