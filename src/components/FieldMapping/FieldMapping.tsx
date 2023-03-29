import {
  H1,
  H3,
  P11,
  P8,
  Stack,
  useDeskproAppTheme,
  P5,
  PropertyRow,
  HorizontalDivider,
  Property,
} from "@deskpro/app-sdk";
import { LogoAndLinkButton } from "../LogoAndLinkButton/LogoAndLinkButton";
import { IJson } from "../../types/json";
import { ReactElement } from "react";
import { mapFieldValues } from "../../utils/mapFieldValues";
import { StyledLink } from "../../styles";

const SpaceBetweenFields = ({
  field: field,
}: {
  field: {
    key: string | number;
    value: string | number | ReactElement;
  };
}) => {
  return (
    <Stack
      style={{
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <H1>{field.key}:</H1>
      <H1>{field.value}</H1>
    </Stack>
  );
};

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[];
  internalUrl?: string;
  externalUrl?: string;
  metadata: IJson["view"];
  idKey?: string;
  internalChildUrl?: string;
  externalChildUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childTitleAccessor?: (field: any) => string;
  title?: string;
};

export const FieldMapping = ({
  fields,
  externalUrl,
  internalUrl,
  metadata,
  idKey = "",
  internalChildUrl,
  externalChildUrl,
  childTitleAccessor,
  title,
}: Props) => {
  const { theme } = useDeskproAppTheme();

  return (
    <Stack vertical gap={4} style={{ width: "100%" }}>
      <Stack
        style={{
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        {title && internalUrl ? (
          <StyledLink title="title" to={internalUrl + fields[0][idKey]}>
            {title}
          </StyledLink>
        ) : (
          <H1>{title}</H1>
        )}
        {externalUrl && (
          <LogoAndLinkButton endpoint={externalUrl}></LogoAndLinkButton>
        )}
      </Stack>
      {fields.map((field, i) => (
        <Stack vertical style={{ width: "100%" }} gap={5} key={i}>
          {(internalChildUrl || childTitleAccessor || externalChildUrl) && (
            <Stack style={{ justifyContent: "space-between", width: "100%" }}>
              {internalChildUrl && childTitleAccessor && (
                <StyledLink to={internalChildUrl + field[idKey]}>
                  {childTitleAccessor(field)}
                </StyledLink>
              )}
              {!internalChildUrl && childTitleAccessor && (
                <H3>{childTitleAccessor(field)}</H3>
              )}
              {externalChildUrl && (
                <LogoAndLinkButton
                  endpoint={externalChildUrl + field[idKey]}
                ></LogoAndLinkButton>
              )}
            </Stack>
          )}
          {metadata?.map((metadataFields, i) => {
            const usableFields = mapFieldValues(metadataFields, field);

            switch (usableFields.length) {
              case 1:
                return (
                  usableFields[0].value && (
                    <Stack vertical gap={4} key={i}>
                      <P8 style={{ color: theme?.colors.grey80 }}>
                        {usableFields[0].key}
                      </P8>
                      <P5 style={{ whiteSpace: "pre-line" }}>
                        {usableFields[0].value}
                      </P5>
                    </Stack>
                  )
                );
              case 4:
              case 2:
                return (
                  <PropertyRow key={i}>
                    {usableFields.map((e, ii) => (
                      <Property title={e.key as string} key={ii}>
                        <P5>{e.value || "-"}</P5>
                      </Property>
                    ))}
                  </PropertyRow>
                );

              case 3:
                return (
                  <Stack
                    style={{ justifyContent: "space-between", width: "100%" }}
                    key={i}
                  >
                    <Stack vertical gap={4}>
                      <P5 theme={theme}>{usableFields[0].value}</P5>
                      <P11 style={{ whiteSpace: "pre-line" }}>
                        {usableFields[1].value}
                      </P11>
                    </Stack>
                    <H3>{usableFields[2].value}</H3>
                  </Stack>
                );

              default:
                return (
                  <Stack gap={20} vertical style={{ width: "100%" }} key={i}>
                    {usableFields
                      .filter((e) => e.key)
                      .map((usableField, usableFieldI) => (
                        <Stack
                          vertical
                          style={{ width: "100%" }}
                          key={usableFieldI}
                        >
                          <SpaceBetweenFields
                            field={usableField}
                          ></SpaceBetweenFields>
                        </Stack>
                      ))}
                  </Stack>
                );
            }
          })}
          <HorizontalDivider
            style={{
              margin: "8px 0px 8px 0px",
              width: "100vh",
              marginLeft: i === fields.length - 1 ? "-20px" : "0px",
              backgroundColor: theme?.colors.grey10,
            }}
          />
        </Stack>
      ))}
    </Stack>
  );
};
