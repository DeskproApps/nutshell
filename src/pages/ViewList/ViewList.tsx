import {
  IDeskproClient,
  Spinner,
  Stack,
  useInitialisedDeskproAppClient,
  useMutationWithClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import contactJson from "../../mapping/contact.json";
import leadJson from "../../mapping/lead.json";
import activitiesJson from "../../mapping/activity.json";

import { capitalizeFirstLetter, getValueByKey } from "../../utils/utils";
import { IJson } from "../../types/json";
import { getActivityById, getContactById, getLeadById } from "../../api/api";

export const ViewList = () => {
  const { objectName, objectId } = useParams();

  const [correctJson, setCorrectJson] = useState<IJson | null>(null);

  const itemMutation = useMutationWithClient<
    {
      function: (client: IDeskproClient, ContactID: string) => Promise<unknown>;
      searchValue: string;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >((client, data) => data?.function(client, data.searchValue));

  const data = itemMutation.data?.result;

  useInitialisedDeskproAppClient(
    (client) => {
      if (!correctJson || !itemMutation.isSuccess) return;

      client.registerElement("nutshellLink", {
        type: "cta_external_link",
        url: `https://app.nutshell.com/${data.htmlUrlPath}`,
        hasIcon: true,
      });

      client.setTitle(
        getValueByKey(
          itemMutation.data.result,
          correctJson.titleKeyName as string
        ) || capitalizeFirstLetter(objectName || "")
      );
    },
    [contactJson, itemMutation.isSuccess]
  );

  useEffect(() => {
    if (!objectName || !objectId) return;

    switch (objectName) {
      case "contact": {
        itemMutation.mutate({
          searchValue: objectId,
          function: getContactById,
        });

        setCorrectJson(contactJson);

        break;
      }
      case "lead": {
        itemMutation.mutate({
          searchValue: objectId,
          function: getLeadById,
        });

        setCorrectJson(leadJson);

        break;
      }
      case "activity": {
        itemMutation.mutate({
          searchValue: objectId,
          function: getActivityById,
        });

        setCorrectJson(activitiesJson);

        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectName, objectId]);

  if (!itemMutation.data || !correctJson) {
    return (
      <Stack style={{ margin: "auto", marginTop: "20px" }}>
        <Spinner size="extra-large" />
      </Stack>
    );
  }

  return (
    <Stack vertical>
      <FieldMapping
        fields={data ? [data] : []}
        metadata={correctJson.view}
        idKey={correctJson.idKey}
      />
      {objectName === "lead" && (
        <FieldMapping
          fields={data.contacts ? data.contacts : []}
          metadata={contactJson.viewLead}
          idKey={correctJson.idKey}
        />
      )}
    </Stack>
  );
};
