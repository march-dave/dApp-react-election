import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Menu extends Component {
    render() {
        return (
            <div>
                <ul class="nav">
                    <li><Link to="/container/DBPlatform">DB Platform</Link></li>
                    <li><Link to="/container/ReverseAuction">Reverse Auction</Link></li>
                    <li><Link to="/container/MarketPlace">Market Place</Link></li>
                    <li><Link to="/components/Help">Help</Link></li>
                </ul>
            </div>
        );
    }
}

export default Menu;