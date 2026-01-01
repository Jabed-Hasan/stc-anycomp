export interface Service {
  id: string;
  name: string;
  price: number;
  purchases: number;
  duration: string;
  approvalStatus: 'Approved' | 'Under Review' | 'Rejected';
  publishStatus: 'Published' | 'Not Published';
}

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Incorporation of a new company',
    price: 2000,
    purchases: 20,
    duration: '3 Days',
    approvalStatus: 'Approved',
    publishStatus: 'Published',
  },
  {
    id: '2',
    name: 'Incorporation of a new company',
    price: 2000,
    purchases: 0,
    duration: '1 Day',
    approvalStatus: 'Under Review',
    publishStatus: 'Published',
  },
  {
    id: '3',
    name: 'Incorporation of a new company',
    price: 2000,
    purchases: 431,
    duration: '14 Days',
    approvalStatus: 'Approved',
    publishStatus: 'Published',
  },
  {
    id: '4',
    name: 'Incorporation of a new company',
    price: 2000,
    purchases: 0,
    duration: '7 Days',
    approvalStatus: 'Under Review',
    publishStatus: 'Published',
  },
  {
    id: '5',
    name: 'Incorporation of a new company',
    price: 2000,
    purchases: 1283,
    duration: '4 Days',
    approvalStatus: 'Rejected',
    publishStatus: 'Not Published',
  },
  {
    id: '6',
    name: 'Incorporation of a new company',
    price: 2000,
    purchases: 9180,
    duration: '5 Days',
    approvalStatus: 'Rejected',
    publishStatus: 'Not Published',
  },
];
