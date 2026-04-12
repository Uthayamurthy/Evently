export interface Student {
  id?: string;
  studentName: string;
  studentRollNumber: string;
  emailId: string;
  password?: string;
  role?: string;
}

export interface Faculty {
  id?: string;
  facultyName: string;
  facultyId: string;
  emailId: string;
  password?: string;
  role?: string;
}

export interface Event {
  id: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  eventDescription: string;
}

export interface ODRequest {
  id: string;
  studentName: string;
  studentRollNumber: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  eventDescription: string;
  facultyId?: string;
  status: string;
}

export interface LoginResponse {
  token: string;
  studentRollNumber?: string;
  facultyId?: string;
  studentName?: string;
  facultyName?: string;
  emailId: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  role: 'STUDENT' | 'FACULTY' | null;
  userId: string | null;
  userName: string | null;
}