import { MESSAGE_MISSING_PROPERTY_SETTINGS } from "../../constants/message-error";

export const getMessageMissingProperty = (propertyName: string) => {
  return `The policy doesn't find property '${propertyName}'.${MESSAGE_MISSING_PROPERTY_SETTINGS}`;
};
