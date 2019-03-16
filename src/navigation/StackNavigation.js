import { createStackNavigator, createAppContainer, createDrawerNavigator, createMaterialTopTabNavigator } from 'react-navigation';
import LogIn from '../authentication/Auth';
import Dashboard from '../screen/Dashboard';
import createPost from '../screen/create post/Create'

const StackNavigator = createStackNavigator({
    LogIn: {
        screen: LogIn
    },
    Dashboard: {
        screen: Dashboard
    },
    createPost:{
        screen: createPost
    }
})

const Navigation = createAppContainer(StackNavigator)
export default Navigation;