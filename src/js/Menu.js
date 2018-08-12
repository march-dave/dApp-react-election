import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Menu extends Component {
    render() {
        return (
            <div class="navbar navbar-default">
                {/* <div class="container-fluid">
                    <div class="navbar-header">
                    <a class="navbar-brand" href="#">WebSiteName</a>
                    </div>
                    <ul class="nav navbar-nav">
                    <li class="active"><a href="#">Home</a></li>
                    <li><a href="#">Page 1</a></li>
                    <li><a href="#">Page 2</a></li>
                    <li><a href="#">Page 3</a></li>
                    </ul>
                </div> */}

                <div class="container-fluid">
                    <ul class="nav navbar-nav">
                        <li class="nav-item"><Link to="/container/DBPlatform">DB Platform</Link></li>
                        <li class="nav-item"><Link to="/container/ReverseAuction">Reverse Auction</Link></li>
                        <li class="nav-item"><Link to="/container/MarketPlace">Market Place</Link></li>
                        <li class="nav-item"><Link to="/components/Help">Help</Link></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Menu;