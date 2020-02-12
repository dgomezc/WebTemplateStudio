import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { IProps, IDispatchProps, IStateProps } from "./interfaces";
import {mapDispatchToProps, mapStateToProps} from "./store";
import styles from "./styles.module.css";
import { getSvg } from "../../../utils/getSvgUrl";
import messages from "./messages";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../utils/constants";
import { injectIntl, InjectedIntlProps } from "react-intl";

import { ReactComponent as Plus } from "../../../assets/plus.svg";
import { ISelected } from "../../../types/selected";
import { inferItemName } from "../../../utils/infer/itemName";


type Props = IProps & IDispatchProps & IStateProps & InjectedIntlProps;

const PageCard = (props:Props) => {
  const { page, intl, setPages, selectedPages, setDetailPage, isModal, pageOutOfBounds } = props;
  const [isMosueOver, setIsMouseOver] = React.useState(false);

  React.useEffect(()=>{
    if (selectedPages.length==0 && page.defaultName == "Blank"){
      setTimeout(()=> setPages([page]),200);
    }
  },[page]);

  const addPage = ()=>{
    const select:ISelected = {
      author:page.author,
      defaultName:page.defaultName,
      internalName:page.internalName,
      isValidTitle:page.isValidTitle,
      licenses:page.licenses,
      title:inferItemName(page.defaultName,selectedPages)
    };

    if (!pageOutOfBounds){
      let newSelectedPages:ISelected[] = selectedPages.splice(0);
      newSelectedPages.push(select);
      setPages(newSelectedPages);
    }
  }

  const showMoreInfo = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setDetailPage(page);
  }

  return (
    <div
    role="button"
    tabIndex={0}
    onClick={addPage}
    className={classNames(styles.container, styles.boundingBox)}
    onMouseLeave={()=>setIsMouseOver(false)}
    onMouseOver={()=>setIsMouseOver(true)}>
    <div>
      <div className={styles.gridLayoutCardHeader}>
        <div>
        {getSvg(page.internalName, styles.icon) ||
          (page.svgUrl && (
            <img src={page.svgUrl} alt="" />
          ))}
        </div>
        <div className={classNames(styles.title)}>
          {page.defaultName}
        </div>
        {isMosueOver && (
          <div className={styles.pageButtons}>
          <button
            className={classNames(styles.cardCount, styles.countButton)}
          >
            <Plus />
          </button>
        </div>
        )}
      </div>
      <div className={styles.description}>
        {page.body}
      </div>
      <div className={styles.gridLayoutCardFooter}>
        <div>
          {!isModal && (
            <Link
            onClick={showMoreInfo}
            className={styles.link}
            to={ROUTES.PAGE_DETAILS}>
            {intl.formatMessage(messages.Preview)}
          </Link>
          )}
        </div>
        <div className={styles.pageCounter}>
          {selectedPages.filter((selectedPage) => selectedPage.defaultName===page.defaultName).length}
        </div>
      </div>
    </div>
  </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PageCard));