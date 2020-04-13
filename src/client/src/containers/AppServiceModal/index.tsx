import * as React from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import asModal from "../../components/Modal";
import messages from "./messages";
import { ReactComponent as Cancel } from "../../assets/cancel.svg";
import { isAppServiceModalOpenSelector } from "../../store/modals/selector";
import RuntimeStackInfo from "./RuntimeStackInfo";
import AppServicePlanInfo from "./AppServicePlanInfo";
import AppNameEditor from "./AppNameEditor";
import SubscriptionSelection from "../../components/SubscriptionSelection";
import { InjectedIntlProps, injectIntl } from "react-intl";
import buttonStyles from "../../css/buttonStyles.module.css";
import { WIZARD_CONTENT_INTERNAL_NAMES, KEY_EVENTS } from "../../utils/constants";
import styles from "./styles.module.css";
import { AppState } from "../../store/combineReducers";
import { ISelectedAppService } from "../../store/azureProfileData/appService/model";
import { getAppServiceSelectionSelector } from "../../store/azureProfileData/appService/selector";
import classNames from "classnames";
import { useState } from "react";
import { saveAppServiceSettingsAction } from "../../store/azureProfileData/appService/action";
import { closeModalAction } from "../../store/modals/action";
import { GetSubscriptionDataForAppService } from "../../utils/extensionService/extensionService";
import LocationSelection from "../../components/LocationSelection";
import { ReactComponent as ArrowDown } from "../../assets/chevron.svg";
import { AppContext } from "../../AppContext";
import ResourceGroupSelection from "../../components/ResourceGroupSelection";

interface IStateProps {
  isModalOpen: boolean;
}

type Props = IStateProps & InjectedIntlProps;

const AppServiceModal = ({ intl }: Props) => {
  const { formatMessage } = intl;
  const dispatch = useDispatch();
  const { vscode } = React.useContext(AppContext);
  const appServiceInStore = useSelector((state: AppState) => getAppServiceSelectionSelector(state));
  const initialSubscription = appServiceInStore ? appServiceInStore.subscription : "";
  const initialAppServiceName = appServiceInStore ? appServiceInStore.siteName : "";
  const initialLocation = appServiceInStore ? appServiceInStore.location : "";
  const initialResourceGroup = appServiceInStore ? appServiceInStore.resourceGroup : "";
  const initialSubscriptionData: SubscriptionData = { locations: [], resourceGroups:[] };

  const [subscription, setSubscription] = useState(initialSubscription);
  const [subscriptionData, setSubscriptionData] = useState(initialSubscriptionData);
  const [appName, setAppName] = useState(initialAppServiceName);
  const [location, setLocation] = useState(initialLocation);
  const [resourceGroup, setResourceGroup] = useState(initialResourceGroup);
  const [isAvailableAppName, setIsAvailableAppName] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  React.useEffect(() => {
    loadResourceGroups();
  }, [subscription]);

  const loadResourceGroups = () => {
    if(subscription) {
      GetSubscriptionDataForAppService(vscode, subscription).then(event => {
        setSubscriptionData(event.data.payload);
      });
    }
  }

  const isEnableSaveButton = (): boolean => {
    const isSubscriptionEmpty = subscription === "";
    const isAppNameEmpty = appName === "";
    const isLocationEmpty = location === "";

    return !(isSubscriptionEmpty || isAppNameEmpty || isLocationEmpty || !isAvailableAppName);
  };

  const getButtonClassNames = () => {
    const buttonClass = isEnableSaveButton() ? buttonStyles.buttonHighlighted : buttonStyles.buttonDark;
    return classNames(buttonClass, styles.button);
  };

  const closeModalIfPressEnterOrSpaceKey = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key === KEY_EVENTS.ENTER || event.key === KEY_EVENTS.SPACE) {
      event.preventDefault();
      event.stopPropagation();
      dispatch(closeModalAction());
    }
  };

  const saveAppServiceSelection = (): void => {
    const appServiceSelection: ISelectedAppService = {
      subscription,
      resourceGroup,
      location,
      siteName: appName,
      internalName: WIZARD_CONTENT_INTERNAL_NAMES.APP_SERVICE,
    };
    dispatch(saveAppServiceSettingsAction(appServiceSelection));
  };

  return (
    <React.Fragment>
      <div className={styles.header}>
        <div className={styles.title}>{formatMessage(messages.title)}</div>
        <Cancel
          data-testid="close-button"
          className={styles.closeIcon}
          onClick={() => dispatch(closeModalAction())}
          onKeyDown={closeModalIfPressEnterOrSpaceKey}
        />
      </div>
      <div className={styles.bodyContainer}>
        <SubscriptionSelection
          initialSubscription={subscription}
          onSubscriptionChange={setSubscription} />

        <AppNameEditor
          subscription={subscription}
          appName={appName}
          onAppNameChange={setAppName}
          onIsAvailableAppNameChange={setIsAvailableAppName}
        />

        {/* Advanced Mode */}
        <div className={classNames({ [styles.hide]: !showAdvanced })}>
          <LocationSelection
            location={location}
            locations={subscriptionData.locations}
            onLocationChange={setLocation} />
            <ResourceGroupSelection
              isEnabled={subscription !== ""}
              resourceGroup={resourceGroup}
              resourceGroups={subscriptionData.resourceGroups}
              onResourceGroupChange={setResourceGroup}
              onRefreshResourceGroup={loadResourceGroups} />
        </div>

        <AppServicePlanInfo subscription={subscription} />

        <RuntimeStackInfo />

        <div className={styles.bottomContainer}>
          <button
            className={classNames(buttonStyles.buttonLink, styles.showAdvancedModeLink)}
            onClick={() => setShowAdvanced(!showAdvanced)}>
              {formatMessage(showAdvanced ? messages.hideAdvancedMode : messages.showAdvancedMode)}
              <ArrowDown className={classNames(styles.advancedModeIcon, {[styles.rotateAdvancedModeIcon]: !showAdvanced})} />
          </button>

          <button className={getButtonClassNames()} onClick={saveAppServiceSelection} disabled={!isEnableSaveButton()}>
            {formatMessage(messages.save)}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state: AppState): IStateProps => ({
  isModalOpen: isAppServiceModalOpenSelector(state),
});

export default connect(mapStateToProps)(asModal(injectIntl(AppServiceModal)));
