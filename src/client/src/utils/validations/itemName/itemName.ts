import { IitemNameValidationConfig } from "../../../store/config/validations/model";
import { ISelected } from "../../../types/selected";
import { validationMessages } from "../messages";
import {
  addExistingItemNameValidate,
  addRegexValidate,
  addRequiredValidate,
  addReservedNameValidate,
  IValidation,
} from "../validations";

export const validateItemName = async (
  itemName: string,
  validations: IitemNameValidationConfig,
  selectedPages: Array<ISelected>
): Promise<IValidation> => {
  const listValidations: Array<IValidation> = [];
  let validate: IValidation = { isValid: true, error: validationMessages.default };

  if (validations.validateEmptyNames) listValidations.push(addRequiredValidate(itemName));
  if (validations.validateExistingNames) listValidations.push(addExistingItemNameValidate(itemName, selectedPages));
  if (validations.reservedNames.length > 0)
    listValidations.push(addReservedNameValidate(itemName, validations.reservedNames));
  if (validations.regexs.length > 0) listValidations.push(addRegexValidate(itemName, validations.regexs));

  const invalids = listValidations.filter((validate) => validate.isValid === false);
  if (invalids.length > 0) validate = invalids[0];

  return validate;
};
