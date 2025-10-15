import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, ExternalLink, UserPlus, FileText, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = 'https://care-folio.vercel.app/api';

function BlockchainApp() {
  const [activeTab, setActiveTab] = useState('doctors');
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Blockchain-based Medical Records</h3>
          <p className="text-sm text-muted-foreground mt-1">Secure and immutable healthcare data management</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="doctors" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Doctors
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <FileText className="w-4 h-4" />
            Health Logs
          </TabsTrigger>
          <TabsTrigger value="consultations" className="gap-2">
            <Activity className="w-4 h-4" />
            Consultations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctors" className="space-y-4">
          <DoctorsTab toast={toast} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <LogsTab toast={toast} />
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <ConsultationsTab toast={toast} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DoctorsTab({ toast }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorAddress: '',
    doctorName: '',
    specialization: '',
    licenseNumber: '',
    degree: '',
    university: '',
    graduationYear: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/doctors`);
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch doctors", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/doctor/certify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          credentialData: {
            degree: formData.degree,
            university: formData.university,
            graduationYear: formData.graduationYear
          }
        })
      });
      const data = await res.json();

      if (data.success) {
        toast({ title: "Success", description: "Doctor certified successfully!" });
        setShowForm(false);
        fetchDoctors();
        setFormData({
          doctorAddress: '',
          doctorName: '',
          specialization: '',
          licenseNumber: '',
          degree: '',
          university: '',
          graduationYear: ''
        });
      } else {
        toast({ title: "Error", description: data.error || "Certification failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to certify doctor", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleRevoke = async (doctorAddress) => {
    const reason = prompt('Enter revocation reason:');
    if (!reason) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/doctor/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorAddress, reason })
      });
      const data = await res.json();

      if (data.success) {
        toast({ title: "Success", description: "Certification revoked" });
        fetchDoctors();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to revoke certification", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Doctor Certifications</h4>
          <p className="text-sm text-muted-foreground">Manage doctor credentials on blockchain</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          {showForm ? 'Cancel' : '+ Certify Doctor'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Certify New Doctor</CardTitle>
            <CardDescription>Add doctor credentials to the blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doctorAddress">Wallet Address *</Label>
                  <Input
                    id="doctorAddress"
                    placeholder="0x..."
                    value={formData.doctorAddress}
                    onChange={(e) => setFormData({...formData, doctorAddress: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Full Name *</Label>
                  <Input
                    id="doctorName"
                    placeholder="Dr. John Doe"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    placeholder="Cardiology"
                    value={formData.specialization}
                    onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number *</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="MED-12345"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    placeholder="MBBS, MD"
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    placeholder="Harvard Medical School"
                    value={formData.university}
                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    placeholder="2020"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : 'Certify Doctor'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && !showForm ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
            <Card key={doctor._id} className={doctor.revoked ? "border-destructive/50" : "border-success/50"}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{doctor.doctorName}</CardTitle>
                    <CardDescription>{doctor.specialization}</CardDescription>
                  </div>
                  <Badge variant={doctor.revoked ? "destructive" : "default"} className="gap-1">
                    {doctor.revoked ? <><XCircle className="w-3 h-3" />Revoked</> : <><CheckCircle2 className="w-3 h-3" />Active</>}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License:</span>
                    <span className="font-medium">{doctor.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wallet:</span>
                    <span className="font-mono text-xs">{doctor.doctor.slice(0, 6)}...{doctor.doctor.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issued:</span>
                    <span>{new Date(doctor.issuedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {doctor.credentialCid && (
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${doctor.credentialCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View on IPFS
                  </a>
                )}
                {!doctor.revoked && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleRevoke(doctor.doctor)}
                    disabled={loading}
                  >
                    Revoke Certification
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function LogsTab({ toast }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [logType, setLogType] = useState('PatientHealth');
  const [formData, setFormData] = useState({
    userAddress: '',
    notes: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    symptoms: '',
    activityType: '',
    durationMinutes: ''
  });

  const fetchLogs = async () => {
    if (!userAddress) {
      toast({ title: "Error", description: "Please enter a user address", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/logs/${userAddress}`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch logs", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const healthData = logType === 'PatientHealth' ? {
      bloodPressure: formData.bloodPressure,
      heartRate: formData.heartRate,
      temperature: formData.temperature,
      symptoms: formData.symptoms,
      date: new Date().toISOString()
    } : {
      activityType: formData.activityType,
      durationMinutes: parseInt(formData.durationMinutes),
      date: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_URL}/user/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: formData.userAddress,
          logType,
          healthData,
          notes: formData.notes,
          activityType: logType === 'Fitness' ? formData.activityType : undefined,
          durationMinutes: logType === 'Fitness' ? parseInt(formData.durationMinutes) : undefined
        })
      });
      const data = await res.json();

      if (data.success) {
        toast({ title: "Success", description: "Log created successfully!" });
        setShowForm(false);
        if (userAddress === formData.userAddress) fetchLogs();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create log", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Health & Fitness Logs</h4>
          <p className="text-sm text-muted-foreground">Track patient health data on blockchain</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          {showForm ? 'Cancel' : '+ Create Log'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Log</CardTitle>
            <CardDescription>Add health or fitness data to blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Log Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={logType === 'PatientHealth' ? 'default' : 'outline'}
                    onClick={() => setLogType('PatientHealth')}
                  >
                    Patient Health
                  </Button>
                  <Button
                    type="button"
                    variant={logType === 'Fitness' ? 'default' : 'outline'}
                    onClick={() => setLogType('Fitness')}
                  >
                    Fitness Activity
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userAddress">User Wallet Address *</Label>
                <Input
                  id="userAddress"
                  placeholder="0x..."
                  value={formData.userAddress}
                  onChange={(e) => setFormData({...formData, userAddress: e.target.value})}
                  required
                />
              </div>

              {logType === 'PatientHealth' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <Input
                      id="bloodPressure"
                      placeholder="120/80"
                      value={formData.bloodPressure}
                      onChange={(e) => setFormData({...formData, bloodPressure: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="72"
                      value={formData.heartRate}
                      onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      value={formData.temperature}
                      onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Input
                      id="symptoms"
                      placeholder="Headache, fever"
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activityType">Activity Type *</Label>
                    <Input
                      id="activityType"
                      placeholder="Running, Yoga"
                      value={formData.activityType}
                      onChange={(e) => setFormData({...formData, activityType: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
                    <Input
                      id="durationMinutes"
                      type="number"
                      placeholder="30"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes *</Label>
                <Input
                  id="notes"
                  placeholder="Additional notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : 'Create Log'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter user wallet address"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
            />
            <Button onClick={fetchLogs} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map((log) => (
            <Card key={log._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {log.logType === 'PatientHealth' ? 'Health Log' : 'Fitness Log'} #{log.logIndex}
                    </CardTitle>
                    <CardDescription>{new Date(log.createdAt).toLocaleString()}</CardDescription>
                  </div>
                  <Badge>{log.logType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm"><strong>Notes:</strong> {log.notes}</p>
                {log.activityType && <p className="text-sm"><strong>Activity:</strong> {log.activityType}</p>}
                {log.durationMinutes && <p className="text-sm"><strong>Duration:</strong> {log.durationMinutes} mins</p>}
                {log.dataCid && (
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${log.dataCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View on IPFS
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ConsultationsTab({ toast }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [patientAddress, setPatientAddress] = useState('');
  const [formData, setFormData] = useState({
    patientAddress: '',
    doctorAddress: '',
    chiefComplaint: '',
    diagnosis: '',
    medications: '',
    instructions: ''
  });

  const fetchConsultations = async () => {
    if (!patientAddress) {
      toast({ title: "Error", description: "Please enter a patient address", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/consultation/${patientAddress}`);
      const data = await res.json();
      setConsultations(data.consultations || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch consultations", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const consultationData = {
      chiefComplaint: formData.chiefComplaint,
      date: new Date().toISOString()
    };

    const prescriptionData = formData.medications ? {
      medications: formData.medications.split('\n').map(med => ({ name: med.trim() })),
      instructions: formData.instructions
    } : null;

    try {
      const res = await fetch(`${API_URL}/consultation/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientAddress: formData.patientAddress,
          doctorAddress: formData.doctorAddress,
          consultationData,
          diagnosis: formData.diagnosis,
          prescriptionData
        })
      });
      const data = await res.json();

      if (data.success) {
        toast({ title: "Success", description: "Consultation created successfully!" });
        setShowForm(false);
        if (patientAddress === formData.patientAddress) fetchConsultations();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create consultation", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Consultations</h4>
          <p className="text-sm text-muted-foreground">Manage patient consultations on blockchain</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          {showForm ? 'Cancel' : '+ Create Consultation'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Consultation</CardTitle>
            <CardDescription>Record consultation details on blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientAddress">Patient Wallet Address *</Label>
                  <Input
                    id="patientAddress"
                    placeholder="0x..."
                    value={formData.patientAddress}
                    onChange={(e) => setFormData({...formData, patientAddress: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorAddress">Doctor Wallet Address *</Label>
                  <Input
                    id="doctorAddress"
                    placeholder="0x..."
                    value={formData.doctorAddress}
                    onChange={(e) => setFormData({...formData, doctorAddress: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                <Input
                  id="chiefComplaint"
                  placeholder="Patient's main concern"
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({...formData, chiefComplaint: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <Input
                  id="diagnosis"
                  placeholder="Medical diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Medications (one per line)</Label>
                <Input
                  id="medications"
                  placeholder="Medicine 1&#10;Medicine 2"
                  value={formData.medications}
                  onChange={(e) => setFormData({...formData, medications: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Input
                  id="instructions"
                  placeholder="Doctor's instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : 'Create Consultation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter patient wallet address"
              value={patientAddress}
              onChange={(e) => setPatientAddress(e.target.value)}
            />
            <Button onClick={fetchConsultations} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consultations.map((consult) => (
            <Card key={consult._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">Consultation #{consult.consultIndex}</CardTitle>
                    <CardDescription>{new Date(consult.createdAt).toLocaleString()}</CardDescription>
                  </div>
                  <Badge>Completed</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  <strong>Doctor:</strong> {consult.doctor.slice(0, 6)}...{consult.doctor.slice(-4)}
                </p>
                <p className="text-sm"><strong>Diagnosis:</strong> {consult.diagnosis}</p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${consult.notesCid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Notes
                  </a>
                  {consult.prescriptionCid && (
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${consult.prescriptionCid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Prescription
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlockchainApp;
