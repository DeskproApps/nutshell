import {
  H1,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import noteJson from "../mapping/note.json";
import contactJson from "../mapping/contact.json";
import leadJson from "../mapping/lead.json";
import activitiesJson from "../mapping/activity.json";

import { getActivitiesByContactId, getContactByEmail } from "../api/api";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import { LogoAndLinkButton } from "../components/LogoAndLinkButton/LogoAndLinkButton";
import { useEffect, useMemo } from "react";
import { titleAccessor } from "../utils/utils";
import { useNavigate } from "react-router-dom";

export const Main = () => {
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const navigate = useNavigate();

  const height = document.querySelector("body")?.clientHeight || 1500;

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "nutshellHomeButton":
          navigate("/redirect");
      }
    },
  });

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Nutshell");

    client.deregisterElement("nutshellLink");

    client.registerElement("refreshButton", { type: "refresh_button" });

    client.registerElement("nutshellHomeButton", {
      type: "home_button",
    });
  });

  useEffect(() => {
    if (!client) return;

    client.setHeight(height);
  }, [client, height]);

  const contactQuery = useQueryWithClient(
    ["Contact", context?.data.user.primaryEmail],
    (client) => getContactByEmail(client, context?.data.user.primaryEmail),
    {
      enabled: !!context,
    }
  );

  const titles = useMemo(() => titleAccessor(), []);

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
          <FieldMapping
            fields={[contact]}
            title={contact.name?.displayName}
            internalUrl={`/view/contact/`}
            externalUrl={`person/${contact.id}`}
            metadata={contactJson.main}
            idKey={leadJson.idKey}
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
            childTitleAccessor={titles.lead}
            fields={leads}
            internalChildUrl={`/view/lead/`}
            metadata={leadJson.main}
            idKey={leadJson.idKey}
          />
        </Stack>
      )}
      {activities && activities?.length !== 0 && (
        <Stack style={{ width: "100%" }} vertical gap={8}>
          <H1>Activities ({activities?.length})</H1>
          <FieldMapping
            childTitleAccessor={titles.activity}
            fields={activities}
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
