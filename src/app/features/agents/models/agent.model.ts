export interface Agent {
  _id?: any;
  name: string;
  contactPersonName: string;
  contactPhoneNumber: string;
  agentType: 'hotel' | 'airline' | 'transportation' | 'tour' | 'visa';
  email: string;
  address?: string;
}
