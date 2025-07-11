import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Briefcase } from 'lucide-react';
import Select from 'react-select';

interface BookingData {
  bookingDate: string;
  clientName: string;
  clientContact: string;
  location: string;
  callTime: string;
  callTimeOption: string;
  managerName: string;
  managerPhone: string;
  attendants: Array<{name: string; phone: string}>;
  attendantReportingTime: string;
  equipment: string;
}

// Sample client data - this would be replaced with Google Sheets data
const clientOptions = [
  { value: 'John Doe', label: 'John Doe' },
  { value: 'Jane Smith', label: 'Jane Smith' },
  { value: 'Mike Johnson', label: 'Mike Johnson' },
  { value: 'Sarah Wilson', label: 'Sarah Wilson' },
  { value: 'David Brown', label: 'David Brown' },
];

const attendants = [
  { value: { name: 'Mayur Mane', phone: '9765544093' }, label: 'Mayur Mane (9765544093)' },
  { value: { name: 'Durgesh', phone: '9407488091' }, label: 'Durgesh (9407488091)' },
  { value: { name: 'Sahil', phone: '9927859682' }, label: 'Sahil (9927859682)' },
  { value: { name: 'Rahul', phone: '8308848541' }, label: 'Rahul (8308848541)' },
  { value: { name: 'PK', phone: '9356846410' }, label: 'PK (9356846410)' }
];

const callTimeOptions = [
  { value: 'fixed', label: 'Fixed Time' },
  { value: 'to_be_updated', label: 'To be updated by client' }
];

