import { createStackNavigator, createAppContainer, createDrawerNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import LogIn from '../authentication/Auth';
import Dashboard from '../screen/Dashboard';
import createPost from '../screen/create post/Create'
import ViewAuction from '../screen/viewAuction/ViewAuction';
import Chat from '../screen/chat/Chat';
import Inbox from '../screen/inbox/Inbox';

const StackNavigator = createStackNavigator({
    LogIn: {
        screen: LogIn
    },
    Dashboard: {
        screen: Dashboard
    },
    createPost: {
        screen: createPost
    },
    ViewAuction: {
        screen: ViewAuction
    },
    Chat: {
        screen: Chat
    },
    Inbox:{
        screen: Inbox
    }
})

const Navigation = createAppContainer(StackNavigator)
export default Navigation;