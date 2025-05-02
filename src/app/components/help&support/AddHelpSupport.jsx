import React, { useState } from 'react';
import ManualPdf from '../../../assets/docs/IOBIX-Internal-CRM-User-Manual.pdf'; // Adjust the path as necessary
import { HelpSupportService } from '../../service/HelpSupportService';
import { toast } from 'react-toastify';


const faqs = [
  { q: 'How do I reset my password?', a: 'Click on the "Forgot Password" link on the sign-in page and follow the instructions.' },
  { q: 'How can I view my assigned tasks?', a: 'Navigate to the "Task" section in the sidebar to see all tasks assigned to you.' },
  { q: 'How do I schedule a meeting?', a: 'Go to "Schedule Calendar", select a date/time, and enter meeting details.' },
  { q: 'Where can I download the user manual?', a: 'Use the "Download User Manual" card on this Help & Support page.' },
  { q: 'How do I submit a ticket?', a: 'Click the "Submit Ticket" button, fill out the form, and hit Submit.' },
];

const AddHelpSupport = () => {
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const [ticket, setTicket] = useState({ name: '', email: '', subject: '', description: '' });
  const [contact, setContact] = useState({ name: '', email: '', message: '' });

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicket(prev => ({ ...prev, [name]: value }));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();

    const helpSupportData = {
        name: ticket.name,
        email: ticket.email,
        subject: ticket.subject,
        description: ticket.description,
    }

    try {
        // Call the API to submit the contact request
        const response = await HelpSupportService.addTicket(helpSupportData);
        // Handle the response as needed
        if (response.status === 1) {
            toast.success('Request submitted successfully! We will get back to you soon.');
            console.log('Ticket request submitted:', response.message);
        }
        else {
            toast.error('Failed to submit request. Please try again.');
            console.error('Failed to submit contact request:', response.message);
        }
        console.log('Contact request submitted:', response);
    }
    catch (error) {
        console.error('Error submitting contact request:', error);
    }
    // console.log('Ticket submitted:', ticket);
    setShowTicketModal(false);
    setTicket({ name: '', email: '', subject: '', description: '' });
  };

  const handleContactChange = e => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
        name: contact.name,
        email: contact.email,
        message: contact.message,
    }

    try {
        // Call the API to submit the contact request
        const response = await HelpSupportService.contactAdmin(contactData);
        // Handle the response as needed
        if (response.status === 1) {
            toast.success('Contact request submitted successfully! We will get back to you soon.');
            console.log('Contact request submitted:', response.message);
        }
        else {
            toast.error('Failed to submit contact request. Please try again.');
            console.error('Failed to submit contact request:', response.message);
        }
        console.log('Contact request submitted:', response);
    }
    catch (error) {
        console.error('Error submitting contact request:', error);
    }
    
    console.log('Contact request:', contact);
    setShowContactModal(false);
    setContact({ name: '', email: '', message: '' });
  };

  return (
    <>
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Help & Support</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* FAQ Card */}
          <div className="p-5 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-blue-700 mb-2">📘 Frequently Asked Questions</h3>
            <p className="text-sm text-gray-600 mb-4">Find answers to the most commonly asked questions.</p>
            <button
              onClick={() => setShowFaqModal(true)}
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm"
            >
              View FAQs
            </button>
          </div>

          {/* Contact Admin Card */}
          <div className="p-5 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-green-700 mb-2">📞 Contact Administrator</h3>
            <p className="text-sm text-gray-600 mb-4">Reach out directly to our CRM support admin for help.</p>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm"
            >
              Contact Admin
            </button>
          </div>

          {/* Download Manual Card */}
          <div className="p-5 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-indigo-700 mb-2">📄 Download User Manual</h3>
            <p className="text-sm text-gray-600 mb-4">Download the full IOBIX CRM User Manual to view detailed steps for all roles.</p>
            <a
              href={ManualPdf}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm"
            >
              Download Manual
            </a>
          </div>

          {/* Submit Ticket Card */}
          <div className="p-5 border rounded-xl hover:shadow-lg transition">
            <h3 className="text-lg font-medium text-yellow-700 mb-2">🎫 Submit a Ticket</h3>
            <p className="text-sm text-gray-600 mb-4">Submit your issue or request. We'll get back to you soon.</p>
            <button
              onClick={() => setShowTicketModal(true)}
              className="text-white bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md text-sm"
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowFaqModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &#x2715;
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">FAQs</h3>
            <ul className="space-y-4 max-h-80 overflow-y-auto">
              {faqs.map((item, idx) => (
                <li key={idx}>
                  <p className="font-medium text-gray-700">Q: {item.q}</p>
                  <p className="text-gray-600 ml-4">A: {item.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowTicketModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &#x2715;
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Submit a Ticket</h3>
            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  id="name"
                  name="name"
                  value={ticket.name}
                  onChange={handleTicketChange}
                  required
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={ticket.email}
                  onChange={handleTicketChange}
                  required
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm text-gray-600 mb-1">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  value={ticket.subject}
                  onChange={handleTicketChange}
                  required
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={ticket.description}
                  onChange={handleTicketChange}
                  required
                  rows="4"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md text-sm"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Admin Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &#x2715;
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Administrator</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  value={contact.name}
                  onChange={handleContactChange}
                  required
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={contact.email}
                  onChange={handleContactChange}
                  required
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm text-gray-600 mb-1">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={contact.message}
                  onChange={handleContactChange}
                  required
                  rows="4"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddHelpSupport;
