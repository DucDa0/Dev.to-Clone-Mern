import React from 'react';
import { Route, Switch } from 'react-router-dom';

// auth
import Register from '../auth/Register';
import Login from '../auth/Login';
import Activate from '../auth/Activate';
import ActivateNewEmail from '../auth/ActivateNewEmail';
import Forget from '../auth/Forget';
import Reset from '../auth/Reset';
import SignOut from '../../components/layout/SignOut';

// Dashboard
import PostItemRoute from '../dashboard/PostItemRoute';
import ReadingListRoute from '../dashboard/ReadingListRoute';
import FollowersRoute from '../dashboard/FollowersRoute';
import FollowingsRoute from '../dashboard/FollowingsRoute';
import FollowingTagsRoute from '../dashboard/FollowingTagsRoute';

// post
import Post from '../post/Post';
import Posts from '../posts/Posts';
import PostEditor from '../post_editor/PostEditor';
import PostEdit from '../post_editor/PostEdit';

// user porfile
import Account from '../profile/Account';
import Profile from '../profile/Profile';
import Me from '../profile/Me';
import DeleteAccount from '../auth/DeleteAccount';

// tags
import TagsDashBoard from '../tags/TagsDashBoard';
import TagHome from '../tags/TagHome';
import UserProfile from '../profile/UserProfile';

// notifications
import NotifyHome from '../notifications/NotifyHome';

// search
import Search from '../search/Search';
// private route
import PrivateRoute from '../routing/PrivateRoute';

import NotFound from '../layout/NotFound';

import { ToastContainer } from 'react-toastify';

const Routes = () => {
  return (
    <section className='main'>
      <ToastContainer />
      <Switch>
        <Route exact path='/' component={Posts} />
        <Route exact path='/dev/search' component={Search} />
        <Route exact path='/tags/:id/:name' component={TagHome} />
        <Route exact path='/tags' component={TagsDashBoard} />
        <Route exact path='/post/:id' component={Post} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/users/activate/:token' component={Activate} />
        <Route
          exact
          path='/users/verify-email/:token'
          component={ActivateNewEmail}
        />
        <Route exact path='/users/password/forget' component={Forget} />
        <Route exact path='/users/password/reset/:token' component={Reset} />
        <Route exact path='/profile/user/:id' component={UserProfile} />
        <PrivateRoute exact path='/signout_confirm' component={SignOut} />
        <PrivateRoute exact path='/profile/me' component={Me} />
        <PrivateRoute exact path='/dashboard' component={PostItemRoute} />
        <PrivateRoute
          exact
          path='/dashboard/reading-list'
          component={ReadingListRoute}
        />
        <PrivateRoute
          exact
          path='/dashboard/followers'
          component={FollowersRoute}
        />
        <PrivateRoute
          exact
          path='/dashboard/followings'
          component={FollowingsRoute}
        />
        <PrivateRoute
          exact
          path='/dashboard/following-tags'
          component={FollowingTagsRoute}
        />
        <PrivateRoute exact path='/settings' component={Profile} />
        <PrivateRoute exact path='/notifications' component={NotifyHome} />
        <PrivateRoute exact path='/settings/user/profile' component={Profile} />
        <PrivateRoute exact path='/settings/user/account' component={Account} />
        <PrivateRoute exact path='/write-post' component={PostEditor} />
        <PrivateRoute exact path='/write-post/edit/:id' component={PostEdit} />
        <PrivateRoute
          exact
          path='/profile/delete_account/:token'
          component={DeleteAccount}
        />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
