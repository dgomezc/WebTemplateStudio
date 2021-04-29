import { call, put, takeEvery } from "redux-saga/effects";
import { select } from "redux-saga/effects";

import { IVSCodeObject } from "../../../types/vscode";
import { getFeaturesOptions } from "../../../utils/cliTemplatesParser";
import { getFeatures } from "../../../utils/extensionService/extensionService";
import { AppState } from "../../combineReducers";
import { setFeaturesAction } from "../../templates/features/actions";
import { USERSELECTION_TYPEKEYS } from "../typeKeys";

export function* getFeaturesSaga(vscode: IVSCodeObject): any {
  yield takeEvery(USERSELECTION_TYPEKEYS.SELECT_BACKEND_FRAMEWORK, callBack);
  yield takeEvery(USERSELECTION_TYPEKEYS.SELECT_FRONTEND_FRAMEWORK, callBack);

  function* callBack() {
    const selectedFrontendSelector = (state: AppState) => state.userSelection.frontendFramework;
    const selectedBackendSelector = (state: AppState) => state.userSelection.backendFramework;
    const selectedProjectTypeSelector = (state: AppState) => state.userSelection.projectType;

    const selectedFrontend = yield select(selectedFrontendSelector);
    const selectedBackend = yield select(selectedBackendSelector);
    const selectedProjectType = yield select(selectedProjectTypeSelector);

    if (selectedProjectType !== "" && (selectedFrontend.internalName !== "" || selectedBackend.internalName !== "")) {
      const event: any = yield call(
        getFeatures,
        vscode,
        selectedProjectType.internalName,
        selectedFrontend.internalName,
        selectedBackend.internalName
      );
      const features = getFeaturesOptions(event.data.payload.features);
      yield put(setFeaturesAction(features));
    }
  }
}
