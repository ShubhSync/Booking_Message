import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormState {
  date: string;
  clientName: string;
  clientContact: string;
  shootLocation: string;
  callTime: string;
  storeManager: string;
  onSetAttendant: string;
  onSetContact: string;
  equipmentList: string;
  whatsappNumber: string;
  emailAddress: string;
}

export default function App() {
  const [form, setForm] = useState<FormState>({
    date: "",
    clientName: "",
    clientContact: "",
    shootLocation: "",
    callTime: "",
    storeManager: "",
    onSetAttendant: "",
    onSetContact: "",
    equipmentList: "",
    whatsappNumber: "",
    emailAddress: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const message = `*Booking Message_${form.date}_${form.clientName}*

*Client Contact Number:* ${form.clientContact}

*Shoot Location:* ${form.shootLocation}

*Call Time:* ${form.callTime}

*Store Manager:* ${form.storeManager}

*On-Set Attendant:* ${form.onSetAttendant}
*Contact Number:* ${form.onSetContact}

*Equipment List*
${form.equipmentList}

*Terms & Conditions*
- Transport charges as per actual. Third party transport like Ola/Uber/Porter are subject to availability, delays to be expected.
- Crew shift is 12hrs. Extra shift charges applicable as per industry standard.
- Sound batteries to be provided by production or charged extra.
- Client should copy the data soon after packup. No data will be stored with us after shoot.
- Client should check and sign the Delivery Challan before the shoot starts to acknowledge that they have received all the equipment as booked by them.

*Regards*`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      alert("Message copied to clipboard!");
    } catch (err) {
      alert("Failed to copy message.");
    }
  };

  const sendWhatsApp = () => {
    const number = form.whatsappNumber.replace(/[^0-9]/g, "");
    if (number) {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${number}?text=${encodedMessage}`, "_blank");
    } else {
      alert("Please enter a valid WhatsApp number.");
    }
  };

  const sendEmail = () => {
    if (form.emailAddress) {
      const subject = encodeURIComponent(`Booking Message - ${form.clientName}`);
      const body = encodeURIComponent(message);
      window.open(`mailto:${form.emailAddress}?subject=${subject}&body=${body}`);
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Booking Message Generator</h1>
        
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Input 
              name="date" 
              placeholder="Date" 
              value={form.date}
              onChange={handleChange} 
            />
            <Input 
              name="clientName" 
              placeholder="Client Name" 
              value={form.clientName}
              onChange={handleChange} 
            />
            <Input 
              name="clientContact" 
              placeholder="Client Contact Number" 
              value={form.clientContact}
              onChange={handleChange} 
            />
            <Input 
              name="shootLocation" 
              placeholder="Shoot Location" 
              value={form.shootLocation}
              onChange={handleChange} 
            />
            <Input 
              name="callTime" 
              placeholder="Call Time" 
              value={form.callTime}
              onChange={handleChange} 
            />
            <Input 
              name="storeManager" 
              placeholder="Store Manager" 
              value={form.storeManager}
              onChange={handleChange} 
            />
            <Input 
              name="onSetAttendant" 
              placeholder="On-Set Attendant" 
              value={form.onSetAttendant}
              onChange={handleChange} 
            />
            <Input 
              name="onSetContact" 
              placeholder="On-Set Contact Number" 
              value={form.onSetContact}
              onChange={handleChange} 
            />
            <Textarea 
              name="equipmentList" 
              placeholder="Equipment List" 
              value={form.equipmentList}
              onChange={handleChange} 
              className="min-h-[120px]" 
            />
            <Input 
              name="whatsappNumber" 
              placeholder="Send to WhatsApp Number (with country code)" 
              value={form.whatsappNumber}
              onChange={handleChange} 
            />
            <Input 
              name="emailAddress" 
              placeholder="Send to Email Address" 
              value={form.emailAddress}
              onChange={handleChange} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <h2 className="font-semibold text-lg text-slate-900">Generated Message</h2>
            <Textarea 
              value={message} 
              readOnly 
              className="min-h-[300px] bg-slate-50" 
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={copyToClipboard}>
                Copy to Clipboard
              </Button>
              <Button variant="secondary" onClick={sendWhatsApp}>
                Send via WhatsApp
              </Button>
              <Button variant="secondary" onClick={sendEmail}>
                Send via Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}