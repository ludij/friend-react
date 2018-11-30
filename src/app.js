import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import axios from './axios';
import Loader from './loader';
import HeaderLoggedIn from './header-logged-in';
import Profile from './profile';
import AvatarModal from './avatar-modal';
import Friends from './friends';
import Online from './online';
import OtherUser from './other-user';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.avatarModalVisibility = this.avatarModalVisibility.bind(this);
        this.loadAvatar = this.loadAvatar.bind(this);
        this.loadBio = this.loadBio.bind(this);
    }
    componentDidMount() {
        return axios.get('/profile')
            .then(userData => {
                this.setState(userData.data);
            })
            .catch(function (err) {
                console.log('error in get profile in componentDidMount: ', err);
            });

    }
    avatarModalVisibility() {
        this.state.avatarModalVisible ?
            this.setState({avatarModalVisible: false}) : this.setState({avatarModalVisible: true});
    }
    loadAvatar(res) {
        this.setState({avatar_url: res.data[0].avatar_url});
    }
    loadBio(res) {
        this.setState({bio: res.data[0].bio});
    }
    render() {
        if (!this.state.id) {
            return <Loader />;
        }
        return (
            <BrowserRouter>
                <React.Fragment>
                    <HeaderLoggedIn
                        id = {this.state.id}
                        firstname = {this.state.firstname}
                        lastname = {this.state.lastname}
                        email = {this.state.email}
                        avatar_url = {this.state.avatar_url}
                        avatarModalVisibility = {this.avatarModalVisibility}
                    />
                    <div className="wrapper">
                        <Route
                            exact path="/"
                            render={
                                () => (
                                    <Profile
                                        id = {this.state.id}
                                        firstname = {this.state.firstname}
                                        lastname = {this.state.lastname}
                                        email = {this.state.email}
                                        avatar_url = {this.state.avatar_url}
                                        bio = {this.state.bio}
                                        avatarModalVisibility = {this.avatarModalVisibility}
                                        loadBio = {this.loadBio}

                                    />
                                )
                            }
                        />
                        <Route
                            path="/friends"
                            component={Friends}
                        />
                        <Route
                            path="/online"
                            component={Online}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherUser {...props} key={props.match.url} />
                            )}
                        />
                        {
                            this.state.avatarModalVisible
                            &&
                            <AvatarModal
                                loadAvatar = {this.loadAvatar}
                                avatarModalVisibility = {this.avatarModalVisibility}
                            />
                        }
                    </div>
                    <div className="wrapper">
                        <p>Want to sign out?</p>
                        <a href="/logout">Log Out</a>
                        <br />
                    </div>
                </React.Fragment>
            </BrowserRouter>
        );
    }
}
