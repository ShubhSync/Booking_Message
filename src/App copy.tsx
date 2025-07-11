import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, MapPin, Phone, Briefcase, Mail, MessageSquare } from 'lucide-react';
import Select from 'react-select';

interface BookingData {
  bookingDate: string;
  clientName: string;
  idType: string;
  clientId: string;
  location: string;
  callTime: string;
  managerName: string;
  managerPhone: string;
  attendantName: string;
  attendantPhone: string;
  equipment: string[];
  clientEmail: string;
  clientWhatsApp: string;
}

const idTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'driving', label: "Driver's License" },
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' }
];

const managers = [
  { value: { name: 'Satya', phone: '+1234567890' }, label: 'Satya' },
  { value: { name: 'Pawan', phone: '+1234567891' }, label: 'Pawan' },
  { value: { name: 'Mike Johnson', phone: '+1234567892' }, label: 'Mike Johnson' }
];

const attendants = [
  { value: { name: 'Mayur', phone: '+1234567893' }, label: 'Mayur' },
  { value: { name: 'Raunak', phone: '+1234567894' }, label: 'Raunak' },
  { value: { name: 'Tom Davis', phone: '+1234567895' }, label: 'Tom Davis' }
];

const equipmentList = [
  { value: 'Camera Sony FX3', label: 'Camera Sony FX3' },
  { value: 'Lens Sony 24-70GMii', label: 'Lens Sony 24-70GMii' },
  { value: 'LED Light Panel 1x1', label: 'LED Light Panel 1x1' },
  { value: 'Wireless Mic Set', label: 'Wireless Mic Set' },
  { value: 'Tripod Manfrotto', label: 'Tripod Manfrotto' },
  { value: 'DJI Ronin RS3', label: 'DJI Ronin RS3' }
];

function App() {
  const [bookingData, setBookingData] = useState<BookingData>({
    bookingDate: '',
    clientName: '',
    idType: 'passport',
    clientId: '',
    location: '',
    callTime: '',
    managerName: '',
    managerPhone: '',
    attendantName: '',
    attendantPhone: '',
    equipment: [],
    clientEmail: '',
    clientWhatsApp: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Partial<BookingData>>({});

  const validateForm = () => {
    const newErrors: Partial<BookingData> = {};
    
    if (!bookingData.bookingDate) newErrors.bookingDate = 'Required';
    if (!bookingData.clientName) newErrors.clientName = 'Required';
    if (!bookingData.clientId) newErrors.clientId = 'Required';
    if (!bookingData.location) newErrors.location = 'Required';
    if (!bookingData.callTime) newErrors.callTime = 'Required';
    if (!bookingData.clientEmail) newErrors.clientEmail = 'Required';
    if (!bookingData.clientWhatsApp) newErrors.clientWhatsApp = 'Required';
    if (bookingData.equipment.length === 0) newErrors.equipment = 'Select at least one item';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (bookingData.clientEmail && !emailRegex.test(bookingData.clientEmail)) {
      newErrors.clientEmail = 'Invalid email format';
    }

    // WhatsApp number validation (must start with + and contain only numbers)
    const phoneRegex = /^\+\d{10,15}$/;
    if (bookingData.clientWhatsApp && !phoneRegex.test(bookingData.clientWhatsApp)) {
      newErrors.clientWhatsApp = 'Invalid format (e.g., +1234567890)';
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

  const handleIdTypeChange = (option: any) => {
    setBookingData(prev => ({ ...prev, idType: option.value }));
  };

  const handleManagerChange = (option: any) => {
    if (option) {
      setBookingData(prev => ({
        ...prev,
        managerName: option.value.name,
        managerPhone: option.value.phone
      }));
    }
  };

  const handleAttendantChange = (option: any) => {
    if (option) {
      setBookingData(prev => ({
        ...prev,
        attendantName: option.value.name,
        attendantPhone: option.value.phone
      }));
    }
  };

  const handleEquipmentChange = (options: any) => {
    setBookingData(prev => ({
      ...prev,
      equipment: options.map((option: any) => option.value)
    }));
    if (errors.equipment) {
      setErrors(prev => ({ ...prev, equipment: undefined }));
    }
  };

  const generateMessage = () => {
    return `BOOKING CONFIRMATION

Date: ${bookingData.bookingDate}
Client Name: ${bookingData.clientName}
${bookingData.idType.toUpperCase()}: ${bookingData.clientId}

Location: ${bookingData.location}
Call Time: ${bookingData.callTime}

Store Manager:
${bookingData.managerName}
${bookingData.managerPhone}

On-Set Attendant:
${bookingData.attendantName}
${bookingData.attendantPhone}

Equipment List:
${bookingData.equipment.map(item => `- ${item}`).join('\n')}

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

  const handleSendWhatsApp = () => {
    const message = encodeURIComponent(generateMessage());
    const whatsappUrl = `https://wa.me/${bookingData.clientWhatsApp.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent('Booking Confirmation - Syncequips');
    const body = encodeURIComponent(generateMessage());
    const mailtoUrl = `mailto:${bookingData.clientEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Booking Message Generator</h1>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline-block w-4 h-4 mr-2" />
                  Call Time
                </label>
                <input
                  type="time"
                  name="callTime"
                  value={bookingData.callTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.callTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.callTime && (
                  <p className="mt-1 text-sm text-red-500">{errors.callTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline-block w-4 h-4 mr-2" />
                  Client Name
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={bookingData.clientName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter client name"
                />
                {errors.clientName && (
                  <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="inline-block w-4 h-4 mr-2" />
                  ID Type
                </label>
                <Select
                  options={idTypes}
                  value={idTypes.find(type => type.value === bookingData.idType)}
                  onChange={handleIdTypeChange}
                  className="w-full"
                  classNamePrefix="select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="inline-block w-4 h-4 mr-2" />
                  ID Number
                </label>
                <input
                  type="text"
                  name="clientId"
                  value={bookingData.clientId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clientId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={`Enter ${bookingData.idType} number`}
                />
                {errors.clientId && (
                  <p className="mt-1 text-sm text-red-500">{errors.clientId}</p>
                )}
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline-block w-4 h-4 mr-2" />
                  Client Email
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={bookingData.clientEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clientEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter client email"
                />
                {errors.clientEmail && (
                  <p className="mt-1 text-sm text-red-500">{errors.clientEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MessageSquare className="inline-block w-4 h-4 mr-2" />
                  Client WhatsApp
                </label>
                <input
                  type="tel"
                  name="clientWhatsApp"
                  value={bookingData.clientWhatsApp}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.clientWhatsApp ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter WhatsApp number (e.g., +1234567890)"
                />
                {errors.clientWhatsApp && (
                  <p className="mt-1 text-sm text-red-500">{errors.clientWhatsApp}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline-block w-4 h-4 mr-2" />
                  Store Manager
                </label>
                <Select
                  options={managers}
                  onChange={handleManagerChange}
                  className="w-full"
                  classNamePrefix="select"
                  placeholder="Select store manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline-block w-4 h-4 mr-2" />
                  On-Set Attendant
                </label>
                <Select
                  options={attendants}
                  onChange={handleAttendantChange}
                  className="w-full"
                  classNamePrefix="select"
                  placeholder="Select on-set attendant"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline-block w-4 h-4 mr-2" />
                Equipment List
              </label>
              <Select
                isMulti
                options={equipmentList}
                onChange={handleEquipmentChange}
                className={`w-full ${errors.equipment ? 'select-error' : ''}`}
                classNamePrefix="select"
                placeholder="Select equipment"
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
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(generateMessage())}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleSendWhatsApp}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Send via WhatsApp
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send via Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;