function App() {
  const [bookingData, setBookingData] = useState<BookingData>({
    bookingDate: '',
    clientName: '',
    clientContact: '',
    location: '',
    callTime: '',
    callTimeOption: 'fixed',
    managerName: 'Store/Office Contact',
    managerPhone: '+91 9270271005',
    attendants: [],
    attendantReportingTime: '',
    equipment: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Partial<BookingData>>({});

  const validateForm = () => {
    const newErrors: Partial<BookingData> = {};
    
    if (!bookingData.bookingDate) newErrors.bookingDate = 'Required';
    if (!bookingData.clientName) newErrors.clientName = 'Required';
    if (!bookingData.clientContact) newErrors.clientContact = 'Required';
    if (!bookingData.location) newErrors.location = 'Required';
    if (bookingData.callTimeOption === 'fixed' && !bookingData.callTime) newErrors.callTime = 'Required when fixed time is selected';
    if (bookingData.attendants.length === 0) newErrors.attendants = 'Select at least one attendant';
    if (!bookingData.attendantReportingTime) newErrors.attendantReportingTime = 'Required';
    if (!bookingData.equipment.trim()) newErrors.equipment = 'Equipment list is required';

    // Client contact validation
    const contactRegex = /^\d{10}$/;
    if (bookingData.clientContact && !contactRegex.test(bookingData.clientContact)) {
      newErrors.clientContact = 'Invalid format (10 digits required)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof BookingData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleClientNameChange = (option: any) => {
    setBookingData(prev => ({ ...prev, clientName: option ? option.value : '' }));
    if (errors.clientName) {
      setErrors(prev => ({ ...prev, clientName: undefined }));
    }
  };

  const handleCallTimeOptionChange = (option: any) => {
    setBookingData(prev => ({ ...prev, callTimeOption: option ? option.value : 'fixed' }));
    if (errors.callTime) {
      setErrors(prev => ({ ...prev, callTime: undefined }));
    }
  };

  const handleAttendantsChange = (options: any) => {
    setBookingData(prev => ({
      ...prev,
      attendants: options ? options.map((option: any) => option.value) : []
    }));
    if (errors.attendants) {
      setErrors(prev => ({ ...prev, attendants: undefined }));
    }
  };

  const generateMessage = () => {
    const attendantsList = bookingData.attendants.map(att => `${att.name}: ${att.phone}`).join('\n');
    const callTimeDisplay = bookingData.callTimeOption === 'to_be_updated' ? 'To be updated by client' : bookingData.callTime;
    
    return `BOOKING CONFIRMATION

Date: ${bookingData.bookingDate}
Client Name: ${bookingData.clientName}
Client Contact: ${bookingData.clientContact}

Location: ${bookingData.location}
Call Time: ${callTimeDisplay}

Store/Office Contact:
${bookingData.managerName}
${bookingData.managerPhone}

On-Set Attendant(s):
${attendantsList}

Attendant Office Reporting Time: ${bookingData.attendantReportingTime}

Equipment List:
${bookingData.equipment}

Terms and Conditions:

1. Transport Charges:
   Will be billed as per actuals. Third-party transport services (Ola, Uber, Porter) are subject to availability; delays should be considered.

2. Crew Shift:
   The standard crew shift is 12 hours. Additional hours are charged as per industry standards.

3. Sound Batteries:
   To be provided by production team or charged additionally.

4. Data Handling:
   The client is responsible for copying all footage/data after the shoot. Syncequips will not retain any data post-packup.

5. Equipment Handover:
   The client must inspect and sign The Delivery Challan before the shoot begins.

Regards,
Syncequips Team`;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleSendToClient = () => {
    if (!bookingData.clientContact) {
      alert('Client contact number is required to send WhatsApp message');
      return;
    }
    const message = encodeURIComponent(generateMessage());
    const whatsappUrl = `https://wa.me/91${bookingData.clientContact}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendToAttendants = () => {
    if (bookingData.attendants.length === 0) {
      alert('Please select at least one attendant to send WhatsApp message');
      return;
    }
    
    const message = encodeURIComponent(generateMessage());
    
    // Send to each selected attendant
    bookingData.attendants.forEach(attendant => {
      const whatsappUrl = `https://wa.me/91${attendant.phone}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Booking Message Generator</h1>
          
          <div className="space-y-6">
            {/* 1. Booking Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline-block w-4 h-4 mr-2" />
                Booking Date
              </label>
              <input
                type="date"
                name="bookingDate"
                value={bookingData.bookingDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.bookingDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bookingDate && (
                <p className="mt-1 text-sm text-red-500">{errors.bookingDate}</p>
              )}
            </div>

            {/* 2. Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline-block w-4 h-4 mr-2" />
                Client Name
              </label>
              <Select
                options={clientOptions}
                onChange={handleClientNameChange}
                className={`w-full ${errors.clientName ? 'select-error' : ''}`}
                classNamePrefix="select"
                placeholder="Select client name"
                isClearable
              />
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Note: Client names are loaded from Google Sheets. To add new clients, update your Google Sheet.
              </p>
            </div>

            {/* 3. Client Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="inline-block w-4 h-4 mr-2" />
                Client Contact Number
              </label>
              <input
                type="tel"
                name="clientContact"
                value={bookingData.clientContact}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.clientContact ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit contact number"
              />
              {errors.clientContact && (
                <p className="mt-1 text-sm text-red-500">{errors.clientContact}</p>
              )}
            </div>

            {/* 4. Shoot Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline-block w-4 h-4 mr-2" />
                Shoot Location
              </label>
              <input
                type="text"
                name="location"
                value={bookingData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter shoot location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            {/* 5. Call Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Call Time
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  options={callTimeOptions}
                  value={callTimeOptions.find(option => option.value === bookingData.callTimeOption)}
                  onChange={handleCallTimeOptionChange}
                  className="w-full"
                  classNamePrefix="select"
                />
                {bookingData.callTimeOption === 'fixed' && (
                  <input
                    type="time"
                    name="callTime"
                    value={bookingData.callTime}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.callTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                )}
              </div>
              {errors.callTime && (
                <p className="mt-1 text-sm text-red-500">{errors.callTime}</p>
              )}
            </div>

            {/* 6. Store/Office Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline-block w-4 h-4 mr-2" />
                Store/Office Contact
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                Store/Office Contact: +91 9270271005
              </div>
            </div>

            {/* 7. On-Set Attendant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline-block w-4 h-4 mr-2" />
                On-Set Attendant(s)
              </label>
              <Select
                isMulti
                options={attendants}
                onChange={handleAttendantsChange}
                className={`w-full ${errors.attendants ? 'select-error' : ''}`}
                classNamePrefix="select"
                placeholder="Select on-set attendant(s)"
              />
              {errors.attendants && (
                <p className="mt-1 text-sm text-red-500">{errors.attendants}</p>
              )}
            </div>

            {/* 8. Attendant Office Reporting Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Attendant Office Reporting Time
              </label>
              <input
                type="time"
                name="attendantReportingTime"
                value={bookingData.attendantReportingTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.attendantReportingTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.attendantReportingTime && (
                <p className="mt-1 text-sm text-red-500">{errors.attendantReportingTime}</p>
              )}
            </div>

            {/* 9. Equipment List */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline-block w-4 h-4 mr-2" />
                Equipment List
              </label>
              <textarea
                name="equipment"
                value={bookingData.equipment}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.equipment ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Paste or type the equipment list here..."
              />
              {errors.equipment && (
                <p className="mt-1 text-sm text-red-500">{errors.equipment}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate Message
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Generated Message</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm">
              {generateMessage()}
            </pre>
            <div className="mt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(generateMessage())}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleSendToClient}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                disabled={!bookingData.clientContact}
              >
                Send to Client on WhatsApp
              </button>
              <button
                onClick={handleSendToAttendants}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={bookingData.attendants.length === 0}
              >
                Send to On-set Attendant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;