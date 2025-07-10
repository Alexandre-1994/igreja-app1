import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// Update the sidebar component to include the app name
const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1 className="app-logo">Ekklesia</h1>
            </div>
            
            <nav className="sidebar-nav">
                <NavLink 
                    to="/app" 
                    exact 
                    className="nav-item" 
                    activeClassName="active"
                >
                    Dashboard
                </NavLink>
                <NavLink 
                    to="/app/members" 
                    className="nav-item" 
                    activeClassName="active"
                >
                    Membros
                </NavLink>
                {/* Add other navigation items as needed */}
            </nav>
            
            <div className="sidebar-footer">
                <span className="version">v1.0.0</span>
            </div>
        </div>
    );
};

export default Sidebar;
