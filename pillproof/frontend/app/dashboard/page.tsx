import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
            </header>
            <div className="stats">
                <div className="stat-card">
                    <span role="img" aria-label="users">👥</span>
                    <h2>324 Users</h2>
                </div>
                <div className="stat-card">
                    <span role="img" aria-label="sales">💰</span>
                    <h2>$12,340</h2>
                </div>
                <div className="stat-card">
                    <span role="img" aria-label="projects">📊</span>
                    <h2>15 Projects</h2>
                </div>
            </div>
            <div className="quick-actions">
                <button className="action-button">Add User</button>
                <button className="action-button">New Project</button>
                <button className="action-button">View Reports</button>
            </div>
            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <ul>
                    <li>User John added a new project.</li>
                    <li>User Jane updated their profile.</li>
                    <li>User Mike commented on a report.</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
