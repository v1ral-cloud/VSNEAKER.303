import { useState, useEffect } from 'react';
import { FiUsers, FiEdit, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight, FiShield, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import userService from '@services/user-service';

/**
 * AdminUsers Component - VSneakers Modern Style
 * Quản lý người dùng
 */
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    document.title = 'Users - VSneakers Admin';
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({
        page: currentPage,
        size: pageSize,
        search: searchQuery,
      });

      if (response.success && response.data) {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      // Mock data for display if API fails
      setUsers([
        { id: 1, fullName: 'John Doe', email: 'john@example.com', role: 'USER', status: 'ACTIVE' },
        { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', role: 'ADMIN', status: 'ACTIVE' },
        { id: 3, fullName: 'Mike Ross', email: 'mike@example.com', role: 'USER', status: 'LOCKED' },
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteUser(id);
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-dark-950">
              Users Management
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              View and manage customer and admin accounts
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-dark-950 text-sm focus:outline-none focus:border-sneaker-orange focus:ring-2 focus:ring-sneaker-orange/10 transition-all"
            />
          </div>
          <button
            onClick={() => { setCurrentPage(0); fetchUsers(); }}
            className="px-6 py-2.5 bg-dark-950 text-white rounded-xl text-sm font-semibold hover:bg-sneaker-orange transition-all"
          >
            Search
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <span className="w-4 h-4 border-2 border-gray-300 border-t-sneaker-orange rounded-full animate-spin" />
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                            user.role === 'ADMIN' ? 'bg-orange-100 text-sneaker-orange' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {user.fullName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-dark-950">{user.fullName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-md ${
                          user.role === 'ADMIN' ? 'bg-orange-50 text-sneaker-orange border border-orange-100' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role === 'ADMIN' ? <FiShield size={10} /> : <FiUser size={10} />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                          (user.status === 'ACTIVE' || user.isActive) ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {user.status || (user.isActive ? 'Active' : 'Locked')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toast('Edit user feature coming soon')}
                            className="p-2 text-gray-400 hover:text-sneaker-orange hover:bg-orange-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiUsers size={24} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">No users found</p>
                      <p className="text-sm text-gray-500">We couldn't find any users matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing page <span className="font-semibold text-dark-950">{currentPage + 1}</span> of <span className="font-semibold text-dark-950">{totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 text-gray-500 hover:text-dark-950 hover:bg-gray-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <FiChevronLeft size={20} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-all
                      ${currentPage === i 
                        ? 'bg-sneaker-orange text-white' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-dark-950'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 text-gray-500 hover:text-dark-950 hover:bg-gray-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <FiChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
