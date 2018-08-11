import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Menu extends Component {
    render() {
        return (
            <div class="header">
                <ul class="nav">
                    <li class="nav-item"><Link to="/container/DBPlatform">DB Platform</Link></li>
                    <li class="nav-item"><Link to="/container/ReverseAuction">Reverse Auction</Link></li>
                    <li class="nav-item"><Link to="/container/MarketPlace">Market Place</Link></li>
                    <li class="nav-item"><Link to="/components/Help">Help</Link></li>
                </ul>
            </div>
        );
    }
}

export default Menu;