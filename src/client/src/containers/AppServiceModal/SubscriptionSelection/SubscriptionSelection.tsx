import * as React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import styles from "../styles.module.css";
import classNames from "classnames";
import { azureMessages as messages } from "../../../mockData/azureServiceOptions";
import Dropdown from "../../../components/Dropdown";

const createSubscriptionLink =
  "https://account.azure.com/signup?showCatalog=True&appId=SubscriptionsBlade";

const DEFAULT_VALUE = {
  value: "Select...",
  label: "Select..."
};

interface IProps {
  subscription: string;
  subscriptions: [any];
  onSubscriptionChange(selectedSubscription: string): void;
}

type Props = IProps & InjectedIntlProps;

const SubscriptionSelection = (props: Props) => {
  const { intl, onSubscriptionChange, subscription, subscriptions } = props;

  const selectedSubscription = subscriptions.find(
    s => s.value === subscription
  );

  return (
    <div className={classNames([styles.selectionContainer])}>
      <div className={styles.selectionHeaderContainer}>
        <div className={styles.leftHeader}>
          {intl.formatMessage(messages.azureModalSubscriptionLabel)}
        </div>
        <a className={styles.link} href={createSubscriptionLink}>
          {intl.formatMessage(messages.azureModalCreateNew)}
        </a>
      </div>
      <div className={styles.subLabel}>
        {intl.formatMessage(messages.azureModalSubscriptionSubLabel)}
      </div>
      <Dropdown
        ariaLabel={intl.formatMessage(messages.azureModalAriaSubscriptionLabel)}
        options={subscriptions}
        handleChange={newSubscription => {
          onSubscriptionChange(newSubscription.value);
        }}
        value={selectedSubscription ? selectedSubscription : DEFAULT_VALUE}
      />
    </div>
  );
};

export default injectIntl(SubscriptionSelection);
