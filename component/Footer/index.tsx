import Icon from "@/component/Icon";

import $ from "./style.module.scss";

function Footer() {
  return (
    <div className={$.footer}>
      <div className={$.match}>
        <Icon name={"heart"} /> 매칭
      </div>
    </div>
  );
}

export default Footer;
