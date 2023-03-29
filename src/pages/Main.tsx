import {
  H1,
  Stack,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import noteJson from "../mapping/note.json";
import contactJson from "../mapping/contact.json";
import leadJson from "../mapping/lead.json";
import activitiesJson from "../mapping/activities.json";

import { getActivitiesByContactId, getContactByEmail } from "../api/api";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import { LogoAndLinkButton } from "../components/LogoAndLinkButton/LogoAndLinkButton";

export const Main = () => {
  const { context } = useDeskproLatestAppContext();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Nutshell");

    client.registerElement("refreshButton", { type: "refresh_button" });
  });

  const contactQuery = useQueryWithClient(
    ["Contact", context?.data.user.primaryEmail],
    (client) => getContactByEmail(client, context?.data.user.primaryEmail),
    {
      enabled: !!context,
    }
  );

  const activityQuery = useQueryWithClient(
    ["Activities", context?.data.user.primaryEmail],
    (client) =>
      getActivitiesByContactId(client, contactQuery.data?.result.id as number),
    {
      enabled: !!contactQuery.isSuccess,
    }
  );

  const contact = contactQuery.data?.result;

  const leads = contact?.leads;

  const notes = contact?.notes;

  const activities = activityQuery.data?.result;

  return (
    <Stack vertical>
      {contact && (
        <Stack style={{ width: "100%" }} vertical gap={8}>
          <Stack
            style={{
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <H1>{contact.name?.displayName}</H1>
            <LogoAndLinkButton endpoint={"leads"}></LogoAndLinkButton>
          </Stack>
          <FieldMapping
            fields={[contact]}
            metadata={contactJson.main}
            internalUrl={`/person/`}
            idKey="id"
          />
        </Stack>
      )}
      {leads && leads?.length !== 0 && (
        <Stack style={{ width: "100%" }} vertical gap={8}>
          <Stack
            style={{
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <H1>Leads ({leads?.length})</H1>
            <LogoAndLinkButton endpoint={"leads"}></LogoAndLinkButton>
          </Stack>
          <FieldMapping
            titleAccessor={(field) => field[leadJson.titleKeyName]}
            fields={leads}
            internalUrl={`/`}
            metadata={leadJson.main}
            idKey={leadJson.idKey}
          />
        </Stack>
      )}
      {activities && activities?.length !== 0 && (
        <Stack style={{ width: "100%" }} vertical gap={8}>
          <H1>Activities ({activities?.length})</H1>
          <FieldMapping
            titleAccessor={() => `Activity with ${contact?.name.displayName}`}
            fields={activities}
            internalUrl={`/`}
            metadata={activitiesJson.main}
            idKey={activitiesJson.idKey}
          />
        </Stack>
      )}
      {notes && notes?.length !== 0 && (
        <Stack style={{ width: "100%" }} vertical gap={5}>
          <H1>Notes ({notes?.length})</H1>
          <FieldMapping fields={notes} metadata={noteJson.main} />
        </Stack>
      )}
    </Stack>
  );
};
