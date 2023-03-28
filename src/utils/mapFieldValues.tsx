import { ReactElement } from "react";
import { StyledLink } from "../styles";
import { IContact, ILead, INote } from "../types/contact";
import { IJson } from "../types/json";

export const mapFieldValues = (
  metadataFields: IJson["list"][0] | IJson["view"][0],
  field: IContact & ILead & INote
): {
  key: string | number;
  value: string | number | ReactElement;
}[] => {
  return metadataFields.map((metadataField) => {
    let value;
    switch (metadataField.type) {
      case "date":
        value = new Date(
          field[metadataField.name as keyof IContact] as string
        ).toLocaleDateString("en-UK");

        break;

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

      case "accounts": {
        value = field.accounts?.map((e) => e.name).join(", ");

        break;
      }

      case "phone": {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
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
