export interface IContactAccountList {
  contacts: IContactFromList[];
  accounts: unknown[];
}

export interface IContactFromList {
  stub: boolean;
  id: number;
  entityType: string;
  name: string;
  jobTitle: string;
}

export interface IPhone {
  "1": Primary;
  "--primary": Primary;
}

export interface Primary {
  countryCode: string;
  number: string;
  extension: null;
  numberFormatted: string;
  E164: string;
  countryCodeAndNumber: string;
}

export interface IContact {
  phone: IPhone;
  id: number;
  entityType: string;
  rev: string;
  modifiedTime: string;
  createdTime: string;
  name: Name;
  htmlUrl: string;
  htmlUrlPath: string;
  avatarUrl: string;
  creator: null;
  owner: {
    name: string;
  };
  leads: ILead[];
  accounts: Account[];
  notes: INote[];
  lastContactedDate: string;
  contactedCount: number;
  tags: string[];
  description: string;
  legacyId: null;
  mergedInto: unknown[];
  audiences: unknown[];
  address: Address;
  email: Email;
  url: URL;
}

export interface Account {
  stub: boolean;
  id: number;
  rev: string;
  entityType: string;
  modifiedTime: string;
  createdTime: string;
  name: string;
  regions?: string[];
  relationship?: string;
  jobTitle?: string;
}

export interface Address {
  "0": Primary;
  "--primary": Primary;
}

export interface Primary {
  name: null;
  location: Location;
  locationAccuracy: string;
  address_1: string;
  address_2: null;
  address_3: null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  timezone: null;
}

export interface Location {
  longitude: number;
  latitude: number;
}

export interface Email {
  "1": string;
  "--primary": string;
}

export interface ILead {
  stub: boolean;
  id: number;
  rev: string;
  entityType: string;
  modifiedTime: string;
  createdTime: string;
  name: string;
  description: string;
  status: number;
  completion: number;
  value?: {
    amount: number;
    currency: string;
  };
  primaryAccountName: string;
  primaryContactName: string;
  isOverdue: boolean;
  lastContactedDate: string;
  dueTime: string;
}

export interface Name {
  givenName: string;
  familyName: string;
  salutation: string;
  displayName: string;
}

export interface INote {
  id: number;
  rev: string;
  entityType: string;
  createdTime: string;
  note: string;
  noteMarkup: string;
  noteHtml: string;
  user: null;
  originId: number;
  date: string;
  contact: Account;
  mentions: Mention[];
}

export interface Mention {
  stub: boolean;
  id: number;
  rev: string;
  entityType: string;
  modifiedTime: string;
  createdTime: string;
  name: string;
  emails: string[];
  isEnabled: boolean;
  isAdministrator: boolean;
}

export interface URL {
  Foursquare: string;
  Linkedin: string;
  "0": string;
  "--primary": string;
}
