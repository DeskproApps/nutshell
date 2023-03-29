// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getValueByKey = (object: any, key: string) => {
  const keys = key.split("."); // split the string into an array of keys

  let value = object;
  for (let i = 0; i < keys.length; i++) {
    if (value[keys[i]]) {
      value = value[keys[i]]; // traverse the object based on the keys in the array
    } else {
      return undefined; // return undefined if the key doesn't exist
    }
  }
  return value; // return the value of the final key in the array
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const getFnKey = (name: string) => {
  switch (name) {
    case "bill":
      return "Invoices";
    case "note":
      return "HistoryRecords";
    case "purchaseorder":
      return "PurchaseOrders";
    default:
      return `${capitalizeFirstLetter(name)}s`;
  }
};

export const titleAccessor = () => {
  return {
    contact: (field) => field.name.displayName,
    lead: (field) => field.description,
    activity: (field) => field.name,
  };
};

export const colors = [
  {
    textColor: "#4C4F50",
    backgroundColor: "#FDF8F7",
    borderColor: "#EC6C4E",
  },
  {
    backgroundColor: "#F3F9F9",
    borderColor: "#5BB6B1",
    textColor: "#4C4F50",
  },
  {
    borderColor: "#912066",
    backgroundColor: "#F4E9F0",
    textColor: "#4C4F50",
  },
  {
    borderColor: "#F2C94C",
    backgroundColor: "#FEF9E7",
    textColor: "#4C4F50",
  },
];
