import React, { useState, useEffect } from 'react';
import { HelpSupportService } from '../../service/HelpSupportService';
import { toast } from 'react-toastify';

const GetHelpSupport = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState({ tickets: false, contacts: false });
  const [error, setError] = useState({ tickets: null, contacts: null });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewType, setViewType] = useState('tickets');

  useEffect(() => {
    fetchTickets();
    fetchContacts();
  }, []);

  const fetchTickets = async () => {
    setLoading(prev => ({ ...prev, tickets: true }));
    try {
      const res = await HelpSupportService.getTicketIssue();
      setTickets(res.data);
    } catch (err) {
      setError(prev => ({ ...prev, tickets: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, tickets: false }));
    }
  };

  const fetchContacts = async () => {
    setLoading(prev => ({ ...prev, contacts: true }));
    try {
      const res = await HelpSupportService.getContactAdmin();
      setContacts(res.data);
    } catch (err) {
      setError(prev => ({ ...prev, contacts: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, contacts: false }));
    }
  };

  const handleView = (item, type) => {
    setSelectedItem(item);
    setViewType(type);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedItem(null);
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === 'tickets') {
        const res = await HelpSupportService.deleteTicketIssue(id);
        if (res.status === 1) {
         toast.error('Ticket deleted successfully!');
         setTickets(prev => prev.filter(item => item.helpIssueTicketId !== id));
        } else {
            toast.error('Failed to delete ticket!');
        }
      } else {
        const res= await HelpSupportService.deleteContactAdmin(id);
        if (res.status === 1) {
            toast.error('Contact deleted successfully!');
            setContacts(prev => prev.filter(item => item.helpAdminContactId !== id));
        } else {
            toast.error('Failed to delete contact!');
        }    
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const renderTable = (items, type) => {
    if (loading[type]) return <p className="text-center py-4">Loading {type}...</p>;
    if (error[type]) return <p className="text-red-500 text-center py-4">Error: {error[type]}</p>;
    if (items.length === 0) return <p className="text-center py-4 text-gray-500">No {type} found.</p>;

    // determine ID field name based on type
    const idKey = type === 'tickets' ? 'helpIssueTicketId' : 'helpAdminContactId';

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                {type === 'tickets' ? 'Subject' : 'Message'}
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Details</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{item.name}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{item.email}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {type === 'tickets' ? item.subject : item.message}
                </td>
                <td
                  className="px-4 py-2 text-sm text-blue-600 hover:underline cursor-pointer"
                  onClick={() => handleView(item, type)}
                >
                  View
                </td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => handleDelete(item[idKey], type)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Admin: Help & Support Requests</h2>
        <div className="border-b mb-4">
          <nav className="flex -mb-px">
            <button
              className={`mr-6 pb-2 text-sm font-medium ${activeTab === 'tickets'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('tickets')}
            >
              Tickets
            </button>
            <button
              className={`pb-2 text-sm font-medium ${activeTab === 'contacts'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600 hover:text-gray-800'}`}
              onClick={() => setActiveTab('contacts')}
            >
              Contacts
            </button>
          </nav>
        </div>

        <div>
          {activeTab === 'tickets'
            ? renderTable(tickets, 'tickets')
            : renderTable(contacts, 'contacts')}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={handleCloseViewModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &#x2715;
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {viewType === 'tickets' ? 'Ticket Details' : 'Contact Details'}
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">Name:</span> {selectedItem.name}</p>
              <p><span className="font-medium">Email:</span> {selectedItem.email}</p>
              {viewType === 'tickets' ? (
                <>
                  <p><span className="font-medium">Subject:</span> {selectedItem.subject}</p>
                  <p><span className="font-medium">Description:</span></p>
                  <p className="ml-4">{selectedItem.description}</p>
                </>
              ) : (
                <>
                  <p><span className="font-medium">Message:</span></p>
                  <p className="ml-4">{selectedItem.message}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GetHelpSupport;


