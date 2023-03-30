import { Stack, Tag } from "@deskpro/deskpro-ui";
import { ReactElement, useMemo } from "react";
import { StyledLink } from "../styles";
import { IContact, ILead, INote } from "../types/contact";
import { IJson } from "../types/json";
import { colors, getValueByKey } from "./utils";

export const mapFieldValues = (
  metadataFields: IJson["view"][0],
  field: IContact & ILead & INote
): {
  key: string | number;
  value: string | number | ReactElement;
}[] => {
  return metadataFields.map((metadataField) => {
    let value;
    switch (metadataField.type) {
      case "date": {
        if (!field[metadataField.name as keyof IContact]) {
          value = null;

          break;
        }

        (() => {
          const date = new Date(
            field[metadataField.name as keyof IContact] as string
          );

          value = `${date.toLocaleDateString(
            "en-UK"
          )} at ${date.toLocaleTimeString("en-UK")}`;
        })();

        break;
      }

      case "url": {
        value = field[metadataField.name as keyof IContact] ? (
          <StyledLink
            to={field[metadataField.name as keyof IContact] as string}
          >
            {field[metadataField.name as keyof IContact] as string}
          </StyledLink>
        ) : (
          ""
        );

        break;
      }

      case "email": {
        value = field.email?.["--primary"];

        break;
      }

      case "percentage": {
        if (!field[metadataField.name as keyof IContact]) {
          value = null;

          break;
        }

        value = `${field[metadataField.name as keyof IContact]}%`;

        break;
      }

      case "contact": {
        value = field;

        break;
      }

      case "currency": {
        if (!field.value) {
          value = null;

          break;
        }

        value = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: field.value?.currency,
        }).format(field.value?.amount || 0);

        break;
      }

      case "assignee": {
        value = field.owner?.name;

        break;
      }

      case "address": {
        const addressValues = field.address?.["--primary"];

        value = `${[
          addressValues.address_1,
          addressValues.address_2,
          addressValues.address_3,
        ]
          .filter((e) => e)
          .join(", ")}, ${addressValues.city}, ${addressValues.state}, ${
          addressValues.postalCode
        }, ${addressValues.country}`;

        break;
      }

      case "tags": {
        const usedColorsTags = useMemo(() => {
          return new Array(field.tags.length)
            .fill(1)
            .map(() => colors[Math.floor(Math.random() * colors?.length)]);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [field.tags]);

        value = (
          <Stack gap={4}>
            {field.tags.map((tag, index) => (
              <Tag color={usedColorsTags[index]} key={index} label={tag}></Tag>
            ))}
          </Stack>
        );
        break;
      }

      case "textInObj": {
        value = getValueByKey(field, metadataField.name as string);

        break;
      }

      case "accounts": {
        value = field.accounts?.map((e) => e.name).join(", ");

        break;
      }

      case "phone": {
        const phoneFields = field.phone?.["--primary"];

        value = phoneFields?.number ? phoneFields.E164 : null;

        break;
      }

      default:
        value = field[metadataField.name as keyof IContact];
    }

    return {
      key: metadataField.label,
      value: value as string | number | ReactElement,
    };
  });
};
