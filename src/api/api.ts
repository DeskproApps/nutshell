import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { IActivity } from "../types/activities";
import { IAPIResponse } from "../types/basic";
import { IContact, IContactAccountList } from "../types/contact";

export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

export const getContactByEmail = async (
  client: IDeskproClient,
  email: string
): Promise<IAPIResponse<IContact>> => {
  const contactAccountByEmailRes = await getContactsAccountsByEmail(
    client,
    email
  );

  if (
    !contactAccountByEmailRes.result ||
    !contactAccountByEmailRes.result.contacts.length
  ) {
    throw new Error("No contact found");
  }

  const contactId = contactAccountByEmailRes.result.contacts[0].id;

  const contactById = await getContactById(client, contactId);

  return contactById;
};

export const getContactsAccountsByEmail = (
  client: IDeskproClient,
  email: string
): Promise<IAPIResponse<IContactAccountList>> =>
  request(client, {
    method: "searchByEmail",
    params: [email],
    id: 1,
  });

export const getContactById = (
  client: IDeskproClient,
  id: number
): Promise<IAPIResponse<IContact>> =>
  request(client, {
    method: "getContact",
    params: [id],
    id: 1,
  });

export const getAllLeads = (client: IDeskproClient): Promise<unknown> =>
  request(client, {
    method: "findLeads",
    params: [{}],
    id: 1,
  });

export const getNotesByContactId = (client: IDeskproClient): Promise<unknown> =>
  request(client);

export const getActivitiesByContactId = (
  client: IDeskproClient,
  contactId: number
): Promise<IAPIResponse<IActivity[]>> =>
  request(client, {
    method: "findActivities",
    params: [
      {
        contactId: [contactId],
      },
    ],
    id: 1,
  });

export const getLeadsByUserId = (client: IDeskproClient): Promise<unknown> =>
  request(client);

export const request = async (
  client: IDeskproClient,
  data?: { [key: string]: unknown }
) => {
  const fetch = await proxyFetch(client);

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: ` Basic __email+':'+api_key.base64__`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`https://app.nutshell.com/api/v1/json`, options);

  if (isResponseError(response)) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;
