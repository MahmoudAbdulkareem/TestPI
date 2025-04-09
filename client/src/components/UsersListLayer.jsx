import { Icon } from '@iconify/react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UsersListLayer = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('A-Z'); // For A-Z or Z-A sorting
    const [filteredUsers, setFilteredUsers] = useState([]);
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!token) {
                setError('Not authenticated. Please log in.');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5001/api/users/view-users', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                // Sort users by isVerified (Active users first)
                const sortedUsers = response.data.sort((a, b) => {
                    if (a.isVerified && !b.isVerified) return -1;
                    if (!a.isVerified && b.isVerified) return 1;
                    return 0;
                });

                setUsers(sortedUsers);
                setFilteredUsers(sortedUsers);
            } else {
                setError('Unexpected response from server.');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('An error occurred while fetching users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filterUsers = () => {
        let filtered = [...users];

        // Filter by search query
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            filtered = filtered.filter((user) =>
                user.name.toLowerCase().includes(lowercasedQuery)
            );
        }

        // Filter by status (Active or Inactive)
        if (statusFilter !== 'All') {
            const isVerified = statusFilter === 'Active';
            filtered = filtered.filter((user) => user.isVerified === isVerified);
        }

        // Sort by Name (A-Z or Z-A)
        if (sortOrder === 'A-Z') {
            filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'Z-A') {
            filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredUsers(filtered);
    };

    useEffect(() => {
        filterUsers();
    }, [searchQuery, statusFilter, sortOrder]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                    </select>
                </div>
                <Link
                    to="/add-user"
                    className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon
                        icon="ic:baseline-plus"
                        className="icon text-xl line-height-1"
                    />
                    Add New User
                </Link>
            </div>
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <div className="d-flex align-items-center gap-10">
                                        <div className="form-check style-check d-flex align-items-center">
                                            <input
                                                className="form-check-input radius-4 border input-form-dark"
                                                type="checkbox"
                                                name="checkbox"
                                                id="selectAll"
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Role</th>
                                <th scope="col" className="text-center">
                                    Status
                                </th>
                                <th scope="col" className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.length > 0 ? (
                                currentUsers.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className={
                                            !user.isVerified
                                                ? 'bg-neutral-200' // Dimmed grey for inactive users
                                                : ''
                                        }
                                    >
                                        <td>
                                            <div className="d-flex align-items-center gap-10">
                                                <div className="form-check style-check d-flex align-items-center">
                                                    <input
                                                        className="form-check-input radius-4 border border-neutral-400"
                                                        type="checkbox"
                                                        name="checkbox"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-grow-1">
                                                    <span className="text-md mb-0 fw-normal text-secondary-light">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                {user.email}
                                            </span>
                                        </td>
                                        <td>{user.phoneNumber}</td>
                                        <td>{user.role}</td>
                                        <td className="text-center">
                                            <span
                                                className={`px-24 py-4 radius-4 fw-medium text-sm ${
                                                    user.isVerified
                                                        ? 'bg-success-focus text-success-600 border border-success-main'
                                                        : 'bg-neutral-300 text-neutral-600 border border-neutral-400'
                                                }`}
                                            >
                                                {user.isVerified ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center gap-10 justify-content-center">
                                                <button
                                                    type="button"
                                                    className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                >
                                                    <Icon
                                                        icon="majesticons:eye-line"
                                                        className="icon text-xl"
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                >
                                                    <Icon icon="lucide:edit" className="menu-icon" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                >
                                                    <Icon
                                                        icon="fluent:delete-24-regular"
                                                        className="menu-icon"
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                    <span>
                        Showing {indexOfFirstUser + 1} to {indexOfLastUser} of {filteredUsers.length} users
                    </span>
                    <nav>
                        <ul className="pagination">
                            {[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map((_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                >
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default UsersListLayer;